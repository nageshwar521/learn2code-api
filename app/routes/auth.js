const express = require("express");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  TOKEN_EXPIRE_TIME,
} = require("../constants");
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
} = require("../translations/keys/commonKeys");
const { getI18nMessage } = require("../translations");
const { errorResponse, successResponse, isValidEmail } = require("../utils");
const db = require("../db/connection");

let refreshTokens = [];

const router = express.Router();

router.post("/login", async (req, res) => {
  const data = req.body;
  const isEmail = isValidEmail(data.username);

  try {
    let user = null;
    if (!data.role) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(roleNotFound) }));
    } else if (isEmail) {
      user = await db("users").where("email", data.username).first();
    } else {
      user = await db("users").where("username", data.username).first();
    }
    // console.log(user);

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
    const accessToken = jwt.sign(
      { username: data.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRE_TIME }
    );
    const refreshToken = jwt.sign(
      { username: data.username },
      REFRESH_TOKEN_SECRET
    );
    const { password, ...userDetails } = user;
    res.status(200).send(
      successResponse({
        message: getI18nMessage(loginSuccess),
        data: {
          accessToken,
          refreshToken,
          expiresIn: TOKEN_EXPIRE_TIME,
          user: userDetails,
        },
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
    console.log(user);

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

router.post("/token", (req, res) => {
  const { token } = req.body;

  try {
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
  } catch (error) {
    res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(serverError) }));
  }
});

router.post("/logout", (req, res) => {
  const { token } = req.body;

  try {
    refreshTokens = refreshTokens.filter((t) => t !== token);

    res.status(200).send(
      successResponse({
        message: getI18nMessage(logoutSuccess),
      })
    );
  } catch (error) {
    res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(serverError) }));
  }
});

module.exports = router;
