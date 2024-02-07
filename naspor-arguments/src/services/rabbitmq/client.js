require("dotenv").config()
const { connect } = require("amqplib")
const Producer = require("./producer")
const Consumer = require("./consumer")
const { EventEmitter } = require("events")
const config = require("../../../config/config")

class RabbitMQClient {
    constructor() {
        this.isInitialized = false
        // this.queue = config.rabbitMQ.queues.rpcQueue
    }

    static getInstance() {
        if (!RabbitMQClient.instane) {
            RabbitMQClient.instane = new RabbitMQClient()
        }
        return RabbitMQClient.instane
    }

    async initialize() {
        if (this.isInitialized) {
            return
        }

        try {
            this.connection = await connect(process.env.RABBITMQ_URL)

            this.producerChannel = await this.connection.createChannel()
            this.consumerChannel = await this.connection.createChannel()

            const { queue: replyQueueName } = await this.consumerChannel.assertQueue("", { exclusive: true })
            console.log("replyQueueName..", replyQueueName);

            this.eventEmmiter = new EventEmitter()
            console.log(this.eventEmmiter)

            this.producer = new Producer(this.producerChannel, replyQueueName, this.eventEmmiter)
            this.consumer = new Consumer(this.consumerChannel, replyQueueName, this.eventEmmiter)

            this.consumer.consumeMessages()

            this.isInitialized = true
        } catch (error) {
            console.error("Rabbitmq error...", error)
        }
    }

    async produce(data, queue) {
        if (!this.isInitialized) {
            await this.initialize()
        }
        return await this.producer.produceMessages(data, queue)
    }

    async send(data, queue){
        if(!this.isInitialized){
            await this.initialize()
        }
        return await this.producer.sendMessage(data, queue)
    }
}

module.exports = RabbitMQClient.getInstance()
