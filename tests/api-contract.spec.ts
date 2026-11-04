import { test, expect, type APIResponse } from '@playwright/test';

// Rules from https://docs.stonewake.ai (API reference, Errors and rate limits) and the OpenAPI document.
// Values are not named in advance: the workspace holds live data.
const KEY = process.env.STONEWAKE_API_KEY ?? '';
const AUTH = { headers: { Authorization: `Bearer ${KEY}` } };
const UNAUTHENTICATED = { error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } };

async function expectValidationError(response: APIResponse, type: string, field: string) {
  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body.error.code).toBe('validation_failed');
  expect(body.detail[0].type).toBe(type);
  expect(body.detail[0].loc).toContain(field);
}

test.describe('list envelope and pagination', () => {
  for (const path of ['/v1/deals', '/v1/entities', '/v1/portfolio', '/v1/screenings', '/v1/monitoring/targets', '/v1/developments']) {
    test(`${path} answers the page envelope`, async ({ request }) => {
      const response = await request.get(`${path}?limit=2&offset=0`, AUTH);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.items.length).toBeLessThanOrEqual(2);
      expect(body.limit).toBe(2);
      expect(body.offset).toBe(0);
      expect(Number.isInteger(body.total)).toBe(true);
    });
  }

  test('pages do not overlap', async ({ request }) => {
    const first = await (await request.get('/v1/entities?limit=3&offset=0', AUTH)).json();
    const second = await (await request.get('/v1/entities?limit=3&offset=3', AUTH)).json();
    const firstIds = first.items.map((item: { id: number }) => item.id);
    for (const item of second.items) expect(firstIds).not.toContain(item.id);
  });

  test('an offset past the end is an empty page with the same total', async ({ request }) => {
    const { total } = await (await request.get('/v1/entities?limit=1', AUTH)).json();
    const body = await (await request.get(`/v1/entities?limit=1&offset=${total}`, AUTH)).json();
    expect(body.items).toEqual([]);
    expect(body.total).toBe(total);
  });

  test('limit is bounded at 100', async ({ request }) => {
    expect((await request.get('/v1/entities?limit=100', AUTH)).status()).toBe(200);
    expect((await request.get('/v1/entities?limit=101', AUTH)).status()).toBe(422);
    expect((await request.get('/v1/entities?limit=0', AUTH)).status()).toBe(422);
  });

  test('countries index takes no paging', async ({ request }) => {
    await expectValidationError(await request.get('/v1/countries?limit=1', AUTH), 'extra_forbidden', 'limit');
  });
});

test.describe('validation refusals', () => {
  test('an unknown filter is refused, not ignored', async ({ request }) => {
    await expectValidationError(await request.get('/v1/deals?nope=1', AUTH), 'extra_forbidden', 'nope');
  });

  test('closed values keep their letter case', async ({ request }) => {
    await expectValidationError(await request.get('/v1/deals?country_code=deu', AUTH), 'literal_error', 'country_code');
    await expectValidationError(await request.get('/v1/deals?country_code=ZZZ', AUTH), 'literal_error', 'country_code');
    await expectValidationError(await request.get('/v1/deals?stage=Financing', AUTH), 'literal_error', 'stage');
  });

  test('a number must be finite', async ({ request }) => {
    await expectValidationError(await request.get('/v1/deals?min_value_usd=1e400', AUTH), 'finite_number', 'min_value_usd');
  });

  test('a single value parameter cannot repeat', async ({ request }) => {
    await expectValidationError(await request.get('/v1/entities?limit=1&limit=2', AUTH), 'value_error', 'limit');
  });

  test('a NUL character is refused', async ({ request }) => {
    expect((await request.get('/v1/search?q=ab%00cd', AUTH)).status()).toBe(422);
  });
});

test.describe('read-only surface', () => {
  for (const method of ['post', 'put', 'patch', 'delete'] as const) {
    test(`${method.toUpperCase()} is refused on a read route`, async ({ request }) => {
      const response = await request[method]('/v1/portfolio', AUTH);
      expect(response.status()).toBe(405);
      expect(await response.json()).toEqual({ error: { code: 'method_not_allowed', message: 'Method not allowed.' } });
    });
  }

  test('a key cannot reach key management', async ({ request }) => {
    const response = await request.get('/org/api-keys', AUTH);
    expect(response.status()).toBe(401);
  });
});

test.describe('credentials', () => {
  test('the scheme is read in any letter case', async ({ request }) => {
    const response = await request.get('/v1/me', { headers: { Authorization: `bEaReR ${KEY}` } });
    expect(response.status()).toBe(200);
  });

  test('a changed key is refused like any other', async ({ request }) => {
    const response = await request.get('/v1/me', { headers: { Authorization: `Bearer ${KEY}x` } });
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual(UNAUTHENTICATED);
  });

  test('a key in the query string does not authenticate', async ({ request }) => {
    const response = await request.get(`/v1/me?api_key=swk_live_invalid`);
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual(UNAUTHENTICATED);
  });

  test('the key describes itself and never returns its secret', async ({ request }) => {
    const response = await request.get('/v1/me', AUTH);
    const text = await response.text();
    expect(text).not.toContain(KEY);
    const body = JSON.parse(text);
    expect(body.key.role).toBe('viewer');
    expect(body.key.scopes).toContain('read');
    expect(body.team_scope.all_teams).toBe(false);
  });

  test('the audit log needs the audit scope', async ({ request }) => {
    const me = await (await request.get('/v1/me', AUTH)).json();
    test.skip(me.key.scopes.includes('audit'), 'This key holds the audit scope');
    const response = await request.get('/v1/audit-log.csv?from=2026-11-01&to=2026-11-02', AUTH);
    expect(response.status()).toBe(403);
    expect((await response.json()).error.code).toBe('forbidden');
  });
});

