const errorHandler = async (ctx, next) => {
	
	try {

	  await next();
	
	} catch (err) {

	  if (err.code === 'EPIPE') {

			console.error('EPIPE error: Client closed connection');
			ctx.status = 499; // Client Closed Request
			ctx.body = 'Client closed connection unexpectedly';
			
			return;
	  
		} else {

			// Handle other errors normally
			ctx.status = err.status || 500;
			ctx.body = err.message || 'Internal Server Error';
			ctx.app.emit('error', err, ctx);
			
			return;
	  
		}
	
	}

};

export { errorHandler };