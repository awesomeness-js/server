import checkAccess from "./server/checkAccess.js";
import fetchPage from "./server/fetchPage.js";
import reRoute from "./server/reRoute.js";
import { componentDependencies } from "./ui/componentDependencies.js";
import start from "./start.js";
import { init, getConfig } from "./config.js";
import getMD from "./server/getMD.js";

export { 
	init,
	getConfig,
	checkAccess,
	reRoute,
	fetchPage,
	start,
	componentDependencies,
	getMD
};

const server = {
	checkAccess,
	componentDependencies,
	fetchPage,
	getConfig,
	init,
	reRoute,
	start,
	getMD
};

export default server;