import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { rm } from "fs/promises";
import mcpFixture from "./helpers/mcpFixture.js";

const mocks = vi.hoisted(() => ({ getConfig: vi.fn() }));

vi.mock("../src/getConfig.js", () => ({ default: mocks.getConfig }));

import mcp from "../src/mcp.js";

describe("mcp middleware", () => {

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

	const ctxFor = ({
		method = "POST", path = "/mcp", body = {}
	} = {}) => {

		const headers = {};

		return {
			method,
			headers,
			set: (key, value) => {

				headers[key] = value;

			},
			request: { body },
			awesomenessRequest: {
				site: "site-a",
				path,
				data: {},
				log: () => {}
			},
		};

	};

	const authenticate = async (req) => {

		return req.path === "/mcp" ? {
			id: "u1",
			permissions: [ "user" ]
		} : null;

	};

	it("passes other paths to next", async () => {

		const next = vi.fn();
		const ctx = ctxFor({ path: "/other" });

		await mcp({ authenticate })(ctx, next);

		expect(next).toHaveBeenCalled();

	});

	it("lets a page GET through, answers 405 for an SSE GET and 401 without a user", async () => {

		const getCtx = ctxFor({ method: "GET" });
		const pageNext = vi.fn();

		await mcp({ authenticate })(getCtx, pageNext);
		expect(pageNext).toHaveBeenCalled();

		const sseCtx = ctxFor({ method: "GET" });

		sseCtx.headers.accept = "text/event-stream";
		await mcp({ authenticate })(sseCtx, vi.fn());
		expect(sseCtx.status).toBe(405);

		const anonCtx = ctxFor({
			body: {
				jsonrpc: "2.0",
				id: 1,
				method: "ping"
			}
		});

		await mcp({
			authenticate: async () => {

				return null;

			}
		})(anonCtx, vi.fn());
		expect(anonCtx.status).toBe(401);
		expect(anonCtx.headers["WWW-Authenticate"]).toBe("Bearer");

	});

	it("skips checkSession for an authenticated user-only route", async () => {

		const ctx = ctxFor({
			body: {
				jsonrpc: "2.0",
				id: 2,
				method: "tools/call",
				params: {
					name: "user_thing",
					arguments: {}
				}
			}
		});

		await mcp({ authenticate })(ctx, vi.fn());

		expect(ctx.status).toBe(200);
		expect(ctx.body.result.isError).toBe(false);
		expect(ctx.awesomenessRequest.authenticated).toBe(true);

	});

	it("answers 202 for notifications", async () => {

		const ctx = ctxFor({
			body: {
				jsonrpc: "2.0",
				method: "notifications/initialized"
			}
		});

		await mcp({ authenticate })(ctx, vi.fn());

		expect(ctx.status).toBe(202);

	});

	it("needs an authenticate function", () => {

		expect(() => {

			return mcp({});

		}).toThrow();

	});

	it("uses the status authenticate throws, e.g. 429", async () => {

		const ctx = ctxFor({
			body: {
				jsonrpc: "2.0",
				id: 3,
				method: "ping" 
			} 
		});

		await mcp({
			authenticate: async () => {

				throw {
					status: 429,
					message: "Too many requests" 
				}; 

			} 
		})(ctx, vi.fn());

		expect(ctx.status).toBe(429);
		expect(ctx.body.error.message).toBe("Too many requests");

	});

});
