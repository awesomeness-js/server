// awesomeness import 'riskDisclosure'
// awesomeness import 'link'
export default ({
	mdContent,
	metadata,
	customLinkRule = true
},{
	customRules = []
} = {}) => {

	const $container = $('<div class="blogPage"></div>');

	// regex find all ::risk:: and replace with '<span class="awesomeness-riskDisclosure">{term:'risk'}</span>'
	mdContent = mdContent.replace(/::risk::/g, '<span class="awesomeness-riskDisclosure">{term:\'risk\'}</span>');
	mdContent = mdContent.replace(/__(.+?)__/g, '<u>$1</u>');
	mdContent = mdContent.replace(/(?<=\s)--(?=\s)/g, '—');
	mdContent = mdContent.replace(/<break-(\d+)>/g, '<div class="break height-$1"></div>');

	// fancy replace for awesomeness
	mdContent = mdContent.replace(/<youTube>(.*?)<\/youTube>/g, (match, p1)=>{

		return `<div class="awesomeness-video">{ 'id': '${p1}', 'type': 'YouTube'}</div>`;
	
	});

	if(customRules.length){

		customRules.forEach((fn) => {

			mdContent = fn(mdContent);

		});
	
	}

	const $md = $(marked.parse(mdContent));

	if(metadata.image){

		const $headerImage = ui.blogPost.headerImage({
			mdContent,
			metadata
		}).appendTo($container);

	}

	
	const $page = $(`<div class="grid-1 p40 gap-40"></div>`).appendTo($container);

	const $post = $(`
		<div class="
			blogPost
			grid-1
			justify-items-stretch
			width100
			max-width-${metadata.maxWidth ?? 700}
			justify-self-center
		"></div>
	`).appendTo($page);

	$md.appendTo($post);

	$post.parseAwesomeness();
	
	if(customLinkRule){

		$container.find('a').initLinks(customLinkRule);

	}

	return $container;

};
