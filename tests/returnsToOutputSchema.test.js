import { describe, expect, it } from "vitest";
import returnsToOutputSchema from "../src/returnsToOutputSchema.js";

describe("returnsToOutputSchema", () => {

	it("returns null for stub or missing returns", () => {

		expect(returnsToOutputSchema(undefined)).toBeNull();
		expect(returnsToOutputSchema({})).toBeNull();
		expect(returnsToOutputSchema({ key: "value" })).toBeNull();

	});

	it("converts a bare field map the same way as inputSchema", () => {

		expect(returnsToOutputSchema({
			echoed: {
				type: "string",
				required: true,
				description: "the echoed text"
			}
		})).toEqual({
			type: "object",
			properties: {
				echoed: {
					type: "string",
					description: "the echoed text"
				}
			},
			required: [ "echoed" ]
		});

	});

	it("converts a wrapped object schema and skips a non-object root", () => {

		expect(returnsToOutputSchema({
			type: "object",
			properties: {
				echoed: { type: "string" }
			}
		})).toEqual({
			type: "object",
			properties: {
				echoed: { type: "string" }
			}
		});
		expect(returnsToOutputSchema({
			type: "array",
			items: { type: "string" }
		})).toBeNull();

	});

});
