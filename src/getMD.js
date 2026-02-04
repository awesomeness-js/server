import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export default async function getMD(relativePath, callerUrl) {

	try {

		const callerDir = path.dirname(fileURLToPath(callerUrl));
		const fullPath = path.resolve(callerDir, relativePath);

		console.log(`Loading MD file from: ${fullPath}`);
    
		return await readFile(fullPath, 'utf8');
	
	} catch {

		return null;
	
	}

}
