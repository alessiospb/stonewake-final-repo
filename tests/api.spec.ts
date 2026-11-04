import { test, expect } from '@playwright/test';

var KEY = process.env.STONEWAKE_API_KEY ?? '';

test('api 1 health', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/health');
  expect(r.status()).toBe(200);
  var b = await r.json();
  expect(Object.keys(b).sort()).toEqual(['app', 'environment', 'status', 'version']);
  expect(b.status).toBe('ok');
  expect(b.app).toBe('stonewake');
  expect(typeof b.version).toBe('string');
  expect(typeof b.environment).toBe('string');
});

test('api 2 me', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/me', { headers: { Authorization: 'Token ' + KEY } });
  expect(r.status()).toBe(200);
  var b = await r.json();
  console.log(b);
  expect(b.credential).toBe('api_key');
  expect(typeof b.role).toBe('string');
  expect(b.role).toMatch(/^[a-z_]+$/);
  expect(typeof b.team_scope.all_teams).toBe('boolean');
  expect(Array.isArray(b.team_scope.teams)).toBe(true);
  if (!b.team_scope.all_teams) {
    expect(b.team_scope.teams.length).toBeGreaterThan(0);
    for (var t of b.team_scope.teams) {
      expect(typeof t.id).toBe('string');
      expect(typeof t.name).toBe('string');
    }
  }
  expect(r.headers()['x-ratelimit-limit']).toMatch(/^\d+$/);
  expect(r.headers()['x-ratelimit-remaining']).toMatch(/^\d+$/);
});

