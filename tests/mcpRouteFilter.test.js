import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { rm } from "fs/promises";
import mcpFixture from "./helpers/mcpFixture.js";

const mocks = vi.hoisted(() => ({ getConfig: vi.fn() }));

vi.mock("../src/getConfig.js", () => ({ default: mocks.getConfig }));

import mcp from "../src/mcp.js";

describe("mcp routeFilter", () => {

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
		method = "tools/list",
		params,
		routeFilter
	} = {}) => {

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
				site: "site-a",
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
			routeFilter
		})(ctx, vi.fn());

		return ctx;

	};

	it("custom routeFilter replaces the default and receives ctx and awesomenessRequest", async () => {

		const seen = [];

		const routeFilter = ({
			route,
			site,
			awesomenessRequest,
			ctx
		}) => {

			seen.push({
				name: route.name,
				site,
				hasCtx: Boolean(ctx && ctx.request),
				userId: awesomenessRequest?.user?.id
			});

			return route.name === "common_untagged";

		};

		const ctx = await send({ routeFilter });
		const names = ctx.body.result.tools.map((tool) => tool.name);

		expect(names).toEqual([ "common_untagged" ]);
		expect(seen.length).toBeGreaterThan(0);
		expect(seen.every((item) => {

			return item.hasCtx && item.userId === "u1" && item.site === "site-a";

		})).toBe(true);

	});

	it("tools/call refuses a route the default filter hides", async () => {

		const ctx = await send({
			method: "tools/call",
			params: {
				name: "common_untagged",
				arguments: {}
			}
		});

		expect(ctx.body.error.code).toBe(-32602);
		expect(ctx.body.error.message).toBe("Unknown tool: common_untagged");

	});

	it("tools/call refuses a route a custom filter hides", async () => {

		const ctx = await send({
			method: "tools/call",
			params: {
				name: "shared_echo",
				arguments: { text: "hi" }
			},
			routeFilter: () => {

				return false;

			}
		});

		expect(ctx.body.error.code).toBe(-32602);
		expect(ctx.body.error.message).toBe("Unknown tool: shared_echo");

	});

});
