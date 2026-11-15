// The MCP initialize result: the client's protocol version when supported, else the newest one.
export default function mcpInitialize({
	params = {},
	serverInfo = null,
	awesomenessRequest,
}) {

	const supported = [ '2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05' ];

	return {
		protocolVersion: supported.includes(params.protocolVersion) ? params.protocolVersion : supported[0],
		capabilities: { tools: { listChanged: false } },
		serverInfo: serverInfo || {
			name: awesomenessRequest.site,
			version: '1.0.0',
		},
	};

}