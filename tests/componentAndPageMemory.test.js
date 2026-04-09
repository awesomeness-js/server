import path from "path";
import { performance } from "perf_hooks";
import { describe, expect, it } from "vitest";

import componentAndPageMemory, { clearComponentAndPageMemory,
	extractUiRefsFromFileMemoized,
	extractUiRefsMemoized,
	getComponentAndPageMemoryStatus, } from "../src/componentAndPageMemory.js";

describe("componentAndPageMemory", () => {

	const fixturesRoot = path.join(
		process.cwd(),
		"tests",
		"fixtures",
		"site-and-components"
	);
	const siteInitPath = path.join(
		fixturesRoot,
		"sites",
		"site-a",
		"pages",
		"home",
		"init.js"
	);
	const siteJsPath = path.join(
		fixturesRoot,
		"sites",
		"site-a",
		"pages",
		"home",
		"js",
		"index.js"
	);
	const componentJsPath = path.join(
		fixturesRoot,
		"components",
		"card",
		"index.js"
	);

	it("exports a default API object", () => {

		expect(componentAndPageMemory).toBeTruthy();
		expect(typeof componentAndPageMemory.readFileMemoized).toBe("function");
		expect(typeof componentAndPageMemory.extractUiRefsMemoized).toBe("function");
		expect(typeof componentAndPageMemory.extractUiRefsFromFileMemoized).toBe("function");
		expect(typeof componentAndPageMemory.clearComponentAndPageMemory).toBe("function");
		expect(typeof componentAndPageMemory.getComponentAndPageMemoryStatus).toBe("function");
	
	});

	it("returns useful status/debug information", () => {

		clearComponentAndPageMemory();
		const initComponents = extractUiRefsFromFileMemoized(siteInitPath, {
			namespace: "ui",
			includeDotAccess: true,
		});
		const pageJsComponents = extractUiRefsFromFileMemoized(siteJsPath, {
			namespace: "ui",
			includeDotAccess: true,
		});
		const cardComponents = extractUiRefsFromFileMemoized(componentJsPath, {
			namespace: "ui",
			includeDotAccess: true,
		});
		const gatheredComponents = [ ...new Set([
			"card",
			...initComponents,
			...pageJsComponents,
			...cardComponents,
		]) ].sort();

		expect(initComponents).toEqual(expect.arrayContaining([ "pageInit", "pageWidget" ]));
		expect(pageJsComponents).toEqual(expect.arrayContaining([ "pageScript" ]));
		expect(cardComponents).toEqual(expect.arrayContaining([ "cardMain", "cardMount" ]));
		expect(extractUiRefsMemoized("ui.inlineOnly();", { namespace: "ui" })).toEqual([ "inlineOnly" ]);

		console.log("components gathered", gatheredComponents);
		expect(gatheredComponents).toEqual([
			"card",
			"cardMain",
			"cardMount",
			"pageInit",
			"pageScript",
			"pageWidget",
		]);

		const status = getComponentAndPageMemoryStatus({
			includeKeys: true,
			sampleSize: 10,
		});

		console.log("componentAndPageMemory status", status);

		expect(status.counts.fileCacheEntries).toBeGreaterThanOrEqual(1);
		expect(status.counts.refsCacheEntries).toBeGreaterThanOrEqual(4);
		expect(status.approximateBytes.totalCacheBytes).toBeGreaterThan(0);
		expect(status.processMemoryUsage).toBeTruthy();
		expect(status.keys.fileCacheKeys).toEqual(expect.arrayContaining([
			siteInitPath,
			siteJsPath,
			componentJsPath,
		]));
		expect(status.keys.refsCacheKeys.length).toBeGreaterThan(0);
		clearComponentAndPageMemory();
	
	});

	it("shows cold hit vs warm hit timing", () => {

		const coldRuns = 25;
		const warmRuns = 250;

		let coldTotalMs = 0;

		for (let i = 0; i < coldRuns; i++) {

			clearComponentAndPageMemory();

			const coldStart = performance.now();

			extractUiRefsFromFileMemoized(componentJsPath, {
				namespace: "ui",
				includeDotAccess: true,
			});

			coldTotalMs += performance.now() - coldStart;
		
		}

		clearComponentAndPageMemory();
		extractUiRefsFromFileMemoized(componentJsPath, {
			namespace: "ui",
			includeDotAccess: true,
		});

		const warmStart = performance.now();

		for (let i = 0; i < warmRuns; i++) {

			extractUiRefsFromFileMemoized(componentJsPath, {
				namespace: "ui",
				includeDotAccess: true,
			});
		
		}

		const warmTotalMs = performance.now() - warmStart;
		const coldAvgMs = coldTotalMs / coldRuns;
		const warmAvgMs = warmTotalMs / warmRuns;

		console.log("componentAndPageMemory cold vs warm", {
			coldRuns,
			warmRuns,
			coldTotalMs,
			warmTotalMs,
			coldAvgMs,
			warmAvgMs,
			ratioWarmToCold: warmAvgMs / coldAvgMs,
		});

		// Warm hits should typically be faster or close to cold hits in CI/VM environments.
		expect(warmAvgMs).toBeLessThanOrEqual(coldAvgMs * 1.5);

		clearComponentAndPageMemory();
	
	});

});
