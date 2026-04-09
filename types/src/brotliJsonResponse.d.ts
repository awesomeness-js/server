export default brotliJsonResponse;
export function brotliJsonResponse(data: any, {}?: {}): {
    statusCode: number;
    isBase64Encoded: boolean;
    headers: {
        'Content-Type': string;
        'Content-Encoding': string;
    };
    body: any;
};
