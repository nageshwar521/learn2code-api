/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .hasTable("roles")
    .then(function (exists) {
      if (!exists) {
        return knex.schema.createTable("roles", function (table) {
          table.uuid("id").defaultTo(knex.raw("(UUID())"));
          table.string("name").notNullable();
        });
      }
    })
    .then(function () {
      return knex.schema.hasTable("branches").then(function (exists) {
        if (!exists) {
          return knex.schema.createTable("branches", function (table) {
            table.uuid("id").defaultTo(knex.raw("(UUID())"));
            table.string("branch_name").unique().notNullable();
            table.string("phone_number").unique().notNullable();
            table.string("address").notNullable();
            table.string("latlng").notNullable();
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
          });
        }
      });
    })
    .then(function () {
      return knex.schema.hasTable("users").then(function (exists) {
        if (!exists) {
          return knex.schema.createTable("users", function (table) {
            table.uuid("id").defaultTo(knex.raw("(UUID())"));
            table.string("first_name").nullable();
            table.string("middle_name").nullable();
            table.string("last_name").nullable();
            table.string("phone_number").unique().notNullable();
            table.string("address").nullable();
            table.string("profile_img_url").nullable();
            table.string("dob").nullable();
            table.uuid("role_id").nullable();
            table.uuid("branch_id").nullable();
            table.string("email").unique().notNullable();
            table.string("username").unique().nullable();
            table.text("password").notNullable();
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
          });
        }
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("users")
    .then(() => knex.schema.dropTable("roles"))
    .then(() => knex.schema.dropTable("branches"));
};
