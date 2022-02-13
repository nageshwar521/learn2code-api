const typeorm = require("typeorm");

const connectionManager = typeorm.getConnectionManager();
const mysqlConnection = connectionManager.create({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "Anitha@521",
  database: "learn2code_schema",
});

module.exports = { mysqlConnection };
