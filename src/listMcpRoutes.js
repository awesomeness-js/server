import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import getConfig from './getConfig.js';
import resolveApiRoute from './resolveApiRoute.js';

// API routes exposed over MCP for a site, keyed by tool name (route path with "/" -> "_").
// Only routes whose _info.js has `mcp: true`. A site route overrides the shared route on the
// same path, so a site can replace or hide a shared tool.
export default async function listMcpRoutes({ site }) {

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

	const tools = {};

	for(const route of Object.keys(routePaths)){

		const resolved = await resolveApiRoute({
			site,
			route,
		}).catch(() => {

			return null;

		});

		if(resolved?.index && resolved.info?.mcp === true){

			const name = route.split('/').join('_');

			tools[name] = {
				name,
				route,
				info: resolved.info,
				index: resolved.index,
				specific: resolved.specific,
			};

		}

	}

	return tools;

}
