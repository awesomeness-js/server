import fs from 'fs';
import parseMd from '#utils/parseMd.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function tagToFilename(tag) {

	return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

}

export default async function getBlogData(folder = 'pages') {

	const folderPath = path.resolve(__dirname, folder);
	const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.md'));

	const tagImagePath = path.resolve(__dirname, '../../public/tools/images/tags');
	const tagImageFiles = fs.existsSync(tagImagePath) ? fs.readdirSync(tagImagePath) : [];

	const tagMap = Object.create(null);


	const result = {
		tags: [],    // now array of { name, count }
		links: [],   // array of urls
		posts: []    // array of metadata objects
	};

	const linkRegex = /\[([^\]]+)\]\(([^)\s]+)\)/g;

	for (const file of files) {

		try {

			const filePath = path.join(folderPath, file);
			const mdContent = fs.readFileSync(filePath, 'utf-8');

			const {
				metadata,
				cleanedMDContent
			} = await parseMd(mdContent);

			if (!metadata || !metadata.published) continue;

			// collect tags
			if (Array.isArray(metadata.tags)) {

				for (const tag of metadata.tags) {

					if (!tag) continue;
					tagMap[tag] = (tagMap[tag] || 0) + 1;
			
				}
		
			}

			// collect links
			let match;


			while ((match = linkRegex.exec(cleanedMDContent)) !== null) {

				const url = match[2];

				result.links.push(url);
		
			}

			// collect post metadata
			result.posts.push({
				file,
				...metadata
			});

		} catch(err){

			console.error(`Error processing file ${file}:`, err);

		}


	
	}

	// build tag array
	result.tags = Object.entries(tagMap)
		.map(([ name, count ]) => ({
			name,
			count,
			image: tagImageFiles.includes(tagToFilename(name) + '.webp') ? `/tools/images/tags/${tagToFilename(name)}.webp` : null	
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	// sort posts by priority (asc), then date (desc), fallback to title
	result.posts.sort((a, b) => {

		const ap = (typeof a.priority === 'number') ? a.priority : Infinity;
		const bp = (typeof b.priority === 'number') ? b.priority : Infinity;

		if (ap !== bp) return ap - bp;

		const ad = new Date(a.published);
		const bd = new Date(b.published);

		if (!isNaN(ad) && !isNaN(bd)) return bd - ad;
		
		return (a.title || '').localeCompare(b.title || '');
	
	});


	return result;

}
