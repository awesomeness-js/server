import checkAccess from "./server/checkAccess.js";
import fetchPage from "./server/fetchPage.js";
import reRoute from "./server/reRoute.js";
import start from "./start.js";
import { init, getConfig } from "./config.js";

export { 
	init,
	getConfig,
	checkAccess,
	reRoute,
	fetchPage,
	start
};

const server = {
	checkAccess,
	fetchPage,
	getConfig,
	init,
	reRoute,
	start
};

export default server;