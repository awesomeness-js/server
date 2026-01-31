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

	// dynamic margin
	for( let i = 0; i < pixels; i += 5 ){

		data += `.gap-${i} { gap:${i}px; } `;

		data += `.m${i} { margin:${i}px; } `;
		data += `.mt${i} { margin-top:${i}px; } `;
		data += `.mb${i} { margin-bottom:${i}px; } `;
		data += `.ml${i} { margin-left:${i}px; } `;
		data += `.mr${i} { margin-right:${i}px; } `;
		data += `.mtb${i} { margin-top:${i}px; margin-bottom:${i}px; } `;
		data += `.mlr${i} { margin-left:${i}px; margin-right:${i}px; } `;

		data += `.p${i} { padding:${i}px; } `;
		data += `.pt${i} { padding-top:${i}px; } `;
		data += `.pb${i} { padding-bottom:${i}px; } `;
		data += `.pl${i} { padding-left:${i}px; } `;
		data += `.pr${i} { padding-right:${i}px; } `;
		data += `.ptb${i} { padding-top:${i}px; padding-bottom:${i}px; } `;
		data += `.plr${i} { padding-left:${i}px; padding-right:${i}px; } `;

		sizes.forEach((s) => {

			data += `.app-size-${s} .gap-${i}-${s} { gap:${i}px; } `;

			data += `.app-size-${s} .m${i}-${s} { margin:${i}px; } `;
			data += `.app-size-${s} .mt${i}-${s} { margin-top:${i}px; } `;
			data += `.app-size-${s} .mr${i}-${s} { margin-right:${i}px; } `;
			data += `.app-size-${s} .mb${i}-${s} { margin-bottom:${i}px; } `;
			data += `.app-size-${s} .ml${i}-${s} { margin-left:${i}px; } `;
			data += `.app-size-${s} .mtb${i}-${s} { margin-top:${i}px; margin-bottom:${i}px; } `;
			data += `.app-size-${s} .mlr${i}-${s} { margin-left:${i}px; margin-right:${i}px; } `;


			data += `.app-size-${s} .p${i}-${s} { padding:${i}px; } `;
			data += `.app-size-${s} .pt${i}-${s} { padding-top:${i}px; } `;
			data += `.app-size-${s} .pr${i}-${s} { padding-right:${i}px; } `;
			data += `.app-size-${s} .pb${i}-${s} { padding-bottom:${i}px; } `;
			data += `.app-size-${s} .pl${i}-${s} { padding-left:${i}px; } `;
			data += `.app-size-${s} .ptb${i}-${s} { padding-top:${i}px; padding-bottom:${i}px; } `;
			data += `.app-size-${s} .plr${i}-${s} { padding-left:${i}px; padding-right:${i}px; } `;
		
		});

	}

	return data;

}
