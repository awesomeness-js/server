export default function mcpHandle({ message, awesomenessRequest, serverInfo, site, }: {
    message: any;
    awesomenessRequest: any;
    serverInfo: any;
    site?: string;
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
