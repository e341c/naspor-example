const {createProxyMiddleware} = require('koa-http-proxy-server');

const setupProxies = (app, routes) => {
    routes.forEach(route => {
        app.use(createProxyMiddleware(route.url, route.proxyOptions))
    });
}
// koa-http-proxy-server here
module.exports = setupProxies