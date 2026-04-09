export default function pageInfo(awesomenessRequest: any, { page }?: {
    page?: any;
}): Promise<{
    getData: any;
    about: any;
    cssPath: any;
    jsPath: any;
}>;
