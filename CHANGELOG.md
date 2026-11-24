# Changelog

## 1.3.0

### Added

- **MCP `outputSchema` from `_info.returns`.** `tools/list` includes `outputSchema` (via the same `infoToJsonSchema` conversion as `inputSchema`) when a route's `returns` is a real object schema. Missing, empty, or template-stub `returns` (`{ key: 'value' }`) omit `outputSchema`, so clients are not given a wrong schema to validate. `mcpCallTool` already returns `structuredContent` for object results, which MCP 2025-06-18 and 2025-11-25 require when `outputSchema` is present. New exports: `isStubReturns`, `returnsToOutputSchema`.

## 1.2.0

### Added

- **MCP endpoint.** `mcp({ authenticate, path = '/mcp', serverInfo, siteMap, routeFilter })` returns Koa middleware for `beforeRouteMiddleware`. It speaks stateless Streamable HTTP with JSON responses: `initialize`, `ping`, `tools/list`, `tools/call`; notifications get 202.
- **Routes become tools with `mcp: true` in `_info.js`.** The tool name is the route path with `/` → `_`. The description and input schema come from `_info.js` (`infoToJsonSchema`). Access is the route's `permissions` checked against the user that `authenticate` returns. A site route overrides (or hides) the shared route on the same path. Common routes are also hidden unless `publishDocs` is an array that includes the site; site-local routes are always shown. `mcp({ routeFilter })` replaces that default (exported as `defaultRouteFilter` so a custom filter can call it). The filter runs once in `listMcpRoutes`, so a hidden route is absent from both `tools/list` and `tools/call`.
- `authenticate(awesomenessRequest)` returns the caller's user, nothing (401 with `WWW-Authenticate: Bearer`), or throws `{ status, message }` (for example 429 when rate limited).
- Tool calls run through the same `validateRequest` (permissions + `clean.object`) and route handler as HTTP API calls. Route errors come back as `isError` results, never stacks.
- A browser `GET` on the MCP path (no `Accept: text/event-stream`) falls through to the page router, so a page can share the URL (for example a token page at `/mcp`). SSE `GET` and other methods get 405.
- `siteMap` (`{ [requestSite]: toolSite }`) lets one host serve another site's tools, for example `mcp({ authenticate, siteMap: { 'api.example.com': 'example.com' } })`. The request's own site and application are unchanged.
- Unexpected errors while handling an MCP message are logged server-side (`console.error`) and answered as JSON-RPC `-32603 Internal error`. Only JSON-RPC errors (integer codes -32768..-32000, e.g. `-32602 Unknown tool`) reach the client as thrown.
- `tools/list` reads only `_info.js`; a route's `index.js` is imported when the tool is called.
- New exports: `mcp`, `mcpHandle`, `mcpListTools`, `mcpCallTool`, `listMcpRoutes`, `defaultRouteFilter`, `resolveApiRoute`, `infoToJsonSchema`, `toJsonSchemaNode`, `jsonRpcError`, `jsonRpcResult`, `mcpInitialize`, `mcpInternalError`.

### Changed

- `validateRequest` skips `checkSession` when `awesomenessRequest.authenticated === true` (set by `mcp()`).
- `koa/routeRequest` resolves API routes through `resolveApiRoute` (same 404/500 bodies).

### Fixed

- `checkAccess` imports `getConfig` (it was used without an import). The development bypass does not apply to MCP requests.