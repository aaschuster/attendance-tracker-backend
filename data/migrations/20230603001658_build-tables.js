const {startingPts} = require("../../consts");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema

  .createTable("roles", table => {
    table.increments("role_id");
    table.string("role");
  })

  .createTable("users", table => {
    table.increments("user_id");
    table.string("firstname")
        .notNullable();
    table.string("lastname")
        .notNullable();
    table.string("hiredate")
        .notNullable()
        .defaultTo(new Date().toLocaleDateString());
    table.decimal("points")
        .notNullable()
        .defaultTo(startingPts);
    table.string("email")
        .unique();
    table.string("password");
    table.integer("role_id")
        .unsigned()
        .notNullable()
        .references("role_id")
        .inTable("roles")
        .onDelete("RESTRICT")
        .onUpdate("RESTRICT");
  })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};
