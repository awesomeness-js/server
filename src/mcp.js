import mcpHandle from './mcpHandle.js';

export default function mcp({
	authenticate,
	path = '/mcp',
	serverInfo = null,
	siteMap = {},
} = {}) {

	if(typeof authenticate !== 'function'){

		throw new Error('mcp() needs an authenticate(awesomenessRequest) function');

	}

	return async function mcpMiddleware(ctx, next) {

		const awesomenessRequest = ctx.awesomenessRequest;
		const pageGet = ctx.method === 'GET' && !String(ctx.headers?.accept || '').includes('text/event-stream');

		if(awesomenessRequest?.path !== path || pageGet){

			await next();

			return;

		}

		const refuse = (status, message) => {

			ctx.status = status;
			ctx.body = {
				jsonrpc: '2.0',
				id: null,
				error: {
					code: -32000,
					message,
				},
			};

		};

		if(ctx.method !== 'POST'){

			ctx.set('Allow', 'POST');
			refuse(405, 'Method not allowed');

			return;

		}

		const auth = await Promise.resolve(awesomenessRequest)
			.then(authenticate)
			.then((user) => ({ user }))
			.catch((error) => ({ error }));

		if(!auth.user){

			const status = Number.isInteger(auth.error?.status) ? auth.error.status : 401;

			ctx.set('WWW-Authenticate', 'Bearer');
			refuse(status, status === 401 ? 'Unauthorized' : (auth.error?.message || 'Refused'));

			return;

		}

		awesomenessRequest.user = auth.user;
		awesomenessRequest.authenticated = true;
		awesomenessRequest.mcp = true;

		const response = await mcpHandle({
			message: ctx.request.body,
			awesomenessRequest,
			serverInfo,
			site: siteMap && Object.hasOwn(siteMap, awesomenessRequest.site) ? siteMap[awesomenessRequest.site] : awesomenessRequest.site,
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
