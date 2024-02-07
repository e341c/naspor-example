require("dotenv").config()

const db_host = process.env.DB_HOST
const db_port = process.env.DB_PORT
const db_name = process.env.DB_NAME
const db_username = process.env.DB_USERNAME
const db_password = process.env.DB_PASSWORD

module.exports = {
    client: "pg",
    connection: {
        host: db_host,
        port: db_port,
        user: db_username,
        password: db_password,
        database: db_name,
    },
    migrations: {
        tableName: "knex_migrations",
        directory: "./migrations",
    },
    pool: {
        min: 2,
        max: 10,
    },
    debug: true,
}

console.log(`Connected to db`)
