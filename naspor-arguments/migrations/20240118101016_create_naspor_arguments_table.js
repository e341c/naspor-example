/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("arguments", (table) => {
        table.bigIncrements("id").primary()
        table.bigint("category_id").unsigned().notNullable()

        table.bigint("amount").unsigned().notNullable()
        table.string("type").notNullable()

        table.bigint("team1_id").unsigned().notNullable()
        table.bigint("team2_id").unsigned().notNullable()

        table.integer("time_start").notNullable()
        table.integer("time_end").notNullable()

        table.string("format").notNullable()

        table.integer("limit")

        table.integer("created_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))
        table.integer("updated_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))

        table.foreign("category_id").references("id").inTable("arguments_category").onDelete("cascade")
        table.foreign("team1_id").references("id").inTable("arguments_teams").onDelete("cascade")
        table.foreign("team2_id").references("id").inTable("arguments_teams").onDelete("cascade")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("arguments")
}
