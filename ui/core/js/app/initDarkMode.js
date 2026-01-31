app.initDarkMode = function(){

	// ititial add
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {

		document.body.classList.add('darkMode');
	
	}

	// adjust on change	
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {

		if(event.matches){

			document.body.classList.add('darkMode'); 

		} else {

			document.body.classList.remove('darkMode'); 

		}
	
	});


};