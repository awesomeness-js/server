import ui from '#ui';

app.pages._md.callToAction = async function(){

	$(`.custom-callToAction-real-estate`).each(function(){

		const $container = $(this);

		$container.empty();

		const $break = $(`<div class="break height-100"></div>`)
			.appendTo($container);

		const $h1 = $(`<h1 class="">Ready to start investing?</h1>`)
			.appendTo($container);

		const $break2 = $(`<div class="break height-25"></div>`)
			.appendTo($container);

		const $p = $(`<p class="lead">
			I turn down about 200 deals a year <b>because I do the math</b>. 
			They simply don't pencil out.
			I also have an extremely conservative investment criteria.
			That said, 
			Ive flipped over 40 units
			from single family homes, 
			to office condos and hotels.
			I currently own over 150 units. 
			You need me, or someone like me, as your copilot.
			If you are interested in learning more about investment real estate, 
			no matter where in the world you live,
			text me
			</p>`).appendTo($container);

		const $link = $(`<a href="sms:855.SCOTT.40" class="">855.SCOTT.40</a>`)
			.appendTo($p);

		const $break3 = $(`<div class="break height-100"></div>`)
			.appendTo($container);
	
	});

};