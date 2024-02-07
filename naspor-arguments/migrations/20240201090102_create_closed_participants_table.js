/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("arguments_closed_participants", (table) => {
        table.bigIncrements("id").primary()
        table.bigint("argument_id").unsigned().notNullable()
        table.bigint("client_id").unsigned().notNullable()

        // table.string("status").notNullable()

        table.foreign("argument_id").references("id").inTable("arguments").onDelete("cascade")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("arguments_closed_participants")
};
