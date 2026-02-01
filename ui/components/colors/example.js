export default ({
	exampleParam = 'test'
} = {}) => {

	let $container = $(`<div class="grid-1 gap-40 plr40"></div>`);
		
	const {
		preFixes,
		colors,
		colorGroups,
		shades
	} = ui.colors();

	const $shadePicker = $(`<div></div>`).appendTo($container);

	$shadePicker.append('<h3 class="mb10"></h3>');

	const $shadeSelected = $(`<h3>Pick a Shade</h3>`).appendTo($shadePicker);

	const $shadeList = $(`<div class="grid-11 gap-10"></div>`).appendTo($shadePicker);

	shades.forEach((shade) => {

		const textShade = shade >= 400 ? 50 : 700;

		const $shadeBox = $(`<div class="bg-gray-${shade} text-center p20 cursor-pointer text-gray-${textShade}">${shade}</div>`)
			.appendTo($shadeList)
			.click(() => {

				chooseShade(shade);

				$shadeSelected.html(`Pick a Shade - <strong>${shade}</strong>`);
			
			});

	});


	const $colors = $(`<div class="grid-1 gap-10"></div>`).appendTo($container);
	const $colorDetails = $(`<div class=""></div>`).appendTo($container);

	
	function chooseShade(shade) {

		$colors.empty();
		$colorDetails.empty();

		$.each(colorGroups, (groupName, groupColors) => {

			let hoverShade = shade + 200;

			if(hoverShade > 700){

				hoverShade = 500;

			}

			if(hoverShade < 300){

				hoverShade = 400;
			
			}
			

			const $colorGroup = $(`<div class="grid-${groupColors.length} gap-10"></div>`).appendTo($colors);

			groupColors.forEach((colorName)=>{

				const $bgBox = $(`<div class="bg-${colorName}-${shade} bg-${colorName}-${hoverShade}--hover text-white ptb40 text-center cursor-pointer">${colorName}</div>`)
					.appendTo($colorGroup)
					.click(()=>{

						$colorDetails.empty();
						
						const $name = $(`<h3 class="mb10">${colorName}</h3>`).appendTo($colorDetails);

						const $backgrounds = $(`<div class="grid-11-xl grid-6-d grid-2-p grid-4-t gap-10 mb10"></div>`).appendTo($colorDetails);
						const $borders = $(`<div class="grid-11-xl grid-6-d grid-2-p grid-4-t gap-10 mb10"></div>`).appendTo($colorDetails);
						const $texts = $(`<div class="grid-11-xl grid-6-d grid-2-p grid-4-t gap-10"></div>`).appendTo($colorDetails);

						shades.forEach((shade) => {

							const bgClass = `bg-${colorName}-${shade}`;
							const borderClass = `border-${colorName}-${shade}`;
							const textClass = `text-${colorName}-${shade}`;

							const textColorForBg = shade >= 300 ? 'text-white' : `text-${colorName}-700`;

							const $bgBox = $(`<div class="${bgClass} ${textColorForBg} p20 text-center">${bgClass}</div>`).appendTo($backgrounds);
							const $borderBox = $(`<div class="${borderClass} border-4 p20 text-center">${borderClass}</div>`).appendTo($borders);
							const $textBox = $(`<div class="${textClass} p20 text-center">${textClass}</div>`).appendTo($texts);

						});

					});


							
				const $name = $(`<h3 class="mb10">${colorName}</h3>`).appendTo($colorDetails);

				const $backgrounds = $(`<div class="grid-11-xl grid-6-d grid-2-p grid-4-t gap-10 mb10"></div>`).appendTo($colorDetails);
				const $borders = $(`<div class="grid-11-xl grid-6-d grid-2-p grid-4-t gap-10 mb10"></div>`).appendTo($colorDetails);
				const $texts = $(`<div class="grid-11-xl grid-6-d grid-2-p grid-4-t gap-10"></div>`).appendTo($colorDetails);

				shades.forEach((shade) => {

					const bgClass = `bg-${colorName}-${shade}`;
					const borderClass = `border-${colorName}-${shade}`;
					const textClass = `text-${colorName}-${shade}`;

					const textColorForBg = shade >= 300 ? 'text-white' : `text-${colorName}-700`;

					const $bgBox = $(`<div class="${bgClass} ${textColorForBg} p20 text-center">${bgClass}</div>`).appendTo($backgrounds);
					const $borderBox = $(`<div class="${borderClass} border-4 p20 text-center">${borderClass}</div>`).appendTo($borders);
					const $textBox = $(`<div class="${textClass} p20 text-center">${textClass}</div>`).appendTo($texts);

				});



			});

		});
	
	}


	chooseShade(500);


	return $container;

};