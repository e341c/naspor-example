const Router = require("@koa/router");
const argumentRouter = require("./argumentRouter");
const categoryRouter = require("./categoryRouter");
const teamRouter = require("./teamRouter");

const router = new Router()

router.use(argumentRouter.routes())
router.use(categoryRouter.routes())
router.use(teamRouter.routes())

module.exports = router