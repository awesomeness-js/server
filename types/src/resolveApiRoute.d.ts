export default function resolveApiRoute({ site, route, infoOnly, }: {
    site: any;
    route: any;
    infoOnly?: boolean;
}): Promise<{
    index: any;
    indexPath: any;
    info: any;
    specific: boolean;
    siteSpecificRoute: any;
    genericRoute: any;
}>;
