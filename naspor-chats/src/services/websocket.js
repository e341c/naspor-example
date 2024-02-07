const { WebSocket } = require("ws")
const JWTService = require("./token/TokenService")
const config = require("../../config/config")
const dbKnex = require("../db/dbKnex")

const clients = new Map()
const chatsTable = new Map()
const jwtService = new JWTService()

const ws_url = `ws://${config.servers.chats.host}:6002`
console.log("Ws started on", ws_url);

function addClientsToChat(chat_id, client_id, ws) {
    if (!chatsTable.has(chat_id)) {
        chatsTable.set(chat_id, { clients: [] })
    }

    const chat = chatsTable.get(chat_id)
    chat.clients.push(client_id)
    console.log(chat)
}

function removeClientFromChat(chat_id, client_id) {
    const chat = chatsTable.get(chat_id)

    if (chat) {
        const client_index = chat.clients.indexOf(client_id)

        if (client_index !== -1) {
            chat.clients.splice(client_index, 1)
        }

        if (chat.clients.length === 0) {
            chatsTable.delete(chat_id)
        }
    }
}

function broadcastToChat(chat_id, message) {
    const chat = chatsTable.get(chat_id)

    if (chat) {
        const clientsArr = chat.clients
        clientsArr?.forEach((client_id) => {
            const client = clients.get(parseInt(client_id))

            client.send(JSON.stringify(message))
        })
        // chat.clients.foreach(client_id => {
        //     const client = clients.get(client_id)
        //     if(client) {
        //         client.send(JSON.stringify(message))
        //     }
        // })
    }
}

async function initWebsocket() {
    const wss = new WebSocket.Server({ port: 6002 })

    console.log(`WebSocket started at ${ws_url}`)

    wss.on("connection", async (ws, req) => {
        const token = req.headers["accesstoken"]

        if (!token) {
            ws.send("No token")
            ws.close()
            return
        }

        const client_id = jwtService.verifyTokenAndGetUserId(token, "clienttoken")

        if (!client_id) {
            ws.send("Client undefiend")
            ws.close()
            return
        }

        const url = new URL(req.url, ws_url)
        const searchParams = url.searchParams

        const chat_id = parseInt(searchParams.get("chat_id"))

        ws.chat_id = chat_id

        if (client_id) {
            ws.client_id = parseInt(client_id)

            clients.set(ws.client_id, ws)

            if (chat_id) {
                addClientsToChat(chat_id, client_id, ws)
            }
        }

        ws.on("message", async (message) => {
            const data = JSON.parse(message)

            const newMessage = await dbKnex("users_clients_chats_messages").insert({ chat_id: ws.chat_id, sender_id: ws.client_id, message: data.message, state: "ok" })

            broadcastToChat(ws.chat_id, { client_id: ws.client_id, message: data.message })
        })

        ws.on("close", async () => {
            removeClientFromChat(ws.chat_id, ws.client_id)
            clients.delete(ws.client_id)
            console.log(`Client with id: ${ws.client_id} disconnected`)
        })

        ws.onerror = async () => {
            removeClientFromChat(chat_id, ws.client_id)
            clients.delete(ws.client_id)
            console.log("Some Error occurred")
        }
    })
}

module.exports = initWebsocket
