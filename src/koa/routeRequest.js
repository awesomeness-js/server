import fetchPage from "../fetchPage.js";
import pageInfo from "../pageInfo.js";
import validateRequest from "../validateRequest.js";
import staticFiles from "./staticFiles.js";
import finalFormat from "./finalFormat.js";
import resolveApiRoute from "../resolveApiRoute.js";

export default async function routeRequest(ctx, next) {

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

		let resolved;

		try {

			resolved = await resolveApiRoute({
				site: awesomenessRequest.site,
				route: awesomenessRequest.pageRoute,
			});

		} catch (importError) {

			ctx.status = 500;
			ctx.body = {
				success: false,
				message: importError?.message,
				...importError,
			};
			finalFormat(awesomenessRequest, ctx);

			return;

		}

		if (!resolved.index) {

			ctx.status = 404;
			ctx.body = {
				success: false,
				message: "route not found",
				siteSpecificRoute: resolved.siteSpecificRoute,
				genericRoute: resolved.genericRoute,
			};
			finalFormat(awesomenessRequest, ctx);

			return;

		}

		const routeIndex = resolved.index;
		const routeInfo = resolved.info;
		const specific = resolved.specific;

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