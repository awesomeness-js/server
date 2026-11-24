import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { rm } from "fs/promises";
import mcpFixture from "./helpers/mcpFixture.js";

const mocks = vi.hoisted(() => ({ getConfig: vi.fn() }));

vi.mock("../src/getConfig.js", () => ({ default: mocks.getConfig }));

import listMcpRoutes from "../src/listMcpRoutes.js";

describe("listMcpRoutes", () => {

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

	it("keys marked routes by tool name and skips unmarked ones", async () => {

		const routes = await listMcpRoutes({ site: "site-a" });

		expect(Object.keys(routes).sort()).toEqual([ "admin_only", "boom", "common_listed", "override_me", "shared_echo", "siteonly_local", "user_thing" ]);
		expect(routes.shared_echo.route).toBe("shared/echo");

	});

	it("lets a site route replace or hide the shared route", async () => {

		const routes = await listMcpRoutes({ site: "site-a" });

		expect(routes.override_me.info.description).toBe("site version");
		expect(routes.override_me.specific).toBe(true);
		expect(routes.hideme).toBeUndefined();

	});

	it("shows the shared versions on a site without overrides", async () => {

		const routes = await listMcpRoutes({ site: "site-b" });

		expect(routes.override_me.info.description).toBe("shared version");
		expect(routes.hideme.info.description).toBe("shared marked");
		expect(routes.common_listed).toBeUndefined();
		expect(routes.siteonly_local).toBeUndefined();

	});

	it("hides untagged, empty, and other-site common routes and shows listed and site-local ones", async () => {

		const routes = await listMcpRoutes({ site: "site-a" });

		expect(routes.common_untagged).toBeUndefined();
		expect(routes.common_empty).toBeUndefined();
		expect(routes.common_other).toBeUndefined();
		expect(routes.common_listed.info.description).toBe("listed for site-a");
		expect(routes.siteonly_local.specific).toBe(true);
		expect(routes.siteonly_local.info.publishDocs).toBeUndefined();

	});

});
