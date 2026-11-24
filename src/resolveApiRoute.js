import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import getConfig from './getConfig.js';

export default async function resolveApiRoute({
	site,
	route,
	infoOnly = false,
}) {

	const {
		siteDir__URL,
		commonApiDir__URL,
	} = getConfig();

	if(!(siteDir__URL instanceof URL) || !(commonApiDir__URL instanceof URL)){

		throw new Error('Config must provide siteDir__URL and commonApiDir__URL as file: URLs');

	}

	const siteDir = path.join(fileURLToPath(siteDir__URL), site, 'api', 'routes', route);
	const genericDir = path.join(fileURLToPath(commonApiDir__URL), 'routes', route);

	const found = {
		index: null,
		indexPath: null,
		info: null,
		specific: false,
		siteSpecificRoute: path.join(siteDir, 'index.js'),
		genericRoute: path.join(genericDir, 'index.js'),
	};

	const candidates = [
		{
			dir: siteDir,
			specific: true,
			message: 'Site specific route import error',
			routeKey: 'siteSpecificRoute',
			infoKey: 'siteSpecificInfo',
		},
		{
			dir: genericDir,
			specific: false,
			message: 'Generic route import error',
			routeKey: 'genericRoute',
			infoKey: 'genericInfo',
		},
	];

	for(const candidate of candidates){

		const indexPath = path.join(candidate.dir, 'index.js');
		const infoPath = path.join(candidate.dir, '_info.js');

		const exists = await Promise.all([ fs.access(indexPath), fs.access(infoPath) ]).then(() => true, () => false);

		if(!exists){

			continue;

		}

		try {

			found.indexPath = indexPath;
			found.index = infoOnly ? null : await import(pathToFileURL(indexPath).href);
			found.info = (await import(pathToFileURL(infoPath).href)).default;
			found.specific = candidate.specific;

		} catch(error){

			throw {
				message: candidate.message,
				error,
				[candidate.routeKey]: indexPath,
				[candidate.infoKey]: infoPath,
			};

		}

		return found;

	}

	return found;

}
