app.init = async function({
	loadPage = 'start',
	emptyBody = false,
} = {}){

	app._supportsConstructableSheets =
		!!document.adoptedStyleSheets &&
		typeof CSSStyleSheet !== "undefined" &&
		typeof CSSStyleSheet.prototype.replaceSync === "function";

	app.session = window.localStorage.getItem('awesomeness-appSession');

	// fuck with dark mode
	app.initDarkMode();

	// adjust on resize
	window.onresize = function(){

		app.resize(); 

	};

	app.resize(); // trigger initial resize

	// URL STUFF
	var origLocation = window.location.pathname;

	// do we have a mouse
	app.mouse = false;


	const $body = $('body');

	window.addEventListener('beforeunload', () => {

		console.log('Saving last page info:', {
			url: origLocation,
			scrollY: window.scrollY
		});

		localStorage.setItem('awesomeness-lastPage', JSON.stringify({
			url: origLocation,
			scrollY: window.scrollY
		}));

	});

	


	$body.on('mousemove', function(){

		app.mouse = true; 
		$body.off('mousemove'); 

	});

	if(loadPage){

		if(emptyBody){

			$body.empty();
		
		}

		app.page(loadPage, { origLocation });
	
	}
	
	const url = "/app.css";

	const css = await fetch(url).then((r) => r.text());

	const sheet = new CSSStyleSheet();

	sheet.replaceSync(css);

	app.meta.styleSheets.__CORE__ = sheet;

	// Optional: Apply globally if not shadow-based
	document.adoptedStyleSheets = [
		...(document.adoptedStyleSheets || []),
		sheet
	];

	return true;

};
