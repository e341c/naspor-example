/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("users_clients_chats_messages", (table) => {
        table.bigIncrements("id").primary()
        table.bigInteger("chat_id").unsigned().notNullable()
        table.bigInteger("sender_id").unsigned().notNullable()

        table.string("message").notNullable()
        table.string("state").notNullable()

        table.integer("created_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))
        table.integer("updated_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))

        table.foreign("chat_id").references("id").inTable("users_clients_chats").onDelete("cascade")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("users_clients_chats_messages")
}
