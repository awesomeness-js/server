export default function(sizes = [
	'xl',
	'd',
	't',
	'p'
]) {

	let data = ` `;

	data += `.text-center {text-align:center !important;} `;
	data += `.text-left {text-align:left !important;} `;
	data += `.text-right {text-align:right !important;} `;

	data += `.text-300 {font-weight:300 !important;} `;
	data += `.text-400 {font-weight:400 !important;} `;
	data += `.text-500 {font-weight:500 !important;} `;
	data += `.text-600 {font-weight:600 !important;} `;
	data += `.text-700 {font-weight:700 !important;} `;
	data += `.text-800 {font-weight:800 !important;} `;
	data += `.text-900 {font-weight:900 !important;} `;

	data += `.text-300--hover:hover{font-weight:300 !important;} `;
	data += `.text-400--hover:hover{font-weight:400 !important;} `;
	data += `.text-500--hover:hover{font-weight:500 !important;} `;
	data += `.text-600--hover:hover{font-weight:600 !important;} `;
	data += `.text-700--hover:hover{font-weight:700 !important;} `;
	data += `.text-800--hover:hover{font-weight:800 !important;} `;
	data += `.text-900--hover:hover{font-weight:900 !important;} `;

	data += `.text-xxs {font-size:.70em !important;} `;
	data += `.text-xs {font-size:.83em !important;} `;
	data += `.text-s {font-size:.9em !important;} `;
	data += `.text-m {font-size:1.1em !important;} `;
	data += `.text-l {font-size:1.2em !important;} `;
	data += `.text-xl {font-size:1.4em !important;} `;
	data += `.text-xxl {font-size:1.6em !important;} `;
	data += `.text-xxxl {font-size:2em !important;} `;

	data += `.text-i {font-style:italic !important;} `;


	sizes.forEach((s) => {

		data += `.app-size-${s} .text-center-${s}{text-align:center !important;} `;
		data += `.app-size-${s} .text-left-${s}{text-align:left !important;} `;
		data += `.app-size-${s} .text-right-${s}{text-align:right !important;} `;

		data += `.app-size-${s} .text-300-${s}{font-weight:300 !important;} `;
		data += `.app-size-${s} .text-400-${s}{font-weight:400 !important;} `;
		data += `.app-size-${s} .text-500-${s}{font-weight:500 !important;} `;
		data += `.app-size-${s} .text-600-${s}{font-weight:600 !important;} `;
		data += `.app-size-${s} .text-700-${s}{font-weight:700 !important;} `;
		data += `.app-size-${s} .text-800-${s}{font-weight:800 !important;} `;
		data += `.app-size-${s} .text-900-${s}{font-weight:900 !important;} `;

		data += `.app-size-${s} .text-300-${s}--hover:hover{font-weight:300 !important;} `;
		data += `.app-size-${s} .text-400-${s}--hover:hover{font-weight:400 !important;} `;
		data += `.app-size-${s} .text-500-${s}--hover:hover{font-weight:500 !important;} `;
		data += `.app-size-${s} .text-600-${s}--hover:hover{font-weight:600 !important;} `;
		data += `.app-size-${s} .text-700-${s}--hover:hover{font-weight:700 !important;} `;
		data += `.app-size-${s} .text-800-${s}--hover:hover{font-weight:800 !important;} `;
		data += `.app-size-${s} .text-900-${s}--hover:hover{font-weight:900 !important;} `;


		data += `.app-size-${s} .text-xxs-${s}{font-size:.70em !important;} `;
		data += `.app-size-${s} .text-xs-${s}{font-size:.83em !important;} `;
		data += `.app-size-${s} .text-s-${s}{font-size:.9em !important;} `;
		data += `.app-size-${s} .text-m-${s}{font-size:1.1em !important;} `;
		data += `.app-size-${s} .text-l-${s}{font-size:1.2em !important;} `;
		data += `.app-size-${s} .text-xl-${s}{font-size:1.4em !important;} `;
		data += `.app-size-${s} .text-xxl-${s}{font-size:1.6em !important;} `;
		data += `.app-size-${s} .text-xxxl-${s}{font-size:2em !important;} `;

		data += `.app-size-${s} .i-${s}{font-style:italic !important;} `;

	});

	return data;

}
