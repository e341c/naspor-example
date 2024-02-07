const nodemailer = require("nodemailer")
const config = require("../../config/config")

const transporter = nodemailer.createTransport(config.email)

async function sendEmail(mailOptions) {
    try {
        return await transporter.sendMail(mailOptions)
    } catch (err) {
        console.error(err)
        return
    }
}

module.exports = {
    sendEmail,
}
