export default [
	{
		pattern: '/blog/:tag',
		handler: async (awesomenessRequest, params) => {
				
			// test by returning json 200
			awesomenessRequest.data.tag = params.tag;
			awesomenessRequest.pageRoute = 'blog';
			
			awesomenessRequest.pageInit = 'blog';

		}
	}
];
