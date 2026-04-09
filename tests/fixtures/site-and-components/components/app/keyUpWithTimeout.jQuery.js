(function() {
	
	$.fn.keyUpWithTimeout = function(callback, timeout) {
	  
		var timer;
	  
	  return this.each(function() {

			let $this = $(this);

			$this.on('keyup', function() {
			
				clearTimeout(timer);
				timer = setTimeout(function() {

					callback($this.val(), this);
				
				}, timeout);
			
			});
	  
		});
	
	};
	
})();