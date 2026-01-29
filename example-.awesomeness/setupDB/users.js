import app from '#app';
import utils from '@awesomeness-js/utils';

export default async function(applications){

	let me = {
		first: 'Scott',
		last: 'Forte',
		email: 'scott@scottmforte.com',
		password: 'Profile4-Unfitted4-Next3-Lesser2-Gains8-Seizing3-Wireless2-Thinning6-Disclose0-Provider9'
	};

	let usersPerApplication = {
		'scottmforte.com': [ me ]
	};

	await utils.eachAsync(usersPerApplication, async ( users, site )=>{

		await utils.eachAsync(users, async (user,k) => {

			try {

				user = await app.user.get({
					email: user.email,
					applicationId: applications[site].id
				 });
		
				 users[k] = user;
	
			} catch(e) {
		
				try { 
	
					users[k] = await app.user.create({
						...user,
						applicationId: applications[site].id
					});
	
				} catch(e){
	
					console.log('❌  User does not exist and could not be created', e);

					throw {
						couldNotCreateUser: {
							application: k,
							email: user.email,
							error: e
						}
					};
	
				}
	
	
			}

		});

	});


	console.log('✔️  Users exist');

	return usersPerApplication;

}