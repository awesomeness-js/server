app.initialScroll = async function(){

	// if we have the same page 
	const wereOnSamePage_raw = localStorage.getItem('awesomeness-lastPage');

	if(wereOnSamePage_raw){

		const wereOnSamePage = JSON.parse(wereOnSamePage_raw);

		const url = window.location.pathname;

		if(wereOnSamePage.url == url){

			if(wereOnSamePage.scrollY){

				setTimeout(function(){

					window.scrollTo(0, wereOnSamePage.scrollY);
					
				}, 100);
				
			}

		}
		
	}

};