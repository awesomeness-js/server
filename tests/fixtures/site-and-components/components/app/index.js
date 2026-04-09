import ui from '#ui';

export default function silentStart({
	theme = {
		name: 'light',
		neutralColor: 'zinc',
		accentColor: 'cyan',
		customColors: {},
	}
}) {

	app.theme = theme;

	if(theme.customColors){

		$.each(theme.customColors, (name, hexValue) => {

			let inputColor;
			let anchorShade = 600;

			if(typeof hexValue === 'string'){

				inputColor = hexValue;

			} else if(typeof hexValue === 'object' && hexValue !== null){

				inputColor = hexValue.inputColor;
				anchorShade = hexValue.anchorShade || anchorShade;

			}

			ui.colors.custom({
				inputColor: inputColor,
				anchorShade: 600,
				name
			});

		});

	}

}