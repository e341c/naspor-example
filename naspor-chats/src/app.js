"use strict"
require("dotenv").config()

const http = require("http")
const cors = require("@koa/cors")
const { default: koaBody } = require("koa-body")
const koa_public = require("koa-static")
const chatRouter = require("./router/chatRouter")

const rabbitMQClient = require("./services/rabbitmq/client")

const server_host = process.env.SERVER_HOST
const server_port = process.env.SERVER_PORT
const server_protocol = process.env.SERVER_PROTOCOL

function createServer(app) {
    rabbitMQClient.initialize()
    console.log(rabbitMQClient);

    app.use(
        cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        })
    )
        .use(
            koaBody({
                multipart: true,
                urlencoded: true,
            })
        )
        .use(koa_public(__basedir, "public"))
        .use(async (ctx, next) => {
            console.log(`Received a ${ctx.request.method} request to ${ctx.request.url}`)
            await next()
        })
        .use(chatRouter.routes())
        .use(async (ctx, next) => {
            ctx.status = 404
            ctx.body = '{"ok":false,"msg":"not found"}'
            return
        })

    http.createServer(app.callback()).listen(server_port, server_host)
    console.log(`Server running at ${server_protocol}://${server_host}:${server_port}`)
}

module.exports = createServer
