import fs from 'fs';
import path from 'path';
import send from 'koa-send';
import { fileURLToPath } from "node:url";
import getConfig from "../getConfig.js";

export default async function staticFiles(ctx, next) {

	const {
		method, 
		path: reqPath, 
		site 
	} = ctx.awesomenessRequest;


	const {
		siteDir__URL, 
		commonPublicDir__URL 
	} = getConfig();

	if (method !== "GET" && method !== "HEAD") {

		await next();
		
		return;
	
	}

	if (!(siteDir__URL instanceof URL) || !(commonPublicDir__URL instanceof URL)) {

		ctx.throw(500, new Error("Config must provide siteDir__URL and commonPublicDir__URL as file: URLs"));
		
		return;
	
	}

	const sitesRoot = fileURLToPath(siteDir__URL);
	const commonRoot = fileURLToPath(commonPublicDir__URL);

	const domainRoot = path.join(sitesRoot, site, "public");

	const relativePath =
    reqPath === "/" ? "index.html" : reqPath.replace(/^\//, "");

	const domainFilePath = path.join(domainRoot, relativePath);
	const commonFilePath = path.join(commonRoot, relativePath);

	let fileServed = false;

	try {	

		// Try to serve from the domain-specific directory
		await fs.promises.access(domainFilePath);
		ctx.set('X-Awesomeness-Place', 'Domain');
		await send(ctx, relativePath, { root: domainRoot });
		fileServed = true;
	
	} catch (err) {

		if (err.code !== 'ENOENT') {

			ctx.throw(500, new Error('Internal Server Error'));
		
		}
	
	}

	if (!fileServed) {

		try {

			// Try to serve from the common directory
			await fs.promises.access(commonFilePath);
			ctx.set('X-Awesomeness-Place', 'Common');
			await send(ctx, relativePath, { root: commonRoot });
			fileServed = true;
		
		} catch (err2) {

			if (err2.code !== 'ENOENT') {

				ctx.throw(500, new Error('Internal Server Error'));
			
			}
		
		}
	
	}

	if (!fileServed) {

		await next(); // Proceed to next middleware if no static file was served
	
	}

}