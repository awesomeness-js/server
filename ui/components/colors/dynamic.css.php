<?php

function dynamicColors() {
	$colorNames = [
		"amber",
		"blue",
		"cyan",
		"emerald",
		"fuchsia",
		"gray",
		"green",
		"indigo",
		"lime",
		"neutral",
		"orange",
		"pink",
		"purple",
		"red",
		"rose",
		"sky",
		"slate",
		"stone",
		"teal",
		"violet",
		"yellow",
		"zinc",
	];

	$preFixes = [
		'bg'     => 'background-color',
		'border' => 'border-color',
		'text'   => 'color'
	];

	$shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

	$css = "";

	foreach ($preFixes as $preFix => $cssProp) {
		// black and white
		$css .= ".$preFix-black{{$cssProp}:var(--black)}\n";
		$css .= ".$preFix-white{{$cssProp}:var(--white)}\n";

		// border widths
		$borderThicknesses = range(1, 8);
		foreach ($borderThicknesses as $width) {
			$css .= ".border-$width{border-width:{$width}px}\n";
			$css .= ".border-top-$width{border-top-width:{$width}px}\n";
			$css .= ".border-bottom-$width{border-bottom-width:{$width}px}\n";
			$css .= ".border-left-$width{border-left-width:{$width}px}\n";
			$css .= ".border-right-$width{border-right-width:{$width}px}\n";
		}

		// border radius 1-100
		foreach (range(1, 100) as $radius) {
			$css .= ".border-radius-$radius{border-radius:{$radius}px}\n";
		}

		// color + shade combos
		foreach ($colorNames as $colorName) {
			foreach ($shades as $shade) {
				$css .= ".{$preFix}-{$colorName}-{$shade}{{$cssProp}:var(--{$colorName}-{$shade})}\n";
				$css .= ".{$preFix}-{$colorName}-{$shade}--hover:hover{{$cssProp}:var(--{$colorName}-{$shade})}\n";
			}
		}
	}

	return $css;
}

function cssBuild() {
	$css = dynamicColors();
	$filePath = __DIR__ . '/dynamic.css';
	file_put_contents($filePath, $css);
	return true;
}

// Run the build when the script executes
cssBuild();
