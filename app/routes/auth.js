const express = require("express");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const {
  MONGO_DB,
  USERS_TABLE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../constants");
const { mongoInstance } = require("../db/connection");
const {
  userNotFound,
  userPasswordNotMatch,
  loginSuccess,
  userExists,
  serverError,
  registerSuccess,
  missingRequiredFields,
  noToken,
  getRefreshTokenSuccess,
  logoutSuccess,
} = require("../translations/keys");
const { getI18nMessage } = require("../translations/messages");
const { errorResponse, successResponse } = require("../utils");

let refreshTokens = [];

const router = express.Router();

router.post("/login", async (req, res) => {
  const data = req.body;
  const db = mongoInstance.db(MONGO_DB);
  const usersCollection = db.collection(USERS_TABLE);

  const user = await usersCollection.findOne({
    $or: [{ email: data.username }, { username: data.username }],
  });
  if (!user) {
    return res
      .status(404)
      .send(errorResponse({ message: getI18nMessage(userNotFound) }));
  }
  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) {
    return res
      .status(401)
      .send(errorResponse({ message: getI18nMessage(userPasswordNotMatch) }));
  }
  try {
    const accessToken = jwt.sign(
      { username: data.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );
    const refreshToken = jwt.sign(
      { username: data.username },
      REFRESH_TOKEN_SECRET
    );
    const { password, _id, ...userDetails } = user;
    res.status(200).send(
      successResponse({
        message: getI18nMessage(loginSuccess),
        data: { accessToken, refreshToken, user: userDetails },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(serverError), error }));
  }
});

router.post("/register", async (req, res) => {
  const data = req.body;
  const db = mongoInstance.db(MONGO_DB);
  const usersCollection = db.collection(USERS_TABLE);

  if (!(data.username && data.email && data.password)) {
    const missingFieldMessage = getI18nMessage(missingRequiredFields);
    let requiredMessage = "";
    if (!data.username) {
      requiredMessage = missingFieldMessage.replace("{field}", "Username");
      return res.status(400).send(errorResponse({ message: requiredMessage }));
    }
    if (!data.email) {
      requiredMessage = missingFieldMessage.replace("{field}", "Email");
      return res.status(400).send(errorResponse({ message: requiredMessage }));
    }
    if (!data.password) {
      requiredMessage = missingFieldMessage.replace("{field}", "Password");
      return res.status(400).send(errorResponse({ message: requiredMessage }));
    }
  }
  const user = await usersCollection.findOne({
    $or: [{ email: data.email }, { username: data.username }],
  });
  if (user) {
    return res
      .status(400)
      .send(errorResponse({ message: getI18nMessage(userExists) }));
  }
  try {
    const hash = await bcrypt.hash(data.password, 10);
    const result = await usersCollection.insertOne({
      ...data,
      id: uuid.v4(),
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
      .send(errorResponse({ message: getI18nMessage(serverError) }));
  }
});

router.post("/token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(404)
      .send(errorResponse({ message: getI18nMessage(noToken) }));
  }

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res
        .status(500)
        .send(errorResponse({ message: getI18nMessage(serverError) }));
    }

    const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
      expiresIn: "20m",
    });

    res.status(200).send(
      successResponse({
        message: getI18nMessage(getRefreshTokenSuccess),
        data: { accessToken },
      })
    );
  });
});

router.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);

  res.status(200).send(
    successResponse({
      message: getI18nMessage(logoutSuccess),
    })
  );
});

module.exports = router;
