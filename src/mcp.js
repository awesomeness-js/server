import mcpHandle from './mcpHandle.js';

// MCP endpoint as Koa middleware for beforeRouteMiddleware (Streamable HTTP, stateless, JSON responses).
// Exposes every API route whose _info.js has `mcp: true` for the request's site.
// authenticate(awesomenessRequest) returns the caller's user ({ id, permissions, ... }) or nothing for a 401.
export default function mcp({
	authenticate,
	path = '/mcp',
	serverInfo = null,
} = {}) {

	if(typeof authenticate !== 'function'){

		throw new Error('mcp() needs an authenticate(awesomenessRequest) function');

	}

	return async function mcpMiddleware(ctx, next) {

		const awesomenessRequest = ctx.awesomenessRequest;

		if(awesomenessRequest?.path !== path){

			await next();

			return;

		}

		if(ctx.method !== 'POST'){

			ctx.set('Allow', 'POST');
			ctx.status = 405;
			ctx.body = {
				jsonrpc: '2.0',
				id: null,
				error: {
					code: -32000,
					message: 'Method not allowed'
				}
			};

			return;

		}

		// a throwing authenticate counts as no user
		const user = await Promise.resolve(awesomenessRequest)
			.then(authenticate)
			.catch(() => null);

		if(!user){

			ctx.set('WWW-Authenticate', 'Bearer');
			ctx.status = 401;
			ctx.body = {
				jsonrpc: '2.0',
				id: null,
				error: {
					code: -32001,
					message: 'Unauthorized'
				}
			};

			return;

		}

		awesomenessRequest.user = user;
		awesomenessRequest.authenticated = true;
		awesomenessRequest.mcp = true;

		const response = await mcpHandle({
			message: ctx.request.body,
			awesomenessRequest,
			serverInfo,
		});

		if(response === null){

			ctx.body = '';
			ctx.status = 202;

			return;

		}

		ctx.status = 200;
		ctx.body = response;

	};

}
