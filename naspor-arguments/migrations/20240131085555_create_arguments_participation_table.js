/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("arguments_participation", (table) => {
        table.bigIncrements("id").primary()
        table.bigint("argument_id").unsigned().notNullable()
        table.bigint("client_id").unsigned().notNullable()

        table.bigint("team_bet_id").unsigned().notNullable()

        table.string("status").notNullable()

        table.integer("created_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))
        table.integer("updated_at").notNullable().defaultTo(knex.raw("date_part('epoch'::text, now())::integer"))

        table.foreign("argument_id").references("id").inTable("arguments").onDelete("cascade")
        table.foreign("team_bet_id").references("id").inTable("arguments_teams").onDelete("cascade")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("arguments_participation")
}
