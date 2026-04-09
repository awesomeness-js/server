export default ({
	$spyOn,
	$applyTo,
	threshold = 100,   // X px
	deadZone = 0,      // optional hysteresis to avoid flicker
	className = 'spy-past-threshold'
} = {}) => {

	const $classEl = ($applyTo && $applyTo.length)
		? $applyTo
		: $('body');

	const spyTarget = ($spyOn && $spyOn.length)
		? $spyOn.get(0)
		: window;

	const isWindow = (spyTarget === window);

	let ticking = false;
	let isApplied = null; // unknown at start

	function readTop() {

		return isWindow
			? (window.pageYOffset || document.documentElement.scrollTop || 0)
			: (spyTarget.scrollTop || 0);
	
	}

	function apply(shouldApply) {

		if (shouldApply) $classEl.addClass(className);
		else $classEl.removeClass(className);
	
	}

	function onRaf() {

		ticking = false;

		const topNow = readTop();

		// deadZone gives you hysteresis:
		// once applied, it won't unapply until threshold - deadZone
		// once unapplied, it won't apply until threshold + deadZone
		let shouldApply;

		if (isApplied === true) {

			shouldApply = topNow >= (threshold - deadZone);
		
		} else if (isApplied === false) {

			shouldApply = topNow >= (threshold + deadZone);
		
		} else {

			// first run
			shouldApply = topNow >= threshold;
		
		}

		if (shouldApply === isApplied) return;

		isApplied = shouldApply;
		apply(shouldApply);
	
	}

	function onScroll() {

		if (ticking) return;
		ticking = true;
		requestAnimationFrame(onRaf);
	
	}

	spyTarget.addEventListener('scroll', onScroll, { passive: true });

	// run once immediately so the class is correct on load
	onRaf();

	// optional cleanup if you want it
	return () => spyTarget.removeEventListener('scroll', onScroll);

};
