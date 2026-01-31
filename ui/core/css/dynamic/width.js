export default function(sizes = [
	'xl',
	'd',
	't',
	'p'
]) {

	let data = ` `;

	// dynamic width
	for (let i = 1; i <= 100; i++) {

		// float
		data += `.width${i} { width:${i}%; } `;
		sizes.forEach((s) => {

			data += `.app-size-${s} .width${i}-${s} { width:${i}%; } `;
		
		});

	}

	// dynamic height
	for (let i = 1; i <= 1000; i++) {

		// float
		data += `.height${i} { height:${i}%; } `;
		sizes.forEach((s) => {

			data += `.app-size-${s} .height${i}-${s} { height:${i}%; } `;
		
		});

	}


	for (let i = 5; i <= 2000; i += 5) {
		
		// max width
		data += `.width-${i} { width:${i}px; } `;
		data += `.height-${i} { height:${i}px; } `;
		data += `.max-width-${i} { max-width:${i}px; } `;
		data += `.min-width-${i} { min-width:${i}px; } `;
		data += `.max-height-${i} { max-height:${i}px; } `;
		data += `.min-height-${i} { min-height:${i}px; } `;

		sizes.forEach((s) => {

			data += `.app-size-${s} .width-${i}-${s} { width:${i}px; } `;
			data += `.app-size-${s} .height-${i}-${s} { height:${i}px; } `;
			data += `.app-size-${s} .max-width-${i}-${s} { max-width:${i}px; } `;
			data += `.app-size-${s} .min-width-${i}-${s} { min-width:${i}px; } `;
			data += `.app-size-${s} .max-height-${i}-${s} { max-height:${i}px; } `;
			data += `.app-size-${s} .min-height-${i}-${s} { min-height:${i}px; } `;
		
		});

	}


	// span 1 - 12
	for (let i = 1; i <= 12; i++) {

		data += `.span${i} { width:${i / 12 * 100}%; } `;
		sizes.forEach((s) => {

			data += `.app-size-${s} .span${i}-${s} { width:${i / 12 * 100}%; } `;
		
		});
	
	}

	return data;

}
