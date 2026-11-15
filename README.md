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
	// return the caller's user ({ id, permissions, ... }) or nothing for a 401
	authenticate: async (awesomenessRequest) => { return lookUpToken(awesomenessRequest.headers.authorization); },
	path: '/mcp', // default
});
```

`mcp()` marks the request authenticated, so `validateRequest` skips `checkSession`, and the dev access bypass never applies to MCP requests.
## License

This project is licensed under the Apache License 2.0.

© 2026 Your Name. All rights reserved.