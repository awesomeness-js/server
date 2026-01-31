/**
 * 
 * @example
 *	app.state.create({
 *		title: pageInfo?.title ?? '👋',
 *		url: pageInfo?.url ?? data?.origLocation ?? '/' + page,
 *	});
 */
app.state.create = function(data){

	if(app.state.skipState){

		app.state.skipState = false;
		
		return true;
	
	}

	if(!data){

		console.error('data for new state undefined'); 

		return; 

	}

	if(!data.url){

		console.error('url for new state undefined'); 

		return; 

	}

	if(!data.title){

		console.error('title for new state undefined'); 

		return; 

	}


	app.state.backIndex++;
	app.state.state[app.state.backIndex] = data;

	history.pushState(app.state.backIndex, data.title, data.url);
	document.title = data.title;

};
