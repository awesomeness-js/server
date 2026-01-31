export default function({
	sizes = [
		'xl',
		'd',
		't',
		'p'
	],
	pixels = 126
} = {}) {

	let data = ` `;

	const grids = 12;

	data += `.grid { display: grid; grid-template-columns: auto auto; } `;
	
	// justify
	data += `.justify-center { justify-content: center; } `;
	data += `.justify-start { justify-content: start; } `;
	data += `.justify-end { justify-content: end; } `;
	data += `.justify-between { justify-content: space-between; } `;
	data += `.justify-around { justify-content: space-around; } `;
	data += `.justify-evenly { justify-content: space-evenly; } `;

	// align
	data += `.align-center { align-items: center; } `;
	data += `.align-start { align-items: start; } `;
	data += `.align-end { align-items: end; } `;
	data += `.align-baseline { align-items: baseline; } `;
	data += `.align-stretch { align-items: stretch; } `;

	// justify-items
	data += `.justify-items-start { justify-items: start; } `;
	data += `.justify-items-center { justify-items: center; } `;
	data += `.justify-items-end { justify-items: end; } `;
	data += `.justify-items-stretch { justify-items: stretch; } `;

	// justify
	data += `.grid.center { justify-self: center; } `;
	data += `.grid.left { justify-self: start; } `;
	data += `.grid.right { justify-self: end; } `;

	data += `.justify-self-center { justify-self: center; } `;
	data += `.justify-self-left { justify-self: start; } `;
	data += `.justify-self-right { justify-self: end; } `;


	data += `.span-full { grid-column: 1 / -1; } `;
	data += `.row-span-full { grid-row: 1 / -1; } `;

	sizes.forEach((s) => {

		data += `.app-size-${s} .grid.center-${s} { justify-self: center; } `;
		data += `.app-size-${s} .grid.left-${s} { justify-self: start; } `;
		data += `.app-size-${s} .grid.right-${s} { justify-self: end; } `;

		data += `.app-size-${s} .justify-self-center-${s} { justify-self: center; } `;
		data += `.app-size-${s} .justify-self-start-${s} { justify-self: start; } `;
		data += `.app-size-${s} .justify-self-end-${s} { justify-self: end; } `;

		data += `.app-size-${s} .span-full-${s} { grid-column: 1 / -1; } `;
		data += `.app-size-${s} .row-span-full-${s} { grid-row: 1 / -1; } `;

		// justify
		data += `.app-size-${s} .justify-center-${s} { justify-content: center; } `;
		data += `.app-size-${s} .justify-start-${s} { justify-content: start; } `;
		data += `.app-size-${s} .justify-end-${s} { justify-content: end; } `;
		data += `.app-size-${s} .justify-between-${s} { justify-content: space-between; } `;
		data += `.app-size-${s} .justify-around-${s} { justify-content: space-around; } `;
		data += `.app-size-${s} .justify-evenly-${s} { justify-content: space-evenly; } `;

		// justify-items
		data += `.app-size-${s} .justify-items-start-${s} { justify-items: start; } `;
		data += `.app-size-${s} .justify-items-center-${s} { justify-items: center; } `;
		data += `.app-size-${s} .justify-items-end-${s} { justify-items: end; } `;
		data += `.app-size-${s} .justify-items-stretch-${s} { justify-items: stretch; } `;

		// align
		data += `.app-size-${s} .align-center-${s} { align-items: center; } `;
		data += `.app-size-${s} .align-start-${s} { align-items: start; } `;
		data += `.app-size-${s} .align-end-${s} { align-items: end; } `;
		data += `.app-size-${s} .align-baseline-${s} { align-items: baseline; } `;
		data += `.app-size-${s} .align-stretch-${s} { align-items: stretch; } `;

	});
	
	
	for (let i = 1; i <= grids; i++) {
		
		// cols
		data += `.grid-${i} { display: grid; grid-template-columns: repeat(${i}, 1fr); } `;

		// spans 
		data += `.span-${i} { grid-column: span ${i} / span ${i}; } `;

		// start
		data += `.start-${i} { grid-column-start: ${i}; } `;

		// end
		data += `.end-${i} { grid-column-end: ${i}; } `;

		// rows
		data += `.grid-rows-${i} { grid-template-rows: repeat(${i}, 1fr); } `;

		// spans
		data += `.row-span-${i} { grid-row: span ${i} / span ${i}; } `;

		// start
		data += `.row-start-${i} { grid-row-start: ${i}; } `;

		// end
		data += `.row-end-${i} { grid-row-end: ${i}; } `;
		
		// order
		data += `.order-${i} { order: ${i}; } `;

		
		sizes.forEach((s) => {

			// cols
			data += `.app-size-${s} .grid-${i}-${s} { display: grid; grid-template-columns: repeat(${i}, 1fr); } `;
			
			// spans 
			data += `.app-size-${s} .span-${i}-${s} { grid-column: span ${i} / span ${i}; } `;

			// start
			data += `.app-size-${s} .start-${i}-${s} { grid-column-start: ${i}; } `;

			// end
			data += `.app-size-${s} .end-${i}-${s} { grid-column-end: ${i}; } `;

			// rows
			data += `.app-size-${s} .grid-rows-${i}-${s} { grid-template-rows: repeat(${i}, 1fr); } `;

			// spans
			data += `.app-size-${s} .row-span-${i}-${s} { grid-row: span ${i} / span ${i}; } `;

			// start
			data += `.app-size-${s} .row-start-${i}-${s} { grid-row-start: ${i}; } `;

			// end
			data += `.app-size-${s} .row-end-${i}-${s} { grid-row-end: ${i}; } `;

			// order
			data += `.app-size-${s} .order-${i}-${s} { order: ${i}; } `;

		});
	
	}

	// add and extra for start and end for both col and row
	data += `.start-${grids +1} { grid-column-start: ${grids +1}; } `;
	data += `.end-${grids +1} { grid-column-end: ${grids +1}; } `;

	sizes.forEach((s) => {

		data += `.app-size-${s} .start-${grids +1}-${s} { grid-column-start: ${grids +1}; } `;
		data += `.app-size-${s} .end-${grids +1}-${s} { grid-column-end: ${grids +1}; } `;
	
	});


	// gap
	for(let i = 1; i <= pixels; i++) {

		data += `.gap-${i} { gap: ${i}px; } `;
		data += `.gap-x-${i} { column-gap: ${i}px; } `;
		data += `.gap-y-${i} { row-gap: ${i}px; } `;

		sizes.forEach((s) => {

			data += `.app-size-${s} .gap-${i}-${s} { gap: ${i}px; } `;
			data += `.app-size-${s} .gap-x-${i}-${s} { column-gap: ${i}px; } `;
			data += `.app-size-${s} .gap-y-${i}-${s} { row-gap: ${i}px; } `;
		
		});

	}


	data += ` `;

	return data;

}
