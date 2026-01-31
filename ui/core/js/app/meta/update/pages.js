app.meta.update.pages = function (pages) {

	if (!pages) return;

	$.each(pages, function (rawName, pageData) {

		// normalize name like original (no leading/trailing slash)
		const name = String(rawName).replace(/^\/+|\/+$/g, "");
		const nameParts = name.split("/");

		// ensure namespace: app.pages.example.test
		let base = app.pages;


		for (let i = 0; i < nameParts.length; i++) {

			const part = nameParts[i];

			if (!base[part]) base[part] = {};
			base = base[part];
		
		}

		// CSS (hot-reload)
		if (pageData.css) {

			const key = "page__" + name.replaceAll("/", "_"); // <- prefix here

			if (app._supportsConstructableSheets) {

				let sheet = app.meta.styleSheets[key];


				if (!sheet) {

					sheet = new CSSStyleSheet();
					app.meta.styleSheets[key] = sheet;
					document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, sheet ];
				
				}

				sheet.replaceSync(pageData.css);
			
			} else {

				// fallback: <style> injection
				const cssID = key; // id equals prefixed key
				const cssTag ='<style type="text/css" id="' + cssID + '">' + pageData.css + "</style>";

				$("#" + cssID).remove(); // remove old
				let $css = $("#css");

				if (!$css.length) $css = $('<div id="css"></div>').appendTo($("body"));
				$(cssTag).appendTo($css);
			
			}
		
		}

		// JS (hot-reload)
		if (pageData.js) {

			try {

				eval(pageData.js); 

			} catch (error) {

				console.error("Failed to load page script:", {
					name,
					error 
				});
			
			}
		
		}

		// metadata
		app.meta.pages[name] = pageData.version;
		
		base.version = pageData.version;
		base.about = pageData.about;
	
	});

};
