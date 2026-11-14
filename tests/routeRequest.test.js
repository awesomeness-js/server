import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";

const mocks = vi.hoisted(() => ({
	getConfig: vi.fn(),
	pageInfo: vi.fn(),
}));

vi.mock("../src/getConfig.js", () => ({
	default: mocks.getConfig,
}));

vi.mock("../src/pageInfo.js", () => ({
	default: mocks.pageInfo,
}));

import routeRequest from "../src/koa/routeRequest.js";

describe("routeRequest on a failed session check", () => {

	let root;

	beforeAll(async () => {

		root = await mkdtemp(path.join(os.tmpdir(), "awesomeness-route-"));

		const routeDir = path.join(root, "sites", "site-a", "api", "routes", "secret");

		await mkdir(routeDir, { recursive: true });
		await mkdir(path.join(root, "api", "routes"), { recursive: true });
		await writeFile(path.join(routeDir, "_info.js"), "export default { permissions: [ 'user' ] };\n");
		await writeFile(path.join(routeDir, "index.js"), "export default async () => ({ ok: true });\n");

	});

	afterAll(async () => {

		await rm(root, {
			recursive: true,
			force: true 
		});

	});

	beforeEach(() => {

		mocks.getConfig.mockReturnValue({
			siteDir__URL: pathToFileURL(path.join(root, "sites") + path.sep),
			commonApiDir__URL: pathToFileURL(path.join(root, "api") + path.sep),
			checkSession: async () => {

				throw { message: "token invalid" };

			},
		});
		mocks.pageInfo.mockResolvedValue({
			about: { permissions: [ "user" ] },
		});

	});

	const request = (awesomenessType, pageRoute) => {

		return {
			awesomenessType,
			pageRoute,
			site: "site-a",
			data: {},
			log: () => {},
		};

	};

	it("answers a protected page with 422 and APP_SESSION in the body", async () => {

		const ctx = { awesomenessRequest: request("page", "goals") };

		await routeRequest(ctx, async () => {});

		expect(ctx.status).toBe(422);
		expect(ctx.body).toMatchObject({
			success: false,
			message: "session check failed",
			APP_SESSION: true,
		});

	});

	it("answers a protected api route with 422 and APP_SESSION in the body", async () => {

		const ctx = { awesomenessRequest: request("api", "secret") };

		await routeRequest(ctx, async () => {});

		expect(ctx.status).toBe(422);
		expect(ctx.body).toMatchObject({
			success: false,
			message: "session check failed",
			APP_SESSION: true,
		});

	});

});
