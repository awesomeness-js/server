function finalFormat(awesomenessRequest, ctx){

	if(!ctx.body.meta){

		ctx.body.meta = {};

	}

	if(awesomenessRequest.pageInit){

		ctx.body.meta.pageInit = awesomenessRequest.pageInit;

	}

	// just a test
	if(process.env.TESTING){

		ctx.body.awesomenessRequest = awesomenessRequest;
	
	}

	// meta update user
	if(awesomenessRequest.user) {

		ctx.body.meta.user = awesomenessRequest.user;
	
	}

	return;

}

export { finalFormat };
export default finalFormat;