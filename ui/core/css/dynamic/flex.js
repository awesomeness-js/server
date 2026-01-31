export default function(sizes = [
	'xl',
	'd',
	't',
	'p'
], max = 12) {

	let data = ` `;

	// dynamic display
	data += ".flex { display: flex; } ";
	data += ".flex-wrap { flex-wrap: wrap; } ";
	
	for (let i = 1; i <= max; i++) {

		// float
		data += `.flex-${i} { flex:${i} ; } `;
	
	}

	sizes.forEach((s) => {

		for (let i = 1; i <= max; i++) {

			// float
			data += `.app-size-${s} .flex-${i}-${s} { flex:${i} ; } `;
			data += `.app-size-${s} .flex-wrap-${s} { flex-wrap: wrap; } `;

		}

	});
	

	return data;

}
