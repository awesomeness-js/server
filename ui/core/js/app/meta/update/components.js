app.meta.update.components = function (components) {

	Object.entries(components).forEach(([ name, component ]) => {

		app.meta.components[name] = component.hash;

		// prefix + normalize
		const key = "component__" + String(name).replaceAll("/", "_");

		// CSS
		if (component.css) {

			if (app._supportsConstructableSheets) {

				let sheet = app.meta.styleSheets[key];


				if (!sheet) {

					sheet = new CSSStyleSheet();
					app.meta.styleSheets[key] = sheet;
					document.adoptedStyleSheets = [ ...document.adoptedStyleSheets, sheet ];
				
				}

				sheet.replaceSync(component.css);
			
			} else {

				// fallback <style> injection
				const cssID = key;
				const cssTag ='<style type="text/css" id="' + cssID + '">' + component.css + "</style>";

				// remove old and insert new inside #css bucket
				$("#" + cssID).remove();
				let $css = $("#css");

				if (!$css.length) $css = $('<div id="css"></div>').appendTo($("body"));
				$(cssTag).appendTo($css);
			
			}
		
		}

		// JS
		if (component.js) {

			try {

				eval(component.js);
			
			} catch (error) {

				console.error("Failed to load function:", {
					component: name,
					error 
				});
			
			}
		
		}
	
	});

};
