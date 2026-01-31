import ui from '#ui';

app.pages.start.init = function(data, options){

	app.pages.start.updateState();
	
	// create HTML first
	// could be done in parts broken down in the scripts folder
	var $body = $('body');

	// good idea to keep everything #app
	// css that gets updated dynamically will be in the body via the #css div
	// so replacing the whole body is generally not good idea
	var $app = $('<div id="app"></div>').appendTo($body);

	// Do whatever you want
	$(`<div style="padding-top: 40vh; text-align: center;">
		<div class="text-xl">Awesomeness</div>
		<div class="text-xs">Build something awesome</div>
	</div>`)
		.appendTo($app);

	ui._example();
	ui.notCommonExample();


	window.dispatchEvent(new Event('resize'));


};
