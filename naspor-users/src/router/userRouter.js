const Router = require("@koa/router")
const Joi = require("@hapi/joi")
const { ValidateRequest } = require("../middleware/ValidateRequest")
const { TokenValidate } = require("../middleware/TokenValidate")
const {
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
} = require("../controllers/userController")

const router = new Router()
const userRouter = new Router()

router
    .post("/refresh", refresh)
    .post(
        "/register",
        ValidateRequest(
            Joi.object()
                .keys({
                    name: Joi.string().required(),
                    email: Joi.string().required(),
                    phone: Joi.string().required(),
                    password: Joi.string().required(),
                    img: Joi.object(),
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
                    login: Joi.string().required(),
                    password: Joi.string().required(),
                })
                .unknown(false)
        ),
        login
    )
    .get("/profile", TokenValidate, profile)
    .post(
        "/profile/edit/name",
        ValidateRequest(
            Joi.object()
                .keys({
                    name: Joi.string(),
                })
                .unknown(false)
        ),
        TokenValidate,
        editName
    )
    .post(
        "/profile/edit/password",
        ValidateRequest(
            Joi.object()
                .keys({
                    password: Joi.string(),
                    re_password: Joi.string(),
                })
                .unknown(false)
        ),
        TokenValidate,
        editPassword
    )
    .post(
        "/profile/password/recovery/send_email",
        ValidateRequest(
            Joi.object()
                .keys({
                    email: Joi.string().required(),
                })
                .unknown(false)
        ),
        sendRecoveryEmail
    )
    .post(
        "/profile/password/recovery/new_password",
        ValidateRequest(
            Joi.object()
                .keys({
                    email: Joi.string(),
                    token: Joi.string().required(),
                    newPassword: Joi.string().required(),
                    confirmPassword: Joi.string().required(),
                })
                .unknown(false)
        ),
        recoveryPassword
    )
    // .post(
    //     "/profile/password/recovery/step_1",
    //     TokenValidate,
    //     sendSmsCode
    // )
    // .post(
    //     "/profile/password/recovery/step_2",
    //     ValidateRequest(
    //         Joi.object()
    //             .keys({
    //                 code: Joi.number().required(),
    //             })
    //             .unknown(false)
    //     ),
    //     TokenValidate,
    //     verifyCode
    // )
    // .post(
    //     "/profile/password/recovery/step_3",
    //     ValidateRequest(
    //         Joi.object()
    //             .keys({
    //                 code: Joi.number().required(),
    //                 password: Joi.string().required(),
    //                 re_password: Joi.string().required()
    //             })
    //             .unknown(false)
    //     ),
    //     TokenValidate
    // )
    // .post(
    //     "/profile/password/recovery/newpassword",
    //     ValidateRequest(
    //         Joi.object()
    //             .keys({
    //                 password: Joi.string().required(),
    //                 re_password: Joi.string().required(),
    //             })
    //             .unknown(false)
    //     ),
    //     TokenValidate
    // )
    .post("/profile/edit/img", TokenValidate, editImg)
    .get("/friends", TokenValidate, getFriends)
    .post("/friends/add", TokenValidate, addFriend)
    .post("/friends/approve/:request_id", TokenValidate, approveFriend)
    .post("/friends/delete/:request_id", TokenValidate, deleteFriend)
    .post("/check", checkUser)

userRouter.use("/api/client", router.routes())

module.exports = userRouter
