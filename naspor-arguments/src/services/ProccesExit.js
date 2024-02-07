"use strict"

function onClose(db) {
    process.on("exit", (code) => {
        console.log(`About to exit with code: ${code}`)

        db.destroy()
            .then(() => {
                console.log("Knex connection closed")
            })
            .catch((err) => {
                console.error(`Error closing knex connections`, err)
            })
        process.exit(1)
    })

    process.on("uncaughtException", (err) => {
        console.error("Uncaught exception:", err)

        db.destroy()
            .then(() => {
                console.log("Knex connections closed.")
            })
            .catch((destroyErr) => {
                console.error("Error closing Knex connections during uncaught exception:", destroyErr)
            })

        process.exit(1)
    })

    process.on("SIGINT", () => {
        console.log("Received SIGINT. Shutting down gracefully.")

        db.destroy()
            .then(() => {
                console.log("Knex connections closed.")
            })
            .catch((err) => {
                console.error("Error closing Knex connections during SIGINT:", err)
            })

        process.exit()
    })
}

module.exports = onClose
