/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("users_clients_notifications", (table) => {
        table.bigIncrements("id").primary()
        table.bigint("client_id").notNullable()

        table.string("type").notNullable()

        table.integer("created_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))
        table.integer("updated_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))

        table.foreign("client_id").references("id").inTable("users_clients").onDelete("cascade")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("users_clients_notifications")
}
