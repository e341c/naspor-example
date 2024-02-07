/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("arguments_teams", (table) => {
        table.bigIncrements("id").primary()

        table.string("team_name").notNullable()
        table.string("team_img").notNullable()

        table.bigint("team_category_id")

        table.foreign("team_category_id").references("id").inTable("arguments_category").onDelete("cascade")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("arguments_teams")
}
