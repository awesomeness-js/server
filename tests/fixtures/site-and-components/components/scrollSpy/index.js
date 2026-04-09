export default ({
	$spyOn,
	$applyTo,
	deadZone = 10
} = {}) => {

	const $classEl = ($applyTo && $applyTo.length)
		? $applyTo
		: $('body');

	const spyTarget = ($spyOn && $spyOn.length)
		? $spyOn.get(0)
		: window;

	const isWindow = (spyTarget === window);

	const className = 'spy-scrolling-down';

	let lastTop = isWindow
		? (window.pageYOffset || document.documentElement.scrollTop || 0)
		: (spyTarget.scrollTop || 0);

	let ticking = false;

	function apply(isDown) {

		if (isDown) $classEl.addClass(className);
		else $classEl.removeClass(className);

	}

	function readTop() {

		return isWindow
			? (window.pageYOffset || document.documentElement.scrollTop || 0)
			: (spyTarget.scrollTop || 0);

	}

	function onRaf() {

		ticking = false;

		const topNow = readTop();
		const delta = topNow - lastTop;

		if (Math.abs(delta) < deadZone) return;

		apply(delta > 0);
		lastTop = topNow;

	}

	spyTarget.addEventListener('scroll', function() {

		if (ticking) return;

		ticking = true;
		requestAnimationFrame(onRaf);

	}, { passive: true });

};
