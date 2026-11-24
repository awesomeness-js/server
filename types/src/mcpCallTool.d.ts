export default function mcpCallTool({ name, args, awesomenessRequest, site, ctx, routeFilter, }: {
    name: any;
    args: any;
    awesomenessRequest: any;
    site?: any;
    ctx: any;
    routeFilter: any;
}): Promise<{
    isError: boolean;
    structuredContent?: any;
    content: {
        type: string;
        text: string;
    }[];
}>;
