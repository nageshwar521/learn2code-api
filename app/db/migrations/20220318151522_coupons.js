/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("coupons").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("coupons", function (table) {
        table.uuid("id").defaultTo(knex.raw("(UUID())"));
        table.string("code").notNullable();
        table.string("desc").notNullable();
        table.float("value").notNullable();
        table.string("type").notNullable();
        table.date("start_date").notNullable();
        table.date("end_date").notNullable();
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
  return knex.schema.dropTable("coupons");
};
