/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("users_clients", (table) => {
        table.bigint("real_balance").notNullable().defaultTo(0)
        table.bigint("virtual_balance").notNullable().defaultTo(10000)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("users_clients", (table) => {
        table.dropColumn("real_balance")
        table.dropColumn("virtual_balance")
    })
}
