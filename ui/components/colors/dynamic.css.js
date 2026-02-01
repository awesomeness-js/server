import { promises as fs } from 'fs';
import {
	dirname, join 
} from 'path';
import { fileURLToPath } from 'url';

// Get the current directory of this script file
const __dirname = dirname(fileURLToPath(import.meta.url));

const dynamicColors = ()=>{

	const colorNames = [
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

	const preFixes = {
		'bg': 'background-color',
		'border': 'border-color',
		'text': 'color'
	};

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

	let css = "";

	Object.keys(preFixes).forEach((preFix)=>{

		// black and white
		css += `.${preFix}-black{${preFixes[preFix]}:var(--black)}\n`;
		css += `.${preFix}-white{${preFixes[preFix]}:var(--white)}\n`;

		css += `.${preFix}-black--hover:hover{${preFixes[preFix]}:var(--black)}\n`;
		css += `.${preFix}-white--hover:hover{${preFixes[preFix]}:var(--white)}\n`;

		// border
		const borderThicknesses = [ 1, 2, 3, 4, 5, 6, 7, 8 ];

		borderThicknesses.forEach((width) => {

			css += `.border-${width}{border-style:solid; border-width: ${width}px;}\n`;

			// top left, bottom, right
			css += `.border-top-${width}{border-top-width:${width}px}\n`;
			css += `.border-bottom-${width}{border-bottom-width:${width}px}\n`;
			css += `.border-left-${width}{border-left-width:${width}px}\n`;
			css += `.border-right-${width}{border-right-width:${width}px}\n`;
			
		});

		// 1 - 100
		const borderRadiusThicknesses = [];


		for (let i = 1; i <= 100; i++) {

			borderRadiusThicknesses.push(i);
		
		}

		borderRadiusThicknesses.forEach((width) => {

			css += `.border-radius-${width}{border-radius:${width}px}\n`;
			
		});


		colorNames.forEach((colorName)=>{

			shades.forEach((shade)=>{

				css += `.${preFix}-${colorName}-${shade}{${preFixes[preFix]}:var(--${colorName}-${shade})}\n`;
				css += `.${preFix}-${colorName}-${shade}--hover:hover{${preFixes[preFix]}:var(--${colorName}-${shade})}\n`;
			
			});
		
		});
	
	});


	return {
		css,
		shades,
		colorNames,
		preFixes
	};

};

async function cssBuild(){

	const { css } = dynamicColors();
	const filePath = join(__dirname, 'dynamic.css'); // Ensures it's written to the current working directory

	await fs.writeFile(filePath, css, 'utf8');
	
	return true;

}


export { cssBuild };