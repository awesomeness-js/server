export default (post) => {

	let $out = $('<div class="blogPost"></div>');

	if(!post || !post.sections){

		$out.html('hmmm.... something is wrong with this post');
		
		return $out;
	
	}

	post.sections.forEach((section) => {

		if(
			typeof ui.blogPost[section.type] !== 'function'
			&& !typeof section.custom === 'function'
		){

			console.log(`blogPost section type "${section.type}" not found (not custom either...)`, section);

			return;

		}

		const $sectionContainer = $(`<div class="blogPost-section"></div>`)
			.appendTo($out);

		const $sectionContent = ui.blogPost[section.type](section.data);

		if(!$sectionContent){

			console.log(`blogPost section type "${section.type}" returned no content`, section);

			return;

		}

		$sectionContent.appendTo($sectionContainer);

	});

	return $out;

};
