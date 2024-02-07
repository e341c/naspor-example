const Response = require("../services/Responce")
const JWTService = require("../services/token/TokenService")

const jwtService = new JWTService()

const TokenValidate = async (ctx, next) => {
    const accesstoken = ctx.request.header?.accesstoken
    console.log(accesstoken);

    try {
        const client_id = jwtService.verifyTokenAndGetUserId(accesstoken, "clienttoken")

        console.log("client token id", client_id)

        if (!client_id) return Response(ctx, 401, "Wrong token")

        ctx.client_id = client_id
        await next()
    } catch (error) {
        console.error(error)
        return Response(ctx, 401, error)
    }
}

const TokenValidateAdmin = async (ctx, next) => {
    const accesstoken = ctx.request.header?.accesstoken
    console.log(accesstoken);

    try {
        const admin_id = jwtService.verifyTokenAndGetUserId(accesstoken, "admintoken")

        console.log("admin token id", admin_id)

        if (!admin_id) return Response(ctx, 401, "Wrong token")

        ctx.client_id = admin_id
        await next()
    } catch (error) {
        console.error(error)
        return Response(ctx, 401, error)
    }
}

module.exports = {
    TokenValidate,
    TokenValidateAdmin
}
