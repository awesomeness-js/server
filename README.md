# Awesomeness JS Configuration

Most configurations for Awesomeness JS are done through the `.awesomeness/config.js` file.

The `./awesomeness/` folder and you can customize the location by modifying the import paths in `package.json`.

## For an Example Application see the repo

[@awesomeness-js/app-template](https://github.com/awesomeness-js/app-template)


## Pre Routing
- start
- attachAwesomenessRequest
  - gets awesomenessRequest.awesomenessType [page, api, generic]
- [staticFiles](#Static-Files)
- beforeRouteMiddleware
- routeRequest

## Routing
- needs to be valid route
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



## Static Files
- site specific files first
  - /${awesomenessConfig.siteURL}/${awesomenessRequest.site}/public/index.html
- then common files
  - /${awesomenessConfig.commonPublicDir}/${awesomenessRequest.site}/public/index.html
  
each call `app.init`


## License

This project is licensed under the Apache License 2.0.

© 2026 Your Name. All rights reserved.