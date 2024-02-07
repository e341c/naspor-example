/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("arguments_category", (table) => {
        table.bigIncrements("id").primary()

        table.string("category_name").notNullable()
        table.string("category_img").notNullable()
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("arguments_category")
}
