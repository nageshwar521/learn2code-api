// const MONGO_USER = process.env.MONGO_USER;
// const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
// const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
// const MONGO_DB = process.env.MONGO_DB;
// const USERS_TABLE = process.env.USERS_TABLE;

const ACCESS_TOKEN_SECRET = "secretKey";
const REFRESH_TOKEN_SECRET = "secretKey";
const TOKEN_EXPIRE_TIME = 60 * 60 * 1000;

const DBX_ACCESS_TOKEN =
  "_yQrQa4XHg0AAAAAAAAAAWdTapdov1txNMbATgdagf4ERdvQpGyD0tu4BWcXm0DY";
const DBX_GET_TEMPORARY_LINK_PATH = "https://api.dropboxapi.com/2";
const DBX_API_DOMAIN = "https://api.dropboxapi.com";

// const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/${MONGO_DB}?retryWrites=true&w=majority`;

module.exports = {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  DBX_ACCESS_TOKEN,
  DBX_GET_TEMPORARY_LINK_PATH,
  DBX_API_DOMAIN,
  TOKEN_EXPIRE_TIME,
};
