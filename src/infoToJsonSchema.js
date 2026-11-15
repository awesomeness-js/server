import toJsonSchemaNode from './toJsonSchemaNode.js';

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
