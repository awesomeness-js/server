(function() {

	$.fn.onResize = function(callback, { 
		widthChangeOnly = true
	} = {}) {

		this.each(function() {

			if (typeof callback !== 'function') {

				return this; 

			}

			let lastKnownSize = 0;

			function resize(entries) {


				if (!$.contains(document, $element[0])) {

					resizeObserver.disconnect();
					
					return;

				}

				let currentSize = $element.width();


				if(widthChangeOnly){

					if (currentSize !== lastKnownSize) {

						lastKnownSize = currentSize;

						callback.call($element, currentSize);

					}
			
				} else {

					callback.call($element, currentSize);

				}
			
			}

			var $element = $(this);
			var resizeObserver = new ResizeObserver(resize);

			// Start observing the element
			resizeObserver.observe($element[0]);

			$element.on('resize', resize );

		});

		// Return this for jQuery chaining
		return this;

	};

})();