import { clean } from '@awesomeness-js/utils';
import checkAccess from './checkAccess.js';
import { getConfig } from "../config.js";

export default async (awesomenessRequest) => {

	const awesomenessConfig = getConfig();

	const {
		data,
		routeInfo 
	} = awesomenessRequest;

	// IS SESSION VALID	

	try {

		await awesomenessConfig.checkSession(awesomenessRequest);


	} catch(e){

		if(
			routeInfo?.permissions.length
			&& !routeInfo?.permissions.includes('*')
		){

			if(
				process.env.NODE_ENV === 'development'
				&& awesomenessConfig.byPassAccessRequirementsInDev === true
			){

				if(awesomenessConfig.debug){

					console.log('by passing access requirement: NODE_ENV is development && byPassAccessRequirementsInDev is true');
				
				}

			} else {

				throw {
					message: 'session check failed',
					error: e
				};

			}

		
		}

	}
	

	if(routeInfo?.permissions.length){

		await checkAccess({
			permissionsAllowed: routeInfo.permissions,
			awesomenessRequest,
		});

	}

	// DOES USER HAVE THE RIGHT PERMISSIONS
	
	// CLEAN THE DATA
	try {

		if(!routeInfo.properties){

			// nothing to clean
			return true;
		
		}
		
		if(typeof data === 'object' && Object.keys(data).length){
		
			const testing = data.testing || false;

			delete data.testing;

			if(awesomenessConfig.debug){

				console.log({ data });
			
			}

			let cleanedObject = clean.object(data, routeInfo.properties, {
				testMode: awesomenessConfig.debug,
			});

			
			data.testing = testing;

			if(!awesomenessRequest.cleanData){

				awesomenessRequest.cleanData = {};
		
			}

			// awesomenessRequest.cleanData = data;

			awesomenessRequest.cleanData = {
				... awesomenessRequest.cleanData,
				... cleanedObject
			};
		
		}

		
		return true;



	} catch (err) {

		throw {
			message: 'validation error',
			err: {
				details: err,
				message: err.message,
				stack: err.stack
			}
		};
		
	}

};