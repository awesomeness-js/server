import isStubReturns from './isStubReturns.js';
import infoToJsonSchema from './infoToJsonSchema.js';

/**
 * @param {object} [returns]
 * @returns {object | null}
 */
export default function returnsToOutputSchema(returns) {

	if(isStubReturns(returns) || (returns.type && returns.type !== 'object')){

		return null;

	}

	return infoToJsonSchema(returns);

}
