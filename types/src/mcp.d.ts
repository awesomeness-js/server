export default function mcp({ authenticate, path, serverInfo, }?: {
    path?: string;
    serverInfo?: any;
}): (ctx: any, next: any) => Promise<void>;
