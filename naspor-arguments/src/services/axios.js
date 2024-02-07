require("dotenv").config()
const axios = require("axios")
const config = require("../../config/config")

// const usersUrl = `${config.servers.users.protocol}://${config.servers.users.host}:${config.servers.users.port}`
// const chatsUrl = `${config.servers.chats.protocol}://${config.servers.chats.host}:${config.servers.chats.port}`

const usersUrl = "http://naspor-users:3001"
const chatsUrl = "http://naspor-chats:3002"

const axiosUsers = axios.create({
    baseURL: usersUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
})

const axiosChats = axios.create({
    baseURL: chatsUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
})

module.exports = { axiosUsers, axiosChats }
