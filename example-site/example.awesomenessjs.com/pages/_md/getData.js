import parseMd from '#utils/parseMd.js';
import checkAccess from '#server/checkAccess.js';

// @awesomenessRequest
export default async function getData(awesomenessRequest) {

	let mdContent = 
		awesomenessRequest.mdContent 
		|| awesomenessRequest.data.mdContent 
		|| '## No Content Found\n\nSorry, no content could be found for this post.';

	let {
		metadata,
		cleanedMDContent,
	} = await parseMd(mdContent);

	mdContent = cleanedMDContent;

	awesomenessRequest.pageInit = '_md';

	// check permissions?
	if(metadata?.permissions?.length){

		await checkAccess({
			permissionsAllowed: metadata.permissions,
			awesomenessRequest,
		});

	}

	return { 
		mdContent,
		metadata,
	};

}