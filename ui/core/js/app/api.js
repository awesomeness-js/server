app.api = async function (route, data = {}) {

	const time = Date.now();

	if (!route) throw {
		reason: 'route undefined',
		route,
		data 
	};
	if (route[0] === '/') route = route.substring(1);
	if (route.match(/[^a-zA-Z0-9/_\-]/)) throw {
		reason: 'route invalid',
		route,
		data 
	};

	const deviceInfo = {
		device: 'web',
		userAgent: window.navigator.userAgent 
	};

	let isFormData = false;
	let body;

	// Detect files
	if (data && Object.values(data).some((v) => v instanceof File || v instanceof FileList || (Array.isArray(v) && v[0] instanceof File))) {

		isFormData = true;
		const formData = new FormData();

		formData.append('awesomenessType', 'api');
		formData.append('meta', JSON.stringify(app.meta));
		formData.append('device', JSON.stringify(deviceInfo));


		for (const key in data) {

			const val = data[key];

			if (val instanceof FileList) {

				[ ...val ].forEach((f) => formData.append(key + '[]', f));
			
			} else if (Array.isArray(val) && val[0] instanceof File) {

				val.forEach((f) => formData.append(key + '[]', f));
			
			} else {

				formData.append(key, val);
			
			}
		
		}

		body = formData;
	
	} else {

		body = JSON.stringify({
			awesomenessType: 'api',
			meta: app.meta,
			device: deviceInfo,
			... data,
		});
	
	}

	let headers = {
		'Authorization': 'Bearer ' + (app.session ?? ''),
	};

	if (!isFormData) headers['Content-Type'] = 'application/json';

	let fetchOptions = {
		method: 'POST',
		headers,
		body,
		timeout: 5 * 60 * 1000,
	};

	try {

		if (app.testing) {

			console.log('%capi: ', 'color: blue; font-weight:bold;', route, isFormData ? body : JSON.parse(body));
		
		}


		const response = await fetch(app.apiBaseURL + route, fetchOptions);

		if (!response.ok) throw {
			status: response.status,
			...(await response.json()) 
		};

		const doneData = await response.json();

		app.metaUpdates(doneData.meta);

		if (app.testing) {

			if (doneData.testing) {

				if (doneData.testing.perf) doneData.testing.perf.xhr = Date.now() - time;
				console.log('%ctesting: ', 'color: purple; font-weight:bold;', doneData.testing);
			
			}

			delete doneData.testing;
			console.log('%cmeta: ', 'color: #ff6f00; font-weight:bold;', doneData.meta ?? null);
			delete doneData.meta;
			console.log('%capi: ', 'color: green; font-weight:bold;', doneData);
		
		} else {

			delete doneData.testing;
			delete doneData.meta;
		
		}

		
		return doneData;
	
	} catch (errorData) {

		if (app.testing) console.log('%capi: ', 'color: red; font-weight:bold;', errorData);

		if (errorData.APP_SESSION) {

			app.session = null;
			app.user = null;
			window.localStorage.removeItem('awesomeness-appSession');
			location.reload();
		
		}

		throw errorData;
	
	}

};
