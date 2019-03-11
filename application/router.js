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
		this.current_route = this.router(route_path[0], route_path.slice(1));
		if (typeof this.current_route.page === "function") {
			this.page = new this.current_route.page();

			if (typeof this.current_route.html === "string") {
				this.element.innerHTML = this.current_route.html;
			}

			if (typeof this.page.init === "function") {
				this.page.init();
			}
		} else {
			if (typeof this.current_route.html === "string") {
				this.element.innerHTML = this.current_route.html;
			}
		}
		let element = document.getElementById('nav-' + route_path[0]);
		if (element != null)
			element.className += " active";
	}
}

module.exports = Router;
