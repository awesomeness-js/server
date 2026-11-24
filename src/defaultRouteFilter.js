/**
 * @param {{
 *   route?: { specific?: boolean, info?: { publishDocs?: unknown } },
 *   site?: string
 * }} options
 * @returns {boolean}
 */
export default function defaultRouteFilter({
	route,
	site,
} = {}) {

	if(route?.specific === true){

		return true;

	}

	const publishDocs = route?.info?.publishDocs;

	if(!Array.isArray(publishDocs)){

		return false;

	}

	return publishDocs.includes(site);

}
