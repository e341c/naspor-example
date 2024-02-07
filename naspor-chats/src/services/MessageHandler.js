const dbKnex = require("../db/dbKnex.js")
const rabbitClient = require("./rabbitmq/client.js")

class MessageHandler {
    static async handle(operation, data, correlationId, replyTo) {
        let response = {}

        if (operation == "create") {
            response = await dbKnex("users_clients_chats").insert({ type: data.type }).returning("*")
        }

        await rabbitClient.produce(response, correlationId, replyTo)
    }
}

module.exports = MessageHandler
