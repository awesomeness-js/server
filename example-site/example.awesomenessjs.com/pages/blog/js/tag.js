import ui from '#ui';

app.pages.wisdom.tag = (tag) => {

	ui.cleanMain();

	const tagWord = tag.replaceAll('-', ' ');

	// capitalize first letter of each word
	const tagTitle = tagWord.replace(/\b\w/g, (c) => c.toUpperCase());

	// state management
	app.state.create({
		title: `Wisdom | ${tagTitle}`,
		url: `/wisdom/${tag}`,
	});

	ui.breadcrumbs({
		data: [
			{ '/wisdom': 'Wisdom' },
			{ [`/wisdom/${tag}`]: tagTitle }
		],
		color: 'cyan',
		callback:(item)=>{

			app.page(item.url);
		
		}
	}).appendTo(app.$main);

	const $mainPosts = $(`<div class="p20-p p40 w100 max-width-1200 m0a"></div>`)
		.appendTo(app.$main);

	const { data } = app.pages.wisdom;

	const limitedData = data.posts.filter((post) => {

		return Array.isArray(post.tags)
			&& post.tags.some((tagItem) => String(tagItem).toLowerCase().trim() === tagWord.toLowerCase().trim());
	
	});

	const $top = $('<div class="mt20 mb70 text-center"></div>').appendTo($mainPosts);

	$(`<h1>${tagTitle}</h1>`).appendTo($top);
	$(`<h2 class="mb20">${limitedData.length} posts</h2>`).appendTo($top);

	const $list = ui.list({
		data: limitedData,
		autoLoad: true,
		listClass: ' grid-1 gap-100',
		searchInputClass: 'mb40 text-xl',
		placeholder: `Search ${tagWord}`,
		animationStyle: 'rotateIn',
		searchFn: ({
			item: post, 
			val 
		}) => {
	
			if(!val){
	
				return true; 
	
			}
	
			const v = String((val ?? '')).toLowerCase().trim();
	
			const isCategory = v.startsWith('category: ');
	
			if(isCategory){
	
				const categorySearch = v.slice(9).trim(); // remove 'category: '
	
				const winner = !!categorySearch
					&& Array.isArray(post.tags)
					&& post.tags.some((tag) => String(tag).toLowerCase().trim().includes(categorySearch));
	
				return winner;
	
			}
	
			return (
				post.title.toLowerCase().includes(v) ||
					(post.subtitle && post.subtitle.toLowerCase().includes(v)) ||
					post.tags.some((tag) => String(tag).toLowerCase().trim().includes(v))
			);
			
		},
		printFn: (post) => {
	
			return ui.posts.preview2(post).click(()=>{
	
				app.page(post.url);
				
			});
			
		},
		limit: 3
	}).appendTo($mainPosts);

	ui.posts.preLoadImages(limitedData);	


	limitedData.forEach((post) => {

		post.style = 'header-image';
		post.image = post.image;
	
	});

};
