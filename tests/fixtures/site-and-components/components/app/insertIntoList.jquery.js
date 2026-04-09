(function(){

	// IMPORTANT NOTE: with custom sortFn's use toLowerCase !!
	$.fn.extend({

		//Name the function
		insertIntoList: function($ul, options) {

			var defaults = {
				'sortFn':function($elm){

					return $elm.html().toLowerCase(); 

				},
				'insertBeforeLast':false,
				'za':false,
				'selector':null
			};

			var options =  $.extend(defaults, options); // jshint ignore:line

			return this.each(function() {

				if(!$ul){

					return false; 

				}

				// From here on in, it's "normal" jQuery

				var $li = $(this); // new item
				var $lis;


				if(options.selector){

					$lis = $ul.children(options.selector); // existing items
				
				} else {

					$lis = $ul.children(); // existing items
				
				}

				var newHtml = options.sortFn($li);

				if($lis.length === 0){

					$li.appendTo($ul); 

					return; 

				}

				$lis.each(function(k,e){

					var $t = $(this);

					// meta hack for skip
					if($t.data('insertIntoListSkip') === true){

						return true; 

					}

					var isLast = $t.is( ":last-child" );
					var current = options.sortFn($t);

					if(options.insertBeforeLast && isLast){

						// insert before last child
						$li.insertBefore($t);
						
						return false;

					}

					if(options.za){

						if(current < newHtml){

							$li.insertBefore($t);
							
							return false;

						} else {

							// continue if it is not the last item
							if(!isLast){

								return true; 

							}

							// it is the last item
							if(options.insertBeforeLast){

								$li.insertBefore($t);
							
							} else {

								$li.insertAfter($t);
							
							}

						}

					} else {

						if(current > newHtml){

							$li.insertBefore($t);
							
							return false;

						} else {

							// continue if it is not the last item
							if(!isLast){

								return true; 

							}

							// it is the last item
							if(options.insertBeforeLast){

								$li.insertBefore($t);
							
							} else {

								$li.insertAfter($t);
							
							}

						}

					}


				});

  			}); // each CORE

		} // xoSelect Function

	}); // extend

})();
