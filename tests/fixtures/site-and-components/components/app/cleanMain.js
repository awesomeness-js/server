export default () => {

	if(!app.$main){

		app.$main = $('#main');
	
	}

	app.$main.empty();
	$(document).scrollTop(0);

	return app.$main;

};