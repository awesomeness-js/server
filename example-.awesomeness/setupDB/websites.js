import app from '#app';
import utils from '@awesomeness-js/utils';

export default async function setup(){

	let websites = {
		'scottmforte.com': {
			id: '5aaa5f12-4223-4801-b6a3-c7e0630f99a2'
		}
	};
	
	
	await utils.eachAsync(websites, async ( d, site ) => {

		let website;

		try {
		
			website = await app.website.get({ name: site });
			
		} catch(e) {
	
			try {
	
				website = await app.website.create({
					name: site,
					... d 
				});
				
	
			} catch (e2){
	
				throw {
					couldNotCreateWebsite: e2
				};
	
			}
	
		}

		websites[site] = website;

	});

	console.log('✔️  websites exist');

	return websites;

}