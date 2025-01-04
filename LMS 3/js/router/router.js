import Utils from '../util/utilities.js'
/* Class Router-handles hash routing and nav link state for application */
export default class Router {
    constructor(window, routes, containerId, templateUrl) {
        this.window = window;
        this._routes = routes;
        this.templateUrl=templateUrl;
        this.containerId=containerId;
        this.utils = new Utils();
        //since the render is normally async, I'm using the async IIFE wrapper
        //you can just exercise the promise pattern if you like
        (async () => {  
            await this.init();
        })();
        
    }
    get routes() {
        return this._routes;
    }
    get defaultRoute() {
        return this._routes.find(r => r.isDefaultView);
    }
    get curRoute(){
        return this.routes.find(element => element.name == window.location.hash);
    }
    get $container(){
        return $(`#${this.containerId}`);
    }
    async init() {
        /*TODO
        1. await the render of the nav
        2. target the nav links, mine use 'nav-link' class so that
        when they are clicked on, you remove all 'active' classes for the link, and add active class
        to the event's currentTarget element
        
        3. set the hashchange event on the 'window' and call loadHash
        4. set the default hash (call setDefaultHash) on the URL
        5. Call loadHash
        */
    }
    setDefaultHash() {
        let curRoute = this.defaultRoute;
        window.location.hash = curRoute.name;
    }
    loadHash() {
        //TODO
        //trigger a 'loadView' event, passing the current route (this.curRoute) as data
    }
    async render() {
        //TODO
        //call this.utils.getFileContents to get the template for the menu.
        //use the getter this.templateUrl for the file path, which is stored in appViewModel
        //render the nav html using ejs
        //stuff the result into this.$container
       
      }
}