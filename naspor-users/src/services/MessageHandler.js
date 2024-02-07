const dbKnex = require("../db/dbKnex.js")
const { sendEmail } = require("./Email.js")
const getNotificationsPermissions = require("./notification.js")
const rabbitClient = require("./rabbitmq/client.js")

class MessageHandler {
    static async handle(operation, data, correlationId, replyTo) {
        let response = {}

        if (operation == "send_notification") {
            data.clients.forEach(async (client_id) => {
                console.log(client_id);
                const client = await dbKnex("users_clients").where({ id: client_id }).select(["email"])
                console.log(client);
                if (client[0].email) {
                    await dbKnex("users_clients_notifications")
                        .insert({ client_id, type: data.type, notification: data.notification })
                        .on("query-error", (err) => console.error("Query error..", err))

                    // проверяет настройки уведомлений для пользователя
                    const permissions = await getNotificationsPermissions(client_id, data.type)
                    console.log(permissions);
                    // если уведомелния разрешенны, то отправляет уведомление на email
                    if (permissions) await sendEmail(data.mailOptions)
                }
            })
            response = { success: true }
        }

        await rabbitClient.produce(response, correlationId, replyTo)
    }
}

module.exports = MessageHandler
