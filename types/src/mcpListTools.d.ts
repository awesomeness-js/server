export default function mcpListTools({ awesomenessRequest, site, ctx, routeFilter, }: {
    awesomenessRequest: any;
    site?: any;
    ctx: any;
    routeFilter: any;
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
