import awesomenessNormalizeRequest  from '../awesomenessNormalizeRequest.js';
import specialPaths from '../specialPaths.js';
import getConfig from "../getConfig.js";

export default async function attachAwesomenessRequest(ctx, next) {
	
	const awesomenessConfig = getConfig();

	ctx.awesomenessRequest = await awesomenessNormalizeRequest({ req: ctx });

	ctx.awesomenessRequest.log('Attached awesomenessRequest to Koa ctx');

	const routes = awesomenessConfig.specialRoutes[ctx.awesomenessRequest.site] || [];

	await specialPaths(ctx.awesomenessRequest, routes);
	
	await next();
	
}