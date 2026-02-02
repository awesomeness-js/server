export default (awesomenessRequest) => {

	const siteSpecific__URL = new URL(`../sites/${awesomenessRequest.site}/`, import.meta.url);

	return [

		// first match wins (site first)
		new URL('./components/', siteSpecific__URL),

		// last item is the default
		new URL('../awesomeness-ui/components/', import.meta.url),
		
	];

};