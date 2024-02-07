const Router = require("@koa/router")
const Joi = require("@hapi/joi")
const { ValidateRequest } = require("../middleware/ValidateRequest")
const { getCategories, createCategory, editCategory, getCategory, deleteCategory } = require("../controllers/categoryController")
const { TokenValidateAdmin } = require("../middleware/TokenValidate")

const router = new Router()
const categoryRouter = new Router()

router
    .get("/all", getCategories)
    .get("/:category_id", getCategory)
    .post(
        "/new",
        TokenValidateAdmin,
        ValidateRequest(
            Joi.object()
                .keys({
                    category_name: Joi.string().required(),
                })
                .unknown(false)
        ),
        createCategory
    )
    .post(
        "/edit/:category_id",
        TokenValidateAdmin,
        ValidateRequest(
            Joi.object()
                .keys({
                    category_name: Joi.string(),
                })
                .unknown(false)
        ),
        editCategory
    )
    .post("/delete/:category_id", TokenValidateAdmin, deleteCategory)

categoryRouter.use("/api/category", router.routes())

module.exports = categoryRouter
