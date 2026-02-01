export default function tagCategory(tag){

	return tag
		.toLowerCase()          // Convert to lowercase
		.replace(/[^a-z\s]/g, '') // Remove non a-z characters
		.replace(/\s+/g, '-');  // Replace spaces with hyphens

}