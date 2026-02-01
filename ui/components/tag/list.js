import ui from '#ui';
// awesomeness import 'insertIntoList';

export default ({
	tags,
	title = 'Categories',
	onClick = (tag)=>{}
})=>{

	const $area = $('<div class="tag-map"></div>').appendTo('body');

	let $categoriesH = $(`<h1 class="">${title}</h1>`).appendTo($area);
	let $categories = $(`<div class="tag-list"></div>`).appendTo($area);


	let allLength = tags.length;

	tags.forEach((tag) => {

		const tagCat = ui.tag.category(tag.name);
			
		let $tag = $(`<div class="tag category-${tagCat}">${tag.name} <span>${tag.count}</span></div>`)
			.data('tagCount', tag.count)
			.data('tag', tag.name)  
			.insertIntoList($categories,{
				za: true,
				sortFn: ($elm)=>{

					return $elm.data('tagCount') * 1;
				
				}
			}).click(()=>{

				onClick(tag); 

			});

	});

	return $area;

};