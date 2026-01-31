import grid from './dynamic/grid.js';
import text from './dynamic/text.js';
import spacing from './dynamic/spacing.js';
import shortcuts from './dynamic/shortcuts.js';
import width from './dynamic/width.js';
import flex from './dynamic/flex.js';

function dynamicCSS() {

	let sizes = [
		'xl', // extra large
		'd', // desktop
		't', // tablet
		'p' // phone
	];
		
	let data = '';

	const pixels = 126;

	data += shortcuts(sizes);
	data += text(sizes);
	data += width(sizes);
	data += flex(sizes);

	data += spacing({
		sizes,
		pixels 
	});
	data += grid({
		sizes,
		pixels 
	});
	
	return data;

}


export { dynamicCSS };