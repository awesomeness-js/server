import ui from '#ui';

export default ({
	$elm,
	callback = () => {},
	root = null,
	rootMargin = "0px 0px",
	threshold = 0.01,
	once = true,

	// auto cleanup
	destroyOnRemove = true,
	removeRoot = null, // defaults below
	debug = false
} = {}) => {

	const registry = ui.scrollSpy.observerPoolRegistry();

	if (!$elm) throw new Error("observer: missing $elm");

	const el = $elm?.[0] || $elm;

	if (!el || !el.nodeType) {

		throw new Error("observer: $elm must be a DOM element or a jQuery-like wrapper");
	
	}

	if (!removeRoot) removeRoot = document.documentElement || document.body;

	let pool = null;
	let mo = null;
	let connectMo = null;

	let last = null;
	let destroyed = false;
	let started = false;
	const subscriber = {
		safeCall: (isIntersecting, entry) => safeCall(isIntersecting, entry)
	};

	const log = (...args) => debug && console.log("[observer]", ...args);

	const safeCall = (v, entry) => {

		if (destroyed) return;

		v = !!v;

		if (v === last) return;
		last = v;

		try {

			callback(v, entry);

		} catch (e) {}

		if (once && v) destroy();

	};

	const destroy = () => {

		if (destroyed) return;
		destroyed = true;

		ui.scrollSpy.observerPoolUnsubscribe({
			registry,
			poolEntry: pool,
			targetElm: el,
			subscriber
		});
		pool = null;

		if (mo) mo.disconnect();
		mo = null;

		if (connectMo) connectMo.disconnect();
		connectMo = null;

		log("destroyed");

	};

	const start = () => {

		if (destroyed || started) return;
		started = true;

		pool = ui.scrollSpy.observerPoolGet({
			registry,
			root,
			rootMargin,
			threshold 
		});

		ui.scrollSpy.observerPoolSubscribe({
			poolEntry: pool,
			targetElm: el,
			subscriber
		});

		log("started", {
			el,
			root,
			rootMargin,
			threshold,
			sharedObserverPool: true
		});

		// auto destroy on removal
		if (destroyOnRemove) {

			mo = new MutationObserver(() => {

				if (!el.isConnected) destroy();

			});

			mo.observe(removeRoot, {
				childList: true,
				subtree: true
			});

		}

	};

	// If it's already connected, start immediately.
	// If not, wait until it becomes connected.
	if (el.isConnected) {

		start();

	} else {

		log("waiting for element to connect...");

		connectMo = new MutationObserver(() => {

			if (destroyed) return;

			if (el.isConnected) {

				connectMo.disconnect();
				connectMo = null;

				// wait 1 frame so layout exists
				requestAnimationFrame(() => start());

			}

		});

		connectMo.observe(removeRoot, {
			childList: true,
			subtree: true
		});

	}

	// stash destroy
	try {

		$elm?.data?.("observerDestroy", destroy); 

	} catch (e) {}

	return { destroy };

};
