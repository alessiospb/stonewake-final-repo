import { test, expect } from '@playwright/test';

const AUTH = { headers: { Authorization: 'Bearer ' + (process.env.STONEWAKE_API_KEY ?? '') } };

test('api 1 health', async ({ request }) => {
  const r = await request.get('/health');
  expect(r.status()).toBe(200);
  const b = await r.json();
  expect(Object.keys(b).sort()).toEqual(['app', 'environment', 'status', 'version']);
  expect(b.status).toBe('ok');
  expect(b.app).toBe('stonewake');
  expect(typeof b.version).toBe('string');
  expect(typeof b.environment).toBe('string');
});

test('api 2 me', async ({ request }) => {
  const r = await request.get('/v1/me', AUTH);
  expect(r.status()).toBe(200);
  const b = await r.json();
  expect(b.credential).toBe('api_key');
  expect(typeof b.role).toBe('string');
  expect(b.role).toMatch(/^[a-z_]+$/);
  expect(typeof b.team_scope.all_teams).toBe('boolean');
  expect(Array.isArray(b.team_scope.teams)).toBe(true);
  if (!b.team_scope.all_teams) {
    expect(b.team_scope.teams.length).toBeGreaterThan(0);
    for (const t of b.team_scope.teams) {
      expect(typeof t.id).toBe('string');
      expect(typeof t.name).toBe('string');
    }
  }
  expect(r.headers()['x-ratelimit-limit']).toMatch(/^\d+$/);
  expect(r.headers()['x-ratelimit-remaining']).toMatch(/^\d+$/);
});

