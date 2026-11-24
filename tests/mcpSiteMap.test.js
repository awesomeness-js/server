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

const send = async ({
	siteMap = { "api.site-a": "site-a" },
	site = "api.site-a",
	method = "tools/list",
	params
}) => {

	const ctx = {
		method: "POST",
		headers: {},
		set: () => {},
		request: {
			body: {
				jsonrpc: "2.0",
				id: 1,
				method,
				params
			}
		},
		awesomenessRequest: {
			site,
			path: "/mcp",
			data: {},
			log: () => {}
		},
	};

	await mcp({
		authenticate: async () => {

			return {
				id: "u1",
				permissions: [ "user" ]
			};

		},
		siteMap
	})(ctx, vi.fn());

	return ctx;

};

const toolNames = async (options) => {

	const { body } = await send(options);

	return Object.fromEntries(body.result.tools.map((tool) => [ tool.name, tool ]));

};

const call = async (name, options = {}) => {

	const { body } = await send({
		...options,
		method: "tools/call",
		params: {
			name,
			arguments: { text: "hi" }
		}
	});

	return body;

};

it("siteMap serves the mapped site's tools on another host, and leaves the request site alone", async () => {

	const unmapped = await toolNames({ siteMap: {} });

	expect(unmapped.override_me.description).toBe("shared version");
	expect(unmapped.hideme).toBeDefined();

	const mapped = await toolNames({});

	expect(mapped.override_me.description).toBe("site version");
	expect(mapped.hideme).toBeUndefined();
	expect(mapped.shared_echo).toBeDefined();
	expect((await send({})).awesomenessRequest.site).toBe("api.site-a");

});

it("tools/call through a mapped host runs the mapped site's routes", async () => {

	const echo = await call("shared_echo");

	expect(echo.result.isError).toBe(false);
	expect(echo.result.structuredContent).toMatchObject({
		route: "shared/echo",
		userId: "u1"
	});

});

it("a tool the mapped site hides is still listed on the unmapped host", async () => {

	expect((await call("hideme")).error.code).toBe(-32602);
	expect((await call("hideme", { siteMap: {} })).result).toBeDefined();

});

it("a mapped host still enforces route permissions", async () => {

	const denied = await call("admin_only");

	expect(denied.result.isError).toBe(true);
	expect(JSON.parse(denied.result.content[0].text).message).toBe("user does not have permission");
	expect(await toolNames({})).not.toHaveProperty("admin_only");

});

it("a request site named like an Object.prototype key is not looked up on the prototype", async () => {

	const tools = await toolNames({ site: "constructor" });

	expect(tools.shared_echo).toBeDefined();

});

it("internal errors reach the client as a generic JSON-RPC error and are logged server-side", async () => {

	const logged = vi.spyOn(console, "error").mockImplementation(() => {});

	mocks.getConfig.mockImplementation(() => {

		throw Object.assign(new Error("secret internal path"), { code: "ERR_INVALID_ARG_TYPE" });

	});

	const { body } = await send({});

	expect(body.error).toEqual({
		code: -32603,
		message: "Internal error"
	});
	expect(logged).toHaveBeenCalled();
	logged.mockRestore();

});