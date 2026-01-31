import getBlogData from '../_md/getBlogData.js';

export default async function getData(awesomenessRequest) {

	const t1 = performance.now();

	const {
		tags,
		posts,
		links
	} = await getBlogData();

	const t2 = performance.now();
	
	return {
		tag: awesomenessRequest.data.tag ?? null,
		tags,
		links,
		posts
	};

}