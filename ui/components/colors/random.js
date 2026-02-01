export default ({
	shadeMin = 400,
	shadeMax = 700
} = {}) => {

	const {
		colors,
		shades
	} = ui.colors();

	const randomColor = colors[Math.floor(Math.random() * colors.length)];
	const shadeRange = shades.filter((shade) => shade >= shadeMin && shade <= shadeMax);
	const randomShade = shadeRange[Math.floor(Math.random() * shadeRange.length)];

	return `${randomColor}-${randomShade}`;

};