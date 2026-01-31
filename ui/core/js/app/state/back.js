app.state.back = function(){ // should ONLY be called via window.onpopstate

	var leavingState = app.state.state[app.state.backIndex];
	var goingToState = app.state.state[app.state.backIndex-1];

	// change title
	document.title = goingToState?.title ?? '👋';

	app.state.skipState = true;

	app.page(goingToState?.url ?? '/'); 

	delete app.state.state[app.state.backIndex];
	app.state.backIndex--;

};
