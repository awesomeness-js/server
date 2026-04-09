(function(){

	$.fn.extend({
		//Name the function
		onEnter: function(fn) {

			if(typeof(fn) != 'function'){

				console.log('function not passed to onEnter.');
				
				return false;
			
			}

			return this.each(function() {

				// From here on in, it's "normal" jQuery
				var $t = $(this);

				$t.off('keypress').on('keypress', function(e){

					var keycode = (e.keyCode ? e.keyCode : e.which);


					if (keycode == '13') {

						e.preventDefault();
						fn.call();
					
					}
				
				});
			
			});
		
		}
	});

})();
