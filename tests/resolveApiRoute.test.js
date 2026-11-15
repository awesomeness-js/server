import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { rm } from "fs/promises";
import mcpFixture from "./helpers/mcpFixture.js";

const mocks = vi.hoisted(() => ({ getConfig: vi.fn() }));

vi.mock("../src/getConfig.js", () => ({ default: mocks.getConfig }));

import resolveApiRoute from "../src/resolveApiRoute.js";

describe("resolveApiRoute", () => {

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

	it("prefers the site route over the shared one", async () => {

		const found = await resolveApiRoute({
			site: "site-a",
			route: "override/me"
		});

		expect(found.specific).toBe(true);
		expect(found.info.description).toBe("site version");
		expect(typeof found.index.default).toBe("function");

	});

	it("falls back to the shared route", async () => {

		const found = await resolveApiRoute({
			site: "site-a",
			route: "shared/echo"
		});

		expect(found.specific).toBe(false);
		expect(found.info.description).toBe("Echo text");

	});

	it("returns index null when the route does not exist", async () => {

		const found = await resolveApiRoute({
			site: "site-a",
			route: "nope"
		});

		expect(found.index).toBeNull();
		expect(found.genericRoute).toContain("nope");

	});

});
