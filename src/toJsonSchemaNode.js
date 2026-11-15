export default function toJsonSchemaNode(node = {}) {

	const formats = {
		uuid: 'uuid',
		timestamp: 'date-time',
	};
	const plainTypes = [ 'string', 'number', 'integer', 'boolean', 'object', 'array' ];
	const copyKeys = [ 'description', 'default', 'minLength', 'maxLength', 'minimum', 'maximum', 'minItems', 'maxItems', 'pattern' ];
	const out = {};

	if(formats[node.type]){

		out.type = 'string';
		out.format = formats[node.type];

	} else if(node.type === 'buffer'){

		out.type = 'string';
		out.contentEncoding = 'base64';

	} else if(plainTypes.includes(node.type)){

		out.type = node.type;

	}

	if(node.format && !out.format){

		out.format = node.format === 'url' ? 'uri' : node.format;

	}

	for(const key of copyKeys){

		if(node[key] !== undefined && node[key] !== null){

			out[key] = node[key];

		}

	}

	if(Array.isArray(node.validValues)){

		out.enum = node.validValues;

	}

	if(Array.isArray(node.examples)){

		out.examples = node.examples;

	} else if(node.example !== undefined){

		out.examples = [ node.example ];

	}

	if(node.properties && typeof node.properties === 'object'){

		out.type = 'object';
		out.properties = {};

		const required = [];

		for(const [ key, child ] of Object.entries(node.properties)){

			out.properties[key] = toJsonSchemaNode(child || {});

			if(child?.required === true){

				required.push(key);

			}

		}

		if(required.length){

			out.required = required;

		}

	}

	if(node.items && typeof node.items === 'object'){

		out.items = toJsonSchemaNode(node.items);

	}

	return out;

}
