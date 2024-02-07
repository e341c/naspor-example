/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("arguments", (table) => {
        table.string("status").notNullable()
        table.bigint("team_won_id")

        table.foreign("team_won_id").references("id").inTable("arguments_teams").onDelete("cascade")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("arguments", (table) => {
        table.dropColumn("status")
        table.dropColumn("team_won_id")
    })
}
