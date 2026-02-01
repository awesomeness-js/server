// awesomeness import 'tag'

export default ({
	mdContent,
	metadata,
	tagBase = '/tag'
}) => {

	const $headerImage = $(`<div class="blogPost-header-image"></div>`)
		.css({ 'background-image': `url(${metadata.image})` });


	const $catDateTime = $(`<div class="blogPost-catDateTime"></div>`)
		.appendTo($headerImage);


	if(!metadata.category && metadata?.tags.length > 0){

		metadata.category = metadata.tags[0];
	
	}

	if(metadata.category){

		$(`<a href="${tagBase}/${metadata.category}"><div class="blogPost-category">${metadata.category}</div></a>`)
			.appendTo($catDateTime);

		// add •
		$(`<div class="blogPost-catDateTime-separator"></div>`)
			.appendTo($catDateTime);
	
	}

	if(metadata.published){

		// make EST default

		let tz = metadata.timezone || 'America/New_York';

		const [ y, m, d ] = metadata.published.split('-').map(Number);

		// Create date in local time (NOT UTC)
		const date = new Date(y, m - 1, d);

		const options = {
			year: 'numeric',
			month: app && app.size && app.size.view !== 'p' ? 'long' : 'short',
			day: 'numeric',
			timeZone: tz
		};

		const formattedDate = date.toLocaleDateString(undefined, options);

		$(`<div class="blogPost-published">${formattedDate}</div>`)
			.appendTo($catDateTime);

		
		// add •
		$(`<div class="blogPost-catDateTime-separator"></div>`)
			.appendTo($catDateTime);
	
	}

	if(!metadata.readTime && mdContent){
	
		const wordsPerMinute = 200;
		const words = mdContent.trim().split(/\s+/).length;
		const readTime = Math.ceil(words / wordsPerMinute);

		metadata.readTime = readTime;

	}

	if(metadata.readTime){

		$(`<div class="blogPost-readTime"><i class="ico-clock"></i> ${metadata.readTime} min read</div>`)
			.appendTo($catDateTime);
	
	} else {

		console.warn('Read time could not be calculated for blog post:', {
			metadata,
			mdContent
		});

	}
	

	const $title = $(`<h1 class="blogPost-title"><a target="_blank" href="${metadata.url}">${metadata.title}</a></h1>`)
		.appendTo($headerImage);

	if(metadata.subTitle){

		$(`<h2 class="blogPost-subTitle">${metadata.subTitle}</h2>`)
			.appendTo($headerImage);
		
	}


	if(metadata.author){

		let image;

		let authorName = metadata.author.url ? `<a class="blogPost-author-name" href="${metadata.author.url}" target="_blank" rel="noopener">${metadata.author.name}</a>` : metadata.author.name;

		if(metadata.author.title){

			authorName += `${metadata.author.title}`;
		
		}


		const $author = $(`<div class="blogPost-author"><span>${authorName}</span></div>`)
			.appendTo($headerImage);

		if(metadata.author.image){

			image = $(`<div class="blogPost-author-image"></div>`)
				.css({ 'background-image': `url(${metadata.author.image})` })
				.prependTo($author);
				
		
		}

	}


	if(metadata.tags){

		const $tagsList = $(`<div class="blogPost-tags-list"></div>`)
			.appendTo($headerImage);

		metadata?.tags?.forEach((tag) => {

			const link = ui.tag.category(tag);

			const $tag = $(`<a href="${tagBase}/${link}"><div class="blogPost-tag ${metadata.tagColor ? metadata.tagColor : ''}">${tag}</div></a>`)
				.appendTo($tagsList)
				.on('click', (e) => {

					e.stopPropagation();
					e.preventDefault();
					app.page(`${tagBase}/${link}`);

				});

		});

	}

	return $headerImage;

};
