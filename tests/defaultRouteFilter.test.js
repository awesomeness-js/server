import { describe, expect, it } from "vitest";
import defaultRouteFilter from "../src/defaultRouteFilter.js";

describe("defaultRouteFilter", () => {

	it("hides a common route with no publishDocs", () => {

		expect(defaultRouteFilter({
			route: {
				specific: false,
				info: { mcp: true }
			},
			site: "site-a"
		})).toBe(false);

	});

	it("hides a common route with an empty publishDocs", () => {

		expect(defaultRouteFilter({
			route: {
				specific: false,
				info: {
					mcp: true,
					publishDocs: []
				}
			},
			site: "site-a"
		})).toBe(false);

	});

	it("hides a common route published to another site", () => {

		expect(defaultRouteFilter({
			route: {
				specific: false,
				info: {
					mcp: true,
					publishDocs: [ "other-site" ]
				}
			},
			site: "site-a"
		})).toBe(false);

	});

	it("shows a common route whose publishDocs lists the site", () => {

		expect(defaultRouteFilter({
			route: {
				specific: false,
				info: {
					mcp: true,
					publishDocs: [ "site-a" ]
				}
			},
			site: "site-a"
		})).toBe(true);

	});

	it("shows a site-local route even without publishDocs", () => {

		expect(defaultRouteFilter({
			route: {
				specific: true,
				info: { mcp: true }
			},
			site: "site-a"
		})).toBe(true);

	});

});
