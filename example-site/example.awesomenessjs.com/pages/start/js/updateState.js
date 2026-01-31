app.pages.start.updateState = function(){

	// set initial
	history.replaceState(0,'Awesomeness PWA', '/');
	document.title = 'Awesomeness | Vanilla JS to build PWAs';

	var startData = {};

	startData.title = 'Awesomeness | Vanilla JS to build PWA';
	startData.url = '/';

	app.state.state[0] = startData;

};
