const bcrypt = require("bcryptjs")

async function hashPassword(password) {
    password.toString()
    const res = await bcrypt.hash(password, 10)
    return res
}

async function comparePassword(password, passwordHash) {
    password.toString()
    const res = await bcrypt.compare(password, passwordHash)
    return res
}

module.exports = {
    hashPassword,
    comparePassword,
}