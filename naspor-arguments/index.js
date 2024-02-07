"use strict"

global.__basedir = __dirname

const dbKnex = require("./src/db/dbKnex")

const onClose = require("./src/services/ProccesExit")
const createServer = require("./src/app")
const RabbitMQClient = require("./src/services/rabbitmq/client")

onClose(dbKnex)
RabbitMQClient.initialize()
createServer()