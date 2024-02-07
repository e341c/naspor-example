const Response = require("../services/Responce")

const ValidateRequest = (schema) => async (ctx, next) => {
    try {
        const { error, value } = schema.validate(ctx.request.body)

        if (error) {
            Response(ctx, 400, '{ "Validation error": ' + JSON.stringify(error.details[0].message) + '}')
            return
        }

        ctx.request.body = value

        await next()
    } catch (err) {
        console.error(err);
        ctx.throw(500, '{ "Validation error": "Internal server error"}')
    }
}

module.exports = {
    ValidateRequest,
}
