export default function(sizes = [
	'xl',
	'd',
	't',
	'p'
]) {

	let data = ` `;

	// dynamic display
	data += ".hidden {display: none !important;} ";
	data += ".fl{float:left !important;} ";
	data += ".fr{float:right !important;} ";
	data += ".m0a{margin: 0 auto;} ";

	// cursor pointer
	data += ".cursor-pointer {cursor: pointer !important;} ";
	data += ".cursor-default {cursor: default !important;} ";

	// position
	data += ".absolute {position:absolute !important;} ";
	data += ".relative {position:relative !important;} ";
	data += ".fixed {position:fixed !important;} ";
	data += ".sticky {position:sticky !important;} ";

	
	sizes.forEach((s) => {

		data += `.app-size-${s} .hidden-${s} {display: none !important;} `;

		data += `.app-size-${s} .cursor-pointer-${s} {cursor: pointer !important;} `;
		data += `.app-size-${s} .cursor-default${s} {cursor: default !important;} `;

		data += `.app-size-${s} .fl {float:left !important;} `;
		data += `.app-size-${s} .fr {float:right !important;} `;

		data += `.app-size-${s} .absolute {position:absolute !important;} `;
		data += `.app-size-${s} .relative {position:relative !important;} `;
		data += `.app-size-${s} .fixed {position:fixed !important;} `;
		data += `.app-size-${s} .sticky {position:sticky !important;} `;


	});
	

	return data;

}
