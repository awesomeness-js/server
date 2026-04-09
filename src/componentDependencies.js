import path from "path";
import { fileURLToPath } from "url";
import { each, getAllFiles } from "@awesomeness-js/utils";
import getConfig from "./getConfig.js";
import { extractUiRefsFromFileMemoized, readFileMemoized } from "./componentAndPageMemory.js";

function urlToFsPath(u) {

	if (!(u instanceof URL)) {

		throw new TypeError("componentLocations must be an array of URL objects");
	
	}

	// If it’s a real file URL, use fileURLToPath
	if (u.protocol === "file:") {

		let p = fileURLToPath(u);

		// Guard against malformed file URLs on POSIX producing "usr/..." instead of "/usr/..."
		if (path.sep === "/" && !p.startsWith("/")) p = "/" + p;

		return p;
	
	}

	// Otherwise, treat it as a path-like URL and use pathname
	// (common with some runtimes/bundlers)
	let p = decodeURIComponent(u.pathname || "");

	if (path.sep === "/" && p && !p.startsWith("/")) p = "/" + p;

	return p;

}

export default function componentDependencies(
	allComponents,
	{
		componentLocations = [],
		namespace = "ui",
		showDetails = false,
		ignore = [ "*.css.js" ],
	} = {}
) {

	const awesomenessConfig = getConfig();

	if (!Array.isArray(componentLocations) || componentLocations.length === 0) {

		throw new TypeError("componentLocations must be a non-empty array of URL objects");
	
	}

	let componentsToProcess = [ ...allComponents ];
	const out = {};

	while (componentsToProcess.length > 0) {

		const newComponentsToProcess = [];

		componentsToProcess.forEach((component) => {

			// Build roots in priority order; last is default because it’s last
			const candidateRoots = componentLocations.map((baseUrl) => {

				// baseUrl should point at a directory; we resolve component under it
				const componentUrl = new URL(`./${component}/`, baseUrl);

				
				return path.resolve(urlToFsPath(componentUrl));
			
			});

			let allFiles;
			let chosenRoot;
			let lastErr;

			for (const root of candidateRoots) {

				try {

					// IMPORTANT: pass root so getAllFiles returns paths relative to the scan root
					allFiles = getAllFiles(".", {
						dir: root,
						root,
						ignore,
					});

					chosenRoot = root;
					break; // first match wins
				
				} catch (e) {

					lastErr = e;
				
				}
			
			}

			if (!allFiles) {

				throw {
					message: "component does not exist (no location matched)",
					component,
					tried: candidateRoots,
					cause: lastErr?.message ?? lastErr,
				};
			
			}

			if (
				awesomenessConfig.debug_componentDependencies &&
				Array.isArray(awesomenessConfig.debug_componentDependencies) &&
				awesomenessConfig.debug_componentDependencies.includes(component)
			) {

				console.log("[awesomenessConfig.debug componentDependencies] chosenRoot:", chosenRoot);
				console.log("[awesomenessConfig.debug componentDependencies] allFiles count:", allFiles.length);
				console.log("[awesomenessConfig.debug componentDependencies] first 50 files:", allFiles.slice(0, 50));
				console.log(
					"[awesomenessConfig.debug componentDependencies] any non-string:",
					allFiles.some((f) => typeof f !== "string")
				);
				console.log(
					"[awesomenessConfig.debug componentDependencies] any absolute:",
					allFiles.some((f) => path.isAbsolute(f))
				);
			
			}

			allFiles.forEach((file) => {

				const normalizedPath = path.normalize(file);

				const fileNameFull = path.basename(normalizedPath);
				const fileTypeArr = fileNameFull.split(".");
				const fileType = fileTypeArr[fileTypeArr.length - 1].toLowerCase();
				const fileName = fileTypeArr.slice(0, -1).join(".");

				out[component] = out[component] || {};
				out[component][fileType] = out[component][fileType] || {};

				// Build tail from the file's relative directory (NOT by searching for `component` in the path)
				const dir = path.dirname(normalizedPath);
				const dirParts = dir === "." ? [] : dir.split(path.sep);

				let tail = "";

				if (fileType === "js" || fileType === "css") {

					if (dirParts.length > 0) {

						tail =
							fileName === "index"
								? "." + dirParts.join(".")
								: `.${dirParts.join(".")}.${fileName}`;
					
					} else {

						tail = fileName === "index" ? "" : `.${fileName}`;
					
					}
				
				}

				const componentName = `${namespace}.${component}${tail}`;

				try {

					// readFileSync must use chosenRoot + relative file path
					const filePath = path.isAbsolute(file) ? file : path.join(chosenRoot, file);
					const fileContent = readFileMemoized(filePath);

					const lines = fileContent.split("\n");
					let fileWithImportsStripped = "";

					try {

						const newTest = extractUiRefsFromFileMemoized(filePath, {
							namespace,
							includeDotAccess: true,
							cacheContext: `component:${component}|file:${filePath}`,
						});

						if (newTest.length > 0) {

							newTest.forEach((newComp) => {

								if (!allComponents.includes(newComp)) {

									allComponents.push(newComp);
									newComponentsToProcess.push(newComp);
								
								}
							
							});
						
						}
					
					} catch (error) {

						console.error("Error extracting UI parts:", error);
					
					}

					lines.forEach((line) => {

						if (line.startsWith("import ui")) {

							if (line.includes(`import ui from '#ui'; // `)) {

								const imports = line.split(`import ui from '#ui'; // `);

								if (imports.length > 1) {

									const importComponents = imports[1]
										.split(",")
										.map((c) => c.trim());

									importComponents.forEach((importComponent) => {

										if (!allComponents.includes(importComponent)) {

											allComponents.push(importComponent);
											newComponentsToProcess.push(importComponent);
										
										}
									
									});
								
								}
							
							}
						
						} else if (
							line.startsWith("// awesomeness import") ||
							line.startsWith("/* awesomeness @import")
						) {

							const importPathMatch = line.match(/['"]([^'"]+)['"]/);

							if (importPathMatch) {

								const importedComponentName = importPathMatch[1]
									.replace(/;$/, "")
									.trim();

								if (!allComponents.includes(importedComponentName)) {

									allComponents.push(importedComponentName);
									newComponentsToProcess.push(importedComponentName);
								
								}
							
							}
						
						} else {

							fileWithImportsStripped += `${line}\n`;
						
						}
					
					});

					if (fileType === "js") {

						if (
							fileWithImportsStripped.startsWith("(function") ||
							fileWithImportsStripped.startsWith("((")
						) {

							fileWithImportsStripped = `;${fileWithImportsStripped}`;
						
						} else {

							fileWithImportsStripped = fileWithImportsStripped.replace(
								"export default ",
								`${componentName} = `
							);
						
						}
					
					}

					out[component][fileType][componentName] = fileWithImportsStripped;
				
				} catch (err) {

					const full = path.isAbsolute(file) ? file : path.join(chosenRoot, file);

					console.error("Failed to get dependencies", {
						component,
						file,
						full,
						code: err?.code,
						message: err?.message,
						stack: err?.stack,
					});
				
				}
			
			});

			if (out[component]) {

				each(out[component], (files, type) => {

					if (type === "js") {

						const jsKeys = Object.keys(files);

						jsKeys.forEach((key) => {

							const keyParts = key.split(".");

							for (let i = 2; i < keyParts.length; i++) {

								const parentPath = keyParts.slice(0, i).join(".");

								if (!files[parentPath]) {

									files[parentPath] = `${parentPath} = ${parentPath} || {}; `;
								
								}
							
							}
						
						});

					}

					if (type === "js" && !files[`${namespace}.${component}`]) {

						files[`${namespace}.${component}`] = `${namespace}.${component} = {}; `;
					
					}

					files = Object.keys(files)
						.sort()
						.reduce((obj, key) => {

							obj[key] = files[key];
							
							return obj;
						
						}, {});

					if (showDetails) {

						out[component][type + "_details"] = files;
					
					}

					out[component][type] = ` ${Object.values(files).join("\n")} `;
				
				});
			
			}

			componentsToProcess = componentsToProcess.filter((f) => f !== component);
		
		});

		if (newComponentsToProcess.length) {

			componentsToProcess = componentsToProcess.concat(newComponentsToProcess);
		
		}
	
	}

	return out;

}
