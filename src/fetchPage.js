import path from "path";
import { fileURLToPath } from "url";

import componentDependencies from "./componentDependencies.js";
import pageInfo from "./pageInfo.js";
import { each, md5, combineFiles } from "@awesomeness-js/utils";
import getConfig from "./getConfig.js";

const componentNamespace = "ui";
const pageNamespaceBase = `app.pages`;

export default async function fetchPage(
	awesomenessRequest,
	{
		about,
		cssPath,
		jsPath,
		getData,
		showDetails = false,
		page = null
	} = {}
) {

	const awesomenessConfig = getConfig();

	// normalize siteDir__URL (expected to point at the /sites/ directory)
	const sitesRootPath =
		awesomenessConfig.siteDir__URL instanceof URL
			? fileURLToPath(awesomenessConfig.siteDir__URL)
			: awesomenessConfig.siteDir__URL;

	const sitePagesRoot = path.join(sitesRootPath, awesomenessRequest.site, "pages");

	function pageFn(filePath){

		// make file path relative to ".../sites/<site>/pages/"
		let rel = path.relative(sitePagesRoot, filePath);

		// normalize to posix-style so splitting works on Windows + *nix
		rel = rel.split(path.sep).join("/");

		// remove extension and split on /js/
		const parts = rel.replace(/\.js$/i, "").split("/js/");

		const pagePath = parts[0] || "";
		const fnPath = (parts[1] || "").split("/").filter(Boolean).join(".");

		const pageNamespace = `${pageNamespaceBase}.${pagePath.split("/").filter(Boolean).join(".")}`;
		const pageFnName = `${pageNamespace}.${fnPath}`;

		return pageFnName;
		
	}
	

	// initialize if not already available
	if (!awesomenessRequest.updatedMeta) {

		awesomenessRequest.updatedMeta = {};
	
	}

	let forceRefresh = false;

	if (!page) {

		page = awesomenessRequest.pageRoute;
	
	} else {

		forceRefresh = true;
	
	}

	if (!about || !cssPath || !jsPath || !getData) {

		let info = await pageInfo(awesomenessRequest, { page });

		cssPath = info.cssPath;
		jsPath = info.jsPath;
		about = info.about;
		getData = info.getData;

		if (info.mdContent) {

			page = "_md";
		
		}
	
	}

	if (!about || !cssPath || !jsPath) {

		throw {
			reason: "page not found",
			aboutPath,
			cssPath,
			jsPath,
			awesomenessRequest,
		};
	
	}

	const meta = {
		about,
		pages: {},
		components: {},
	};

	// CHECK PERMISSIONS
	if (about?.permissions.length) {

		const userPermissions = awesomenessRequest.user?.permissions || [];
		const hasPermission = about.permissions.some((rp) => userPermissions.includes(rp) || rp === "*");

		if (!hasPermission) {

			if (process.env.NODE_ENV === "development") {

				console.log("by  page passing access requirement.");
			
			} else {

				throw {
					message: "user does not have permission to view this page",
					permissions: about.permissions,
					userPermissions,
				};
			
			}
		
		}
	
	}

	// GET PAGE
	if (
		forceRefresh === true ||
		awesomenessRequest.testing === true ||
		about.version != awesomenessRequest.meta?.pages[page]
	) {

		meta.pages[page] = meta.pages[page] || {};

		meta.pages[page].version = about.version;
		meta.pages[page].about = about;

		// GET ALL PAGE SCRIPTS
		try {

			let js = "";

			js += combineFiles(jsPath, "js", {
				processContent: ({
					content, path 
				}) => {

					const fnName = pageFn(path, awesomenessRequest);

					content = content.replaceAll(`import ui from '#ui';`, "");
					content = content.replaceAll(`import ui from "#ui";`, "");

					content = content.replaceAll("export default function", `${fnName} = function`);
					content = content.replaceAll("export default async function", `${fnName} = async function`);
					content = content.replaceAll("export default async", `${fnName} = async`);
					content = content.replaceAll("export default", `${fnName} =`);

					return content;
				
				},
			});

			meta.pages[page].js = js;
		
		} catch (err) {

			console.log("failed to get page js", { err });
		
		}

		// GET ALL PAGE CSS
		try {

			let css = "";

			css += combineFiles(cssPath, "css");
			meta.pages[page].css = css;
		
		} catch (err) {

			meta.pages[page].css = "/* no css found */";
		
		}
	
	}

	if (about?.components?.length) {

		const allDependencies = componentDependencies(about.components, {
			componentLocations: awesomenessConfig.componentLocations(awesomenessRequest),
			namespace: componentNamespace,
			showDetails,
		});

		each(allDependencies, (data, component) => {

			try {

				const css = data.css;
				const js = data.js;
				let hash = md5(css + js);

				if (hash !== awesomenessRequest.meta.components[component]) {

					meta.components[component] = {
						css,
						js,
						hash 
					};

					if (showDetails) {

						meta.components[component].css_details = data.css_details;
						meta.components[component].js_details = data.js_details;
					
					}
				
				}
			
			} catch (err) {

				console.log(`failed to get component: ${component}`, {
					component,
					err 
				});
			
			}
		
		});
	
	}

	const pages = awesomenessRequest.updatedMeta.pages || {};
	const components = awesomenessRequest.updatedMeta.components || {};

	if (Object.keys(meta.pages).length) {

		awesomenessRequest.updatedMeta.pages = {
			...pages,
			...meta.pages 
		};
	
	}

	if (Object.keys(meta.components).length) {

		awesomenessRequest.updatedMeta.components = {
			...components,
			...meta.components 
		};
	
	}

	const pageData = await getData(awesomenessRequest);

	
	return pageData;

}
