const config = require("../../config/config")
const { client } = require("../../knexfile")
const dbKnex = require("../db/dbKnex")
const Response = require("../services/Responce")
// const addParticipantsToArgument = require("../services/closedArgument")
const RabbitMqClient = require("../services/rabbitmq/client")

const getArguments = async (ctx) => {
    try {
        const arguments = await dbKnex("arguments")
            .whereNot({ format: "closed" })
            .andWhere({ status: "active", type: "real" })
            .select("*")
        return Response(ctx, 200, arguments)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const getClosedArguments = async (ctx) => {
    try {
        const arguments = await dbKnex("arguments").where({ format: "closed" }).select("*")
        return Response(ctx, 200, arguments)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const getArgument = async (ctx) => {
    const argument_id = parseInt(ctx.params?.argument_id)
    if (!argument_id) return Response(ctx, 400, "Не указан id спора")

    try {
        const argument = await dbKnex("arguments").where({ id: argument_id }).select("*")
        if (!argument[0]) return Response(ctx, 404, "Спора с таким id не существует")
        return Response(ctx, 200, argument)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const getArgumentsHistory = async (ctx) => {
    const client_id = ctx.client_id
    try {
        const argumentsCreated = await dbKnex("arguments").where({ author_id: client_id }).select("*")
        const argumentsHistory = await dbKnex("arguments_participation").where({ client_id }).select("*")
        const history = {
            created: argumentsCreated,
            participated: argumentsHistory,
        }
        return Response(ctx, 200, history)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

// сделать проверку friends id
const createArgument = async (ctx) => {
    const body = ctx.request.body
    const client_id = ctx.client_id
    body.author_id = client_id
    body.status = "active"
    const friends = body.friends
    delete body.friends

    if (body.format == "closed" && !friends?.length) {
        return Response(ctx, 400, "Вы создаете закрытый спор но не добавляете в него участников")
    }

    // const token = ctx.request.headers?.accesstoken

    const responce = await RabbitMqClient.produce({ operation: "create", type: "argument" }, config.rabbitMQ.queues.rpcQueueChats)
    body.chat_id = responce[0].id

    try {
        const newArgument = await dbKnex("arguments")
            .insert(body)
            .on("query-error", (err) => Response(ctx, 403, err.detail))
            .returning("*")

        // if (body.format == "closed") {
        //     if (friends) {
        //         await addParticipantsToArgument(newArgument[0].id, friends)
        //     }
        // }

        if (friends) {
                const emailData = {
                    clients: friends,
                    mailOptions: {
                        subject: "Вас пригласили на спор",
                        html: "<p>Вы были приглашены в закрытый или открытый спор</p>",
                    },
                    type: `${body.format}_argument`,
                    notification: "Вас пригласили на спор"
                }
            const notification = await RabbitMqClient.produce({ operation: "send_notification", ...emailData }, config.rabbitMQ.queues.rpcQueueUsers)
            console.log("Notification responce..", notification);
            //     await broker.send("users", emailData)
            //     // try {
            //     //     await axiosUsers.post("/api/notifications/send", emailData)
            //     // } catch (error) {
            //     //     console.error(error)
            //     //     return Response(ctx, 400, error)
            //     // }
        }

        return Response(ctx, 200, newArgument)
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const deleteArgument = async (ctx) => {
    const argument_id = parseInt(ctx.params.argument_id)
    if (!argument_id) return Response(ctx, 400, "Не указан id спора")

    try {
        await dbKnex("arguments")
            .where({ id: argument_id })
            .delete()
            .on("query-error", (err) => Response(ctx, 403, err.detail))
        return Response(ctx, 200, "Спор удален")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

const participateInArgument = async (ctx) => {
    const client_id = ctx.client_id
    const limit = 20 // прописать логику на лимит польщователей в споре
    const argument_id = parseInt(ctx.params.argument_id)
    if (!argument_id) return Response(ctx, 400, "Не указан id спора")

    const { team_bet_id } = ctx.request.body

    try {
        const argument = await dbKnex("arguments").where({ id: argument_id }).first().count()
        if (argument.count != 1) return Response(ctx, 403, "Спор с таким id не существует")

        await dbKnex("arguments_participation").insert({ argument_id, client_id, team_bet_id, status: "status" })

        return Response(ctx, 200, "Ставка успешно сделана")
    } catch (error) {
        console.error(error)
        return Response(ctx, 403, error)
    }
}

module.exports = {
    getArguments,
    getArgument,
    createArgument,
    deleteArgument,
    getArgumentsHistory,
    participateInArgument,
}
