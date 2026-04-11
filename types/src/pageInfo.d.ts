export default function pageInfo(awesomenessRequest: any, { page }?: {
    page?: null | undefined;
}): Promise<{
    getData: any;
    about: any;
    cssPath: any;
    jsPath: any;
}>;
