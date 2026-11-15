import listMcpRoutes from './listMcpRoutes.js';
import infoToJsonSchema from './infoToJsonSchema.js';

export default async function mcpListTools({
	awesomenessRequest,
	site = awesomenessRequest.site,
}) {

	const routes = await listMcpRoutes({ site });
	const userPermissions = awesomenessRequest.user?.permissions || [];
	const tools = [];

	for(const route of Object.values(routes)){

		const allowed = route.info.permissions || [];
		const canCall = !allowed.length || allowed.some((permission) => {

			return permission === '*' || userPermissions.includes(permission);

		});

		if(canCall){

			tools.push({
				name: route.name,
				description: route.info.description || route.route,
				inputSchema: infoToJsonSchema(route.info.properties),
			});

		}

	}

	return tools;

}
