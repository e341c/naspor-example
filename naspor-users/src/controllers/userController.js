const dbKnex = require("../db/dbKnex")
const JWTService = require("../services/token/TokenService")
const Response = require("../services/Responce")
const { saveFile, deleteFile, updateFile } = require("../services/File")
// const generateCode = require("../services/GenerateCode")
const { hashPassword, comparePassword } = require("../services/Password")
const sendPasswordResetEmail = require("../services/ResetPassword")
const axiosChats = require("../services/Axios")
const { sendEmail } = require("../services/Email")
const config = require("../../config/config")
const getNotificationsPermissions = require("../services/notification")

const jwtService = new JWTService()
const refresh_key = process.env.REFRESH_KEY

const refresh = async (ctx) => {
    const refreshToken = ctx.request.header?.refreshtoken

    if (!refreshToken) return Response(ctx, 401, "Refresh token not provided")

    try {
        const decoded = jwtService.verifyToken(refreshToken, refresh_key)
        const accesstoken = jwtService.generateAccessToken({ user_id: decoded.user_id, type: "clienttoken" })

        return Response(ctx, 200, { ok: true, accesstoken: accesstoken })
    } catch (error) {
        console.error(error)
        return Response(ctx, 401, error)
    }
}

const register = async (ctx) => {
    const body = ctx.request.body
    const img = ctx.request.files.img

    if (img) {
        if (!["image/jpeg", "image/png", "image/jpg", "image/svg"].includes(img.mimetype)) {
            return Response(ctx, 403, "Фотогорафия должна быть с расширением png, jpg, jpeg, svg")
        }

        const maxSize = 1 * 1024 * 1024
        if (img.size > maxSize) return Response(ctx, 413, "Файл не может быть больше 1mb")
    }

    body.phone = body.phone.replace(/\D/g, "")

    try {
        const user = await dbKnex("users_clients").where({ phone: body.phone }).orWhere({ email: body.email }).select("id")
        if (user?.length) {
            return Response(ctx, 403, "Номер или email уже зарегистрирован")
        }

        const imgPath = saveFile(img, "images/clients")

        body.img = `/${imgPath}`

        body.password = await hashPassword(body.password)

        const newUser = await dbKnex("users_clients")
            .insert(body)
            .returning("*")
            .on("query-error", (err) => Response(ctx, 403, err.detail))

        const notificationSettings = await dbKnex("users_clients_notifications_settings").insert({ client_id: newUser[0].id })

        return Response(ctx, 200, "Вы успешно зарегистрированы")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const login = async (ctx) => {
    const body = ctx.request.body

    let isPhoneNumber = false
    let isEmail = false

    const phoneNumberRegex = /^\d+$/
    if (phoneNumberRegex.test(body.login)) {
        isPhoneNumber = true
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(body.login)) {
        isEmail = true
    }

    let client

    try {
        if (isEmail) {
            client = await dbKnex("users_clients").where({ email: body.login }).select("*")
        } else {
            body.login = body.login.replace(/\D/g, "")
            client = await dbKnex("users_clients").where({ phone: body.login }).select("*")
        }

        if (!client.length) return Response(ctx, 401, "Номер или email не зарегистрирован")

        const validPassword = await comparePassword(body.password, client[0].password)
        if (!validPassword) return Response(ctx, 403, "Вы ввели неверный пароль")

        const accesstoken = jwtService.generateAccessToken({ user_id: client[0].id, type: "clienttoken" })
        const refreshtoken = jwtService.generateRefreshToken({ user_id: client[0].id, type: "clienttoken" })

        return Response(ctx, 200, { ok: true, accesstoken, refreshtoken })
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const profile = async (ctx) => {
    const client_id = ctx.client_id

    try {
        const client = await dbKnex("users_clients").where({ id: client_id }).select("*")

        return Response(ctx, 200, client)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const getFriends = async (ctx) => {
    const client_id = ctx.client_id

    try {
        const friendsList = await dbKnex("users_clients_friends").where({ client_id: client_id }).orWhere({ friend_id: client_id }).orderBy("state", "desc").orderBy("created_at", "desc").select("*")

        return Response(ctx, 200, friendsList)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const addFriend = async (ctx) => {
    const client_id = ctx.client_id
    const friend_id = ctx.request.body.friend_id

    if (!friend_id) return Response(ctx, 403, "Введите id")

    if (friend_id == client_id) return Response(ctx, 403, "Вы не можете добавить себя в друзья")

    try {
        const friend = await dbKnex("users_clients").where({ id: friend_id }).select(["id", "email"]).first()
        if (!friend) return Response(ctx, 403, `Пользователь с id: ${friend_id} не существует`)

        const addToFriendList = await dbKnex("users_clients_friends")
            .insert({ client_id, friend_id })
            .returning("*")
            .on("query-error", (err) => Response(ctx, 403, err.detail))

        // проверяет настройки уведомлений для пользователя
        const permissions = await getNotificationsPermissions(friend_id, "friend_request")

        // если уведомелния разрешенны, то отправляет уведомление на email
        if (permissions) {
            const mailOptions = {
                from: config.email,
                to: friend.email,
                subject: "Вас добавили в друзья",
                html: "<p>Вам пришел запрос на дружбу</p>",
            }

            await sendEmail(mailOptions)
        }

        return Response(ctx, 200, addToFriendList)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const approveFriend = async (ctx) => {
    const client_id = ctx.client_id
    const request_id = parseInt(ctx.params.request_id)

    if (!request_id) return Response(ctx, 403, "Вы не ввели id заявки")
    try {
        const friendRequest = await dbKnex("users_clients_friends").where({ id: request_id }).select("*")

        if (!friendRequest[0]) return Response(ctx, 403, "Заявки не существует")

        if (friendRequest[0].client_id == client_id) return Response(ctx, 403, "Ваш друг должен принять заявку")

        if (friendRequest[0].state == "approved") return Response(ctx, 403, "Вы уже приняли заявку")

        const token = ctx.request.headers?.accesstoken

        console.log(token)

        const data = {
            state: "approved",
        }
        try {
            const createChatApi = await axiosChats.post(
                "/api/chat/create",
                { type: "personal" },
                {
                    headers: {
                        accesstoken: token,
                    },
                }
            )
            console.log(createChatApi.data)
            data.chat_id = createChatApi.data[0].id
            console.log(data.chat_id)
        } catch (error) {
            console.error(error)
            return Response(ctx, 403, error)
        }

        // if (chat.response?.error) return Response(ctx, 403, "err")

        const approvedRequst = await dbKnex("users_clients_friends").update({ state: "approved", chat_id }).returning("*")

        console.log(approvedRequst)

        return Response(ctx, 200, "Заявка принята")
    } catch (error) {
        // console.error(error)
        return Response(ctx, 403, error)
    }
}

const deleteFriend = async (ctx) => {
    const client_id = ctx.client_id
    const request_id = parseInt(ctx.params.request_id)

    try {
        const deleteFriend = await dbKnex("users_clients_friends").where({ id: request_id, client_id }).orWhere({ id: request_id, friend_id: client_id }).delete().returning("*")

        if (!deleteFriend[0]) return Response(ctx, 403, "Заявки не существует")

        return Response(ctx, 200, "Успешно удалено")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const editName = async (ctx) => {
    const client_id = ctx.client_id
    const name = ctx.request.body.name

    try {
        const client = await dbKnex("users_clients").where({ id: client_id }).update({ name })

        return Response(ctx, 200, "Имя успешно изменено")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const editImg = async (ctx) => {
    const client_id = ctx.client_id
    const img = ctx.request.files?.img

    if(!img) return Response(ctx, 403, "Вы не выбрали фото")

    if (img) {
        if (!["image/jpeg", "image/png", "image/jpg", "image/svg"].includes(img.mimetype)) {
            return Response(ctx, 413, "Фотогорафия должна быть с расширением png, jpg, jpeg, svg")
        }

        const maxSize = 1 * 1024 * 1024
        if (img.size > maxSize) return Response(ctx, 403, "Файл не может быть больше 1mb")
    }

    try {
        const client = await dbKnex("users_clients").where({ id: client_id }).select("*")

        const path = updateFile(img, client[0].img, "images/clients")

        const updateClient = await dbKnex("users_clients")
            .where({ id: client_id })
            .update({ img: `/${path}` })
            .returning("*")

        return Response(ctx, 200, "Фотография профиля изменена")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

// Доделать
const editPassword = async (ctx) => {
    const client_id = ctx.client_id

    const body = ctx.request.body

    if (body.password !== body.re_password) return Response(ctx, 403, "Пароли не совпадают")

    try {
        const passwordHash = await hashPassword(body.password)

        const client = await dbKnex("users_clients").where({ id: client_id }).update({ password: passwordHash })

        return Response(ctx, 200, "Пароль успешно изменен")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

// Отправляется ссылка с токеном на почту, фронт берет токен и отправляет его на запрос /api/client/profile/password/recovery/new_password
const sendRecoveryEmail = async (ctx) => {
    const { email } = ctx.request.body

    try {
        const client = await dbKnex("users_clients").where({ email }).select("*")

        if (!client[0]) return Response(ctx, 403, "Ваш email не зарегистрирован")

        const token = jwtService.generateAccessToken({ user_id: client[0].id, type: "clienttoken" })

        sendPasswordResetEmail(email, token)

        return Response(ctx, 200, `Письмо для восстановления пароля отправлено на почту ${email}`)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const recoveryPassword = async (ctx) => {
    const { email, token, newPassword, confirmPassword } = ctx.request.body
    if (newPassword !== confirmPassword) return Response(ctx, 403, "Пароли не совпадают")

    try {
        const client_id = jwtService.verifyTokenAndGetUserId(token, "clienttoken")
        if (!client_id) return Response(ctx, 403, "Токен истек или не действителен")

        const client = await dbKnex("users_clients").where({ id: client_id }).select("*")
        if (!client[0]) return Response(ctx, 403, "Ваш email не зарегистрирован")

        const passwordHash = await hashPassword(newPassword)

        await dbKnex("users_clients").where({ id: client_id }).update({ password: passwordHash })

        return Response(ctx, 200, "Пароль успешно изменен")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

// // Смс код восстановление
// const sendSmsCode = async (ctx) => {
//     const client_id = ctx.client_id

//     const code = generateCode()

//     console.log(code)

//     try {
//         const client = await dbKnex("users_clients").where({ id: client_id }).update({ code }).returning("*")

//         // code to send sms code to phone

//         return Response(ctx, 200, "Смс код отправлен")
//     } catch (error) {
//         console.error(error)
//         return Response(ctx, 403, error)
//     }
// }

// // Смс код восстановление
// const verifyCode = async (ctx) => {
//     const client_id = ctx.client_id
//     const code = ctx.request.body.code

//     try {
//         const client = await dbKnex("users_clients").where({ id: client_id }).select("code")

//         if (code != client[0].code) return Response(ctx, 403, "Код не совпадает")

//         return Response(ctx, 200, "Код подтвержден")
//     } catch (error) {
//         console.error(error)
//         return Response(ctx, 403, error)
//     }
// }

const checkUser = async (ctx) => {
    const user_id = ctx.request.body.user_id
    try {
        const user = await dbKnex("users_clients").where({ id: user_id }).select("*")

        if (!user[0]) return Response(ctx, 403, "Пользователь не найден")

        return Response(ctx, 200, user)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

module.exports = {
    register,
    login,
    profile,
    refresh,
    getFriends,
    addFriend,
    approveFriend,
    deleteFriend,
    editName,
    editPassword,
    editImg,
    // sendSmsCode,
    // verifyCode,
    checkUser,
    sendRecoveryEmail,
    recoveryPassword,
}
