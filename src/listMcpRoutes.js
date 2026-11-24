import resolveApiRoute from './resolveApiRoute.js';
import resolveRouteFilter from './resolveRouteFilter.js';
import listMcpRoutePaths from './listMcpRoutePaths.js';

export default async function listMcpRoutes({
	site,
	awesomenessRequest,
	ctx,
	routeFilter,
} = {}) {

	const filter = resolveRouteFilter({
		routeFilter,
		awesomenessRequest,
	});
	const requestCtx = ctx || awesomenessRequest?.ctx;
	const routePaths = await listMcpRoutePaths({ site });
	const tools = {};

	for(const route of Object.keys(routePaths)){

		const resolved = await resolveApiRoute({
			site,
			route,
			infoOnly: true,
		}).catch(() => {

			return null;

		});

		if(resolved?.indexPath && resolved.info?.mcp === true){

			const name = route.split('/').join('_');
			const entry = {
				name,
				route,
				info: resolved.info,
				indexPath: resolved.indexPath,
				specific: resolved.specific,
			};

			if(await filter({
				route: entry,
				site,
				awesomenessRequest,
				ctx: requestCtx,
			})){

				tools[name] = entry;

			}

		}

	}

	return tools;

}
