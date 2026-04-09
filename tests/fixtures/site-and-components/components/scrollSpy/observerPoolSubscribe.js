export default ({
	poolEntry,
	targetElm,
	subscriber
} = {}) => {

	if (!poolEntry) {

		throw new Error('observerPoolSubscribe: missing poolEntry');

	}

	if (!targetElm) {

		throw new Error('observerPoolSubscribe: missing targetElm');

	}

	if (!subscriber) {

		throw new Error('observerPoolSubscribe: missing subscriber');

	}

	let subscribers = poolEntry.targets.get(targetElm);

	if (!subscribers) {

		subscribers = new Set();
		poolEntry.targets.set(targetElm, subscribers);
		poolEntry.observer.observe(targetElm);

	}

	subscribers.add(subscriber);

};
