// A JSON-RPC 2.0 error response.
export default function jsonRpcError({
	id = null,
	code,
	message,
}) {

	return {
		jsonrpc: '2.0',
		id,
		error: {
			code,
			message
		}
	};

}