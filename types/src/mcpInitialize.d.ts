export default function mcpInitialize({ params, serverInfo, awesomenessRequest, }: {
    params?: {};
    serverInfo?: any;
    awesomenessRequest: any;
}): {
    protocolVersion: any;
    capabilities: {
        tools: {
            listChanged: boolean;
        };
    };
    serverInfo: any;
};
