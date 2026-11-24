export default function isStubReturns(returns) {

	if(!returns || typeof returns !== 'object' || Array.isArray(returns)){

		return true;

	}

	if(returns.type !== undefined
		|| returns.properties !== undefined
		|| returns.items !== undefined
		|| returns.description !== undefined){

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

		return value.type !== undefined
			|| value.properties !== undefined
			|| value.items !== undefined
			|| value.description !== undefined;

	});

}
