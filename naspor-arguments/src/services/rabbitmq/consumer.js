const { EventEmitter } = require("events")

class Consumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel
        this.queue = queue
        this.eventEmitter = eventEmitter
    }

    async consumeMessages() {
        console.log("Ready to consume messages on queue", this.queue + "...")

        this.channel.consume(
            this.replyQueueName,
            (message) => {
                console.log("the reply is..", JSON.parse(message.content.toString()))
                this.eventEmitter.emit(message.properties.correlationId.toString(), message)
            },
            {
                noAck: true,
            }
        )
    }
}

module.exports = Consumer
