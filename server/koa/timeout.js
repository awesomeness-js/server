// Timeout middleware
const timeout = (ms) => {

	return async (ctx, next) => {

	  // Create a promise that rejects after `ms` milliseconds
	  const timer = new Promise((_, reject) => {

			const id = setTimeout(() => {

		  reject(new Error('Request timed out'));
			
			}, ms);
  
			// Clear the timer if the request finishes early
			ctx.res.on('finish', () => clearTimeout(id));
	  
		});
  
	  try {

			// Race the timer and the next middleware
			await Promise.race([ next(), timer ]);
	  
		} catch (err) {

			// If an error occurs (such as a timeout), set the response
			ctx.status = 408; // 408 Request Timeout
			ctx.body = {
		  success: false,
		  message: err.message
			};
			
			return;
	  
		}
	
	};

};

export { timeout };