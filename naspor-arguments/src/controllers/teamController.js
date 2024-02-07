const dbKnex = require("../db/dbKnex")
const { saveFile, updateFile, deleteFile } = require("../services/File")
const Response = require("../services/Responce")

const getTeams = async (ctx) => {
    try {
        const teams = await dbKnex("arguments_teams").select("*")
        return Response(ctx, 200, teams)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}
const getTeam = async (ctx) => {
    const team_id = parseInt(ctx.params?.team_id)
    try {
        const team = await dbKnex("arguments_teams").where({ id: team_id }).select("*")
        if (!team[0]) return Response(ctx, 404, "Команды с таким id не существует")

        return Response(ctx, 200, team)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const createTeam = async (ctx) => {
    const data = ctx.request.body

    const team_img = ctx.request.files.team_img

    if (!team_img) return Response(ctx, 403, "Ва не выбрали фотографию")

    if (team_img) {
        if (!["image/jpeg", "image/png", "image/jpg", "image/svg"].includes(team_img.mimetype)) {
            return Response(ctx, 403, "Фотогорафия должна быть с расширением png, jpg, jpeg, svg")
        }

        const maxSize = 1 * 1024 * 1024
        if (team_img.size > maxSize) return Response(ctx, 413, "Файл не может быть больше 1mb")
    }
    try {
        const img_path = saveFile(team_img, "images/team")
        data.team_img = `/${img_path}`

        const newTeam = await dbKnex("arguments_teams").insert(data)
        return Response(ctx, 201, "Новая команда создана")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const editTeam = async (ctx) => {
    const team_id = parseInt(ctx.params.team_id)
    const body = ctx.request.body

    const team_img = ctx.request.files.team_img

    const data = {}

    const team = await dbKnex("arguments_teams")
        .where({ id: team_id })
        .select("*")
        .catch((error) => {
            console.error(error)
            return Response(ctx, 403, error)
        })

    if (body.team_name) data.team_name = body.team_name
    if (body.team_category_id) data.team_category_id = body.team_category_id

    if (team_img) {
        if (!["image/jpeg", "image/png", "image/jpg", "image/svg"].includes(team_img.mimetype)) {
            return Response(ctx, 403, "Фотогорафия должна быть с расширением png, jpg, jpeg, svg")
        }

        const maxSize = 1 * 1024 * 1024
        if (team_img.size > maxSize) return Response(ctx, 413, "Файл не может быть больше 1mb")

        const img_path = team[0].team_img

        console.log(img_path)

        const path = updateFile(team_img, img_path, "images/team")

        data.team_img = `/${path}`
    }

    try {
        await dbKnex("arguments_teams").where({ id: team_id }).update(data)

        return Response(ctx, 202, "Команда изменина")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const deleteTeam = async (ctx) => {
    const team_id = parseInt(ctx.params.team_id)
    try {
        const team = await dbKnex("arguments_teams").where({ id: team_id }).select("*")
        if (!team[0]) return Response(ctx, 404, "Команды с таким id не существует")
        deleteFile(team[0].team_img)

        await dbKnex("arguments_teams").where({ id: team_id }).delete()
        return Response(ctx, 202, "Команда удалена")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

module.exports = {
    getTeams,
    getTeam,
    createTeam,
    editTeam,
    deleteTeam,
}
