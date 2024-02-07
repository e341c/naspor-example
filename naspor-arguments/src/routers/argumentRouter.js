const Router = require("@koa/router")
const Joi = require("@hapi/joi")
const { ValidateRequest } = require("../middleware/ValidateRequest")
const { TokenValidate, TokenValidateAdmin } = require("../middleware/TokenValidate")
const { getArguments, getArgument, createArgument, deleteArgument, getArgumentsHistory, participateInArgument } = require("../controllers/argumentController")

const router = new Router()
const argumentRouter = new Router()

router
    .get("/history", TokenValidate, getArgumentsHistory)
    .get("/all", getArguments)
    .get("/:argument_id", getArgument)
    // сделать middleware на проверку friends id
    .post(
        "/new",
        TokenValidate,
        ValidateRequest(
            Joi.object()
                .keys({
                    category_id: Joi.number().required(),
                    amount: Joi.number().required(),
                    type: Joi.string().required(),
                    team1_id: Joi.number().required(),
                    team2_id: Joi.number().required(),
                    time_start: Joi.number().required(),
                    time_end: Joi.number().required(),
                    format: Joi.string().required(),
                    limit: Joi.number(),
                    friends: Joi.array(),
                })
                .unknown(false)
        ),
        createArgument
    )
    .post("/delete/:argument_id", TokenValidateAdmin, deleteArgument)
    .post(
        "/participate/:argument_id",
        TokenValidate,
        ValidateRequest(
            Joi.object()
                .keys({
                    team_bet_id: Joi.number().required(),
                })
                .unknown(false)
        ),
        participateInArgument
    )

argumentRouter.use("/api/argument", router.routes())

module.exports = argumentRouter
