import getConfig from './getConfig.js';

export default async ({
	permissionsAllowed,
	awesomenessRequest,
}) => {

	const awesomenessConfig = getConfig();

	const userPermissions = awesomenessRequest.user?.permissions || [];

	// has at lease one of the permissions
	const hasPermission = permissionsAllowed.some((rp) => userPermissions.includes(rp) || rp === '*');

	if(!hasPermission){

		// MCP requests never take the dev bypass: a token only gets what its user is allowed.
		if(
			process.env.NODE_ENV === 'development'
			&& awesomenessConfig.byPassAccessRequirementsInDev === true
			&& awesomenessRequest.mcp !== true
		){

			console.log('by passing access requirement. 2 - development env && byPassAccessRequirementsInDev is true');

		} else {

			throw {
				message: 'user does not have permission',
				permissionsAllowed,
				userPermissions
			};

		}

	}

	return true;

};
