const express = require("express");
const {
  MONGO_DB,
  USERS_TABLE,
  ACCESS_TOKEN_SECRET,
  DROPBOX_BASE_URL,
  DROPBOX_BASE_PATH,
} = require("../constants");
const { mongoInstance } = require("../db/connection");
const { uploadFile } = require("../middlewares/upload");
const {
  userNotFound,
  userUpdateSuccess,
  userUpdateError,
  userDeleteSuccess,
  userDeleteError,
  getUsersSuccess,
  getUsersError,
  getUserSuccess,
  getUserError,
} = require("../translations/keys");
const { getI18nMessage } = require("../translations/messages");
const { errorResponse, successResponse } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
  const db = mongoInstance.db(MONGO_DB);
  const usersCollection = db.collection(USERS_TABLE);
  try {
    const users = await usersCollection.find({});
    res.status(200).send(
      successResponse({
        message: getI18nMessage(getUsersSuccess),
        data: { users },
      })
    );
  } catch (error) {
    return res
      .status(401)
      .send(errorResponse({ message: getI18nMessage(getUsersError) }));
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const db = mongoInstance.db(MONGO_DB);
  const usersCollection = db.collection(USERS_TABLE);
  try {
    const user = await usersCollection.findOne({ id: userId });
    if (!user) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(userNotFound) }));
    }
    const { password, _id, ...userDetails } = user;
    res.status(200).send(
      successResponse({
        message: getI18nMessage(getUserSuccess),
        data: { user: userDetails },
      })
    );
  } catch (error) {
    return res
      .status(401)
      .send(errorResponse({ message: getI18nMessage(getUserError) }));
  }
});

router.use(uploadFile).post("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  const db = mongoInstance.db(MONGO_DB);
  const usersCollection = db.collection(USERS_TABLE);

  const user = await usersCollection.findOne({
    id: userId,
  });
  if (!user) {
    return res
      .status(404)
      .send(errorResponse({ message: getI18nMessage(userNotFound) }));
  }
  try {
    const user = await usersCollection.updateOne(
      {
        id: userId,
      },
      {
        $set: {
          ...data,
          imagePath: `${DROPBOX_BASE_URL}${DROPBOX_BASE_PATH}${req.uploadedFile.path_lower}`,
          file: req.uploadedFile,
        },
      }
    );
    res.status(200).send(
      successResponse({
        message: getI18nMessage(userUpdateSuccess),
        data: { user },
      })
    );
  } catch (error) {
    return res
      .status(401)
      .send(errorResponse({ message: getI18nMessage(userUpdateError) }));
  }
});

router.delete("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const db = mongoInstance.db(MONGO_DB);
  const usersCollection = db.collection(USERS_TABLE);

  const user = await usersCollection.findOne({
    id: userId,
  });
  if (!user) {
    return res
      .status(404)
      .send(errorResponse({ message: getI18nMessage(userNotFound) }));
  }
  try {
    const deleteResult = await usersCollection.deleteOne({
      id: userId,
    });
    res.status(200).send(
      successResponse({
        message: getI18nMessage(userDeleteSuccess),
        data: { deleteResult },
      })
    );
  } catch (error) {
    return res
      .status(401)
      .send(errorResponse({ message: getI18nMessage(userDeleteError) }));
  }
});

module.exports = router;
