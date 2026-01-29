process.on('uncaughtException', (err) => {

	console.error('💥 Uncaught Exception:', err);

});

process.on('unhandledRejection', (reason, promise) => {

	console.error('💥 Unhandled Rejection:', reason);

});