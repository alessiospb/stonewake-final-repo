import { test, expect, type APIRequestContext } from '@playwright/test';

// The MCP server speaks JSON-RPC over HTTP (https://docs.stonewake.ai/mcp) and reads the same data as /v1.
const MCP_URL = process.env.STONEWAKE_MCP_URL ?? 'https://mcp.stonewake.ai/';
const KEY = process.env.STONEWAKE_API_KEY ?? '';
const AUTH = { Authorization: `Bearer ${KEY}` };
const JSON_RPC = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };

function rpc(request: APIRequestContext, method: string, params?: object, headers: Record<string, string> = {}) {
  return request.post(MCP_URL, {
    headers: { ...JSON_RPC, ...headers },
    data: { jsonrpc: '2.0', id: 1, method, params },
  });
}

// Tool answers wrap the data between STONEWAKE_DATA markers, beside a note that it is data, not instructions.
async function callTool(request: APIRequestContext, name: string, args: object) {
  const body = await (await rpc(request, 'tools/call', { name, arguments: args }, AUTH)).json();
  expect(body.result.isError ?? false).toBe(false);
  const text: string = body.result.content[0].text;
  return JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
}

test.describe('MCP without a key', () => {
  // Skipped for documentation defect D-02 (docs/defects.md). The assertions stay unchanged.
  test.skip('lists the 38 read-only tools', { annotation: { type: 'defect', description: 'D-02, SpiraTest incident 88: https://itac.spiraservice.net/30/Incident/88.aspx' } }, async ({ request }) => {
    const body = await (await rpc(request, 'tools/list')).json();
    const names = body.result.tools.map((tool: { name: string }) => tool.name);
    expect(names).toHaveLength(38);
    for (const name of ['deal_book', 'screening_lookup', 'country_profile', 'ownership_chain', 'portfolio_overview']) {
      expect(names).toContain(name);
    }
  });

  test('refuses a tool that reads workspace data', async ({ request }) => {
    const body = await (await rpc(request, 'tools/call', { name: 'portfolio_overview', arguments: {} })).json();
    expect(body.error.code).toBe(-32001);
  });

  test('a wrong key gets the same refusal code', async ({ request }) => {
    const headers = { Authorization: 'Bearer swk_live_invalid' };
    const body = await (await rpc(request, 'tools/call', { name: 'portfolio_overview', arguments: {} }, headers)).json();
    expect(body.error.code).toBe(-32001);
  });

  test('searching the documentation needs no key', async ({ request }) => {
    const body = await (await rpc(request, 'tools/call', { name: 'search_stonewake_docs', arguments: { query: 'rate limits' } })).json();
    expect(body.result.isError ?? false).toBe(false);
  });

  test('an unknown method is refused', async ({ request }) => {
    const body = await (await rpc(request, 'no/such/method')).json();
    expect(body.error.code).toBe(-32601);
  });

  test('a body that is not JSON is refused', async ({ request }) => {
    const response = await request.post(MCP_URL, { headers: JSON_RPC, data: Buffer.from('{not json') });
    expect(response.status()).toBe(400);
    expect((await response.json()).error.code).toBe(-32700);
  });

  test('a foreign Origin is refused', async ({ request }) => {
    const response = await rpc(request, 'tools/list', undefined, { Origin: 'https://example.com' });
    expect(response.status()).toBe(403);
  });
});

test.describe('MCP with a key', () => {
  test('an undeclared argument is refused', async ({ request }) => {
    const body = await (await rpc(request, 'tools/call', { name: 'portfolio_overview', arguments: { nope: 1 } }, AUTH)).json();
    expect(body.error.code).toBe(-32602);
  });

  test('portfolio matches the API', async ({ request }) => {
    const api = await (await request.get('/v1/portfolio/summary', { headers: AUTH })).json();
    const { summary } = await callTool(request, 'portfolio_overview', {});
    expect(summary.active_exposures).toBe(api.active_exposures);
    expect(summary.statuses).toEqual(api.statuses);
  });

  test('a country matches the API', async ({ request }) => {
    const api = await (await request.get('/v1/countries/DEU', { headers: AUTH })).json();
    const mcp = await callTool(request, 'country_profile', { iso3: 'DEU' });
    expect(mcp.name).toBe(api.name);
    expect(mcp.risk.score).toBe(api.risk.score);
  });

  test('the deal book matches the API', async ({ request }) => {
    const api = await (await request.get('/v1/deals?limit=5', { headers: AUTH })).json();
    const mcp = await callTool(request, 'deal_book', { limit: 5 });
    expect(mcp.total).toBe(api.total);
    expect(mcp.items.map((deal: { deal_id: string }) => deal.deal_id)).toEqual(api.items.map((deal: { deal_id: string }) => deal.deal_id));
  });
});
