const express = require("express");
const typeorm = require("typeorm");
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
} = require("../translations/keys");
const { getI18nMessage } = require("../translations/messages");
const { errorResponse, successResponse } = require("../utils");

const router = express.Router();

const dbConnection = typeorm.getConnection();

router.get("/", async (req, res) => {
  try {
    const users = await dbConnection.createQueryBuilder("users").getMany();

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

  try {
    const user = await dbConnection
      .createQueryBuilder("users")
      .where("user.id = :id", { id: userId });
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
      .status(401)
      .send(errorResponse({ message: getI18nMessage(getUserError) }));
  }
});

router.use(uploadFile).post("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  const user = await dbConnection
    .createQueryBuilder("users")
    .where("user.id = :id", { id: userId })
    .execute();

  if (!user) {
    return res
      .status(404)
      .send(errorResponse({ message: getI18nMessage(userNotFound) }));
  }
  try {
    const result = await getConnection()
      .createQueryBuilder()
      .update("users")
      .set({
        ...data,
        profile_img_url: `${DBX_API_DOMAIN}${DBX_GET_TEMPORARY_LINK_PATH}${req.uploadedFile.path_lower}`,
      })
      .where("id = :id", { id: userId })
      .execute();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(userUpdateSuccess),
        data: { result },
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

  const user = await dbConnection
    .createQueryBuilder("users")
    .where("user.id = :id", { id: userId })
    .execute();
  if (!user) {
    return res
      .status(404)
      .send(errorResponse({ message: getI18nMessage(userNotFound) }));
  }
  try {
    const deleteResult = await dbConnection
      .createQueryBuilder("users")
      .delete()
      .where("id = :id", { id: userId })
      .execute();
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
