const { mysqlConnection } = require("./mysqldb");

const initDB = async () => {
  try {
    await mysqlConnection.connect();
    console.log("Connection success");
  } catch (error) {
    console.error("Error connecting: " + err.stack);
  }
};

module.exports = { initDB };
