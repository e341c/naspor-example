const jwt = require("jsonwebtoken")
require("dotenv").config()

class JWTService {
    constructor() {
        this.secret = process.env.JWT_KEY
        this.refreh_secret = process.env.REFRESH_KEY
    }

    generateAccessToken(payload, expiresIn = "1h") {
        return jwt.sign(payload, this.secret, { expiresIn })
    }

    generateRefreshToken(payload, expiresIn = "30d") {
        return jwt.sign(payload, this.refreh_secret, { expiresIn })
    }

    verifyToken(token, secret = this.secret) {
        try {
            const data = jwt.verify(token, secret)

            return data
        } catch (err) {
            // console.error(err)
            return null
        }
    }

    verifyTokenAndGetUserId(token, token_type = "accesstoken") {
        try {
            const obj = this.verifyToken(token)
            if (obj === null) {
                return null
            }
            if (obj.type !== token_type) {
                return null
            }
            return obj.user_id
        } catch (err) {
            // console.error(err)
            return null
        }
    }
}

module.exports = JWTService
