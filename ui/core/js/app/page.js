app.page = async function(page, data = {}){

	if(app.$main){

		app.$main.css({ 'opacity': 0 }); 
		console.log('page loading...');

	}


	// start timer
	const time = new Date().getTime();


	if(!page){

		ui.statusPage(400);

		if(app.$main){

			app.$main.css({ 'opacity': 1 }); 
			console.log('error page...', page);

		}

		throw {
			status: 400,
			page,
			data,
			error: "No page specified"
		};
	
	}

	// remove leading /
	if(page.substr(0,1) === '/'){

		page = page.substr(1);

	}

	if(!page){


		try {

			if(app.start){

				await app.start();
				app.$main.css({ 'opacity': 1 }); 

			}
		
		} catch (e) {

			console.error('Error loading start page:', e);

		}

		return;
	
	}


	// remove anchor
	let anchor = null;


	if(page.indexOf('#') > -1){

		anchor = page.split('#')[1];
		page = page.split('#')[0];
	
		data.anchor = anchor;

	}

	// only allow a-z _ - (throw if invalid)
	if(!page.match(/^[a-z0-9_\-\/]+$/i)){

		if(ui.statusPage){

			ui.statusPage(404);

		} else {

			console.log('statusPage function not found in ui');
		
		}

		if(app.$main){

			app.$main.css({ 'opacity': 1 }); 
			console.log('error page...');

		}

		throw {
			status: 400,
			page,
			data,
			error: "Invalid page name"
		};

	}

	
	// send out test data
	if(app.testing){

		console.log("%cpage: ", "color: blue; font-weight:bold;", data ,'page request started ('+page+')');
	
	}

	// define fetch options
	let fetchOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + app.session ?? ''
		},
		body: JSON.stringify({
			... data,
			awesomenessType: 'page',
			meta: app.meta,
			testing: app.testing,
			device: {
				'device':'web',
				'userAgent': window.navigator.userAgent
			}
		}),
		timeout: 5 * 60 * 1000 // 5 minutes
	};

	let responseData;
	let pageInfo;
	let pageInit;

	try {

		if(ui.pageLoading) {
			
			$loading = ui.pageLoading();

		}

		let response = await fetch(app.pageBaseURL + page, fetchOptions);

		responseData = await response.json();

		console.log({ responseData });

		if(responseData.meta){

			app.metaUpdates(responseData.meta);

		}

		// If the response is not ok
		// throw an error-like object to trigger the catch
		if (!response.ok) {

			if(ui.statusPage){

				ui.statusPage(404);

			} else {

				console.log('statusPage function not found in ui');
		
			}

			if(app.$main){

				app.$main.css({ 'opacity': 1 }); 
				console.log('error page...');

			}

			throw {
				status: response.status,
				...responseData 
			};
		
		}
			
		
		if(responseData.meta.pageInit){

			pageInit = responseData.meta.pageInit;
		
		}


		pageInfo = responseData.meta.pages?.[page] ?? null;

		if(app.testing){

			if(responseData.testing){ 

				if (responseData.testing.perf) {

					responseData.testing.perf.xhr = new Date().getTime() - time;
				
				}

				console.log("%ctesting: ", "color: purple; font-weight:bold;", responseData.testing); 
			
			}

			delete responseData.testing;

			console.log("%cmeta: ", "color: #ff6f00; font-weight:bold;", responseData.meta ?? null);
			

			delete responseData.meta;

			console.log("%cpage: ", "color: green; font-weight:bold;", responseData);
		
		} else {

			delete responseData.testing;
			delete responseData.meta;

		}


	} catch (errorData) {

		if(app.testing){

			console.log("%cpage: ", "color: red; font-weight:bold;", errorData); 

		}

		if(errorData.APP_SESSION){

			app.session = null;
			app.user = null;
			window.localStorage.removeItem('awesomeness-appSession');
			location.reload();
		
		}

		if(ui.statusPage){

			ui.statusPage(404);

		} else {

			console.log('statusPage function not found in ui');
		
		}

		if(app.$main){

			app.$main.css({ 'opacity': 1 }); 
			console.log('error page...');

		}

		throw errorData;

	}	



	let placeName = pageInit ?? page;
	let place = app.pages;

	
	let parts = placeName.split('/');

	let on = 0;
	const last = parts.length;

	let test = 'app.pages';

	while(on < last){

		if(!place[parts[on]]){

			place[parts[on]] = {}; 

		}

		place = place[parts[on]];

		test += `.${parts[on]}`;

		on++;

		
	}

	// state management
	app.state.create({
		title: pageInfo?.about?.title ?? responseData?.metadata?.title ?? '👋',
		url: pageInfo?.about?.url ?? responseData?.metadata?.url ?? data?.origLocation ?? '/' + page,
	});
	

	if(anchor){

		responseData.anchor = anchor;
	
	}
	
	place.init(responseData);

	if(app.$main){

		app.$main.css({ 'opacity': 1 }); 

	}

	return responseData;
		
};