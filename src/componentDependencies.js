import path from "path";
import { fileURLToPath } from "url";
import { each, getAllFiles } from "@awesomeness-js/utils";
import { readFileSync } from "fs";


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

function extractUiFirstParts(str) {

	const regex = /ui\.([a-zA-Z0-9_]+)(?:\.[a-zA-Z0-9_.]*)?\(/g;
	const matches = new Set();
	let match;

	while ((match = regex.exec(str)) !== null) {

		matches.add(match[1]);
	
	}

	return [ ...matches ];

}

export default function componentDependencies(allComponents, {
	componentLocations = [],
	namespace = "ui",
	showDetails = false,
	ignore = [ "*.css.js" ],
} = {}) {

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

			console.log({
				"import.meta.url =": import.meta.url,
				component,
				candidateRoots 
			});

			let allFiles;
			let chosenRoot;
			let lastErr;

			for (const root of candidateRoots) {

				try {

					allFiles = getAllFiles(".", {
						dir: root,
						ignore 
					});

					chosenRoot = root;

					break; // first match wins
				
				} catch(e) {

					// try next
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

			allFiles.forEach((file) => {

				const normalizedPath = path.normalize(file);
				const pathSegments = normalizedPath.split(path.sep);

				const variableIndex = pathSegments.indexOf(component);

				let fileNameFull = pathSegments[pathSegments.length - 1];
				const fileTypeArr = fileNameFull.split(".");
				const fileType = fileTypeArr[fileTypeArr.length - 1];
				const fileName = fileTypeArr.slice(0, -1).join(".");

				out[component] = out[component] || {};
				out[component][fileType] = out[component][fileType] || {};

				let arrAfterComponent = pathSegments.slice(variableIndex + 1);

				arrAfterComponent.pop();

				let tail = "";

				if (fileType === "js" || fileType === "css") {

					if (arrAfterComponent.length > 0) {

						tail =
              fileName === "index"
              	? "." + arrAfterComponent.join(".")
              	: `.${arrAfterComponent.join(".")}.${fileName}`;
					
					} else {

						tail = fileName === "index" ? "" : `.${fileName}`;
					
					}
				
				}

				const componentName = `${namespace}.${component}${tail}`;

				try {

					const fileContent = readFileSync(path.join(chosenRoot, file), "utf-8");
					const lines = fileContent.split("\n");
					let fileWithImportsStripped = "";

					try {

						const newTest = extractUiFirstParts(fileContent);

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

									const importComponents = imports[1].split(",").map((c) => c.trim());

									importComponents.forEach((importComponent) => {

										if (!allComponents.includes(importComponent)) {

											allComponents.push(importComponent);
											newComponentsToProcess.push(importComponent);
										
										}
									
									});
								
								}
							
							}
						
						} else if (
							line.startsWith("// awesomeness import") 
							|| line.startsWith("/* awesomeness @import")
						) {

							const importPathMatch = line.match(/['"]([^'"]+)['"]/);

							if (importPathMatch) {

								const importedComponentName = importPathMatch[1].replace(/;$/, "").trim();

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
							fileWithImportsStripped.startsWith("(function") 
							|| fileWithImportsStripped.startsWith("((")
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

					console.log("Failed to get dependencies", { component });
				
				}
			
			});

			if (out[component]) {

				each(out[component], (files, type) => {

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
