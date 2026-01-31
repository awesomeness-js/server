import hostMap from './hostMap.js';
import initDB from './initDB.js';
import specialRoutes from './specialRoutes.js';
import wsHandler from './wsHandler.js';
import beforeRouteMiddleware from './beforeRouteMiddleware.js';
import checkSession from './checkSession.js';
import applicationMap from './applicationMap.js';

export default {
	
	siteDir__URL: new URL("../sites/", import.meta.url),
	commonPublicDir__URL: new URL("../awesomeness-ui/core/public/", import.meta.url),
	commonApiDir__URL: new URL("../api/", import.meta.url),

	componentLocations: (awesomenessRequest) => {

		const siteDir__URL = new URL(`../sites/${awesomenessRequest.site}/`, import.meta.url);

		return [

			// first match wins (site first)
			new URL('./components/', siteDir__URL),

			// last item is the default
			new URL('../awesomeness-ui/components/', import.meta.url),
		];

	},

	debug: true,
	byPassAccessRequirementsInDev: true,

	applicationMap,
	beforeRouteMiddleware,
	checkSession,
	hostMap,
	initDB, 
	specialRoutes,
	wsHandler, 
};