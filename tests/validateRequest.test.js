import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	getConfig: vi.fn(),
}));

vi.mock("../src/getConfig.js", () => ({
	default: mocks.getConfig,
}));

import validateRequest from "../src/validateRequest.js";

describe("validateRequest session check", () => {

	beforeEach(() => {

		mocks.getConfig.mockReturnValue({
			checkSession: async () => {

				throw { message: "session expired" };

			},
		});

	});

	it("flags a failed session check on a protected route with APP_SESSION", async () => {

		await expect(validateRequest({
			data: {},
			routeInfo: { permissions: [ "user" ] },
		})).rejects.toMatchObject({
			message: "session check failed",
			APP_SESSION: true,
			error: { message: "session expired" },
		});

	});

	it("lets a public route through without a session", async () => {

		await expect(validateRequest({
			data: {},
			routeInfo: { permissions: [ "*" ] },
		})).resolves.toBe(true);

	});

});
