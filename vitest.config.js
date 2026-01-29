export default {
	test: {
		globals: true,
		cache: false,
		environment: 'node',
		watchExclude: [
			'**/node_modules/**',
			'**/.git/**',
		],
		testMatch: [
			'**/*.test.js'
		],
		setupFiles: './tests/setup.js',
	}
};
