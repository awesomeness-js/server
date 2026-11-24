import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getConfig: vi.fn() }));

vi.mock("../src/getConfig.js", () => ({ default: mocks.getConfig }));

import checkAccess from "../src/checkAccess.js";

describe("checkAccess", () => {

	beforeEach(() => {

		mocks.getConfig.mockReturnValue({ byPassAccessRequirementsInDev: true });
		process.env.NODE_ENV = "development";
		vi.spyOn(console, "log").mockImplementation(() => {});

	});

	afterEach(() => {

		process.env.NODE_ENV = "test";
		vi.restoreAllMocks();

	});

	it("keeps the dev bypass for normal requests (config now imported)", async () => {

		await expect(checkAccess({
			permissionsAllowed: [ "admin" ],
			awesomenessRequest: { user: { permissions: [ "user" ] } }
		})).resolves.toBe(true);

	});

	it("never bypasses for MCP requests", async () => {

		await expect(checkAccess({
			permissionsAllowed: [ "admin" ],
			awesomenessRequest: {
				mcp: true,
				user: { permissions: [ "user" ] }
			}
		})).rejects.toMatchObject({ message: "user does not have permission" });

	});

});
