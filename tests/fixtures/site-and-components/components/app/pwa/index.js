import ui from '#ui';

export default ({
	replaceApp = true,
	navItems = [],
	topNavUse = 'icons', // or 'names' or 'both'
	bottomNavUse = 'icons', // or 'names' or 'both'
	logo = 'Awesomeness PWA',
	profileImageURL = null,
	logoURL = '/',
	searchURL = '/search',
	profileURL = '/profile',
	beforeSearch = null,
} = {}) => {

	let $app = ui.app.vanilla({ replaceApp });
	
	const THEME = ui.theme();

	const $topNavBar = $(`<div class="
		awesomeness-app-pwa-top-navBar 
		${THEME.menu.base}
		${THEME.text.secondary} 
	"></div>`)
		.appendTo($app);

	
	const $leftMenu = $(`<div class="awesomeness-app-pwa-left-menu ${THEME.menu.base}"></div>`).appendTo($app);
	const $rightMenu = $(`<div class="awesomeness-app-pwa-right-menu ${THEME.menu.base}"></div>`).appendTo($app);
	
	const $bottomNavBar = $(`<div class="
		hidden-xl hidden-d 
		awesomeness-app-pwa-bottom-navBar 
		${THEME.menu.base} 
		${THEME.text.secondary}
	"></div>`)
		.appendTo($app);
	
	if(THEME.menuBorderColor){

		$topNavBar.addClass(THEME.border.color).css({ 'border-bottom': `1px solid` });
		$bottomNavBar.addClass(THEME.border.color).css({ 'border-top': `1px solid` });
		$leftMenu.addClass(THEME.border.color).css({ 'border-right': `1px solid` });
		$rightMenu.addClass(THEME.border.color).css({ 'border-left': `1px solid` });
	
	}
		
	const $link = ui.link({
		link: logoURL,
		beforeOpen: async () => {

			closeNav($leftMenu);
			closeNav($rightMenu);
		
			if(beforeSearch){

				return await beforeSearch();
			
			}

			return null;

		}
	}).addClass(`
		awesomeness-app-pwa-logo
		${THEME.text.secondary} 
		${THEME.text.accent}--hover
	`);

	const $logo = $(`<div class="">${logo}</div>`).appendTo($link);
		
	$link.appendTo($topNavBar);

	const $searchArea = $(`<div class="awesomeness-app-pwa-search-area"></div>`).appendTo($topNavBar);
	const $topNavBarRight = $(`<div class="hidden-p hidden-t awesomeness-app-pwa-top-navBar-right"></div>`).appendTo($topNavBar);



	if(searchURL){


		const $link = ui.link({
			link: searchURL,
			beforeOpen: async () => {

				if(beforeSearch){

					return await beforeSearch();
				
				}

				closeNav($leftMenu);
				closeNav($rightMenu);
			
			}
		});

		const $searchIcon = $(`
		<div class="
		awesomeness-app-pwa-menu-button 
		awesomeness-app-pwa-sub-nav-item
		${THEME.text.accent}--hover
		color-${THEME.accent.color}--hover
		border-${THEME.accent.color}--hover
		mlr20
		mr10-p
		ml0-p
		">
			<i class="ico-search2"></i>
		</div>`).appendTo($link);

		$link.appendTo($topNavBar);


	}

	if(profileURL){

		const $link = ui.link({
			link: profileURL
		});

		$link.appendTo($topNavBar);

		const $profilePic = $(`<div class="awesomeness-app-pwa-profile-pic ${THEME.surface.elevated}"></div>`)
			.appendTo($link);

		if(profileImageURL){

			$profilePic
				.css({
					'background-image': `url(${profileImageURL})`
				});

		} else {

			$profilePic
				.css({
					'background-image': `url(https://api.dicebear.com/5.x/miniavs/svg?backgroundColor=4a46e0&seed=${Math.random()})`,
				});

		}

	}

	

	const $clickToClose = $(`<div class="awesomeness-app-pwa-click-to-close"></div>`)
		.hide()
		.css({
			opacity: 0.7,
		})
		.appendTo($app);

	$clickToClose.click(()=>{

		closeNav($leftMenu);
		closeNav($rightMenu);
	
	});

	const $main = $(`<div id="main" class="awesomeness-app-pwa-main ${THEME.app.fg} ${THEME.app.bg}"></div>`).appendTo($app);
	
	if(navItems.length > 0){
		
		const $grid = $(`<div class="grid-${navItems.length} height-65"></div>`)
			.appendTo($bottomNavBar);

		navItems.forEach((item) => {

			const $link = ui.link({
				link: item.url,
			}).appendTo($grid)
				.addClass(`flex justify-center align-center`);

			const $item = $(`<div class="
				awesomeness-app-pwa-sub-nav-item
				${THEME.text.accent}--hover
				color-${THEME.accent.color}--hover
				border-${THEME.accent.color}--hover
				"></div>`)
				.appendTo($link);
		
			if(item.ico){

				$(`<div class="awesomeness-app-pwa-sub-nav-item-ico"><i class="ico-${item.ico}"></i></div>`)
					.appendTo($item);

			}

			if(item.emoji){

				$(`<div class="awesomeness-app-pwa-sub-nav-item-ico">${item.emoji}</div>`)
					.appendTo($item);

			}

			if(item.name){

				$(`<div class="awesomeness-app-pwa-sub-nav-item-name">${item.name}</div>`)
					.appendTo($item);
			
			}

			$link.clone(true).addClass(`awesomeness-app-pwa-topNavUse-${topNavUse}`).appendTo($topNavBarRight);

			$link.addClass(`awesomeness-app-pwa-bottomNavUse-${bottomNavUse}`);

		});

	}
	
	let navOpen = false;

	function openNav($nav){

		$clickToClose.show();

		$nav.addClass('open');
		navOpen = true;
	
	}

	function closeNav($nav){

		$nav.removeClass('open');
		navOpen = false;

		$clickToClose.hide();

	}

	return $app;

};