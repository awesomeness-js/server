/**
 * @param {{
 *   route?: { specific?: boolean, info?: { publishDocs?: unknown } },
 *   site?: string
 * }} options
 * @returns {boolean}
 */
export default function defaultRouteFilter({ route, site, }?: {
    route?: {
        specific?: boolean;
        info?: {
            publishDocs?: unknown;
        };
    };
    site?: string;
}): boolean;