test('api 3 no token', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/me');
  expect(r.status()).toBe(401);
  expect(await r.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  var r2 = await request.get('https://api.stonewake.ai/v1/portfolio');
  expect(r2.status()).toBe(401);
  expect(await r2.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  var r3 = await request.get('https://api.stonewake.ai/v1/countries');
  expect(r3.status()).toBe(401);
  expect(await r3.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  var r4 = await request.get('https://api.stonewake.ai/v1/entities');
  expect(r4.status()).toBe(401);
  expect(await r4.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  var r5 = await request.post('https://api.stonewake.ai/v1/citations/resolve');
  expect(r5.status()).toBe(401);
  expect(await r5.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
});

test('api 4 bad keys', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/me', { headers: { Authorization: 'Bearer swk_live_invalid000000000000000000000000' } });
  expect(r.status()).toBe(401);
  expect(await r.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  var r2 = await request.get('https://api.stonewake.ai/v1/me', { headers: { Authorization: 'Bearer not-a-key' } });
  expect(r2.status()).toBe(401);
  expect(await r2.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  var r3 = await request.get('https://api.stonewake.ai/v1/me', { headers: { Authorization: 'Basic abc' } });
  expect(r3.status()).toBe(401);
  expect(await r3.json()).toEqual({ error: { code: 'unauthenticated', message: 'Missing or invalid credentials.' } });
  var r4 = await request.get('https://api.stonewake.ai/v1/portfolio', { headers: { Authorization: 'Bearer swk_live_invalid000000000000000000000000' } });
  expect(r4.status()).toBe(401);
});

test('api 5 portfolio list', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/portfolio?limit=2', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r.status()).toBe(200);
  var b = await r.json();
  expect(Array.isArray(b.data)).toBe(true);
  expect(b.data.length).toBeLessThanOrEqual(2);
  expect(b.limit).toBe(2);
  expect(b.offset).toBe(0);
  expect(Number.isInteger(b.total)).toBe(true);
  for (var i of b.data) {
    expect(typeof i.id).toBe('number');
    expect(typeof i.label).toBe('string');
    expect(typeof i.active).toBe('boolean');
    expect(['green', 'amber', 'red', 'insufficient', 'not_assessed', 'sole_trader']).toContain(i.status);
    expect(i.completeness).toBeGreaterThanOrEqual(0);
    expect(i.completeness).toBeLessThanOrEqual(1);
  }
  var r2 = await request.get('https://api.stonewake.ai/v1/portfolio?limit=100', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r2.status()).toBe(200);
  var b2 = await r2.json();
  expect(b2.limit).toBe(100);
  var r3 = await request.get('https://api.stonewake.ai/v1/portfolio?limit=-1', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r3.status()).toBe(422);
  var r4 = await request.get('https://api.stonewake.ai/v1/portfolio?limit=abc', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r4.status()).toBe(422);
  var r5 = await request.get('https://api.stonewake.ai/v1/portfolio?limit=100000', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r5.status()).toBe(422);
  expect((await r5.json()).detail[0].msg).toBe('Input should be less than or equal to 100');
});

test('api 6 portfolio summary', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/portfolio/summary', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r.status()).toBe(200);
  var s = await r.json();
  expect(Object.keys(s.statuses).sort()).toEqual(['amber', 'green', 'insufficient', 'not_assessed', 'red', 'sole_trader']);
  var sum = 0;
  for (var k in s.statuses) {
    expect(Number.isInteger(s.statuses[k])).toBe(true);
    sum = sum + s.statuses[k];
  }
  expect(Number.isInteger(s.active_exposures)).toBe(true);
  expect(Number.isInteger(s.reviews_overdue)).toBe(true);
  expect(sum).toBe(s.active_exposures);
  var r2 = await request.get('https://api.stonewake.ai/v1/portfolio?limit=1', { headers: { Authorization: 'Bearer ' + KEY } });
  expect((await r2.json()).total).toBe(s.active_exposures);
});

test('api 7 entities', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/entities?limit=2', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r.status()).toBe(200);
  var b = await r.json();
  expect(Array.isArray(b.items)).toBe(true);
  expect(b.items.length).toBeGreaterThanOrEqual(1);
  expect(b.limit).toBe(2);
  expect(b.total).toBeGreaterThan(0);
  for (var i of b.items) {
    expect(typeof i.id).toBe('number');
    expect(typeof i.slug).toBe('string');
    expect(typeof i.display_name).toBe('string');
    expect(typeof i.kind).toBe('string');
  }
  var first = b.items[0];
  var r2 = await request.get('https://api.stonewake.ai/v1/entities/' + first.id, { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r2.status()).toBe(200);
  expect(await r2.json()).toEqual(first);
});

test('api 8 entity not found', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/entities/999999', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r.status()).toBe(404);
  expect(await r.json()).toEqual({ error: { code: 'not_found', message: 'Resource not found.' } });
  var r2 = await request.get('https://api.stonewake.ai/v1/entities/abc', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r2.status()).toBe(422);
  var b2 = await r2.json();
  expect(b2.error.code).toBe('validation_failed');
  expect(b2.detail[0].type).toBe('int_parsing');
  expect(b2.detail[0].loc).toEqual(['path', 'entity_id']);
  var r3 = await request.get('https://api.stonewake.ai/v1/nodes/999999999', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r3.status()).toBe(404);
  var r4 = await request.get('https://api.stonewake.ai/v1/entities/999999');
  expect(r4.status()).toBe(401);
});

test('api 9 countries', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/countries', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r.status()).toBe(200);
  var b = await r.json();
  expect(Array.isArray(b.regions)).toBe(true);
  expect(b.countries.length).toBeGreaterThanOrEqual(100);
  for (var c of b.countries) {
    expect(c.iso3).toMatch(/^[A-Z]{3}$/);
    expect(typeof c.name).toBe('string');
  }
  var de = b.countries.find((x: any) => x.iso3 == 'DEU');
  expect(de.name).toBe('Germany');
  var r2 = await request.get('https://api.stonewake.ai/v1/countries/DEU', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r2.status()).toBe(200);
  var d = await r2.json();
  expect(d.iso3).toBe('DEU');
  expect(d.iso2).toBe('GE');
  expect(d.name).toBe('Germany');
  expect(d.region).toBe('europe');
  expect(d.risk.score).toBeGreaterThanOrEqual(0);
  expect(d.risk.score).toBeLessThanOrEqual(100);
  var r3 = await request.get('https://api.stonewake.ai/v1/countries/ZZZ', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r3.status()).toBe(404);
});

test('api 10 search', async ({ request }) => {
  var r = await request.get('https://api.stonewake.ai/v1/search?q=bank&limit=3', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r.status()).toBe(200);
  var b = await r.json();
  expect(b.query).toBe('bank');
  expect(b.hits.length).toBeGreaterThanOrEqual(1);
  expect(b.hits.length).toBeLessThanOrEqual(3);
  for (var h of b.hits) {
    expect(typeof h.node_id).toBe('number');
    expect(typeof h.label).toBe('string');
    expect(h.score).toBeGreaterThanOrEqual(0);
    expect(h.score).toBeLessThanOrEqual(1);
  }
  var r2 = await request.get('https://api.stonewake.ai/v1/search?q=zzzzqqqxxxyy', { headers: { Authorization: 'Bearer ' + KEY } });
  expect((await r2.json()).hits).toEqual([]);
  var r3 = await request.get('https://api.stonewake.ai/v1/search', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r3.status()).toBe(422);
  var r4 = await request.get('https://api.stonewake.ai/v1/search?q=a', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r4.status()).toBe(422);
  expect((await r4.json()).detail[0].msg).toBe('String should have at least 2 characters');
  var r5 = await request.get('https://api.stonewake.ai/v1/search?q=bank&limit=99999', { headers: { Authorization: 'Bearer ' + KEY } });
  expect(r5.status()).toBe(422);
  expect((await r5.json()).detail[0].msg).toBe('Input should be less than or equal to 50');
});
