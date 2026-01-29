import app from '#app';

export default async (awesomenessRequest) => {

	//console.log('checking session');
	
	const session = await app.session.check(awesomenessRequest);	

	const user = await app.user.get({ id: session.userId });

	awesomenessRequest.user = user;

	//console.log('session valid', { user });

};