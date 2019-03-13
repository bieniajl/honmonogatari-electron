const broken_route_page = { html: `
<p>Broken Route: <span id="error"></span></p>
`};

class Router {
	constructor(routing) {
		this.routing = routing;
		this.outlet = document.getElementsByTagName('router')[0];
	}

	setReloadCallback(callback) {
		this.reloadCallback = callback;
		return this;
	}

	route() {
		this.loadRoute(this.routing, window.location.hash.substr(1).split(';'));
		return this;
	}

	loadRoute(routing, route_data) {
		let route = routing[route_data[0] === undefined ? '' : route_data[0]];

		if (route === undefined) {
			this.loadPage(broken_route_page, null);
			document.getElementById('error').innerHTML = window.location.hash;
			return;
		}

		switch (route.type) {
			case 'page':
				this.loadPage(route.page, route_data.slice(1));
				break;
			case 'routing':
				this.loadRoute(route.routing, route_data.slice(1));
				break;
		}
	}

	loadPage(page, data) {
		if (this.page !== undefined)
			this.outlet.innerHTML = "";

		if (page.page === undefined) {
			this.page = "static"
		} else {
			this.page = new page.page(data);
		}

		if (page.html !== undefined)
			this.outlet.innerHTML = page.html;

		if (typeof this.page.init === "function")
			this.page.init();
	}

	navigate(route) {
		this.outlet.innerHTML = "";
		window.location.hash = "#" + route;
		this.loadRoute(this.routing, window.location.hash.substr(1).split(';'));
	}

	reload() {
		if (typeof this.reloadCallback === 'function')
			this.reloadCallback();
		window.location.reload();
	}
}

module.exports = Router;
