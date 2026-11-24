export default function jsonRpcResult({ id, result, }: {
    id?: any;
    result: any;
}): {
    jsonrpc: string;
    id: any;
    result: any;
};
