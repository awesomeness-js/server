
// awesomeness app
window.app = {
	testing:true,
	data:{}, // namespace for app data
	state:{
		backIndex:0,
		state:{},
		skipState:false
	},
	apiBaseURL: '/', // must include trailing slash such as https://example.com/
	pageBaseURL: '/', // must include trailing slash such as https://example.com/
	print:{}, // component factory namespace
	meta:{ // holds meta data about the app like script versions
		components:{}, // key = component, value = hash
		update:{}, // update html and JS dynamically
		appFns:{}, // // key = file name in /api/common/front-end/app, value = hash
		css:{}, // key = file name in /api/common/front-end/common-css, value = hash
		pages:{}, // key = page, value = version #
		styleSheets:{} // registry for constructable stylesheets
	},
	size:{
		p:{
			min: 0,
			max: 750
		},
		t:{
			min: 751,
			max: 1099
		},
		d:{
			min: 1100,
			max: 1599
		},
		xl:{
			min: 1600,
			max: 99999
		}
	},
	pages:{} // namespace for all page specific JS, CSS & Data
}; // namespace for app
