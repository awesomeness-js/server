app.pages.examples.init = function(data, options){

	app.pages.examples.updateState();

	const $app = $('#app');

	$app.empty();

	console.log('here');

	let $page = $('<div id="page-examples"></div>')
		.appendTo($app);


};
