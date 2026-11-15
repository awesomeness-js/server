export default function mcpListTools({ awesomenessRequest }: {
    awesomenessRequest: any;
}): Promise<{
    name: any;
    description: any;
    inputSchema: {
        type: any;
        format: any;
        contentEncoding: string;
        enum: any;
        examples: any;
        properties: {};
        required: string[];
        items: /*elided*/ any;
    };
}[]>;
