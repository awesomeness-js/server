export default (word, customMap = {}) => {

	if(customMap && customMap[word]) {
	
		return customMap[word];

	}

	const randomColor = ui.colors.random();

	return randomColor;

};