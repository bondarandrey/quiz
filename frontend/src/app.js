import {Router} from "./router.js";

class App {
    constructor() {
        this.roter = new Router();
        window.addEventListener('DOMContentLoaded',this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
        }
    handleRouteChanging() {
        this.roter.openRoute();
    }
}

(new App());