import { describe, expect, it } from "vitest";
import infoToJsonSchema from "../src/infoToJsonSchema.js";

describe("infoToJsonSchema", () => {

	it("converts the _info dialect to JSON Schema", () => {

		const schema = infoToJsonSchema({
			type: "object",
			properties: {
				id: {
					type: "uuid",
					required: true,
					description: "post id"
				},
				when: { type: "timestamp" },
				status: {
					type: "string",
					validValues: [ "idea", "draft" ],
					default: "idea"
				},
				title: {
					type: "string",
					minLength: 1,
					maxLength: 100,
					default: null,
					example: "Hi"
				},
				link: {
					type: "string",
					format: "url"
				},
				tags: {
					type: "array",
					items: {
						type: "string",
						maxLength: 10
					}
				},
				count: {
					type: "integer",
					required: false
				},
			},
		});

		expect(schema.type).toBe("object");
		expect(schema.required).toEqual([ "id" ]);
		expect(schema.properties.id).toEqual({
			type: "string",
			format: "uuid",
			description: "post id"
		});
		expect(schema.properties.when).toEqual({
			type: "string",
			format: "date-time"
		});
		expect(schema.properties.status).toEqual({
			type: "string",
			default: "idea",
			enum: [ "idea", "draft" ]
		});
		expect(schema.properties.title).toEqual({
			type: "string",
			minLength: 1,
			maxLength: 100,
			examples: [ "Hi" ]
		});
		expect(schema.properties.link.format).toBe("uri");
		expect(schema.properties.tags).toEqual({
			type: "array",
			items: {
				type: "string",
				maxLength: 10
			}
		});
		expect(schema.properties.count).toEqual({ type: "integer" });

	});

	it("treats empty or missing properties as an empty object schema", () => {

		expect(infoToJsonSchema({})).toEqual({
			type: "object",
			properties: {}
		});
		expect(infoToJsonSchema(undefined)).toEqual({
			type: "object",
			properties: {}
		});

	});

	it("wraps a bare field map", () => {

		const schema = infoToJsonSchema({
			name: {
				type: "string",
				required: true
			}
		});

		expect(schema).toEqual({
			type: "object",
			properties: { name: { type: "string" } },
			required: [ "name" ]
		});

	});

});
