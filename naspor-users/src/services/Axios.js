require("dotenv").config()
const axios = require("axios");
// const config = require("../../config/config");

// const server_host = process.env.USERS_SERVER_HOST
// const server_port = process.env.USERS_SERVER_PORT
// const server_protocol = process.env.USERS_SERVER_PROTOCOL

// const url = `${config.servers.chats.protocol}://${config.servers.chats.host}:${config.servers.chats.port}`
const url = "http://naspor-chats:3002"

const axiosChats = axios.create({
    baseURL: url,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
})

module.exports = axiosChats