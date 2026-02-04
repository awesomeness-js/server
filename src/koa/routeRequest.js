import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath, pathToFileURL } from "url";

import fetchPage from "../fetchPage.js";
import pageInfo from "../pageInfo.js";
import validateRequest from "../validateRequest.js";
import staticFiles from "./staticFiles.js";
import finalFormat from "./finalFormat.js";
import getConfig from "../getConfig.js";

export default async function routeRequest(ctx, next) {

	const awesomenessConfig = getConfig();

	const awesomenessRequest = ctx.awesomenessRequest;

	// make sure there is no dots in the path
	// regex non alphanumeric or forward slash
	if (awesomenessRequest.pageRoute.match(/[^a-zA-Z0-9\/\_\-]/)) {

		ctx.status = 404;

		ctx.body = {
			success: false,
			message: "Invalid path",
		};

		finalFormat(awesomenessRequest, ctx);

		return;
	
	}

	if (awesomenessRequest.awesomenessType === "page") {

		awesomenessRequest.log('yeah we are live (PAGE)');

		try {

			let {
				about, cssPath, jsPath, getData 
			} = await pageInfo(awesomenessRequest);

			awesomenessRequest.routeInfo = about;

			try {

				await validateRequest(awesomenessRequest);
			
			} catch (error) {

				ctx.status = 422;

				ctx.body = {
					success: false,
					...error,
					stack: error.stack,
				};

				finalFormat(awesomenessRequest, ctx);

				return;
			
			}

			const page = awesomenessRequest.mdContent ? "_md" : awesomenessRequest.pageRoute;

			try {

				const pageData = await fetchPage(awesomenessRequest, {
					getData,
					about,
					cssPath,
					jsPath,
					page,
				});

				ctx.body = {
					success: true,
					meta: awesomenessRequest.updatedMeta,
					...pageData,
				};

				finalFormat(awesomenessRequest, ctx);

				return;
			
			} catch (error) {

				ctx.status = 500;

				ctx.body = {
					success: false,
					message: "Page exists but error fetching data.",
					meta: awesomenessRequest.updatedMeta,
					error,
					page,
					errMessage: error?.message || "Error in getData function",
					stack: error.stack,
				};

				finalFormat(awesomenessRequest, ctx);

				return;
			
			}
		
		} catch (error) {

			ctx.status = 404;

			ctx.body = {
				success: false,
				error,
				message: error?.message || "Error fetching page",
				stack: error.stack,
			};

			finalFormat(awesomenessRequest, ctx);

			return;
		
		}
	
	} else if (awesomenessRequest.awesomenessType === "api") {

		awesomenessRequest.log('yeah we are live (API)');

		const {
			siteDir__URL, 
			commonApiDir__URL
		} = awesomenessConfig;

		// siteDir__URL should point at the /sites/ directory (as a file: URL)
		if (!(siteDir__URL instanceof URL) || !(commonApiDir__URL instanceof URL)) {

			ctx.throw(
				500,
				new Error("Config must provide siteDir__URL and commonApiDir__URL as file: URLs")
			);
			
			return;
		
		}

		const sitesRoot = fileURLToPath(siteDir__URL);
		const commonApiRoot = fileURLToPath(commonApiDir__URL);

		const siteApiRoutesRoot = path.join(sitesRoot, awesomenessRequest.site, "api", "routes");
		const commonApiRoutesRoot = path.join(commonApiRoot, "routes");

		const routeRel = path.join(awesomenessRequest.pageRoute, "index.js");
		const infoRel = path.join(awesomenessRequest.pageRoute, "_info.js");

		const siteSpecificIndexPath = path.join(siteApiRoutesRoot, routeRel);
		const siteSpecificInfoPath = path.join(siteApiRoutesRoot, infoRel);

		const genericIndexPath = path.join(commonApiRoutesRoot, routeRel);
		const genericInfoPath = path.join(commonApiRoutesRoot, infoRel);

		let routeIndex;
		let routeInfo;

		let specific = false;

		// Prefer filesystem existence checks so we don't rely on import() throwing for control flow
		try {

			awesomenessRequest.log('Trying site specific route.', {
				siteSpecificIndexPath,
				siteSpecificInfoPath 
			});

			await fs.access(siteSpecificIndexPath);
			await fs.access(siteSpecificInfoPath);

			awesomenessRequest.log('Site specific route found.', {
				siteSpecificIndexPath,
				siteSpecificInfoPath 
			});

			routeIndex = await import(pathToFileURL(siteSpecificIndexPath).href);
			const infoMod = await import(pathToFileURL(siteSpecificInfoPath).href);

			routeInfo = infoMod.default;

			awesomenessRequest.log('Site specific route info loaded.', {
				routeInfo 
			});


			specific = true;
		
		} catch (error) {

			awesomenessRequest.log('Site specific route not found, trying generic route.', { error });

			try {

				await fs.access(genericIndexPath);
				await fs.access(genericInfoPath);

				routeIndex = await import(pathToFileURL(genericIndexPath).href);
				const infoMod = await import(pathToFileURL(genericInfoPath).href);

				routeInfo = infoMod.default;

				specific = false;
			
			} catch (error2) {

				ctx.status = 404;

				ctx.body = {
					success: false,
					message: "route not found",
					error: error2,
					siteSpecificRoute: siteSpecificIndexPath,
					genericRoute: genericIndexPath,
				};

				finalFormat(awesomenessRequest, ctx);

				return;
			
			}
		
		}

		try {

			// store routeInfo
			awesomenessRequest.specific = specific;
			awesomenessRequest.routeInfo = routeInfo;

			// validate data
			try {

				await validateRequest(awesomenessRequest);
			
			} catch (error) {

				ctx.status = 422;

				ctx.body = {
					success: false,
					...error,
					stack: error.stack,
				};

				finalFormat(awesomenessRequest, ctx);

				return;
			
			}

			const data = await routeIndex.default(awesomenessRequest);

			ctx.body = {
				success: true,
				meta: awesomenessRequest.updatedMeta,
				...data,
			};

			finalFormat(awesomenessRequest, ctx);
		
		} catch (error) {

			ctx.status = 500;

			if (awesomenessRequest.status) {

				ctx.status = awesomenessRequest.status;
			
			}

			ctx.body = {
				success: false,
				meta: awesomenessRequest.updatedMeta,
				message: error?.message || "Error in route function",
				error,
				stack: error.stack,
			};

			finalFormat(awesomenessRequest, ctx);

			return;
		
		}
	
	} else {

		// if its a get request
		// a static file should have been served already
		// if the application is working correctly then ctx.awesomenessType === 'page' should be true
		// if it is not true, they are hitting a url cold or reloading
		// so load the app

		if (awesomenessRequest.method != "GET") {

			ctx.status = 405;
			ctx.body = {
				success: false,
				message: "Method Not Allowed",
			};

			finalFormat(awesomenessRequest, ctx);

			return;
		
		}

		if (awesomenessRequest.path === "/test") {

			ctx.body = {
				success: true,
				message: "Hello, World! (just a test)",
			};

			finalFormat(awesomenessRequest, ctx);

			return;
		
		}

		awesomenessRequest.path = "/";
		await staticFiles(ctx, next);

		return;
	
	}

}