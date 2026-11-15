export default function mcpCallTool({ name, args, awesomenessRequest, }: {
    name: any;
    args: any;
    awesomenessRequest: any;
}): Promise<{
    isError: boolean;
    structuredContent?: any;
    content: {
        type: string;
        text: string;
    }[];
}>;
