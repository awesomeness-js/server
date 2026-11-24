import listMcpRoutes from './listMcpRoutes.js';
import infoToJsonSchema from './infoToJsonSchema.js';
import returnsToOutputSchema from './returnsToOutputSchema.js';

export default async function mcpListTools({
	awesomenessRequest,
	site = awesomenessRequest.site,
	ctx,
	routeFilter,
}) {

	const routes = await listMcpRoutes({
		site,
		awesomenessRequest,
		ctx,
		routeFilter,
	});
	const userPermissions = awesomenessRequest.user?.permissions || [];
	const tools = [];

	for(const route of Object.values(routes)){

		const allowed = route.info.permissions || [];
		const canCall = !allowed.length || allowed.some((permission) => {

			return permission === '*' || userPermissions.includes(permission);

		});

		if(canCall){

			const tool = {
				name: route.name,
				description: route.info.description || route.route,
				inputSchema: infoToJsonSchema(route.info.properties),
			};
			const outputSchema = returnsToOutputSchema(route.info.returns);

			if(outputSchema){

				tool.outputSchema = outputSchema;

			}

			tools.push(tool);

		}

	}

	return tools;

}
