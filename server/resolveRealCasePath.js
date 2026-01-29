import { readdirSync } from "fs";
import path from "path";

/**
 * Case-insensitive real path resolver.
 * Works correctly on Windows, macOS, and Linux/Docker.
 */
export function resolveRealCasePath(inputPath, returnAbsolute = false) {

	if (!inputPath) return null;

	const absPath = path.resolve(inputPath);
	const { root } = path.parse(absPath);
	const parts = absPath.split(path.sep).filter(Boolean);

	let current = root || path.sep;

	// ✅ Only skip the first part if it's a Windows drive letter (e.g., "C:\")
	const startIndex = process.platform === "win32" ? 1 : 0;

	for (const part of parts.slice(startIndex)) {

		try {

			const entries = readdirSync(current);
			const match = entries.find((e) => e.toLowerCase() === part.toLowerCase());

			if (!match) return null;
			current = path.join(current, match);
		
		} catch {

			return null;
		
		}
	
	}

	let finalPath;


	if (returnAbsolute) {

		finalPath = current;
	
	} else {

		const rel = path.relative(process.cwd(), current);

		finalPath = rel.startsWith(".") ? rel : `./${rel}`;
	
	}

	return finalPath.split(path.sep).join("/");

}
