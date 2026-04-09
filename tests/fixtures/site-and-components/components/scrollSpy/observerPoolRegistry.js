export default () => {

	const OBSERVER_POOL_KEY = '__awesomenessScrollSpyElmPool__';
	const globalScope = typeof window !== 'undefined' ? window : globalThis;

	if (!globalScope[OBSERVER_POOL_KEY]) {

		globalScope[OBSERVER_POOL_KEY] = {
			pools: new Map(),
			rootIds: new WeakMap(),
			rootSeq: 0
		};

	}

	return globalScope[OBSERVER_POOL_KEY];

};
