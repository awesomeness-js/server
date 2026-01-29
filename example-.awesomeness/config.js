import hostMap from './hostMap.js';
import initDB from './initDB.js';
import specialRoutes from './specialRoutes.js';
import wsHandler from './wsHandler.js';
import beforeRouteMiddleware from './beforeRouteMiddleware.js';
import checkSession from './checkSession.js';
import applicationMap from './applicationMap.js';

export default {

	configURL: new URL(import.meta.url),
	siteURL: new URL("../sites/", import.meta.url),
	commonPublicDir: new URL("../awesomeness-ui/core/public/", import.meta.url),

	componentLocations: (awesomenessRequest) => {

		const siteURL = new URL(`../sites/${awesomenessRequest.site}/`, import.meta.url);

		return [

			// first match wins (site first)
			new URL('./components/', siteURL),

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