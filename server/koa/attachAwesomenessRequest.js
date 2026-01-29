import awesomenessNormalizeRequest  from '../awesomenessNormalizeRequest.js';
import specialPaths from '../specialPaths.js';
import { getConfig } from "../../config.js";

async function attachAwesomenessRequest(ctx, next) {
	
	const awesomenessConfig = getConfig();

	ctx.awesomenessRequest = await awesomenessNormalizeRequest({ req: ctx });

	const routes = awesomenessConfig.specialRoutes[ctx.awesomenessRequest.site] || [];

	if(ctx.awesomenessRequest.awesomenessType === 'page'){

		await specialPaths(ctx.awesomenessRequest, routes);

	}
	
	await next();
	
}

export { attachAwesomenessRequest };
export default attachAwesomenessRequest;
