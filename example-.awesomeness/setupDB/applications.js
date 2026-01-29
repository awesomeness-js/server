import app from '#app';
import utils from '@awesomeness-js/utils';

export default async function setup(){

	let applications = {
		'scottmforte.com': {}
	};
	
	
	await utils.eachAsync(applications, async ( d, site ) => {

		let application;

		try {
		
			application = await app.application.get({ name: site });
			
		} catch(e) {
	
			try {
	
				if(e.applicationDoesNotExist){

					application = await app.application.create({ name: site });
				
				}
	
			} catch (e2){
	
				throw {
					couldNotCreateApplication: e2
				};
	
			}
	
		}

		applications[site] = application;

	});

	console.log('✔️  Applications exist');

	return applications;

}