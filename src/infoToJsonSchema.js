import toJsonSchemaNode from './toJsonSchemaNode.js';

// The MCP inputSchema for a route: its _info.properties as a JSON Schema object.
// Accepts the usual { type: 'object', properties: {...} } shape, a bare field map, or nothing.
export default function infoToJsonSchema(properties) {

	const wrapped = properties?.type === 'object' || (properties?.properties && typeof properties.properties === 'object');

	const schema = toJsonSchemaNode(wrapped ? properties : {
		type: 'object',
		properties: properties || {},
	});

	schema.type = 'object';
	schema.properties = schema.properties || {};

	return schema;

}
