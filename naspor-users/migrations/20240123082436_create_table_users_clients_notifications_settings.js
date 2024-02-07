/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users_clients_notifications_settings", (table) => {
        table.bigIncrements("id").primary()
        table.bigint("client_id").unsigned().notNullable()

        table.boolean("arguments").defaultTo(true).notNullable()
        table.boolean("opened_argument").defaultTo(true).notNullable()
        table.boolean("closed_argument").defaultTo(true).notNullable()
        table.boolean("chat").defaultTo(true).notNullable()
        table.boolean("admin").defaultTo(true).notNullable()
        table.boolean("result").defaultTo(true).notNullable()

        table.foreign("client_id").references("id").inTable("users_clients").onDelete("cascade")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("users_clients_notifications_settings")
};
