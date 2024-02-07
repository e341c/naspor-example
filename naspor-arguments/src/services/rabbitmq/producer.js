const { randomUUID } = require("crypto")
const config = require("../../../config/config")

class Producer {
    constructor(channel, replyQueueName, evenEmitter) {
        this.channel = channel
        this.replyQueueName = replyQueueName
        this.evenEmitter = evenEmitter
    }

    async produceMessages(data, queue) {
        const uuid = randomUUID()
        console.log("The correlationId is ", uuid)
        // config in sendToQueue(queue = config...)
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
            replyTo: this.replyQueueName,
            correlationId: uuid,
            expiration: 10,
            headers: {
                function: data.operation,
            },
        })

        return new Promise((resolve, reject) => {
            this.evenEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString())
                resolve(reply)
            })
        })
    }
}

module.exports = Producer
