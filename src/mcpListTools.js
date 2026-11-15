import listMcpRoutes from './listMcpRoutes.js';
import infoToJsonSchema from './infoToJsonSchema.js';

// MCP tool descriptors for the marked routes this caller may use (route permissions vs user.permissions).
export default async function mcpListTools({ awesomenessRequest }) {

	const routes = await listMcpRoutes({ site: awesomenessRequest.site });
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
