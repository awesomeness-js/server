import ui from '#ui';

export default (tags)=>{

	if(typeof(tags) === 'string'){

		tags = [ tags ]; 

	}
	
	const $tags = $('<div class="tags"></div>');

	tags.forEach((tag)=>{

		const catClass = `category-${ui.tag.category(tag)}`;

		const $tag = $(`<span class="tag ${catClass}">${tag}</span>`).appendTo($tags);

		if(typeof tag.callback === 'function'){

			$tag.click(()=>{

				tag.callback(tag, catClass); 

			});

		}

	});

	return $tags;
	
};