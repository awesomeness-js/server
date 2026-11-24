export default function jsonRpcError({ id, code, message, }: {
    id?: any;
    code: any;
    message: any;
}): {
    jsonrpc: string;
    id: any;
    error: {
        code: any;
        message: any;
    };
};
