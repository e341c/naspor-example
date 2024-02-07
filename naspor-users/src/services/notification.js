const dbKnex = require("../db/dbKnex")

async function getNotificationsPermissions(client_id, notificationType) {
    const notificationsSettings = await dbKnex("users_clients_notifications_settings")
        .where({ client_id })
        .select(["arguments", "opened_argument", "closed_argument", "chat", "admin", "result", "friend_request"])
        .first()

    console.log("Client notifications..", notificationsSettings)
    for (const key in notificationsSettings) {
        if (notificationsSettings[key] === true && key == notificationType) {
            return true
        }
    }
    return false
}

// async function

module.exports = getNotificationsPermissions
