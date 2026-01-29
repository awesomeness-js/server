import checkAccess from "./server/checkAccess.js";
import reRoute from "./server/reRoute.js";
import { init, getConfig } from "./config.js";
import start from "./start.js";

export { 
	init,
	getConfig,
	checkAccess,
	reRoute,
	start
};

const server = {
	init,
	getConfig,
	checkAccess,
	reRoute,
	start
};

export default server;