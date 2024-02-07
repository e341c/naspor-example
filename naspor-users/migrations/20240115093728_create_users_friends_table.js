/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("users_clients_friends", (table) => {
        table.bigIncrements("id").primary()
        table.bigint("client_id").unsigned().notNullable()
        table.bigint("friend_id").unsigned().notNullable()

        table.string("state").defaultTo("not approved").notNullable()

        table.bigint("chat_id").unsigned()

        table.integer("created_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))
        table.integer("updated_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))

        table.foreign("client_id").references("id").inTable("users_clients").onDelete("cascade")
        table.foreign("friend_id").references("id").inTable("users_clients").onDelete("cascade")

        table.unique(["client_id", "friend_id"])
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("users_clients_friends")
}
