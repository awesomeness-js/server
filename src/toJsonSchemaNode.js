export default function toJsonSchemaNode(node = {}) {

	const formats = {
		uuid: 'uuid',
		timestamp: 'date-time',
	};
	const plainTypes = [ 'string', 'number', 'integer', 'boolean', 'object', 'array' ];
	const copyKeys = [ 'description', 'default', 'minLength', 'maxLength', 'minimum', 'maximum', 'minItems', 'maxItems', 'pattern' ];
	const types = Array.isArray(node.type) ? node.type : [ node.type ];
	const baseTypes = types.filter((type) => type !== undefined && type !== 'null');
	const baseType = baseTypes[0];
	const nullable = node.nullable === true || types.includes('null');
	const out = {};

	if(baseTypes.length > 1){

		const mapped = [ ...new Set(baseTypes.map((type) => {

			if(formats[type] || type === 'buffer'){

				return 'string';

			}

			return plainTypes.includes(type) ? type : null;

		}).filter(Boolean)) ];

		if(mapped.length){

			out.type = mapped.length === 1 ? mapped[0] : mapped;

		}

	} else if(formats[baseType]){

		out.type = 'string';
		out.format = formats[baseType];

	} else if(baseType === 'buffer'){

		out.type = 'string';
		out.contentEncoding = 'base64';

	} else if(plainTypes.includes(baseType)){

		out.type = baseType;

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

	if(typeof node.additionalProperties === 'boolean'){

		out.additionalProperties = node.additionalProperties;

	} else if(node.additionalProperties && typeof node.additionalProperties === 'object'){

		out.type = out.type ?? 'object';
		out.additionalProperties = toJsonSchemaNode(node.additionalProperties);

	}

	if(node.items && typeof node.items === 'object'){

		out.items = toJsonSchemaNode(node.items);

	}

	for(const key of [ 'oneOf', 'anyOf' ]){

		if(Array.isArray(node[key])){

			out[key] = node[key].map((child) => toJsonSchemaNode(child || {}));

		}

	}

	if(nullable){

		if(out.type !== undefined){

			out.type = [ ...[].concat(out.type), 'null' ];

		} else if(baseType === undefined && types.includes('null')){

			out.type = 'null';

		}

		if(out.enum && !out.enum.includes(null)){

			out.enum = [ ...out.enum, null ];

		}

	}

	return out;

}
