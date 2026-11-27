const schemaKeys = [ 'type', 'properties', 'items', 'description', 'oneOf', 'anyOf', 'additionalProperties' ];

export default function isStubReturns(returns) {

	if(!returns || typeof returns !== 'object' || Array.isArray(returns)){

		return true;

	}

	if(schemaKeys.some((key) => returns[key] !== undefined)){

		return false;

	}

	const values = Object.values(returns);

	if(values.length === 0){

		return true;

	}

	return !values.some((value) => {

		if(!value || typeof value !== 'object' || Array.isArray(value)){

			return false;

		}

		return schemaKeys.some((key) => value[key] !== undefined);

	});

}
