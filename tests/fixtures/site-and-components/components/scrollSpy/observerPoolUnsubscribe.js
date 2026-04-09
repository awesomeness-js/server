export default ({
	registry,
	poolEntry,
	targetElm,
	subscriber
} = {}) => {

	if (!poolEntry || !targetElm || !subscriber) {

		return;

	}

	const subscribers = poolEntry.targets.get(targetElm);

	if (!subscribers) {

		return;

	}

	subscribers.delete(subscriber);

	if (subscribers.size === 0) {

		poolEntry.targets.delete(targetElm);
		poolEntry.observer.unobserve(targetElm);

	}

	if (poolEntry.targets.size === 0) {

		poolEntry.observer.disconnect();

		if (registry?.pools) {

			registry.pools.delete(poolEntry.key);

		}

	
	}

};
