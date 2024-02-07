const Router = require("@koa/router")
const userRouter = require("./userRouter")
const notificationRouter = require("./notificationRouter")
const adminRouter = require("./adminRouter")

const router = new Router()

router.use(adminRouter.routes())
router.use(userRouter.routes())
router.use(notificationRouter.routes())

module.exports = router
