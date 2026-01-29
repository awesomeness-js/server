import { getConfig } from "../config.js";

import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { existsSync } from "fs";
import { promises as fs } from "fs";
import { resolveRealCasePath } from "./resolveRealCasePath.js";

export default async function pageInfo(awesomenessRequest, { page = null } = {}) {

	const awesomenessConfig = getConfig();

	if (!page) {

		page = awesomenessRequest.pageRoute;
	
	}

	const slug = page.split("/").pop().split(".")[0].split("?")[0];

	// awesomenessConfig.siteURL points at the /sites/ directory (as a URL)
	const sitesRootPath =
		awesomenessConfig.siteURL instanceof URL
			? fileURLToPath(awesomenessConfig.siteURL)
			: awesomenessConfig.siteURL;

	const siteRootPath = path.join(sitesRootPath, awesomenessRequest.site);
	const pagesRootPath = path.join(siteRootPath, "pages");

	const mainPath = resolveRealCasePath(path.join(pagesRootPath, page));

	let getDataPath = mainPath ? path.join(mainPath, "getData.js") : null;
	let aboutPath = mainPath ? path.join(mainPath, "_info.js") : null;
	let cssPath = mainPath ? path.join(mainPath, "css") : null;
	let jsPath = mainPath ? path.join(mainPath, "js") : null;

	let aboutExists = aboutPath ? existsSync(aboutPath) : false;
	let getDataExists = getDataPath ? existsSync(getDataPath) : false;

	if (aboutExists) {

		const { default: about } = await import(pathToFileURL(aboutPath).href);

		let getData = null;

		if (getDataExists) {

			({ default: getData } = await import(pathToFileURL(getDataPath).href));
		
		}

		return {
			getData,
			about,
			cssPath,
			jsPath,
		};
	
	}

	// is it a simple blog page?
	getDataPath = path.join(pagesRootPath, "_md", "getData.js");
	aboutPath = path.join(pagesRootPath, "_md", "_info.js");
	cssPath = path.join(pagesRootPath, "_md", "css");
	jsPath = path.join(pagesRootPath, "_md", "js");

	aboutExists = existsSync(aboutPath);
	getDataExists = existsSync(getDataPath);

	if (!aboutExists) {

		throw {
			message: "page not found",
			aboutPath,
			cssPath,
			jsPath,
			awesomenessRequest,
		};
	
	}

	const blogPageLocation = path.join(pagesRootPath, "_md", "pages", `${slug}.md`);
	const relativePath = resolveRealCasePath(blogPageLocation);

	const { default: about } = await import(pathToFileURL(aboutPath).href);

	let getData = null;

	if (getDataExists) {

		({ default: getData } = await import(pathToFileURL(getDataPath).href));
	
	}

	const out = {
		getData,
		about,
		cssPath,
		jsPath,
	};

	if (relativePath) {

		out.mdContent = await fs.readFile(relativePath, "utf-8");
		awesomenessRequest.mdContent = out.mdContent;
	
	} else {

		console.log("relative path does not exist, no content found");

		throw {
			code: 404,
			message: "page not found. tried specific, MD, and database",
			url: slug,
		};
	
	}

	return out;

}
