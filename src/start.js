import Koa from 'koa';
import compress from 'koa-compress';
import http from "http";

import attachAwesomenessRequest from './koa/attachAwesomenessRequest.js';
import cors from './koa/cors.js';
import errorHandler from './koa/errorHandler.js';
import jsonBodyParser from './koa/jsonBodyParser.js';
import serverUp from './koa/serverUp.js';
import timeout from './koa/timeout.js';
import staticFiles from "./koa/staticFiles.js";
import routeRequest from './koa/routeRequest.js';
import attachWs from "./ws/index.js";
import getConfig from './getConfig.js';

import '../errors.js'; // handle errors


export default async function start(){

	console.log('Initializing Awesomeness server...');

	const awesomenessConfig = getConfig();

	console.log(`Starting Awesomeness server on port ${process.env.PORT}`);

	// Koa app
	const app = new Koa();

	app.use(compress());

	// error handling
	app.use(errorHandler);

	// limits
	app.use(jsonBodyParser);
	app.use(timeout(1000 * 60 * 5)); // 5 minutes

	// enable cors
	app.use(cors);

	// where we going
	app.use(attachAwesomenessRequest);

	// default static files
	app.use(staticFiles);

	if(Array.isArray(awesomenessConfig.beforeRouteMiddleware)){

		awesomenessConfig.beforeRouteMiddleware.forEach((middlewareFunction) => {

			app.use(middlewareFunction);

		});

	} else {

		if(awesomenessConfig.debug){

			console.log('No customMiddleware array found in awesomenessConfig');

		}

	}


	// dynamic routing
	app.use(routeRequest);

	// create HTTP server manually so WS can hook upgrade

	const server = http.createServer(app.callback());

	if(typeof awesomenessConfig.wsHandler === 'function'){

		attachWs(server);

	} else {

		console.log('No wsHandler function found in awesomenessConfig');

	}

	// init DB
	if(typeof awesomenessConfig.initDB === 'function'){

		await awesomenessConfig.initDB();

	} else {

		console.log('No initDB function found in awesomenessConfig');

	}


	server.listen(process.env.PORT, serverUp);

  
	[ 'SIGINT', 'SIGTERM' ].forEach(async (signal) => {

		process.on(signal, async () => {

			console.log(`Received ${signal}, shutting down gracefully...`);
			server.close(() => {

		  console.log('Server closed');
		  process.exit(0);
		
			});
		
			setTimeout(() => {

		  console.error('Force shutdown');
		  process.exit(1);
		
			}, 5000);
	  
		});

	});


}