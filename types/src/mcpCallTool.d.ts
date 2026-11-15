export default function mcpCallTool({ name, args, awesomenessRequest, site, }: {
    name: any;
    args: any;
    awesomenessRequest: any;
    site?: string;
}): Promise<{
    isError: boolean;
    structuredContent?: any;
    content: {
        type: string;
        text: string;
    }[];
}>;
