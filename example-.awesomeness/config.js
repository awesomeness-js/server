import hostMap from './hostMap.js';
import initDB from './initDB.js';
import specialRoutes from './specialRoutes.js';
import wsHandler from './wsHandler.js';
import beforeRouteMiddleware from './beforeRouteMiddleware.js';
import checkSession from './checkSession.js';
import applicationMap from './applicationMap.js';
import componentLocations from './componentLocations.js';

export default {
	siteDir__URL: new URL("../sites/", import.meta.url),
	commonPublicDir__URL: new URL("../awesomeness-ui/core/public/", import.meta.url),
	commonApiDir__URL: new URL("../api/", import.meta.url),
	componentLocations,
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