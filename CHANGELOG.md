# Changelog

## 1.2.0

### Added

- **MCP endpoint.** `mcp({ authenticate, path = '/mcp', serverInfo })` returns Koa middleware for `beforeRouteMiddleware`. It speaks stateless Streamable HTTP with JSON responses: `initialize`, `ping`, `tools/list`, `tools/call`; notifications get 202.
- **Routes become tools with `mcp: true` in `_info.js`.** The tool name is the route path with `/` → `_`. The description and input schema come from `_info.js` (`infoToJsonSchema`). Access is the route's `permissions` checked against the user that `authenticate` returns. A site route overrides (or hides) the shared route on the same path.
- `authenticate(awesomenessRequest)` returns the caller's user, nothing (401 with `WWW-Authenticate: Bearer`), or throws `{ status, message }` (for example 429 when rate limited).
- Tool calls run through the same `validateRequest` (permissions + `clean.object`) and route handler as HTTP API calls. Route errors come back as `isError` results, never stacks.
- `tools/list` reads only `_info.js`; a route's `index.js` is imported when the tool is called.
- New exports: `mcp`, `mcpHandle`, `mcpListTools`, `mcpCallTool`, `listMcpRoutes`, `resolveApiRoute`, `infoToJsonSchema`, `toJsonSchemaNode`.

### Changed

- `validateRequest` skips `checkSession` when `awesomenessRequest.authenticated === true` (set by `mcp()`).
- `koa/routeRequest` resolves API routes through `resolveApiRoute` (same 404/500 bodies).

### Fixed

- `checkAccess` imports `getConfig` (it was used without an import). The development bypass does not apply to MCP requests.