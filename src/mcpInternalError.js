// The code and message a client may see for a thrown value. Known JSON-RPC errors (an integer code in the
// reserved -32768..-32000 range) pass through; anything else is logged here and answered as a generic internal error.
export default function mcpInternalError({
	error,
	method,
}) {

	const code = error?.code;

	if(Number.isInteger(code) && code >= -32768 && code <= -32000 && typeof error.message === 'string'){

		return {
			code,
			message: error.message
		};

	}

	console.error('MCP internal error', {
		method,
		error
	});

	return {
		code: -32603,
		message: 'Internal error'
	};

}