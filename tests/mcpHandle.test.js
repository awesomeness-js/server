import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { rm } from "fs/promises";
import mcpFixture from "./helpers/mcpFixture.js";

const mocks = vi.hoisted(() => ({ getConfig: vi.fn() }));

vi.mock("../src/getConfig.js", () => ({ default: mocks.getConfig }));

import mcpHandle from "../src/mcpHandle.js";

describe("mcpHandle", () => {

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

	const call = (message, permissions = [ "user" ]) => {

		return mcpHandle({
			message: {
				jsonrpc: "2.0",
				...message
			},
			awesomenessRequest: {
				site: "site-a",
				data: {},
				user: {
					id: "u1",
					permissions
				},
				authenticated: true,
				mcp: true,
				log: () => {}
			},
		});

	};

	it("initializes with a supported protocol version and the tools capability", async () => {

		const res = await call({
			id: 1,
			method: "initialize",
			params: { protocolVersion: "2025-06-18" }
		});

		expect(res.result.protocolVersion).toBe("2025-06-18");
		expect(res.result.capabilities.tools).toBeDefined();
		expect(res.result.serverInfo.name).toBe("site-a");
		expect((await call({
			id: 2,
			method: "initialize",
			params: { protocolVersion: "1999-01-01" }
		})).result.protocolVersion).toBe("2025-11-25");

	});

	it("returns null for notifications and answers ping", async () => {

		expect(await call({ method: "notifications/initialized" })).toBeNull();
		expect(await call({
			id: 3,
			method: "ping"
		})).toEqual({
			jsonrpc: "2.0",
			id: 3,
			result: {}
		});

	});

	it("lists only marked tools the caller may use, with schemas from _info", async () => {

		const res = await call({
			id: 4,
			method: "tools/list"
		});
		const names = res.result.tools.map((tool) => {

			return tool.name;

		}).sort();

		expect(names).toEqual([ "boom", "override_me", "shared_echo", "user_thing" ]);

		const echo = res.result.tools.find((tool) => {

			return tool.name === "shared_echo";

		});

		expect(echo.description).toBe("Echo text");
		expect(echo.inputSchema).toEqual({
			type: "object",
			properties: {
				text: {
					type: "string",
					description: "what to echo"
				}
			},
			required: [ "text" ]
		});

	});

	it("calls a tool through validateRequest and the route handler", async () => {

		const res = await call({
			id: 5,
			method: "tools/call",
			params: {
				name: "shared_echo",
				arguments: { text: "hi" }
			}
		});

		expect(res.result.isError).toBe(false);
		expect(res.result.structuredContent).toEqual({
			route: "shared/echo",
			data: { text: "hi" },
			userId: "u1"
		});
		expect(JSON.parse(res.result.content[0].text).data.text).toBe("hi");

	});

	it("refuses a route the user lacks permission for, as an isError result", async () => {

		const res = await call({
			id: 6,
			method: "tools/call",
			params: {
				name: "admin_only",
				arguments: {}
			}
		});

		expect(res.result.isError).toBe(true);
		expect(JSON.parse(res.result.content[0].text).message).toBe("user does not have permission");

	});

	it("reports route errors without stacks", async () => {

		const res = await call({
			id: 7,
			method: "tools/call",
			params: {
				name: "boom",
				arguments: {}
			}
		});

		expect(res.result.isError).toBe(true);
		expect(res.result.content[0].text).not.toContain("at ");

	});

	it("rejects unknown tools, unknown methods, and invalid requests", async () => {

		expect((await call({
			id: 8,
			method: "tools/call",
			params: { name: "shared_hidden" }
		})).error.code).toBe(-32602);
		expect((await call({
			id: 9,
			method: "resources/list"
		})).error.code).toBe(-32601);
		expect((await mcpHandle({
			message: [ {} ],
			awesomenessRequest: {}
		})).error.code).toBe(-32600);

	});

});
