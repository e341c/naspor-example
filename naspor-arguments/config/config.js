require("dotenv").config()

module.exports = {
    servers: {
        users: {
            protocol: process.env.USERS_SERVER_PROTOCOL,
            host: process.env.USERS_SERVER_HOST,
            port: process.env.USERS_SERVER_PORT,
        },
        chats: {
            protocol: process.env.CHATS_SERVER_PROTOCOL,
            host: process.env.CHATS_SERVER_HOST,
            port: process.env.CHATS_SERVER_PORT,
        },
        arguments: {
            protocol: process.env.SERVER_PROTOCOL,
            host: process.env.SERVER_HOST,
            port: process.env.SERVER_PORT,
        },
    },
    rabbitMQ: {
        queues: {
            rpcQueueChats: "rpc_queue_chats",
            rpcQueueUsers: "rpc_queue_users",
        },
    },
}
