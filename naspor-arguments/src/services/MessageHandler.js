const rabbitClient = require("./rabbitmq/client")

class MessageHandler {
    static async handle(operation, data, correlationId, replyTo) {
        let response = {}
        console.log("The data is..", data)
        console.log("The operation is..", operation)

        await rabbitClient.produce(response, correlationId, replyTo)
    }
}

module.exports = MessageHandler