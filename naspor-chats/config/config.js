require("dotenv").config()

module.exports = {
    servers: {
        users: {
            protocol: process.env.USERS_SERVER_PROTOCOL,
            host: process.env.USERS_SERVER_HOST,
            port: process.env.USERS_SERVER_PORT,
        },
        chats: {
            protocol: process.env.SERVER_PROTOCOL,
            host: process.env.SERVER_HOST,
            port: process.env.SERVER_PORT,
        },
    },
    rabbitMQ: {
        queues: {
            rpcQueue: "rpc_queue_chats",
        },
    },
}
