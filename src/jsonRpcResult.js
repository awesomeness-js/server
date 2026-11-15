export default function jsonRpcResult({
	id = null,
	result,
}) {

	return {
		jsonrpc: '2.0',
		id,
		result
	};

}