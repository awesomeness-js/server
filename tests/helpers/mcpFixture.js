import { mkdtemp, mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";

export default async function mcpFixture() {

	const root = await mkdtemp(path.join(os.tmpdir(), "awesomeness-mcp-"));

	const route = async (base, routePath, info, body = "async (r) => ({ route: '" + routePath + "', data: r.cleanData, userId: r.user?.id ?? null })") => {

		const dir = path.join(root, base, routePath);

		await mkdir(dir, { recursive: true });
		await writeFile(path.join(dir, "_info.js"), `export default ${JSON.stringify(info)};\n`);
		await writeFile(path.join(dir, "index.js"), `export default ${body};\n`);

	};

	const shared = path.join("api", "routes");
	const site = path.join("sites", "site-a", "api", "routes");
	const publishedSites = [ "site-a", "site-b", "api.site-a", "constructor" ];
	const text = {
		type: "object",
		properties: {
			text: {
				type: "string",
				required: true,
				description: "what to echo"
			}
		}
	};

	await route(shared, "shared/echo", {
		description: "Echo text",
		permissions: [ "*" ],
		mcp: true,
		properties: text,
		publishDocs: publishedSites,
		returns: {
			echoed: {
				type: "string",
				required: true,
				description: "the echoed text"
			}
		}
	});
	await route(shared, "shared/hidden", {
		description: "Not exposed",
		permissions: [ "*" ],
		properties: text
	});
	await route(shared, "admin/only", {
		description: "Admin only",
		permissions: [ "admin" ],
		mcp: true,
		properties: {},
		publishDocs: publishedSites
	});
	await route(shared, "user/thing", {
		description: "Users",
		permissions: [ "user" ],
		mcp: true,
		properties: {},
		publishDocs: publishedSites
	});
	await route(shared, "override/me", {
		description: "shared version",
		permissions: [ "*" ],
		mcp: true,
		properties: {},
		publishDocs: publishedSites
	});
	await route(site, "override/me", {
		description: "site version",
		permissions: [ "*" ],
		mcp: true,
		properties: {}
	});
	await route(shared, "hideme", {
		description: "shared marked",
		permissions: [ "*" ],
		mcp: true,
		properties: {},
		publishDocs: publishedSites
	});
	await route(site, "hideme", {
		description: "site unmarked",
		permissions: [ "*" ],
		properties: {}
	});
	await route(shared, "boom", {
		description: "Throws",
		permissions: [ "*" ],
		mcp: true,
		properties: {},
		publishDocs: publishedSites,
		returns: { key: "value" }
	}, "async () => { throw new Error('kaboom'); }");
	await route(shared, "common/untagged", {
		description: "untagged common",
		permissions: [ "*" ],
		mcp: true,
		properties: {}
	});
	await route(shared, "common/empty", {
		description: "empty publishDocs",
		permissions: [ "*" ],
		mcp: true,
		publishDocs: [],
		properties: {}
	});
	await route(shared, "common/other", {
		description: "other site only",
		permissions: [ "*" ],
		mcp: true,
		publishDocs: [ "other-site" ],
		properties: {}
	});
	await route(shared, "common/listed", {
		description: "listed for site-a",
		permissions: [ "*" ],
		mcp: true,
		publishDocs: [ "site-a" ],
		properties: {},
		returns: {}
	});
	await route(site, "siteonly/local", {
		description: "site-local untagged",
		permissions: [ "*" ],
		mcp: true,
		properties: {}
	});

	const config = {
		siteDir__URL: pathToFileURL(path.join(root, "sites") + path.sep),
		commonApiDir__URL: pathToFileURL(path.join(root, "api") + path.sep),
		checkSession: async () => {

			throw { message: "no session" };

		},
	};

	return {
		root,
		config,
	};

}
