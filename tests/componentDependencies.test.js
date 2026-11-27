import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearComponentAndPageMemory } from "../src/componentAndPageMemory.js";

const mocks = vi.hoisted(() => ({
	getConfig: vi.fn(),
}));

vi.mock("../src/getConfig.js", () => ({
	default: mocks.getConfig,
}));

import componentDependencies from "../src/componentDependencies.js";

describe("componentDependencies", () => {

	let tempRoot;

	function writeComponentFile(componentName, relativeFilePath, content) {

		const filePath = path.join(tempRoot, componentName, relativeFilePath);

		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		fs.writeFileSync(filePath, content);

	}

	beforeEach(() => {

		clearComponentAndPageMemory();
		tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "awes-component-deps-"));
		mocks.getConfig.mockReturnValue({});

	});

	afterEach(() => {

		clearComponentAndPageMemory();
		fs.rmSync(tempRoot, {
			recursive: true,
			force: true 
		});
		vi.clearAllMocks();

	});

	it("recursively resolves transitive dependencies through nested component files", () => {

		writeComponentFile("alpha", "index.js", `export default function alpha() {
	ui.beta.start();
	return true;
}`);

		writeComponentFile("beta", path.join("nested", "index.js"), `export default function betaNested() {
	ui.gamma.mount();
	return true;
}`);

		writeComponentFile("gamma", path.join("deeper", "bridge.js"), `export default function gammaBridge() {
	ui.delta.render();
	return true;
}`);

		writeComponentFile("delta", "index.js", `export default function delta() {
	return "done";
}`);

		const out = componentDependencies([ "alpha" ], {
			componentLocations: [ pathToFileURL(tempRoot + path.sep) ],
			namespace: "ui",
		});

		expect(Object.keys(out).sort()).toEqual([ "alpha", "beta", "delta", "gamma" ]);
		expect(out.alpha.js).toContain("ui.alpha = function alpha()");
		expect(out.beta.js).toContain("ui.beta.nested = function betaNested()");
		expect(out.gamma.js).toContain("ui.gamma.deeper.bridge = function gammaBridge()");
		expect(out.delta.js).toContain("ui.delta = function delta()");

	});


	it("names dotted file names with bracket notation and adds parent inits without junk objects", () => {

		writeComponentFile("widget", "index.js", `export default function widget() {
	return true;
}`);

		writeComponentFile("widget", "helper.iif.js", `(()=>{
	return true;
})();`);

		writeComponentFile("widget", path.join("deep", "inner", "run.js"), `export default function run() {
	return true;
}`);

		const out = componentDependencies([ "widget" ], {
			componentLocations: [ pathToFileURL(tempRoot + path.sep) ],
			namespace: "ui",
			showDetails: true,
		});

		expect(Object.keys(out.widget.js_details)).toEqual([
			"ui.widget",
			"ui.widget.deep",
			"ui.widget.deep.inner",
			"ui.widget.deep.inner.run",
			"ui.widget[\"helper.iif\"]",
		]);
		expect(out.widget.js_details["ui.widget.deep"]).toBe("ui.widget.deep = ui.widget.deep || {}; ");
		expect(out.widget.js).toContain("ui.widget.deep.inner.run = function run()");
		expect(out.widget.js).not.toContain("ui.widget.helper");

	});

});