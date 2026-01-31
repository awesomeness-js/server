window.onpopstate = function(event){

	console.log('event.state', event.state);
	console.log('backIndex', app.state.backIndex);

	if(event.state < app.state.backIndex) {

		app.state.back();

	} else {

		console.log('fw button pressed.. that\'s a TODO');

		if(app.state[app.state.backIndex]){

			var copy = app.state[app.state.backIndex];

		  app.state[event.state] = copy;
			history.replaceState(app.state.backIndex, copy.title, copy.url);
		
		}

	}

};
