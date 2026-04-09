import ui from '#ui';

export default function startApp({
	data = {},
	style = 'simple',
	theme = {
		name: 'light',
		neutralColor: 'zinc',
		accentColor: 'cyan',
		customColors: {},
	},
	navItems = [],
	logo = null,
	styleConfig = {
	},
	postSetupHook = null,
	home = null,
}) {

	if(!ui.app[style]){

		throw new Error(`App style ${style} not found`);

	}

	app.theme = theme;

	if(theme.customColors){

		$.each(theme.customColors, (name, hexValue) => {

			let inputColor;
			let anchorShade = 600;

			if(typeof hexValue === 'string'){

				inputColor = hexValue;

			} else if(typeof hexValue === 'object' && hexValue !== null){

				inputColor = hexValue.inputColor;
				anchorShade = hexValue.anchorShade || anchorShade;

			}

			ui.colors.custom({
				inputColor: inputColor,
				anchorShade: 600,
				name
			});

		});

	}

	// create HTML first
	// could be done in parts broken down in the scripts folder
	var $body = $('body');

	$body.empty();

	var $app = $('<div id="app"></div>').appendTo($body);
	
	ui.app[style]({
		logo,
		navItems,
		...styleConfig
	});

	app.$app = $app;

	if(postSetupHook && typeof postSetupHook === 'function'){

		postSetupHook({ $app });
	
	}


	const $main = ui.app.cleanMain();


	if(
		data?.goToPage
		&& data.goToPage != 'start'
	){

		let place = app.pages;
		const trimmedPlace = data.goToPage.replace(/^\/+|\/+$/g, '');
		const placeParts = trimmedPlace.split('/');

		for(const part of placeParts){

			if(!place[part]){

				place[part] = {};
			
			}

			place = place[part];
		
		}

		if(place.init){

			if(data.goToPage == "_md"){

				// state management
				app.state.create({
					title: data?.pageData?.metadata?.title ?? '👋',
					url: data?.pageData?.metadata?.url ?? data?.origLocation ?? '/' + data.goToPage,
				});

			} else {

				// state management
				app.state.create({
					title: place?.about?.title ?? '👋',
					url: place?.about?.url ?? data?.origLocation ?? '/' + data.goToPage,
				});

			}
			
			place.init(data.pageData);
			
		} else {

			console.warn('No page found for', data);

			if(data.errorFetchingPage?.code){

				ui.statusPage(data.errorFetchingPage?.code).appendTo($app);

			} else {

				ui.statusPage(401).appendTo($app);

			}


		}

		
	} else {

		if(home && typeof home === 'function'){

			home({
				$app,
				data,
				$main 
			});

		}

	}


	setTimeout(function(){

		app.initialScroll();

	}, 10);


}