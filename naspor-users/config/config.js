require("dotenv").config()

module.exports = {
    servers: {
        chats: {
            protocol: process.env.CHATS_SERVER_PROTOCOL,
            host: process.env.CHATS_SERVER_HOST,
            port: process.env.CHATS_SERVER_PORT,
        },
    },
    email: {
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    },
    frontendURL: "http://localhost:3000",
    rabbitMQ: {
        queues: {
            rpcQueue: "rpc_queue_users",
        },
    },
}
