app.resize = function(){

	var nw = document.body.offsetWidth;

	if(app.size.pageWidth == nw){

		return;

	}

	// get heights
	app.size.pageWidth = nw;
	app.size.pageHeight = document.body.offsetHeight;

	var oldView = app.size.view;

	if (app.size.pageWidth >= app.size.xl.min){

		app.size.view = 'xl';

	}

	if (app.size.pageWidth >= app.size.d.min && app.size.pageWidth <= app.size.d.max){

		app.size.view = 'd';

	}

	if (app.size.pageWidth >= app.size.t.min && app.size.pageWidth <= app.size.t.max){

		app.size.view = 't';

	}

	if (app.size.pageWidth >= app.size.p.min && app.size.pageWidth <= app.size.p.max){

		app.size.view = 'p';

	}

	// change attr so we can
	if(oldView != app.size.view){

		document.body.classList.remove('app-size-xl');
		document.body.classList.remove('app-size-d');
		document.body.classList.remove('app-size-t');
		document.body.classList.remove('app-size-p');
		document.body.classList.add('app-size-'+app.size.view);
	
	}

};