const Router = require("@koa/router")
const { ValidateRequest } = require("../middleware/ValidateRequest")
const Joi = require("@hapi/joi")
const { register, login, refresh, profile } = require("../controllers/adminController")
const { AdminTokenValidate } = require("../middleware/TokenValidate")

const router = new Router()
const adminRouter = new Router()

router
    .post("/refresh", refresh)
    .post(
        "/register",
        ValidateRequest(
            Joi.object()
                .keys({
                    name: Joi.string().required(),
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                })
                .unknown(false)
        ),
        register
    )
    .post(
        "/login",
        ValidateRequest(
            Joi.object()
                .keys({
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                })
                .unknown(false)
        ),
        login
    )
    .get("/profile", AdminTokenValidate, profile)

adminRouter.use("/api/admin", router.routes())

module.exports = adminRouter
