const dbKnex = require("../db/dbKnex")
const { saveFile } = require("../services/File")
const { hashPassword, comparePassword } = require("../services/Password")
const Response = require("../services/Responce")
const JWTService = require("../services/token/TokenService")

const jwtService = new JWTService()
const refresh_key = process.env.REFRESH_KEY

const refresh = async (ctx) => {
    const refreshToken = ctx.request.header?.refreshtoken

    if (!refreshToken) return Response(ctx, 401, "Refresh token not provided")

    try {
        const decoded = jwtService.verifyToken(refreshToken, refresh_key)
        const accesstoken = jwtService.generateAccessToken({ user_id: decoded.user_id, type: "admintoken" })

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

        const imgPath = saveFile(img, "images/admins")

        body.img = `/${imgPath}`
    }

    try {
        const user = await dbKnex("users_admins").where({ email: body.email }).select("id")
        if (user?.length) {
            return Response(ctx, 403, "Email уже зарегистрирован")
        }

        body.password = await hashPassword(body.password)

        const newAdmin = await dbKnex("users_admins")
            .insert(body)
            .returning("*")
            .on("query-error", (err) => Response(ctx, 403, err.detail))

        // const notificationSettings = await dbKnex("users_admins_notifications_settings").insert({ client_id: newAdmin[0].id })

        return Response(ctx, 200, "Вы успешно зарегистрированы")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const login = async (ctx) => {
    const body = ctx.request.body

    console.log(body)

    const admin = await dbKnex("users_admins").where({ email: body.email }).select("*").first()
    if (!admin) return Response(ctx, 404, "Админ с таким email не найден")

    try {
        const validPassword = await comparePassword(body.password, admin.password)
        if (!validPassword) return Response(ctx, 403, "Вы ввели неверный пароль")

        const accesstoken = jwtService.generateAccessToken({ user_id: admin.id, type: "admintoken" })
        const refreshtoken = jwtService.generateRefreshToken({ user_id: admin.id, type: "admintoken" })

        return Response(ctx, 200, { ok: true, accesstoken, refreshtoken })
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const profile = async (ctx) => {
    const admin_id = ctx.admin_id
    try {
        const admin = await dbKnex("users_admins").where({ id: admin_id }).select("*").first()
        return Response(ctx, 200, admin)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

module.exports = {
    refresh,
    register,
    login,
    profile,
}
