import ui from '#ui';

export default ({
	replaceApp = true
} = {}) => {

	let $app;

	if (replaceApp) {

		$app = $('#app');
		$app.empty().addClass('awesomeness-app-simple');
	
	} else {

		$app = $('<div class="awesomeness-app-simple"></div>');

	}

	const themeProps = ui.theme();

	$app.addClass(themeProps.surface.base);
	$('body').addClass(themeProps.surface.base);
	
	return $app;

};