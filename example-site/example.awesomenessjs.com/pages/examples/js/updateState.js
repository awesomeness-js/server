app.pages.examples.updateState = function(){

	// set initial
	history.replaceState(0,'Awesomeness PWA', '/examples');
	document.title = 'Awesomeness | Vanilla JS to build PWAs';

	var startData = {};

	startData.title = 'Awesomeness | Vanilla JS to build PWA';
	startData.url = '/examples';

	app.state.state[0] = startData;

};
