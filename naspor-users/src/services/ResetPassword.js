const config = require("../../config/config")
const { sendEmail } = require("./Email")

function sendPasswordResetEmail(email, token) {
    const resetLink = `${config.frontendURL}/reset-password?token=${token}`

    const resetPasswordEmail = {
        from: config.email,
        to: email,
        subject: "Восстановление пароля",
        html: `<p>Нажмите ссылку ниже для восстановления пароля:</p>
                <a href="${resetLink}">Ссылка для восстановления пароля</a>
                <p>Если вы не отправляли запрос на восставноления пароля, то проигнорируйте это сообщение.</p>`,
    }

    sendEmail(resetPasswordEmail)
}

module.exports = sendPasswordResetEmail