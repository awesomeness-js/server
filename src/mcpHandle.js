import mcpListTools from './mcpListTools.js';
import mcpCallTool from './mcpCallTool.js';

// One JSON-RPC 2.0 message in, one response out (null for notifications).
// Stateless MCP: initialize, ping, tools/list, tools/call. No sessions, no SSE.
export default async function mcpHandle({
	message,
	awesomenessRequest,
	serverInfo,
}) {

	const supported = [ '2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05' ];
	const id = message?.id ?? null;

	const reply = (result) => {

		return {
			jsonrpc: '2.0',
			id,
			result
		};

	};

	const fail = (code, text) => {

		return {
			jsonrpc: '2.0',
			id,
			error: {
				code,
				message: text
			}
		};

	};

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

			return reply({
				protocolVersion: supported.includes(params.protocolVersion) ? params.protocolVersion : supported[0],
				capabilities: { tools: { listChanged: false } },
				serverInfo: serverInfo || {
					name: awesomenessRequest.site,
					version: '1.0.0',
				},
			});

		}

		if(message.method === 'ping'){

			return reply({});

		}

		if(message.method === 'tools/list'){

			return reply({ tools: await mcpListTools({ awesomenessRequest }) });

		}

		if(message.method === 'tools/call'){

			return reply(await mcpCallTool({
				name: params.name,
				args: params.arguments,
				awesomenessRequest,
			}));

		}

		return fail(-32601, `Method not found: ${message.method}`);

	} catch(error){

		return fail(error?.code ?? -32603, error?.message || 'Internal error');

	}

}
