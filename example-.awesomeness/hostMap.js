import * as fs from 'fs/promises';
const sites = await fs.readdir('sites');

export default function({
	host, // already lower case - starts as req.headers.host (lower case)
	mainDomain // already lower case 
}){

	const simpleMap = {
		"localhost:3000": "example.awesomenessjs.com",
	};

	if (simpleMap[host]) { 

		host = simpleMap[host]; 

	} else {

		if (simpleMap[mainDomain]) {
		
			host = simpleMap[mainDomain];

		}

	}

	if (!sites.includes(host)) {

		// try the root
		if (sites.includes(mainDomain)) { 

			host = mainDomain;

		} else {

			host = 'awesomenessjs.com';
		
		}

	}

	return host;

}