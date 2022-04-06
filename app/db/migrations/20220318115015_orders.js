/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("orders").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("orders", function (table) {
        table.uuid("id").defaultTo(knex.raw("(UUID())"));
        table.uuid("customer_id").notNullable();
        table.uuid("employee_id").notNullable();
        table.uuid("branch_id").nullable();
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
  return knex.schema.dropTable("orders");
};
