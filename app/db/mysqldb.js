const typeorm = require("typeorm");

const connectionManager = typeorm.getConnectionManager();
const mysqlConnection = connectionManager.create({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "Anitha@521",
  database:
    process.env.NODE_ENV === "development"
      ? "learn2code_schema"
      : "alnlabsc_learn2code",
});

module.exports = { mysqlConnection };
