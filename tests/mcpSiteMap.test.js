import { afterAll, beforeAll, beforeEach, expect, it, vi } from "vitest";
import { rm } from "fs/promises";
import mcpFixture from "./helpers/mcpFixture.js";

const mocks = vi.hoisted(() => ({ getConfig: vi.fn() }));

vi.mock("../src/getConfig.js", () => ({ default: mocks.getConfig }));

import mcp from "../src/mcp.js";

let fixture;

beforeAll(async () => {

	fixture = await mcpFixture();

});

afterAll(async () => {

	await rm(fixture.root, {
		recursive: true,
		force: true
	});

});

beforeEach(() => {

	mocks.getConfig.mockReturnValue(fixture.config);

});

const listTools = async ({ siteMap }) => {

	const ctx = {
		method: "POST",
		headers: {},
		set: () => {},
		request: {
			body: {
				jsonrpc: "2.0",
				id: 1,
				method: "tools/list"
			}
		},
		awesomenessRequest: {
			site: "api.site-a",
			path: "/mcp",
			data: {},
			log: () => {}
		},
	};

	await mcp({
		authenticate: async () => ({
			id: "u1",
			permissions: [ "user" ]
		}),
		siteMap
	})(ctx, vi.fn());

	return {
		tools: Object.fromEntries(ctx.body.result.tools.map((tool) => [ tool.name, tool ])),
		site: ctx.awesomenessRequest.site
	};

};

it("siteMap serves the mapped site's tools on another host, and leaves the request site alone", async () => {

	const unmapped = await listTools({ siteMap: undefined });

	expect(unmapped.tools.override_me.description).toBe("shared version");
	expect(unmapped.tools.hideme).toBeDefined();

	const mapped = await listTools({ siteMap: { "api.site-a": "site-a" } });

	expect(mapped.tools.override_me.description).toBe("site version");
	expect(mapped.tools.hideme).toBeUndefined();
	expect(mapped.tools.shared_echo).toBeDefined();
	expect(mapped.site).toBe("api.site-a");

});