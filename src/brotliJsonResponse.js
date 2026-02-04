import { brotliCompressSync, constants } from 'zlib';

function brotliJsonResponse(data, {

} = {}) {
  
	const json = JSON.stringify(data);
  
	const compressed = brotliCompressSync(Buffer.from(json), {
		params: {
			[constants.BROTLI_PARAM_QUALITY]: 5
		}
	});

	return {
		statusCode: 200,
		isBase64Encoded: true,
		headers: {
			'Content-Type': 'application/json',
			'Content-Encoding': 'br'
		},
		body: compressed.toString('base64')
	};

}

export { brotliJsonResponse };
export default brotliJsonResponse;