test.describe('rate limit headers', () => {
  test('every response states the policy', async ({ request }) => {
    const policy = (await request.get('/v1/me')).headers()['ratelimit-policy'];
    expect(policy).toContain('"key-minute"');
    expect(policy).toContain('"workspace-day"');
  });

  test('a keyed response states the window', async ({ request }) => {
    const headers = (await request.get('/v1/me', AUTH)).headers();
    expect(headers['ratelimit']).toMatch(/"key-minute";r=\d+;t=\d+/);
    expect(Number(headers['x-ratelimit-remaining'])).toBeLessThanOrEqual(Number(headers['x-ratelimit-limit']));
  });
});

test.describe('deals', () => {
  test('list row and deal detail agree', async ({ request }) => {
    const { items } = await (await request.get('/v1/deals?limit=1', AUTH)).json();
    expect(items.length).toBe(1);
    const response = await request.get(`/v1/deals/${items[0].deal_id}`, AUTH);
    expect(response.status()).toBe(200);
    const deal = await response.json();
    expect(deal.deal_id).toBe(items[0].deal_id);
    expect(deal.name).toBe(items[0].name);
  });

  test('a filter keeps only matching rows', async ({ request }) => {
    const all = await (await request.get('/v1/deals?limit=1&include_hidden=true', AUTH)).json();
    const body = await (await request.get('/v1/deals?country_code=DEU&include_hidden=true&limit=100', AUTH)).json();
    expect(body.total).toBeLessThanOrEqual(all.total);
    for (const deal of body.items) expect(deal.countries_iso3).toContain('DEU');
  });

  test('sorting by name follows the direction', async ({ request }) => {
    const ascending = await (await request.get('/v1/deals?sort=name&direction=asc&limit=2', AUTH)).json();
    const descending = await (await request.get('/v1/deals?sort=name&direction=desc&limit=2', AUTH)).json();
    expect(ascending.total).toBe(descending.total);
    test.skip(ascending.total < 2, 'Needs at least two deals');
    expect(ascending.items[0].deal_id).not.toBe(descending.items[0].deal_id);
  });

  test('hidden deals only widen the book', async ({ request }) => {
    const visible = await (await request.get('/v1/deals?limit=1', AUTH)).json();
    const withHidden = await (await request.get('/v1/deals?limit=1&include_hidden=true', AUTH)).json();
    expect(withHidden.total).toBeGreaterThanOrEqual(visible.total);
  });

  test('an unknown deal answers the canonical 404', async ({ request }) => {
    const response = await request.get('/v1/deals/000000000000', AUTH);
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ error: { code: 'not_found', message: 'Resource not found.' } });
  });
});

test.describe('countries', () => {
  test('index and detail show the same score', async ({ request }) => {
    const { countries } = await (await request.get('/v1/countries', AUTH)).json();
    const germany = countries.find((country: { iso3: string }) => country.iso3 === 'DEU');
    const detail = await (await request.get('/v1/countries/DEU', AUTH)).json();
    expect(detail.risk.score).toBe(germany.risk_score);
  });

  test('every score is within 0 to 100, or carries its reason', async ({ request }) => {
    const { countries } = await (await request.get('/v1/countries', AUTH)).json();
    for (const country of countries) {
      if (country.risk_score === null) expect(country.risk_reason, country.iso3).toBeTruthy();
      else {
        expect(country.risk_score, country.iso3).toBeGreaterThanOrEqual(0);
        expect(country.risk_score, country.iso3).toBeLessThanOrEqual(100);
      }
    }
  });
});

test.describe('company nodes', () => {
  test('a search hit opens its company, network and ownership chain', async ({ request }) => {
    const { hits } = await (await request.get('/v1/search?q=bank&limit=1', AUTH)).json();
    const node = hits[0].node_id;
    for (const path of ['company', 'network', 'ownership-chain', 'financing']) {
      expect((await request.get(`/v1/nodes/${node}/${path}`, AUTH)).status(), path).toBe(200);
    }
  });

  test('ownership bounds are enforced', async ({ request }) => {
    const { hits } = await (await request.get('/v1/search?q=bank&limit=1', AUTH)).json();
    const response = await request.get(`/v1/nodes/${hits[0].node_id}/ownership-chain?max_depth=9`, AUTH);
    expect(response.status()).toBe(422);
  });
});

test.describe('deprecated routes', () => {
  test('the entity risk twin answers 404', async ({ request }) => {
    expect((await request.get('/v1/entities/1/risk', AUTH)).status()).toBe(404);
  });

  test('merge suggestions answer an empty page', async ({ request }) => {
    const body = await (await request.get('/v1/deals/merge/suggestions', AUTH)).json();
    expect(body.items).toEqual([]);
    expect(body.total).toBe(0);
  });
});

test.describe('hostile input', () => {
  for (const q of [`' OR '1'='1`, '<script>alert(1)</script>', '../../etc/passwd', '{{7*7}}']) {
    test(`search handles ${q}`, async ({ request }) => {
      const response = await request.get(`/v1/search?q=${encodeURIComponent(q)}`, AUTH);
      expect(response.status()).toBe(200);
      expect((await response.json()).query).toBe(q);
    });
  }
});
