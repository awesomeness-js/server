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


	it("keeps additionalProperties as a map type, recursively", () => {

		const schema = infoToJsonSchema({
			type: "object",
			properties: {
				bookData: {
					type: "object",
					description: "keyed by book code",
					additionalProperties: {
						type: "object",
						properties: {
							title: { type: "string" },
							chapters: {
								type: "array",
								items: {
									type: "object",
									additionalProperties: { type: "integer" }
								}
							}
						}
					}
				},
				extra: {
					type: "object",
					additionalProperties: true
				},
				closed: {
					type: "object",
					additionalProperties: false
				},
				bare: {
					additionalProperties: { type: "string" }
				}
			}
		});

		expect(schema.properties.bookData).toEqual({
			type: "object",
			description: "keyed by book code",
			additionalProperties: {
				type: "object",
				properties: {
					title: { type: "string" },
					chapters: {
						type: "array",
						items: {
							type: "object",
							additionalProperties: { type: "integer" }
						}
					}
				}
			}
		});
		expect(schema.properties.extra).toEqual({
			type: "object",
			additionalProperties: true
		});
		expect(schema.properties.closed).toEqual({
			type: "object",
			additionalProperties: false
		});
		expect(schema.properties.bare).toEqual({
			type: "object",
			additionalProperties: { type: "string" }
		});

	});

	it("turns nullable: true and type arrays into JSON Schema type arrays", () => {

		const schema = infoToJsonSchema({
			type: "object",
			properties: {
				first: {
					type: "string",
					nullable: true,
					description: "first value"
				},
				imageThumb: {
					type: [ "string", "null" ]
				},
				id: {
					type: [ "uuid", "null" ],
					required: true
				},
				when: {
					type: "timestamp",
					nullable: true
				},
				blob: {
					type: "buffer",
					nullable: true
				},
				status: {
					type: "string",
					nullable: true,
					validValues: [ "a", "b" ]
				},
				either: {
					type: [ "string", "integer", "null" ]
				},
				nothing: {
					type: "null"
				},
				plain: {
					type: "string",
					nullable: false
				},
				loose: {
					nullable: true,
					description: "any value"
				},
				user: {
					type: [ "object", "null" ],
					properties: {
						name: {
							type: "string",
							nullable: true
						}
					}
				},
				names: {
					type: "array",
					items: {
						type: "string",
						nullable: true
					}
				}
			}
		});

		expect(schema.required).toEqual([ "id" ]);
		expect(schema.properties.first).toEqual({
			type: [ "string", "null" ],
			description: "first value"
		});
		expect(schema.properties.imageThumb).toEqual({ type: [ "string", "null" ] });
		expect(schema.properties.id).toEqual({
			type: [ "string", "null" ],
			format: "uuid"
		});
		expect(schema.properties.when).toEqual({
			type: [ "string", "null" ],
			format: "date-time"
		});
		expect(schema.properties.blob).toEqual({
			type: [ "string", "null" ],
			contentEncoding: "base64"
		});
		expect(schema.properties.status).toEqual({
			type: [ "string", "null" ],
			enum: [ "a", "b", null ]
		});
		expect(schema.properties.either).toEqual({ type: [ "string", "integer", "null" ] });
		expect(schema.properties.nothing).toEqual({ type: "null" });
		expect(schema.properties.plain).toEqual({ type: "string" });
		expect(schema.properties.loose).toEqual({ description: "any value" });
		expect(schema.properties.user).toEqual({
			type: [ "object", "null" ],
			properties: {
				name: { type: [ "string", "null" ] }
			}
		});
		expect(schema.properties.names).toEqual({
			type: "array",
			items: { type: [ "string", "null" ] }
		});

	});

	it("converts oneOf and anyOf members recursively", () => {

		const schema = infoToJsonSchema({
			type: "object",
			properties: {
				sharedWith: {
					description: "the edge, or true when removed",
					oneOf: [
						{
							type: "object",
							properties: {
								id: {
									type: "uuid",
									required: true
								}
							}
						},
						{ type: "boolean" },
						{ type: "null" }
					]
				},
				list: {
					type: "array",
					items: {
						anyOf: [
							{
								type: "string",
								nullable: true
							},
							{
								type: "object",
								additionalProperties: { type: "integer" }
							}
						]
					}
				}
			}
		});

		expect(schema.properties.sharedWith).toEqual({
			description: "the edge, or true when removed",
			oneOf: [
				{
					type: "object",
					properties: {
						id: {
							type: "string",
							format: "uuid"
						}
					},
					required: [ "id" ]
				},
				{ type: "boolean" },
				{ type: "null" }
			]
		});
		expect(schema.properties.list).toEqual({
			type: "array",
			items: {
				anyOf: [
					{ type: [ "string", "null" ] },
					{
						type: "object",
						additionalProperties: { type: "integer" }
					}
				]
			}
		});

	});

});
