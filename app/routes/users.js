const express = require("express");
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
  userExists,
  addUserSuccess,
} = require("../translations/keys/commonKeys");
const { getI18nMessage } = require("../translations");
const { errorResponse, successResponse, isValidEmail } = require("../utils");
const db = require("../db/connection");
const bcrypt = require("bcryptjs");
const {
  missingRequiredFields,
  serverError,
} = require("../translations/keys/commonKeys");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await db("users").select().orderBy("created_at", "desc");

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
  const missingFieldMessage = getI18nMessage(missingRequiredFields);

  try {
    if (!data.email) {
      const requiredMessage = missingFieldMessage.replace("{field}", "Email");
      return res.status(400).send(errorResponse({ message: requiredMessage }));
    }
    if (!data.password) {
      const requiredMessage = missingFieldMessage.replace(
        "{field}",
        "Password"
      );
      return res.status(400).send(errorResponse({ message: requiredMessage }));
    }
    const user = await db("users").where("email", data.email).first();
    // console.log(user);

    if (user) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage(userExists),
        })
      );
    }
    const hash = await bcrypt.hash(data.password, 10);
    await db("users").insert({
      ...data,
      password: hash,
    });
    const newUser = await db("users").where("email", data.email).first();
    res.status(201).send(
      successResponse({
        message: getI18nMessage(addUserSuccess),
        data: { user: newUser },
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

router.post("/username", async (req, res) => {
  const data = req.body;
  const isEmail = isValidEmail(data.username);

  try {
    if (isEmail) {
      user = await db("users").where("email", data.username).first();
    } else {
      user = await db("users").where("username", data.username).first();
    }
    if (!user) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage(userNotFound),
          error: { isEmail },
        })
      );
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
      .send(
        errorResponse({ message: getI18nMessage(getUserError), error: data })
      );
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
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage(userNotFound),
          error: { user },
        })
      );
    }
    // if (req?.uploadedFile?.path_lower) {
    //   newData = {
    //     ...data,
    //     profile_img_url: `${DBX_API_DOMAIN}${DBX_GET_TEMPORARY_LINK_PATH}${req.uploadedFile.path_lower}`,
    //   };
    // }

    await db("users").update(newData).where("id", userId);
    const newUser = await db("users").where("id", userId).first();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(userUpdateSuccess),
        data: { user: newUser },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage(userUpdateError),
        error: { userId, data },
      })
    );
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
