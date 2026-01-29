import specialPaths from './specialPaths.js';
import fetchPage from './fetchPage.js';
import { getConfig } from "../config.js";

export default async function reRoute({
	goToPage, 
	awesomenessRequest
}){

	const awesomenessConfig = getConfig();

	if(!goToPage){

		return {
			pageData: {},
			pageRouteFixed: awesomenessRequest.pageRoute
		};
	
	}
	
	if(!awesomenessRequest.reRoutes){

		awesomenessRequest.reRoutes = [];
	
	}

	awesomenessRequest.reRoutes.push(awesomenessRequest.pageRoute);
	
	// re-route
	awesomenessRequest.path = goToPage;
	
	// page route - replace leading and trailing slash
	goToPage = goToPage.replace(/^\/+|\/+$/g, '');
	awesomenessRequest.pageRoute = goToPage;

	// slug
	const slug = goToPage.split('/').pop().split('.')[0].split('?')[0];

	awesomenessRequest.slug = slug;

	const routes = awesomenessConfig.specialRoutes[awesomenessRequest.site] || [];

	await specialPaths(awesomenessRequest, routes);

	const pageData = await fetchPage(awesomenessRequest);

	const out = {
		pageData,
		pageRouteFixed: awesomenessRequest.pageRoute
	};

	return out;

}