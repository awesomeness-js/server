export default ({
	registry,
	root,
	rootMargin,
	threshold
} = {}) => {

	if (!registry) {

		throw new Error('observerPoolGet: missing registry');

	}

	const toThresholdKey = (value) => {

		if (Array.isArray(value)) {

			return value.join(',');

		}

		return String(value);

	};

	const getRootKey = (rootElm) => {

		if (!rootElm) {

			return 'viewport';

		}

		if (!registry.rootIds.has(rootElm)) {

			registry.rootSeq += 1;
			registry.rootIds.set(rootElm, `root-${registry.rootSeq}`);

		}

		return registry.rootIds.get(rootElm);

	};

	const key = `${getRootKey(root)}|${rootMargin}|${toThresholdKey(threshold)}`;

	if (registry.pools.has(key)) {

		return registry.pools.get(key);

	}

	const targets = new Map();

	const observer = new IntersectionObserver((entries) => {

		entries.forEach((entry) => {

			const subscribers = targets.get(entry.target);

			if (!subscribers || subscribers.size === 0) {

				return;

			}

			subscribers.forEach((subscriber) => {

				subscriber.safeCall(entry.isIntersecting, entry);

			});

		});

	}, {
		root,
		rootMargin,
		threshold
	});

	const poolEntry = {
		key,
		observer,
		targets
	};

	registry.pools.set(key, poolEntry);

	return poolEntry;

};
