const dbKnex = require("../db/dbKnex")
const { saveFile, updateFile, deleteFile } = require("../services/File")
const Response = require("../services/Responce")

const getCategories = async (ctx) => {
    try {
        const categories = await dbKnex("arguments_category").select("*")
        return Response(ctx, 200, categories)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const getCategory = async (ctx) => {
    const category_id = parseInt(ctx.params?.category_id)
    if(!category_id) return Response(ctx, 403, "Укажите id категории")

    try {
        const category = await dbKnex("arguments_category").where({ id: category_id }).select("*")
        if(!category[0]) return Response(ctx, 404, "Рубрики с таким id не существует")

        return Response(ctx, 200, category)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const createCategory = async (ctx) => {
    const { category_name } = ctx.request.body

    const category_img = ctx.request.files.category_img

    if (!category_img) return Response(ctx, 403, "Ва не выбрали фотографию")

    if (category_img) {
        if (!["image/jpeg", "image/png", "image/jpg", "image/svg"].includes(category_img.mimetype)) {
            return Response(ctx, 403, "Фотогорафия должна быть с расширением png, jpg, jpeg, svg")
        }

        const maxSize = 1 * 1024 * 1024
        if (category_img.size > maxSize) return Response(ctx, 413, "Файл не может быть больше 1mb")
    }

    try {
        const imgPath = saveFile(category_img, "images/category")

        const data = {
            category_name,
            category_img: `/${imgPath}`,
        }
        const newCategory = await dbKnex("arguments_category")
            .insert(data)
            .returning("*")
            .on("query-error", (err) => Response(ctx, 403, err.detail))

        return Response(ctx, 201, newCategory)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const editCategory = async (ctx) => {
    const category_name = ctx.request.body?.category_name
    const category_id = parseInt(ctx.params?.category_id)
    if(!category_id) return Response(ctx, 403, "Укажите id категории")

    const category_img = ctx.request.files?.category_img

    const data = {}

    const category = await dbKnex("arguments_category")
        .where({ id: category_id })
        .select("*")
        .catch((error) => {
            console.error(error)
            return Response(ctx, 403, error)
        })

    if (category_name) {
        data.category_name = category_name
    }

    if (category_img) {
        if (!["image/jpeg", "image/png", "image/jpg", "image/svg"].includes(category_img.mimetype)) {
            return Response(ctx, 403, "Фотогорафия должна быть с расширением png, jpg, jpeg, svg")
        }

        const maxSize = 1 * 1024 * 1024
        if (category_img.size > maxSize) return Response(ctx, 413, "Файл не может быть больше 1mb")

        const img_path = category[0].category_img

        const path = updateFile(category_img, img_path, "images/category")

        data.category_img = `/${path}`
    }

    try {
        await dbKnex("arguments_category").where({ id: category_id }).update(data)

        return Response(ctx, 202, "Рубрика изменена")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const deleteCategory = async (ctx) => {
    const category_id = parseInt(ctx.params?.category_id)
    if(!category_id) return Response(ctx, 403, "Укажите id категории")
    try {
        const category = await dbKnex("arguments_category").where({ id: category_id }).select("*")
        if(!category[0]) return Response(ctx, 404, "Рубрики с таким id не существует")
        deleteFile(category[0].category_img)

        await dbKnex("arguments_category").where({ id: category_id }).delete()
        return Response(ctx, 202, "Рубрика удалена")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    editCategory,
    deleteCategory,
}
