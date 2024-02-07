/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("users_clients", (table) => {
        table.bigIncrements("id").primary()
        table.string("name").notNullable()

        table.string("email").unique().notNullable()
        table.bigint("phone").unique().notNullable()

        table.string("password").notNullable()
        table.string("img")

        table.integer("code")

        table.integer("created_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))
        table.integer("updated_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("users_clients")
}
