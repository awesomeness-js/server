import { describe, expect, it } from "vitest";
import isStubReturns from "../src/isStubReturns.js";

describe("isStubReturns", () => {

	it("treats missing, empty, and template stubs as stubs", () => {

		expect(isStubReturns(undefined)).toBe(true);
		expect(isStubReturns(null)).toBe(true);
		expect(isStubReturns({})).toBe(true);
		expect(isStubReturns({ key: "value" })).toBe(true);
		expect(isStubReturns("nope")).toBe(true);
		expect(isStubReturns([ { type: "string" } ])).toBe(true);

	});

	it("treats a bare field map and a wrapped object schema as real", () => {

		expect(isStubReturns({
			echoed: {
				type: "string",
				required: true
			}
		})).toBe(false);
		expect(isStubReturns({
			type: "object",
			properties: {
				echoed: { type: "string" }
			}
		})).toBe(false);

	});


	it("treats a field that only uses oneOf, anyOf, or additionalProperties as real", () => {

		expect(isStubReturns({ sharedWith: { oneOf: [ { type: "boolean" } ] } })).toBe(false);
		expect(isStubReturns({ sharedWith: { anyOf: [ { type: "boolean" } ] } })).toBe(false);
		expect(isStubReturns({ prayers: { additionalProperties: { type: "object" } } })).toBe(false);
		expect(isStubReturns({ oneOf: [ { type: "object" } ] })).toBe(false);

	});

});
