import ui from '#ui';

export default ({
	replaceApp = true,
	navItems = [],
	logo = 'AwesomenessJS.com',
	fancyNavUnderline = true,
	maxWidth = null,
	navMaxWidth = null,
} = {}) => {

	console.log({ navMaxWidth });

	let $app = ui.app.vanilla({ replaceApp });

	const themeProps = ui.theme();

	const $topNavBar = $(`<div class="awesomeness-app-simple-navBar ${themeProps.text.secondary}"></div>`)
		.appendTo($app);

	const $navBarInterior = $(`<div class="awesomeness-app-simple-navBar-interior"></div>`)
		.appendTo($topNavBar);


	if(navMaxWidth){

		$navBarInterior.css('max-width', `${navMaxWidth}px`);
	
	}

	const $logo = $(`<div class="awesomeness-app-simple-logo ${themeProps.text.accent}--hover">${logo}</div>`)
		.appendTo($navBarInterior)
		.on('click', () => {

			window.location.href = '/';
		
		});

	const $topNavItems = $(`<div class="hidden-t hidden-p awesomeness-app-simple-top-navItems"></div>`)
		.appendTo($navBarInterior);

	const $main = $(`<div id="main" class="awesomeness-app-simple-main ${themeProps.surface.base}"></div>`)
		.appendTo($app);

	if(maxWidth){

		$main.css('max-width', `${maxWidth}px`);
	
	}

	const $menuNav = $(`<i class="ico-menu awesomeness-app-simple-menu-button hidden-xl hidden-d ${themeProps.text.secondary} ${themeProps.text.accent}--hover"></i>`)
		.appendTo($navBarInterior);

	const $phoneMenu = $(`<div class="awesomeness-app-simple-phone-menu hidden-xl hidden-d ${themeProps.surface.base} ${themeProps.text.secondary} ${themeProps.text.accent}--hover pt65"></div>`);

	
	if(navItems.length > 0){
		
		const $navItemsContainer = $(`<div class="flex gap-10 height-65"></div>`)
			.appendTo($topNavItems);

		navItems.forEach((item) => {

			let thisFancyNavUnderline = fancyNavUnderline;

			if(!item.name && item.ico) {

				item.name = `<i class="ico-${item.ico}"></i>`;
				thisFancyNavUnderline = false;
			
			}


			const itemContent = thisFancyNavUnderline ? `<span class="underline">${item.name}</span>` : item.name;

			const $link = ui.link({
				link: item.url,
			}).appendTo($navItemsContainer)
				.addClass(`flex justify-center align-center`);

			const $item = $(`<div class="awesomeness-app-simple-nav-item ${themeProps.text.secondary} ${themeProps.text.accent}--hover">${itemContent}</div>`)
				.appendTo($link);

			
			$link.clone(true).appendTo($phoneMenu);

		});

	}

	// Put this after you create $menuNav and $phoneMenu

	let menuOpen = false;

	// Ensure phone menu is in the DOM
	$phoneMenu.appendTo($app);

	// Backdrop (z-index 2)
	const $menuBackdrop = $('<div class="awesomeness-app-simple-menu-backdrop clearfix hidden"></div>')
		.appendTo($app);

	// icon swap helpers
	const setMenuIconOpen = () => {

		$menuNav.removeClass('ico-menu').addClass('ico-x');

	};

	const setMenuIconClosed = () => {

		$menuNav.removeClass('ico-x').addClass('ico-menu');

	};

	// open/close
	const openMenu = () => {

		if (menuOpen) return;
		menuOpen = true;

		$menuBackdrop.removeClass('hidden'); // show backdrop
		$phoneMenu.addClass('is-open');      // slide down
		setMenuIconOpen();

	};

	const closeMenu = () => {

		if (!menuOpen) return;
		menuOpen = false;

		$phoneMenu.removeClass('is-open');   // slide up
		$menuBackdrop.addClass('hidden');    // hide backdrop
		setMenuIconClosed();

	};

	const toggleMenu = () => (menuOpen ? closeMenu() : openMenu());

	// button click
	$menuNav.on('click', (e) => {

		e.preventDefault();
		toggleMenu();

	});

	// backdrop click closes
	$menuBackdrop.on('click', (e) => {

		e.preventDefault();
		closeMenu();

	});

	// clicking a link closes
	$phoneMenu.on('click', 'a', () => closeMenu());

	// defensive: if items aren't anchors
	$phoneMenu.find('.awesomeness-app-simple-nav-item').on('click', () => closeMenu());

	ui.scrollSpy.top({
		threshold: 120,
		className: themeProps.surface.base,
		$applyTo: $topNavBar
	});
	
	return $app;

};