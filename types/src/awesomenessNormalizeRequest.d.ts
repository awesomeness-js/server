export default awesomenessNormalizeRequest;
export function awesomenessNormalizeRequest({ req }?: {
    req?: {} | undefined;
}): Promise<{
    headers: any;
    ip: any;
    userAgent: any;
    method: any;
    host: any;
    mainDomain: any;
    domain: any;
    subDomain: string;
    site: any;
    application: any;
    path: any;
    pageRoute: any;
    slug: any;
    meta: any;
    testing: any;
    device: any;
    data: {};
    awesomenessType: any;
    urlParams: {};
    _RAW: {};
    log: (message: any, data?: {}) => void;
    logData: never[];
}>;
