import graph from '@awesomeness-js/graph-postgres';
import setupApplication from './setupDB/applications.js';
import setupUsers from './setupDB/users.js';
import setupWebsites from './setupDB/websites.js';

async function setup(){

	let applications = await setupApplication();
	let users = await setupUsers(applications);
	let websites = await setupWebsites();

}

export default async ()=>{

	
	// is graph available?
	try {

		graph.config.init({
			host: process.env.AWESOMENESS_GRAPH_POSTGRES_HOST,
			port: process.env.AWESOMENESS_GRAPH_POSTGRES_PORT,
			user: process.env.AWESOMENESS_GRAPH_POSTGRES_USER,
			password: process.env.AWESOMENESS_GRAPH_POSTGRES_PASSWORD,
			database: process.env.AWESOMENESS_GRAPH_POSTGRES_DB,
			ssl: {
				rejectUnauthorized: false
			}
		});

		// await graph.utils.createDB();

		await graph.kv.add('serverStarted', new Date().toISOString());

		let testGet = await graph.kv.get('serverStarted');

		if (testGet) {

			console.log('Graph is available:');
	
			try {

				await setup();

			} catch (err) {

				console.log('Setup failed:');

			}


		} else {

			console.error('Graph is not available ... testGet');
	
		}

	} catch (err) {

		console.error('Graph is not available:');

	}


};
