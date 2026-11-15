export default function mcp({ authenticate, path, serverInfo, siteMap, }?: {
    path?: string;
    serverInfo?: any;
    siteMap?: Record<string, string>;
}): (ctx: any, next: any) => Promise<void>;
