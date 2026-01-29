import fetchPage from '../fetchPage.js';
import pageInfo from '../pageInfo.js';
import validateRequest from '../validateRequest.js';
import { staticFiles } from './staticFiles.js';
import finalFormat from './finalFormat.js';

async function routeRequest(ctx, next){

	const awesomenessRequest = ctx.awesomenessRequest;

	// make sure there is no dots in the path
	// regex non alphanumeric or forward slash
	if(awesomenessRequest.pageRoute.match(/[^a-zA-Z0-9\/\_\-]/)){

		ctx.status = 404;
		
		ctx.body = {
			success: false,
			message: 'Invalid path',
		};

		finalFormat(awesomenessRequest, ctx);

		return;
	
	}


	if(awesomenessRequest.awesomenessType === 'page'){

		try {

			let { 
				about, 
				cssPath, 
				jsPath,
				getData
			} = await pageInfo(awesomenessRequest);

			awesomenessRequest.routeInfo = about;

			try {

				await validateRequest(awesomenessRequest);

			} catch (error) {

				ctx.status = 422;
			
				ctx.body = {
					success: false,
					... error,
					stack: error.stack,
				};

				finalFormat(awesomenessRequest, ctx);
				
				return;

			}


			const page = awesomenessRequest.mdContent ? '_md' : awesomenessRequest.pageRoute;

			try {
					
				const pageData = await fetchPage(awesomenessRequest, {
					getData,
					about, 
					cssPath, 
					jsPath,
					page
				});

				ctx.body = {
					success: true,
					meta: awesomenessRequest.updatedMeta,
					... pageData
				};

				finalFormat(awesomenessRequest, ctx);
					
				return;

			} catch (error) {
					
				ctx.status = 500;
					
				ctx.body = {
					success: false,
					message: 'Page exists but error fetching data.',
					meta: awesomenessRequest.updatedMeta,
					error,
					page,
					errMessage: error?.message || 'Error in getData function', 
					stack: error.stack
				};

				finalFormat(awesomenessRequest, ctx);
					
				return;

			}



		} catch(error) {

			ctx.status = 404;

			ctx.body = {
				success: false,
				error,
				message: error?.message || 'Error fetching page',
				stack: error.stack,
			};

			finalFormat(awesomenessRequest, ctx);
			
			return;

		}

	} else if(awesomenessRequest.awesomenessType === 'api'){

		const siteSpecificRoute = new URL(`../../sites/${awesomenessRequest.site}/api/routes/${awesomenessRequest.pageRoute}/index.js`, import.meta.url);
		const genericRoute = new URL(`../../api/routes/${awesomenessRequest.pageRoute}/index.js`, import.meta.url);

		const siteSpecific_info = new URL(`../../sites/${awesomenessRequest.site}/api/routes/${awesomenessRequest.pageRoute}/_info.js`, import.meta.url);
		const generic_info = new URL(`../../api/routes/${awesomenessRequest.pageRoute}/_info.js`, import.meta.url);

		let routeIndex;
		let routeInfo;

		let specific = false;

		try {	

			routeIndex = await import(siteSpecificRoute);
			routeInfo = await import(siteSpecific_info);
			routeInfo = routeInfo.default;

			specific = true;

		} catch (error) {

			try {
									
				routeIndex = await import(genericRoute);
				routeInfo = await import(generic_info);
				routeInfo = routeInfo.default;

				specific = false;

			} catch (error) {
				
				ctx.status = 404;
			
				ctx.body = {
					success: false,
					message: 'route not found',
					error,
					siteSpecificRoute,
					genericRoute,
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
					... error,
					stack: error.stack,
				};

				finalFormat(awesomenessRequest, ctx);
				
				return;

			}

			const data = await routeIndex.default(awesomenessRequest);

			ctx.body = {
				success: true,
				meta: awesomenessRequest.updatedMeta,
				...data
			};

			finalFormat(awesomenessRequest, ctx);
		
		} catch (error) {
		
			ctx.status = 500;

			if(awesomenessRequest.status){

				ctx.status = awesomenessRequest.status;
			
			}
			
			ctx.body = {
				success: false,
				meta: awesomenessRequest.updatedMeta,
				message: error?.message || 'Error in route function',
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

		if(awesomenessRequest.method != 'GET'){

			ctx.status = 405;
			ctx.body = {
				success: false,
				message: 'Method Not Allowed',
			};

			finalFormat(awesomenessRequest, ctx);			
			
			return;
		
		}

		if(awesomenessRequest.path === '/test'){

			ctx.body = {
				success: true,
				message: 'Hello, World! (just a test)',
			};

			finalFormat(awesomenessRequest, ctx);
			
			return;

		}

		awesomenessRequest.path = '/';
		await staticFiles(ctx, next);
		
		return;

	}


}



export { routeRequest };