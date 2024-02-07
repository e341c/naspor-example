/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("users_clients_notifications_settings", (table) => {
        table.boolean("friend_request").defaultTo(true).notNullable()
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("users_clients_notifications_settings", (table) => {
        table.dropColumn("friend_request")
    })
}
