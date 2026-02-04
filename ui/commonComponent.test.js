import componentDependencies from '../src/componentDependencies.js';
import { expect, test } from 'vitest';

test('component test', () => {
 
	const test = componentDependencies([ '_example' ],{
		showDetails: true
	});

	expect(test._example.js).toBeDefined();
	expect(test._example.js).toContain('ui._example');
	expect(test._example.css).toBeDefined();
	expect(test._example.js_details).toBeDefined();
	expect(test._example.css_details).toBeDefined();

	const test2 = componentDependencies([ 'notCommonExample' ],{
		showDetails: false,
		customLocation: `./sites/demo.awesomenessjs.com/components`,
	});

	expect(test2.notCommonExample.js).toBeDefined();
	expect(test2.notCommonExample.js).toContain('ui.notCommonExample');
	expect(test2.notCommonExample.css).toBeDefined();
	expect(test2.notCommonExample.js_details).toBeUndefined();
	expect(test2.notCommonExample.css_details).toBeUndefined();

});