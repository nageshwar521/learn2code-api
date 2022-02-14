const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_DB = process.env.MONGO_DB;
const USERS_TABLE = process.env.USERS_TABLE;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const DBX_ACCESS_TOKEN = process.env.DBX_ACCESS_TOKEN;
const DBX_GET_TEMPORARY_LINK_PATH = "https://api.dropboxapi.com/2";
const DBX_API_DOMAIN = process.env.DBX_API_DOMAIN;

const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/${MONGO_DB}?retryWrites=true&w=majority`;

module.exports = {
  MONGO_URI,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DB,
  USERS_TABLE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  DBX_ACCESS_TOKEN,
  DBX_GET_TEMPORARY_LINK_PATH,
  DBX_API_DOMAIN,
};
