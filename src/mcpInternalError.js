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