const morgan = require("koa-morgan")

const setupLogging = (app) => {
    app.use(morgan("combined"))
}

module.exports = setupLogging