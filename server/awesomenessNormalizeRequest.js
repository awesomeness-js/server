import { getConfig } from "../config.js";
import applicationMap from './applicationMap.js';
import reRoute from './reRoute.js';

async function awesomenessNormalizeRequest({
	req = {}
} = {}) {

	const awesomenessConfig = getConfig();
	
	const domain = req.headers.host;

	// If the request is from API Gateway, use the requestContext to get the method
	const method = req.method ?? req.requestContext?.http?.method;
	const ip = req.ip ?? req.requestContext?.http?.sourceIp;
	const userAgent = req.headers.userAgent;

	let host = domain.toLowerCase();
	
	const domainParts = host.split('.');
	const mainDomain = domainParts.slice(-2).join('.').toLowerCase();

	let subDomain = '';


	if (domainParts.length > 2) {

		subDomain = domainParts.slice(0, -2).join('.');
	
	}

	host = awesomenessConfig.hostMap({
		host,
		mainDomain
	});

	const applicationName = applicationMap(host);

	let path = req.path ?? req.requestContext?.http?.path ?? '/';
	let pageRoute = path.replace('/', '');

	const slug = pageRoute.split('/').pop().split('.')[0].split('?')[0];

	// top level keys
	const topLevelKeys = [ 'awesomenessType', 'meta', 'device' ];

	const newData = {};
	const parts = req?.request?.body ?? {};

	for (const key in parts) {

		if (!topLevelKeys.includes(key)) {

			newData[key] = parts[key];
				
		}
			
	}

	const urlParams = {};

	const queryString = req?.request?.url || '';

	if (queryString.includes('?')) {

		const queryPart = queryString.split('?').slice(1).join('?').split('#')[0];
		const queryPairs = queryPart.split('&');

		for (const pair of queryPairs) {

			const [ key, value ] = pair.split('=');

			urlParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
		
		}
	
	}

	const startTime = performance.now();

	const log = (message, data = {}) => {

		const timeElapsed = performance.now() - startTime;

		if(awesomenessConfig.debug){

			awesomenessRequest.logData.push({
				timestamp: new Date().toISOString(),
				timeElapsed,
				message,
				data
			});

		}
	
	};

	const awesomenessRequest = {

		// request info
		headers: { ... req.headers },
		ip,
		userAgent,
		method,
		// our site info - fucked with
		host,
		mainDomain,
		domain,
		subDomain,
		site: host, // might not be host with special mapping
		application: applicationName,
		path,
		pageRoute,
		slug,

		// stuff to return
		meta: {},

		// stuff from sender
		testing: req?.request?.body?.testing ?? false,
		meta: req?.request?.body?.meta ?? {
			components: {},
			pages: {}
		},
		device: req?.request?.body?.device ?? {},
		data: newData,
		awesomenessType: req?.request?.body?.awesomenessType ?? 'generic',

		urlParams,

		// just because
		_RAW: req,
		
		log,
		logData: []
	};

	awesomenessRequest.reRoute = (destination)=>{

		return reRoute({
			goToPage: destination,
			awesomenessRequest
		});

	};

	return awesomenessRequest;
	
}

export { awesomenessNormalizeRequest };
export default awesomenessNormalizeRequest;
