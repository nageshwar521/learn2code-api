const express = require("express");
const { DBX_GET_TEMPORARY_LINK_PATH, DBX_API_DOMAIN } = require("../constants");
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
  missingRequiredFields,
  userExists,
} = require("../translations/keys");
const { getI18nMessage } = require("../translations/messages");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

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

router.post("/", async (req, res) => {
  const data = req.body;

  if (!(data.username && data.password)) {
    const missingFieldMessage = getI18nMessage(missingRequiredFields);
    let requiredMessage = "";

    if (!data.username) {
      requiredMessage = missingFieldMessage.replace("{field}", "Username");
      return res.status(400).send(errorResponse({ message: requiredMessage }));
    }
    if (!data.password) {
      requiredMessage = missingFieldMessage.replace("{field}", "Password");
      return res.status(400).send(errorResponse({ message: requiredMessage }));
    }
  }
  try {
    const user = await db("users").where("username", data.username).first();
    // console.log(user);

    if (user) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage(userExists),
        })
      );
    }
    const hash = await bcrypt.hash(data.password, 10);
    const result = await db("users").insert({
      ...data,
      password: hash,
    });
    res.status(201).send(
      successResponse({
        message: getI18nMessage(registerSuccess),
        data: { user: result },
      })
    );
  } catch (error) {
    res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(serverError), error }));
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
