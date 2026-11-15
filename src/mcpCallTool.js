import { pathToFileURL } from 'url';
import listMcpRoutes from './listMcpRoutes.js';
import validateRequest from './validateRequest.js';

// Run one MCP tool: the marked route, through the same validateRequest (permissions + clean.object)
// and route handler as an HTTP API call. Route failures come back as an isError result, never a stack.
export default async function mcpCallTool({
	name,
	args,
	awesomenessRequest,
	site = awesomenessRequest.site,
}) {

	const routes = await listMcpRoutes({ site });
	const tool = routes[name];

	if(!tool){

		throw {
			code: -32602,
			message: `Unknown tool: ${name}`,
		};

	}

	awesomenessRequest.awesomenessType = 'api';
	awesomenessRequest.pageRoute = tool.route;
	awesomenessRequest.routeInfo = tool.info;
	awesomenessRequest.specific = tool.specific;
	awesomenessRequest.data = args && typeof args === 'object' && !Array.isArray(args) ? args : {};
	awesomenessRequest.cleanData = {};

	try {

		await validateRequest(awesomenessRequest);

		const index = await import(pathToFileURL(tool.indexPath).href);
		const result = (await index.default(awesomenessRequest)) ?? {};
		const isObject = typeof result === 'object' && !Array.isArray(result);

		return {
			content: [ {
				type: 'text',
				text: JSON.stringify(result),
			} ],
			...(isObject ? { structuredContent: result } : {}),
			isError: false,
		};

	} catch(error){

		const details = error?.err?.message;

		return {
			content: [ {
				type: 'text',
				text: JSON.stringify({
					message: error?.message || 'Tool failed',
					...(details ? { details } : {}),
				}),
			} ],
			isError: true,
		};

	}

}
