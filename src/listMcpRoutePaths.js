import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import getConfig from './getConfig.js';

export default async function listMcpRoutePaths({ site } = {}) {

	const {
		siteDir__URL,
		commonApiDir__URL,
	} = getConfig();

	const roots = [
		path.join(fileURLToPath(commonApiDir__URL), 'routes'),
		path.join(fileURLToPath(siteDir__URL), site, 'api', 'routes'),
	];

	const routePaths = {};

	for(const root of roots){

		const entries = await fs.readdir(root, { recursive: true }).catch(() => {

			return [];

		});

		for(const entry of entries){

			const rel = entry.split(path.sep).join('/');

			if(!rel.endsWith('/_info.js')){

				continue;

			}

			const route = rel.slice(0, -'/_info.js'.length);

			if(/^[a-zA-Z0-9/_-]+$/.test(route)){

				routePaths[route] = true;

			}

		}

	}

	return routePaths;

}
