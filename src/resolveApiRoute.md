# resolveApiRoute

Finds an API route for a site. The site's own route wins over the shared one.

Returns `{ index, indexPath, info, specific, siteSpecificRoute, genericRoute }`.

- `index`: the imported `index.js` module, or `null` when neither the site route nor the shared route exists, and also `null` when `infoOnly` is true.
- `indexPath`: path to the winning `index.js`, or `null` if none exists. Still set when `infoOnly` is true.
- `info`: the default export of the winning `_info.js`, or `null`.
- `specific`: `true` when the site route won, `false` when the shared route won or nothing was found.
- `siteSpecificRoute` / `genericRoute`: the candidate `index.js` paths (site first, then shared).

`infoOnly: true` reads `_info.js` without importing `index.js`.