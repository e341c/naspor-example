const Response = require("../services/Responce")
const dbKnex = require("../db/dbKnex")
const axiosUsers = require("../services/Axios")

const getChat = async (ctx) => {
    // const client_id = ctx.client_id

    const chat_id = parseInt(ctx.params.chat_id)

    try {
        const chat = await dbKnex("users_clients_chats_messages").where({ chat_id }).select("*").orderBy("created_at", "desc")

        return Response(ctx, 200, chat)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const sendMessage = async (ctx) => {
    const { message, chat_id } = ctx.request.body
    const client_id = ctx.client_id
    try {
        const newMessage = await dbKnex("users_clients_chats_messages").insert({ chat_id, sender_id: client_id, message, state: "ok" })
        return Response(ctx, 200, "Сообщение отправлено")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const createChatRoom = async (ctx) => {
    const type = ctx.request.body?.type
    if (!type) return Response(ctx, 403, "Тип чата не указан")

    try {
        const chat = await dbKnex("users_clients_chats").insert({type}).returning("*")

        return Response(ctx, 200, chat)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

// Убрать
// const createChatWithFriend = async (ctx) => {
//     const client_id = ctx.client_id
//     const friend_id = ctx.request.body.friend_id
//     const token = ctx.request.headers?.accesstoken

//     try {
//         try {
//             const user = await axiosUsers.post(
//                 `/api/client/check`,
//                 { user_id: friend_id },
//                 {
//                     headers: {
//                         accesstoken: token,
//                     },
//                 }
//             )
//         } catch (error) {
//             return Response(ctx, 403, error.response.data)
//         }

//         const chat = await dbKnex("users_clients_chats").insert({}).returning("*")

//         const data = {
//             chat_id: chat[0].id,
//             client1_id: client_id,
//             client2_id: friend_id,
//         }

//         console.log(data);

//         const friendChat = await dbKnex("users_clients_chats_friends").insert(data).returning("*")
//         return Response(ctx, 200, "Чат создан")
//     } catch (error) {
//         console.error(error)
//         return Response(ctx, 403, error.detail)
//     }
// }

module.exports = {
    getChat,
    // createChatWithFriend,
    createChatRoom,
    sendMessage,
}
