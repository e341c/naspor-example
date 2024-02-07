require("dotenv").config()
const { connect } = require("amqplib")
const Consumer = require("./consumer")
const Producer = require("./producer")
const config = require("../../../config/config")

class RabbitMQClient {
    constructor() {
        if (RabbitMQClient.instance) {
            return RabbitMQClient.instance
        }
        this.isInitialized = false
        RabbitMQClient.instance = this
    }

    async initialize() {
        if (this.isInitialized) {
            return
        }
        try {
            this.connection = await connect(process.env.RABBITMQ_URL)

            this.producerChannel = await this.connection.createChannel()
            this.consumerChannel = await this.connection.createChannel()

            const { queue: rpcQueue } = await this.consumerChannel.assertQueue(config.rabbitMQ.queues.rpcQueue, {exclusive: true})
            console.log(rpcQueue);

            this.producer = new Producer(this.producerChannel)
            this.consumer = new Consumer(this.consumerChannel, rpcQueue)

            this.consumer.consumeMessages()

            this.isInitialized = true
        } catch (error) {
            console.log("Rabbitmq error...", error)
        }
    }

    async produce(data, correlationId, replyToQueue) {
        if (this.isInitialized) {
            await this.initialize()
        }
        return await this.producer.produceMessages(data, correlationId, replyToQueue)
    }
}

module.exports = new RabbitMQClient()
