const db = require("./connection");

async function resetDb() {
  const results = await db.raw(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'alnlabs_db';"
  );

  await db.raw("SET FOREIGN_KEY_CHECKS = 0");

  results[0].forEach(async ({ table_name }) => {
    await db.raw("DROP TABLE IF EXISTS '" + table_name + "';");
  });

  await db.raw("SET FOREIGN_KEY_CHECKS = 1");
}

module.export = { resetDb };
