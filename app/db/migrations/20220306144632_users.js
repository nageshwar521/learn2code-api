/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("users").then(function (exists) {
    if (!exists) {
      knex.schema.createTable("users", function (table) {
        table.increments();
        table.string("first_name").notNullable();
        table.string("middle_name").notNullable();
        table.string("last_name").notNullable();
        table.string("phone_number").unique().notNullable();
        table.string("address").nullable();
        table.string("profile_img_url").nullable();
        table.string("dob").nullable();
        table.integer("role_id").references("id").inTable("roles");
        table.string("email").unique().notNullable();
        table.text("password").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
