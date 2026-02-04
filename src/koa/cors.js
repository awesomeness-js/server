export default async function cors(ctx, next){

	// Set CORS headers
	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
	// Handle OPTIONS requests
	if (ctx.method === 'OPTIONS') {

	  ctx.status = 204; // No Content
	  
		return;
	
	}
  
	// Proceed to the next middleware
	await next();
	
}