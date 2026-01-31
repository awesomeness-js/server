import ui from '#ui';

app.pages._md.init = async function(pageData){

	ui.cleanMain();
	
	if(
		pageData.metadata.breadcrumbs 
		&& !pageData.metadata.image
	){

		ui.breadcrumbs({
			data: pageData.metadata.breadcrumbs,
			color: pageData.metadata.breadcrumbColor ?? 'stone'
		}).appendTo(app.$main);

	}

	const $page = ui.blogPost.md(pageData,{
		tagBase: '/tag',
		customRules: [
			(mdContent)=>{

				return mdContent.replace(/<cta-realEstate>/g, '<div class="custom-callToAction-real-estate"></div>');

			},
			(mdContent)=>{

				// find <bibleVerse> tags and replace with divs
				return mdContent.replace(/<bibleVerse>/g, '<div class="data-bible-verse">').replace(/<\/bibleVerse>/g, '</div>');

			}
		]
	}).appendTo(app.$main);

	$page.find('a').click(function(event){

		event.preventDefault();
		event.stopPropagation();

		const href = $(this).attr('href');

		if(href && href.startsWith('http')){

			// open target blank
			window.open(href, '_blank');
		
		} else {

			// does this a tag have any awesomeness-* class
			if($(this).attr('class') && $(this).attr('class').match(/awesomeness-/)){

				// do nothing, let awesomeness-ui handle it

			} else {

				// internal links
				app.page(href);
			
			}

		}

	});

	// find code blocks that have only a string inside and add class .simple-code-string
	$page.find('code').each(function(){

		const $code = $(this);
		const codeText = $code.text().trim();


		if(codeText && !codeText.includes('\n')){

			$code.addClass('simple-code-string');
		
		}
	
	});

	Prism.highlightAll();

	app.pages._md.callToAction();

	ui.bibleVerse.init();


};