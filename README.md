# Awesomeness JS Configuration

Most configurations for Awesomeness JS are done through the `.awesomeness/config.js` file.

The `./awesomeness/` folder and you can customize the location by modifying the import paths in `package.json`.

## For an Example Application see the repo

[@awesomeness-js/app-template](https://github.com/awesomeness-js/app-template)

# Underlying Request Flow

## Pre Routing
- start
- attachAwesomenessRequest
  - gets awesomenessRequest.awesomenessType [page, api, generic]
- [staticFiles](#Static-Files)
- beforeRouteMiddleware
- routeRequest

## Routing
- needs to be valid route for [page, api]
  - /[^a-zA-Z0-9\/\_\-]/ -> make sure there is no dots in the path -> 404

## API Routing ( needs awesomenessType in post body `api`)
- try /api/routes/${awesomenessRequest.pageRoute}
  - try site specific first
  - then try common routes (needs to be edited uses URL and not passed config)
- validateRequest
- route index.js

## Page Routing ( needs awesomenessType in post body `page`)
- pageInfo
- validateRequest
- fetchPage
- finalFormat

## Generic Routing ( has no defined awesomenessType in post body)
- method must be get or 405 is thrown
- /test -> returns awesomeness is working
- routes to staticFiles
- awesomenessRequest.awesomenessType is not set in POST body
- request is treated as a static file request
- static file served is it exists in the public folder
  - site specific first
  - then common files

If a public static file is not found
- public/index.html is served
- You DO NOT need your own public/index.html file
  - The awesomeness-ui framework provides a default one
  - this calls app.init()

# From the Browser 

## What happens

1. User visits a page
- Server receives request


## Static Files
- site specific files first
  - /${awesomenessConfig.siteDir__URL}/${awesomenessRequest.site}/public/index.html
- then common files
  - [/${awesomenessConfig.commonPublicDir__URL}/${awesomenessRequest.site}/public/index.html](/example-site/example.awesomenessjs.com/public/index.html)
  
[index.html](/example-site/example.awesomenessjs.com/public/index.html)



# MCP (Model Context Protocol)

Any API route can be an MCP tool. Add `mcp: true` to its `_info.js`:

```js
export default {
	description: 'Get a Bible passage',   // tool description
	permissions: [ '*' ],                 // who may call it (unchanged)
	mcp: true,                            // exposed over MCP; absent = not exposed
	publishDocs: [ 'example.com' ],       // required on common routes; site-local routes skip this
	properties: { type: 'object', properties: { ... } }, // tool inputSchema
};
```

- Tool name = route path with `/` -> `_` (`bible/passage` -> `bible_passage`).
- Shared `api/routes` and `sites/<site>/api/routes` are both scanned; a site route overrides the shared route on the same path (and hides it if the site version is not marked).
- Calls run through the same `validateRequest` (permissions + `clean.object`) and route `index.js` as `awesomenessType: 'api'` requests. `tools/list` only shows tools the caller's `user.permissions` allow.
- Transport: stateless Streamable HTTP, JSON responses (no SSE). Methods: `initialize`, `ping`, `tools/list`, `tools/call`; notifications get `202`.

Turn it on with one `beforeRouteMiddleware` entry. The app supplies only `authenticate`:

```js
import { mcp } from '@awesomeness-js/server';

export default mcp({
	// return the caller's user ({ id, permissions, ... }) or nothing for a 401;
	// throw { status: 429, message } (or another status) to refuse with that status
	authenticate: async (awesomenessRequest) => { return lookUpToken(awesomenessRequest.headers.authorization); },
	path: '/mcp', // default
	// optional: serve another site's tools on this host, e.g. an API subdomain
	siteMap: { 'api.example.com': 'example.com' },
	// optional: replace defaultRouteFilter({ route, site, awesomenessRequest, ctx })
	// routeFilter: ({ route, site, awesomenessRequest, ctx }) => { return defaultRouteFilter({ route, site }) && extra; },
});
```

Tools come from the request's site (shared routes plus that site's `api/routes`). `siteMap` maps a request site to the site whose tools it serves; the request itself (`awesomenessRequest.site`, the application) is unchanged.

A common (shared) route is included only when `_info.publishDocs` is an array that lists that site. Missing or empty `publishDocs` hides it. A site-local route is always shown. Pass `routeFilter` to `mcp()` to replace that default. The function receives `{ route, site, awesomenessRequest, ctx }` and returns true or false. `defaultRouteFilter` is exported so a custom filter can call it and extend it. The same filter applies to `tools/list` and `tools/call`.

`mcp()` marks the request authenticated, so `validateRequest` skips `checkSession`, and the dev access bypass never applies to MCP requests.

## MCP internals

- `mcpHandle` takes one JSON-RPC 2.0 message and returns one response, or `null` (HTTP 202) for a notification such as `notifications/initialized`.
- `listMcpRoutes` keys tools by name (route path with `/` → `_`) and reads only `_info.js`; it applies `routeFilter` or `defaultRouteFilter`. `mcpCallTool` imports `index.js` when the tool is called.
- `infoToJsonSchema` accepts `_info.properties` as a `{ type: 'object', properties }` schema, a bare field map, or nothing.
- Route failures from `mcpCallTool` come back as an `isError` result, never a stack. Unexpected errors are logged and answered as JSON-RPC `-32603 Internal error`; known JSON-RPC codes in `-32768..-32000` pass through.

## License

This project is licensed under the Apache License 2.0.

© 2026 Your Name. All rights reserved.