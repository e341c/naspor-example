require("dotenv").config()
const axios = require("axios")
const config = require("../../config/config")

// const server_host = process.env.USERS_SERVER_HOST
// const server_port = process.env.USERS_SERVER_PORT
// const server_protocol = process.env.USERS_SERVER_PROTOCOL

// const url = `${config.servers.users.protocol}://${config.servers.users.host}:${config.servers.users.port}`
const url = "http://naspor-users:3001"

console.log("Server naspor-users running at", url);

const axiosUsers = axios.create({
    baseURL: url,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
})

module.exports = axiosUsers