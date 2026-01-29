let _config = Object.freeze({}); 

export function init(userConfig = {}) {

	const defaults = {
		applicationMap: {},
		beforeRouteMiddleware: [],
		checkSession: null,
		hostMap: null,
		initDB: null,
		specialRoutes: {},
		wsHandler: null,
		componentLocations: [],
	};

	_config = Object.freeze({
		...defaults,
		...userConfig,
	});

	return _config;

}

export function getConfig() {

	return _config;

}