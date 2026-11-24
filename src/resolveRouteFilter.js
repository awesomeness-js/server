import defaultRouteFilter from './defaultRouteFilter.js';

export default function resolveRouteFilter({
	routeFilter,
	awesomenessRequest,
} = {}) {

	if(typeof routeFilter === 'function'){

		return routeFilter;

	}

	if(typeof awesomenessRequest?.routeFilter === 'function'){

		return awesomenessRequest.routeFilter;

	}

	return defaultRouteFilter;

}
