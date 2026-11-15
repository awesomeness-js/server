export default function mcpListTools({ awesomenessRequest, site, }: {
    awesomenessRequest: any;
    site?: string;
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