test('api 3 no token', async ({ request }) => {
  const r = await request.get('/v1/me');
  expect(r.status()).toBe(401);
  expect(await r.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  const r2 = await request.get('/v1/portfolio');
  expect(r2.status()).toBe(401);
  expect(await r2.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  const r3 = await request.get('/v1/countries');
  expect(r3.status()).toBe(401);
  expect(await r3.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  const r4 = await request.get('/v1/entities');
  expect(r4.status()).toBe(401);
  expect(await r4.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  const r5 = await request.post('/v1/citations/resolve');
  expect(r5.status()).toBe(401);
  expect(await r5.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
});

test('api 4 bad keys', async ({ request }) => {
  const r = await request.get('/v1/me', { headers: { Authorization: 'Bearer swk_live_invalid000000000000000000000000' } });
  expect(r.status()).toBe(401);
  expect(await r.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  const r2 = await request.get('/v1/me', { headers: { Authorization: 'Bearer not-a-key' } });
  expect(r2.status()).toBe(401);
  expect(await r2.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  const r3 = await request.get('/v1/me', { headers: { Authorization: 'Basic abc' } });
  expect(r3.status()).toBe(401);
  expect(await r3.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  const r4 = await request.get('/v1/portfolio', { headers: { Authorization: 'Bearer swk_live_invalid000000000000000000000000' } });
  expect(r4.status()).toBe(401);
});

test('api 5 portfolio list', async ({ request }) => {
  const r = await request.get('/v1/portfolio?limit=2', AUTH);
  expect(r.status()).toBe(200);
  const b = await r.json();
  expect(Array.isArray(b.items)).toBe(true);
  expect(b.items.length).toBeLessThanOrEqual(2);
  expect(b.limit).toBe(2);
  expect(b.offset).toBe(0);
  expect(Number.isInteger(b.total)).toBe(true);
  for (const i of b.items) {
    expect(typeof i.id).toBe('number');
    expect(typeof i.label).toBe('string');
    expect(typeof i.active).toBe('boolean');
    expect(['green', 'amber', 'red', 'insufficient', 'not_assessed', 'sole_trader']).toContain(i.status);
    expect(i.completeness).toBeGreaterThanOrEqual(0);
    expect(i.completeness).toBeLessThanOrEqual(1);
  }
  const r2 = await request.get('/v1/portfolio?limit=100', AUTH);
  expect(r2.status()).toBe(200);
  const b2 = await r2.json();
  expect(b2.limit).toBe(100);
  const r3 = await request.get('/v1/portfolio?limit=-1', AUTH);
  expect(r3.status()).toBe(422);
  const r4 = await request.get('/v1/portfolio?limit=abc', AUTH);
  expect(r4.status()).toBe(422);
  const r5 = await request.get('/v1/portfolio?limit=100000', AUTH);
  expect(r5.status()).toBe(422);
  expect((await r5.json()).detail[0].msg).toBe('Input should be less than or equal to 100');
});

test('api 6 portfolio summary', async ({ request }) => {
  const r = await request.get('/v1/portfolio/summary', AUTH);
  expect(r.status()).toBe(200);
  const s = await r.json();
  expect(Object.keys(s.statuses).sort()).toEqual(['amber', 'green', 'insufficient', 'not_assessed', 'red', 'sole_trader']);
  let sum = 0;
  for (const k in s.statuses) {
    expect(Number.isInteger(s.statuses[k])).toBe(true);
    sum = sum + s.statuses[k];
  }
  expect(Number.isInteger(s.active_exposures)).toBe(true);
  expect(Number.isInteger(s.reviews_overdue)).toBe(true);
  expect(sum).toBe(s.active_exposures);
  const r2 = await request.get('/v1/portfolio?limit=1', AUTH);
  expect((await r2.json()).total).toBe(s.active_exposures);
});

test('api 7 entities', async ({ request }) => {
  const r = await request.get('/v1/entities?limit=2', AUTH);
  expect(r.status()).toBe(200);
  const b = await r.json();
  expect(Array.isArray(b.items)).toBe(true);
  expect(b.items.length).toBeGreaterThanOrEqual(1);
  expect(b.limit).toBe(2);
  expect(b.total).toBeGreaterThan(0);
  for (const i of b.items) {
    expect(typeof i.id).toBe('number');
    expect(typeof i.slug).toBe('string');
    expect(typeof i.display_name).toBe('string');
    expect(typeof i.kind).toBe('string');
  }
  const first = b.items[0];
  const r2 = await request.get('/v1/entities/' + first.id, AUTH);
  expect(r2.status()).toBe(200);
  expect(await r2.json()).toEqual(first);
});

test('api 8 entity not found', async ({ request }) => {
  const r = await request.get('/v1/entities/999999', AUTH);
  expect(r.status()).toBe(404);
  expect(await r.json()).toEqual({ error: { code: 'not_found', message: 'Resource not found.' } });
  const r2 = await request.get('/v1/entities/abc', AUTH);
  expect(r2.status()).toBe(422);
  const b2 = await r2.json();
  expect(b2.error.code).toBe('validation_failed');
  expect(b2.detail[0].type).toBe('int_parsing');
  expect(b2.detail[0].loc).toEqual(['path', 'entity_id']);
  const r3 = await request.get('/v1/nodes/999999999', AUTH);
  expect(r3.status()).toBe(404);
  const r4 = await request.get('/v1/entities/999999');
  expect(r4.status()).toBe(401);
});

test('api 9 countries', async ({ request }) => {
  const r = await request.get('/v1/countries', AUTH);
  expect(r.status()).toBe(200);
  const b = await r.json();
  expect(Array.isArray(b.regions)).toBe(true);
  expect(b.countries.length).toBeGreaterThanOrEqual(100);
  for (const c of b.countries) {
    expect(c.iso3).toMatch(/^[A-Z]{3}$/);
    expect(typeof c.name).toBe('string');
  }
  const de = b.countries.find((x: { iso3: string }) => x.iso3 === 'DEU');
  expect(de.name).toBe('Germany');
  const r2 = await request.get('/v1/countries/DEU', AUTH);
  expect(r2.status()).toBe(200);
  const d = await r2.json();
  expect(d.iso3).toBe('DEU');
  expect(d.iso2).toBe('DE');
  expect(d.name).toBe('Germany');
  expect(d.region).toBe('europe');
  expect(d.risk.score).toBeGreaterThanOrEqual(0);
  expect(d.risk.score).toBeLessThanOrEqual(100);
  const r3 = await request.get('/v1/countries/ZZZ', AUTH);
  expect(r3.status()).toBe(404);
});

test('api 10 search', async ({ request }) => {
  const r = await request.get('/v1/search?q=bank&limit=3', AUTH);
  expect(r.status()).toBe(200);
  const b = await r.json();
  expect(b.query).toBe('bank');
  expect(b.hits.length).toBeGreaterThanOrEqual(1);
  expect(b.hits.length).toBeLessThanOrEqual(3);
  for (const h of b.hits) {
    expect(typeof h.node_id).toBe('number');
    expect(typeof h.label).toBe('string');
    expect(h.score).toBeGreaterThanOrEqual(0);
    expect(h.score).toBeLessThanOrEqual(1);
  }
  const r2 = await request.get('/v1/search?q=zzzzqqqxxxyy', AUTH);
  expect((await r2.json()).hits).toEqual([]);
  const r3 = await request.get('/v1/search', AUTH);
  expect(r3.status()).toBe(422);
  const r4 = await request.get('/v1/search?q=a', AUTH);
  expect(r4.status()).toBe(422);
  expect((await r4.json()).detail[0].msg).toBe('String should have at least 2 characters');
  const r5 = await request.get('/v1/search?q=bank&limit=99999', AUTH);
  expect(r5.status()).toBe(422);
  expect((await r5.json()).detail[0].msg).toBe('Input should be less than or equal to 25');
});
