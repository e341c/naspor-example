"use strict"
require("dotenv").config()

const Koa = require("koa")
const http = require("http")
const setupLogging = require("./services/logging")
const setupProxies = require("./services/proxy")
const ROUTES = require("./routes")
const setupStatic = require("./services/static")

const app = new Koa()

const server_protocol = process.env.SERVER_PROTOCOL
const server_host = process.env.SERVER_HOST
const server_port = process.env.SERVER_PORT

console.log(server_protocol, server_host, server_port);

function createServer() {
    app.use(async (ctx, next) => {
        console.log(`Request made to: ${ctx.method} ${ctx.url}`)
        await next()
    })

    setupLogging(app)
    setupProxies(app, ROUTES)
    setupStatic(app, ROUTES)

    http.createServer(app.callback()).listen(server_port, server_host)
    console.log(`API Gateway running at ${server_protocol}://${server_host}:${server_port}`)
}

module.exports = createServer
