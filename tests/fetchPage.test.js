import { beforeEach, describe, expect, it, vi } from "vitest";
import path from "path";
import { performance } from "perf_hooks";
import { clearComponentAndPageMemory } from "../src/componentAndPageMemory.js";

const mocks = vi.hoisted(() => ({
	componentDependencies: vi.fn(),
	pageInfo: vi.fn(),
	getConfig: vi.fn(),
}));

vi.mock("../src/componentDependencies.js", () => ({
	default: mocks.componentDependencies,
}));

vi.mock("../src/pageInfo.js", () => ({
	default: mocks.pageInfo,
}));

vi.mock("../src/getConfig.js", () => ({
	default: mocks.getConfig,
}));

import fetchPage from "../src/fetchPage.js";

describe("fetchPage component inference", () => {

	const fixturesRoot = path.join(
		process.cwd(),
		"tests",
		"fixtures",
		"site-and-components"
	);
	const jsPath = path.join(
		fixturesRoot,
		"sites",
		"site-a",
		"pages",
		"home",
		"js"
	);
	const cssPath = path.join(
		fixturesRoot,
		"sites",
		"site-a",
		"pages",
		"home",
		"css"
	);
	const expectedComponents = [
		"app",
		"card",
		"cardMain",
		"cardMount",
		"pageInit",
		"pageScript",
		"pageWidget",
	];

	function buildRequest() {

		return {
			site: "site-a",
			pageRoute: "home",
			testing: true,
			meta: {
				pages: {},
				components: {},
			},
			updatedMeta: {
				pages: {},
				components: {},
			},
			user: {
				permissions: [ "*" ],
			},
		};

	}

	beforeEach(() => {

		vi.clearAllMocks();

		mocks.getConfig.mockReturnValue({
			siteDir__URL: path.join(fixturesRoot, "sites"),
			componentLocations: () => [ new URL("file:///tmp/components/") ],
		});

		mocks.pageInfo.mockResolvedValue({
			about: {
				version: "1.0.0",
				permissions: [],
				components: [ "card" ],
			},
			cssPath,
			jsPath,
			getData: async () => ({ ok: true }),
		});

		mocks.componentDependencies.mockImplementation((components) => {

			return components.reduce((acc, component) => {

				acc[component] = {
					css: `/* ${component} css */`,
					js: `/* ${component} js */`,
				};

				return acc;
			
			}, {});
		
		});
	
	});

	it("infers components from init.js and page js files", async () => {

		const awesomenessRequest = {
			site: "site-a",
			pageRoute: "home",
			meta: {
				pages: {},
				components: {},
			},
			updatedMeta: {
				pages: {},
				components: {},
			},
			user: {
				permissions: [ "*" ],
			},
		};

		const out = await fetchPage(awesomenessRequest, {});

		expect(out).toEqual({ ok: true });
		expect(mocks.componentDependencies).toHaveBeenCalledTimes(1);

		const inferred = [ ...new Set(mocks.componentDependencies.mock.calls[0][0]) ].sort();

		console.log("fetchPage inferred components", inferred);

		expect(inferred).toEqual(expectedComponents);
	
	});

	it("still infers init.js components when page js rebuild is skipped", async () => {

		const awesomenessRequest = {
			site: "site-a",
			pageRoute: "home",
			meta: {
				pages: {
					home: "1.0.0",
				},
				components: {},
			},
			updatedMeta: {
				pages: {},
				components: {},
			},
			user: {
				permissions: [ "*" ],
			},
		};

		const out = await fetchPage(awesomenessRequest, {});

		expect(out).toEqual({ ok: true });
		expect(mocks.componentDependencies).toHaveBeenCalledTimes(1);

		const inferred = [ ...new Set(mocks.componentDependencies.mock.calls[0][0]) ].sort();

		console.log("fetchPage inferred components (cached page)", inferred);

		expect(inferred).toEqual(expectedComponents);
	
	});

	it("works when about.components is omitted and still infers from page files", async () => {

		mocks.pageInfo.mockResolvedValueOnce({
			about: {
				version: "1.0.0",
				permissions: [],
			},
			cssPath,
			jsPath,
			getData: async () => ({ ok: true }),
		});

		const awesomenessRequest = buildRequest();
		const out = await fetchPage(awesomenessRequest, {});

		expect(out).toEqual({ ok: true });
		expect(mocks.componentDependencies).toHaveBeenCalledTimes(1);

		const inferred = [ ...new Set(mocks.componentDependencies.mock.calls[0][0]) ].sort();

		console.log("fetchPage inferred components (no about.components)", inferred);

		expect(inferred).toEqual([
			"app",
			"cardMain",
			"cardMount",
			"pageInit",
			"pageScript",
			"pageWidget",
		]);
		expect(inferred).not.toContain("card");
	
	});

	it("shows batch timing with cache retained vs cache cleared", async () => {

		const requestRuns = 75;

		clearComponentAndPageMemory();
		mocks.componentDependencies.mockClear();

		const retainedStart = performance.now();

		for (let i = 0; i < requestRuns; i++) {

			await fetchPage(buildRequest(), {});
		
		}

		const retainedMs = performance.now() - retainedStart;

		clearComponentAndPageMemory();
		mocks.componentDependencies.mockClear();

		const clearedStart = performance.now();

		for (let i = 0; i < requestRuns; i++) {

			clearComponentAndPageMemory();
			await fetchPage(buildRequest(), {});
		
		}

		const clearedMs = performance.now() - clearedStart;
		const ratioRetainedToCleared = retainedMs / clearedMs;

		console.log("fetchPage batch cache benchmark", {
			requestRuns,
			retainedMs,
			clearedMs,
			ratioRetainedToCleared,
		});

		expect(retainedMs).toBeLessThanOrEqual(clearedMs * 1.5);
	
	});

	it("handles pages with dashes in their names (uses bracket notation)", async () => {

		const awesomenessRequest = {
			site: "site-a",
			pageRoute: "mortgage-calculator",
			meta: {
				pages: {},
				components: {},
			},
			updatedMeta: {
				pages: {},
				components: {},
			},
			user: {
				permissions: [ "*" ],
			},
		};

		// Simulate pageInfo for a page with a dash in the name
		mocks.pageInfo.mockResolvedValueOnce({
			about: {
				version: "1.0.0",
				permissions: [],
				components: [ "card" ],
			},
			cssPath,
			jsPath,
			getData: async () => ({ ok: true }),
		});

		const out = await fetchPage(awesomenessRequest, {});

		expect(out).toEqual({ ok: true });
		expect(mocks.componentDependencies).toHaveBeenCalledTimes(1);

		// The test here is mainly to ensure no error is thrown and the call completes
		// For deeper validation, you could spy on the namespace init logic if exposed

	});

});
