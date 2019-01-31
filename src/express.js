const isMatching = function (req, route) {
  if (route.method && req.method !== route.method) return false;
  if (route.url instanceof RegExp && route.url.test(req.url)) return true;
  if (route.url && req.url !== route.url) return false;
  return true;
}

class Express {
  constructor() {
    this.routes = [];
  }
  use(handler) {
    this.routes.push({ handler });
  }
  get(url, handler) {
    this.routes.push({ method: "GET", url, handler });
  }
  post(url, handler) {
    this.routes.push({ method: "POST", url, handler });
  }
  requestHandler(req, res) {
    const routes = this.routes.filter(r => isMatching(req, r));
    const next = function () {
      const current = routes.shift();
      if (current == undefined) return;
      current.handler(req, res, next);
      return;
    }
    next();
  }
}

module.exports = {
  isMatching, Express
}