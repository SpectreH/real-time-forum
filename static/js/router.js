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

    const url = `/${urlSegments.join('/')}`;
    history.pushState({}, '', url);
    
    const routerOutletElement = document.querySelector('[data-router-outlet]');

    if (this.authRes) {
      const mainRouterElement = this._matchUrlToRoute([""]);

      if (!routerOutletElement.querySelector('[auth-data-router-outlet]')) {
        routerOutletElement.innerHTML = await mainRouterElement.getTemplate(mainRouterElement.params);
      } else if (matchedRoute.path == '/') {
        let fullMainPageHtml = document.createElement("div");
        fullMainPageHtml.innerHTML = await mainRouterElement.getTemplate(mainRouterElement.params);     
        routerOutletElement.querySelector('[auth-data-router-outlet]').innerHTML = fullMainPageHtml.querySelector('[auth-data-router-outlet]').innerHTML
      }

      if (matchedRoute.path != '/') {
        let mainInnerHTMLRouter = routerOutletElement.querySelector('[auth-data-router-outlet]');
        mainInnerHTMLRouter.innerHTML = await matchedRoute.getTemplate(matchedRoute.params);
      } 
    } else {
      const routerOutletElement = document.querySelector('[data-router-outlet]');
      routerOutletElement.innerHTML =  await matchedRoute.getTemplate(matchedRoute.params);
    }

    if (this.chatSocket == undefined && this.authRes) {
      this.chatSocket = await ChatSocket.create()
    }

    if (matchedRoute.path == '/chat/:userid' && this.chatSocket != undefined && this.authRes) {
      let func = this.chatSocket.keypress
      let funcBind = func.bind(this.chatSocket);
      routerOutletElement.querySelector(".chat-textarea").addEventListener("keypress", function (event) {
        funcBind(event, parseInt(urlSegments[1]))
      }.bind(funcBind))
    }

    routerOutletElement.classList.remove("hide")
    this.formValidation();
  }

  _matchUrlToRoute(urlSegments) {
    const routeParams = {};
    const matchedRoute = this.routes.find(route => {
      const routePathSegments = route.path.split('/').slice(1);

      if (routePathSegments.length !== urlSegments.length) {
        return false;
      }

      const match = routePathSegments.every((routePathSegment, i) => {
        return routePathSegment === urlSegments[i] || routePathSegment[0] === ':';
      });

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
    const pathnameSplit = window.location.pathname.split('/');
    const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : '';
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