// awesomeness import 'insertIntoList';

export default ({
	datas,
	title = 'Categories',
	onClick = (category)=>{}
})=>{

	let categories = {};

	datas.forEach(function(thing){

		thing.tags.forEach(function(tag){

			if(!categories[tag]) categories[tag] = [];
			categories[tag].push(thing);
		
		});
	
	});

	const $area = $('<div class="tag-map"></div>').appendTo('body');

	$(`<h1>${title}</h1>`).appendTo($area);
	let $tagMap = $('<div class="tag-map"></div>').appendTo($area);

	function tagCategory(tag){

		return tag
			.toLowerCase()          // Convert to lowercase
			.replace(/[^a-z\s]/g, '') // Remove non a-z characters
			.replace(/\s+/g, '-');  // Replace spaces with hyphens
	
	}

	let allLength = datas.length;

	categories['all'] = datas;

	$.each(categories, function(category, things){

		const tagCat = tagCategory(category);
			
		let $category = $(`<div class="category tag category-${tagCat}">${category} <span>${things.length}</span></div>`)
			.data('categoryCount', things.length)
			.data('category', category)  
			.insertIntoList($tagMap,{
				za: true,
				sortFn: ($elm)=>{

					return $elm.data('categoryCount') * 1;
				
				}
			}).click(()=>{

				onClick(category); 

			});

	});

	return $area;

};