const express = require("express");
const { DBX_GET_TEMPORARY_LINK_PATH, DBX_API_DOMAIN } = require("../constants");
const { getConnection } = require("../db/connection");
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
const db = require("../db/connection");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await db("users").select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage(getUsersSuccess),
        data: { users },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getUsersError) }));
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await db("users").where("id", userId).first();
    if (!user) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(userNotFound) }));
    }
    const { password, ...userDetails } = user;
    res.status(200).send(
      successResponse({
        message: getI18nMessage(getUserSuccess),
        data: { user: userDetails },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getUserError) }));
  }
});

router.use(uploadFile).post("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const user = await db("users").where("id", userId).first();

    if (!user) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(userNotFound) }));
    }
    if (req.uploadedFile?.path_lower) {
      newData = {
        ...data,
        profile_img_url: `${DBX_API_DOMAIN}${DBX_GET_TEMPORARY_LINK_PATH}${req.uploadedFile.path_lower}`,
      };
    }

    const result = await db("users").where("id", userId).update(newData);
    res.status(200).send(
      successResponse({
        message: getI18nMessage(userUpdateSuccess),
        data: { result },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(userUpdateError) }));
  }
});

router.delete("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await db("users").where("id", userId).first();
    if (!user) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(userNotFound) }));
    }
    const result = await db("users").where("id", userId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(userDeleteSuccess),
        data: result,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(userDeleteError), error }));
  }
});

module.exports = router;
