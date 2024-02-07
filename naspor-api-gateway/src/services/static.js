const serve = require("koa-static")

const setupStatic = (app, routes) => {
    routes.forEach((route) => {
        if (route.images) {
            const rootPath = route.proxyOptions.target.replace(/^(https?:\/\/[^/]+)(\/.*)?$/, "$2")

            console.log(`Root path for ${route.url}: ${rootPath}`)

            // Remove the '/api/clients' prefix from the URL
            const urlWithoutPrefix = route.url.replace("/api/clients", "")

            // Use the adjusted URL to serve images
            app.use(serve(`${rootPath}${urlWithoutPrefix}/public/images`))
        }
    })
}

module.exports = setupStatic
