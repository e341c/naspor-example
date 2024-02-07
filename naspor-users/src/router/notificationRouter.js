const Router = require("@koa/router")
const { ValidateRequest } = require("../middleware/ValidateRequest")
const Joi = require("@hapi/joi")
const sendNotification = require("../controllers/notificationController")

const router = new Router()
const notificationRouter = new Router()

router.post(
    "/send",
    ValidateRequest(
        Joi.object()
            .keys({
                clients: Joi.array().required(),
                mailOptions: Joi.object().required(),
                type: Joi.string().required(),
            })
            .unknown(false)
    ),
    sendNotification
)

notificationRouter.use("/api/notifications", router.routes())

module.exports = notificationRouter
