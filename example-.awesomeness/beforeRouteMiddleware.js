// All functions called before request routing

async function customMiddleware1(ctx, next) {

	// console.log('Custom middleware before routeRequest', ctx.awesomenessRequest.path);
	
	// custom logic here

	await next();

}

export default [ 
	customMiddleware1 
];