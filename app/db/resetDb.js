const db = require("./connection");

async function resetDb() {
  const results = [
    "roles",
    "branches",
    "users",
    "orders",
    "services",
    "transactions",
    "permissions",
    "dictionary",
    "coupans",
    "knex_migrations",
    "knex_migrations_lock",
  ];

  await db.raw("SET FOREIGN_KEY_CHECKS = 0");

  results.forEach(async (table_name) => {
    await db.raw("DROP TABLE IF EXISTS '" + table_name + "';");
  });

  await db.raw("SET FOREIGN_KEY_CHECKS = 1");
}

module.export = { resetDb };
