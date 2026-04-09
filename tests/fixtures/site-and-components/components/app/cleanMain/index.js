export default ({
	withFullScreenHero = false
} = {}) => {

	if(!app.$main){

		app.$main = $('#main');
	
	}

	if(withFullScreenHero){

		app.$main.addClass('withFullScreenHero');
	
	} else {

		app.$main.removeClass('withFullScreenHero');
	
	}

	app.$main.empty();
	$(document).scrollTop(0);

	return app.$main;

};