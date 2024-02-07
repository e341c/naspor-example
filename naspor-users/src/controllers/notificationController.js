const config = require("../../config/config")
const dbKnex = require("../db/dbKnex")
const { sendEmail } = require("../services/Email")
const Response = require("../services/Responce")
const getNotificationsPermissions = require("../services/notification")

const sendNotification = async (ctx) => {
    const clients = ctx.request.body?.clients
    const mailOptions = ctx.request.body?.mailOptions
    const type = ctx.request.body?.type

    mailOptions.from = config.email

    try {
        // итерирует по всем клиентам в массиве clients
        clients?.map(async (client_id) => {
            const client = await dbKnex("users_clients").where({ id: client_id }).select("*")

            if (client[0]) {
                mailOptions.to = client[0].email

                // создает уведомление в базе
                await dbKnex("users_clients_notifications")
                    .insert({ client_id, type })
                    .on("query-error", (err) => Response(ctx, 403, err.detail))

                // проверяет настройки уведомлений для пользователя
                const permissions = await getNotificationsPermissions(client_id, type)
                
                // если уведомелния разрешенны, то отправляет уведомление на email
                if (permissions) await sendEmail(mailOptions)
            }
        })
        return Response(ctx, 200, "Уведомление отправлено")
    } catch (error) {
        return Response(ctx, 403, error)
    }
}

module.exports = sendNotification
