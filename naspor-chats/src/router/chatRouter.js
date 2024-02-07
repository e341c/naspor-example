const Router = require("@koa/router")
const Joi = require("@hapi/joi")
const { ValidateRequest } = require("../middleware/ValidateRequest")
const TokenValidate = require("../middleware/TokenValidate")
const { getChat, createChatWithFriend, createChatRoom, sendMessage } = require("../controllers/chatController")

const router = new Router()
const chatRouter = new Router()

router
    // .post(
    //     "/friend/create",
    //     ValidateRequest(
    //         Joi.object()
    //             .keys({
    //                 friend_id: Joi.number().required(),
    //             })
    //             .unknown(false)
    //     ),
    //     TokenValidate,
    //     createChatWithFriend
    // )
    .post(
        "/create",
        ValidateRequest(
            Joi.object()
                .keys({
                    type: Joi.string().required(),
                })
                .unknown(false)
        ),
        TokenValidate,
        createChatRoom
    )
    .post(
        "/send/message",
        ValidateRequest(
            Joi.object()
                .keys({
                    chat_id: Joi.number().required(),
                    message: Joi.string().required(),
                })
                .unknown(false)
        ),
        TokenValidate,
        sendMessage
    )
    .get("/friend/:chat_id", TokenValidate, getChat)

// по chat_id подключение к чату (группа, друг)

chatRouter.use("/api/chat", router.routes())

module.exports = chatRouter
