export default (code) => {

	let $statusPage;

	if(code === 404){

		$statusPage = $(`
			<div class="status-page status-page-404">
				<h1>404</h1>
				<p>Oops! The page you are looking for does not exist.</p>
				<a href="/" class="btn-home">Go to Home Page</a>
			</div>
		`);

	} else if(code === 401){

		$statusPage = $(`
			<div class="status-page status-page-404">
				<h1>Nah...</h1>
				<p>Sorry Bro... Access Denied.</p>
				<a href="/" class="btn-home">Go to Home Page</a>
			</div>
		`);

	} else {

		$statusPage = $(`
			<div class="status-page status-page-generic">
				<h1>${code}</h1>
				<p>Something went wrong.</p>
				<a href="/" class="btn-home">Go to Home Page</a>
			</div>
		`);

	}

	return $statusPage;

};