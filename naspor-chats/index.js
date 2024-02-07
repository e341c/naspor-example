"use strict"

global.__basedir = __dirname

const dbKnex = require("./src/db/dbKnex")
const Koa = require("koa")

const createServer = require("./src/app")
const onClose = require("./src/services/ProccesExit")
const initWebsocket = require("./src/services/websocket")

const app = new Koa()

onClose(dbKnex)
createServer(app)
initWebsocket(app)
