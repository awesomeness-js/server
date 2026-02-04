// cache: site -> pattern -> { regex, keys }
const __routeCache = new Map();

function compile(site, pattern) {

	let siteMap = __routeCache.get(site);

	if (!siteMap) {

		siteMap = new Map();
		__routeCache.set(site, siteMap);
	
	}

	let compiled = siteMap.get(pattern);

	if (!compiled) {

		const esc = (s) => s.replace(/([.+^=!:${}()|[\]\\])/g, '\\$1');
		const keys = [];
		const re = '^/' + pattern
			.split('/').filter(Boolean)
			.map((seg) => {

				if (seg.startsWith(':')) {

					keys.push(seg.slice(1));
					
					return '([^/]+)';
				
				}

				return esc(seg);
			
			})
			.join('/') + '/?$';

		compiled = {
			regex: new RegExp(re),
			keys 
		};
		siteMap.set(pattern, compiled);
	
	}

	return compiled;

}

export function matchPathSite(site, pattern, path) {

	const {
		regex, keys 
	} = compile(site, pattern);
	const m = regex.exec(path);

	if (!m) return null;

	const params = {};

	for (let i = 0; i < keys.length; i++) params[keys[i]] = m[i + 1];
	
	return params;

}

export async function specialPaths(awesomenessRequest, routes) {

	for (const route of routes) {

		// console.log('Checking route:', {
		// 	pattern: route.pattern,
		// 	path: awesomenessRequest.path,
		// 	site: awesomenessRequest.site
		// });


		const params = matchPathSite(awesomenessRequest.site, route.pattern, awesomenessRequest.path);

		if (params) {

			// console.log('Matched route:', {
			// 	pattern: route.pattern,
			// 	path: awesomenessRequest.path,
			// 	site: awesomenessRequest.site,
			// 	params
			// });

			await route.handler(awesomenessRequest, params, route);
			
			return; // stop the chain here
		
		} else {

			// console.log('No match for route:', {
			// 	pattern: route.pattern,
			// 	path: awesomenessRequest.path,
			// 	site: awesomenessRequest.site
			// });

		}
	
	}

}

export default specialPaths;
