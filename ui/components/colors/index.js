export default () => {

	const colors = [
		"red",
		"orange",
		"amber",
		"yellow",
		"lime",
		"green",
		"emerald",
		"teal",
		"cyan",
		"sky",
		"blue",
		"indigo",
		"violet",
		"purple",
		"fuchsia",
		"pink",
		"rose",
		"slate",
		"gray",
		"zinc",
		"neutral",
		"stone"
	  ];

	const colorGroups = {
		'reds': [ 'red', 'rose', 'pink' ],
		'oranges': [ 'orange', 'amber', 'yellow' ],
		'greens': [ 'lime', 'green', 'emerald', 'teal' ],
		'blues': [ 'cyan', 'sky', 'blue' ],
		'purples': [ 'indigo', 'violet', 'purple', 'fuchsia' ],
		'grays': [ 'slate', 'gray', 'zinc', 'neutral', 'stone' ]
	};

	const preFixes = [
		'bg',
		'border',
		'text'
	];


	const shades = [
		50,
		100,
		200,
		300,
		400,
		500,
		600,
		700,
		800,
		900,
		950
	];

	return {
		colorGroups,
		preFixes,
		colors,
		shades
	};

};