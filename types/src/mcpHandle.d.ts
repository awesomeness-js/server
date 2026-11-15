export default function mcpHandle({ message, awesomenessRequest, serverInfo, }: {
    message: any;
    awesomenessRequest: any;
    serverInfo: any;
}): Promise<{
    jsonrpc: string;
    id: any;
    error: {
        code: any;
        message: any;
    };
} | {
    jsonrpc: string;
    id: any;
    result: any;
}>;
