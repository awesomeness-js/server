app.metaUpdates = function(meta){

	if(!meta) return;

	// ORDER OF UPDATES MATTERS
	if(meta.user) app.user = meta.user;
	if(meta.pages) app.meta.update.pages(meta.pages);
	if(meta.components) app.meta.update.components(meta.components);

};
