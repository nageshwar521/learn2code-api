const { default: knex } = require("knex");
const { dbConfig } = require("./mysqldb");

const knexInstance = knex(dbConfig);

module.exports = knexInstance;
