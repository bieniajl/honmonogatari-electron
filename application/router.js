const default_router = () => {
	return {
		page: null,
		html: '<p>No Router Added</p>'
	};
}

class Router {
	constructor(router = default_router) {
		this.router = router;
		this.element = document.getElementsByTagName('router')[0];
	}

	route(route_path = window.location.hash.substr(1).split(';')) {
		var route = this.router(route_path[0], route_path.slice(1));
		if (typeof route.page === "function") {
			this.page = new route.page();

			if (typeof route.html === "string") {
				this.element.innerHTML = route.html;
			}

			if (typeof this.page.init === "function") {
				this.page.init();
			}
		} else {
			if (typeof route.html === "string") {
				this.element.innerHTML = route.html;
			}
		}
	}
}

module.exports = Router;
