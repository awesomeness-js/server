import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { rm } from "fs/promises";
import mcpFixture from "./helpers/mcpFixture.js";

const mocks = vi.hoisted(() => ({ getConfig: vi.fn() }));

vi.mock("../src/getConfig.js", () => ({ default: mocks.getConfig }));

import routeRequest from "../src/koa/routeRequest.js";

describe("routeRequest api routes via resolveApiRoute", () => {

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

	const ctxFor = (pageRoute, data = {}) => {

		return {
			awesomenessRequest: {
				awesomenessType: "api",
				pageRoute,
				site: "site-a",
				data,
				log: () => {}
			}
		};

	};

	it("runs a public route and cleans its data", async () => {

		const ctx = ctxFor("shared/echo", { text: "hi" });

		await routeRequest(ctx, async () => {});

		expect(ctx.body).toMatchObject({
			success: true,
			route: "shared/echo",
			data: { text: "hi" }
		});

	});

	it("uses the site route when one exists", async () => {

		const ctx = ctxFor("override/me");

		await routeRequest(ctx, async () => {});

		expect(ctx.body.success).toBe(true);
		expect(ctx.awesomenessRequest.specific).toBe(true);

	});

	it("answers 404 for a missing route", async () => {

		const ctx = ctxFor("nope");

		await routeRequest(ctx, async () => {});

		expect(ctx.status).toBe(404);
		expect(ctx.body.message).toBe("route not found");

	});

});
