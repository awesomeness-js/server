export default function mcp({ authenticate, path, serverInfo, siteMap, routeFilter, }?: {
    path?: string;
    serverInfo?: any;
    siteMap?: {};
    routeFilter?: any;
}): (ctx: any, next: any) => Promise<void>;
