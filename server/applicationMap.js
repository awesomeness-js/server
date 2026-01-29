import { getConfig } from "../config.js";

export default function(host){

	const awesomenessConfig = getConfig();
	
	if (
		awesomenessConfig.applicationMap
		&& awesomenessConfig.applicationMap[host]
	) { 

		return awesomenessConfig.applicationMap[host];

	} else {

		// use the root domain
		const parts = host.split('.');


		if(parts.length > 2){

			return parts.slice(-2).join('.');
		
		} else {

			return host;

		}

	}


}