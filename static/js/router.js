class Router {
  constructor(routes) {
    this.routes = routes;
    this.authRes;
    this.chatSocket;
  }

  async initialize() {
    await this.cookieValidation()
    await this._loadInitialRoute();
  }

  static async create(routes) {
    const o = new Router(routes);
    await o.initialize();
    return o;
  }

  async loadRoute(...urlSegments) {
    await this.cookieValidation()
    // Get the template for the given route.
    let matchedRoute = this._matchUrlToRoute(urlSegments);

    if (this.authRes) {
      if (matchedRoute.path == "/login" || matchedRoute.path == "/registration") {
        matchedRoute =  this._matchUrlToRoute([""]);
      }
    } else {
      if (matchedRoute.path != "/login" && matchedRoute.path != "/registration") {
        matchedRoute = this._matchUrlToRoute(["login"]);
      }
    }

    // Push a history entry with the new url.
    // We pass an empty object and an empty string as the historyState and title arguments, but their values do not really matter here.
    const url = `/${urlSegments.join('/')}`;
    history.pushState({}, '', url);
    
    const routerOutletElement = document.querySelectorAll('[data-router-outlet]')[0];

    if (this.authRes) {
      if (!routerOutletElement.querySelectorAll('[auth-data-router-outlet]')[0] || matchedRoute.path == '/') {
        const mainRouterElement = this._matchUrlToRoute([""]);
        routerOutletElement.innerHTML = await mainRouterElement.getTemplate(mainRouterElement.params);
      }

      if (matchedRoute.path != '/') {
        let mainInnerHTMLRouter = routerOutletElement.querySelectorAll('[auth-data-router-outlet]')[0];
        mainInnerHTMLRouter.innerHTML = await matchedRoute.getTemplate(matchedRoute.params);
      } 
    } else {
      // Append the given template to the DOM inside the router outlet.
      const routerOutletElement = document.querySelectorAll('[data-router-outlet]')[0];
      routerOutletElement.innerHTML =  await matchedRoute.getTemplate(matchedRoute.params);
    }

    if (this.chatSocket == undefined && this.authRes) {
      this.chatSocket = await ChatSocket.create()
    }

    routerOutletElement.classList.remove("hide")
    this.formValidation();
  }

  _matchUrlToRoute(urlSegments) {
    // Try and match the URL to a route.
    const routeParams = {};
    const matchedRoute = this.routes.find(route => {

      // We assume that the route path always starts with a slash, and so 
      // the first item in the segments array  will always be an empty
      // string. Slice the array at index 1 to ignore this empty string.
      const routePathSegments = route.path.split('/').slice(1);

      // If there are different numbers of segments, then the route does not match the URL.
      if (routePathSegments.length !== urlSegments.length) {
        return false;
      }

      // If each segment in the url matches the corresponding segment in the route path, 
      // or the route path segment starts with a ':' then the route is matched.
      const match = routePathSegments.every((routePathSegment, i) => {
        return routePathSegment === urlSegments[i] || routePathSegment[0] === ':';
      });

      // If the route matches the URL, pull out any params from the URL.
      if (match) {
        routePathSegments.forEach((segment, i) => {
          if (segment[0] === ':') {
            const propName = segment.slice(1);
            routeParams[propName] = decodeURIComponent(urlSegments[i]);
          }
        });
      }
      return match;
    });

    return { ...matchedRoute, params: routeParams };
  }

  async _loadInitialRoute() {
    // Figure out the path segments for the route which should load initially.
    const pathnameSplit = window.location.pathname.split('/');
    const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : '';
    // Load the initial route.
    await this.loadRoute(...pathSegments);
  }

  async cookieValidation() {
    await fetch('/cookie-validation', { method: "post" }).then(res => res.json()).then(res => {
      this.authRes = res.ok
    })
  }

  formValidation() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
        let categorySelection = document.getElementById("category-selection-list")
        if (categorySelection) {
          let inputs = categorySelection.querySelectorAll("input");
          let atLeastOneCheck = false; 

          inputs.forEach(input => {
            if (input.checked) {
              atLeastOneCheck = true;
            }
          });

          inputs.forEach(input => {
            if (atLeastOneCheck) {
              input.required = false;
            } else {
              input.required = true;
            }
          });
        }

        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
  }
}