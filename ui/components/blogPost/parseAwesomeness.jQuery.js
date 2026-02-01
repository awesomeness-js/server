(function($){

	$.fn.parseAwesomeness = function() {

		return this.each(function() {

			const $root = $(this);

			// Matches: class="awesomeness-foo", class="awesomeness-bar", etc.
			$root.find('[class^="awesomeness-"]').each(function() {

				const $el = $(this);

				// extract the awesomeness-* part from className
				const classes = this.className.split(/\s+/);
				const awesomeClass = classes.find((c) => c.startsWith('awesomeness-'));

				if (!awesomeClass) return;

				const type = awesomeClass.slice('awesomeness-'.length); // e.g. "callToAction"

				// parse the inner object literal
				const raw = $el.text().trim();
				const data = (new Function(`return (${raw})`))();

				// You take over from here:
				console.log('Found:', type, data);

				if (!ui[type]) {

					console.warn(`No UI component found for type: ${type}`);
					
					return;
				
				}	

				const $newElm = ui[type](data);

				$el.empty().append($newElm);

			});

		});

	};

})(jQuery);
