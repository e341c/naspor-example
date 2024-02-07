const Router = require("@koa/router")
const { getTeams, getTeam, createTeam, editTeam, deleteTeam } = require("../controllers/teamController")
const { ValidateRequest } = require("../middleware/ValidateRequest")
const Joi = require("@hapi/joi")
const { TokenValidateAdmin } = require("../middleware/TokenValidate")

const router = new Router()
const teamRouter = new Router()

router
    .get("/all", getTeams)
    .get("/:team_id", getTeam)
    .post(
        "/new",
        TokenValidateAdmin,
        ValidateRequest(
            Joi.object()
                .keys({
                    team_name: Joi.string().required(),
                    team_category_id: Joi.number().required(),
                })
                .unknown(false)
        ),
        createTeam
    )
    .post(
        "/edit/:team_id",
        TokenValidateAdmin,
        ValidateRequest(
            Joi.object()
                .keys({
                    team_name: Joi.string(),
                    team_category_id: Joi.number(),
                })
                .unknown(false)
        ),

        editTeam
    )
    .post("/delete/:team_id", TokenValidateAdmin, deleteTeam)

teamRouter.use("/api/team", router.routes())

module.exports = teamRouter
