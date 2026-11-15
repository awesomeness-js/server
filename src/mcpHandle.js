import mcpListTools from './mcpListTools.js';
import mcpCallTool from './mcpCallTool.js';
import jsonRpcError from './jsonRpcError.js';
import jsonRpcResult from './jsonRpcResult.js';
import mcpInternalError from './mcpInternalError.js';
import mcpInitialize from './mcpInitialize.js';

// One JSON-RPC 2.0 message in, one response out (null for notifications).
// Stateless MCP: initialize, ping, tools/list, tools/call. No sessions, no SSE.
export default async function mcpHandle({
	message,
	awesomenessRequest,
	serverInfo,
	site = awesomenessRequest?.site,
}) {

	const id = message?.id ?? null;

	const reply = (result) => jsonRpcResult({
		id,
		result
	});

	const fail = (code, text) => jsonRpcError({
		id,
		code,
		message: text
	});

	if(!message || Array.isArray(message) || message.jsonrpc !== '2.0' || typeof message.method !== 'string'){

		return fail(-32600, 'Invalid Request');

	}

	if(message.id === undefined){

		// notification, e.g. notifications/initialized
		return null;

	}

	const params = message.params || {};

	try {

		if(message.method === 'initialize'){

			return reply(mcpInitialize({
				params,
				serverInfo,
				awesomenessRequest
			}));

		}

		if(message.method === 'ping'){

			return reply({});

		}

		if(message.method === 'tools/list'){

			return reply({
				tools: await mcpListTools({
					awesomenessRequest,
					site
				}) 
			});

		}

		if(message.method === 'tools/call'){

			return reply(await mcpCallTool({
				name: params.name,
				args: params.arguments,
				awesomenessRequest,
				site,
			}));

		}

		return fail(-32601, `Method not found: ${message.method}`);

	} catch(error){

		const safe = mcpInternalError({
			error,
			method: message.method
		});

		return fail(safe.code, safe.message);

	}

}
