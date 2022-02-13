const { MONGO_URI } = require("../constants");
const MongoClient = require("mongodb").MongoClient;

const mongoInstance = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const initDB = () => {
  mongoInstance
    .connect()
    .then(() => {
      console.log("MongoDB connection success...!");
    })
    .catch((error) => {
      console.log("MongoDB connection error...!", error);
    });
};

module.exports = { initDB, mongoInstance };
