const express = require("express");
const {
  roleNotFound,
  roleUpdateSuccess,
  roleUpdateError,
  roleDeleteSuccess,
  roleDeleteError,
  getRolesSuccess,
  getRolesError,
  getRoleSuccess,
  getRoleError,
  roleAlreadyExists,
  addRoleSuccess,
  addRoleError,
} = require("../translations/keys");
const { getI18nMessage } = require("../translations/messages");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const roles = await db("roles").select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage(getRolesSuccess),
        data: { roles },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getRolesError) }));
  }
});

router.post("/", async (req, res) => {
  const data = req.body;

  try {
    const role = await db("roles").where("name", data.name).first();
    if (role) {
      return res
        .status(400)
        .send(errorResponse({ message: getI18nMessage(roleAlreadyExists) }));
    }
    const result = await db("roles").insert(data);
    res.status(200).send(
      successResponse({
        message: getI18nMessage(addRoleSuccess),
        data: { result },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(addRoleError) }));
  }
});

router.get("/:roleId", async (req, res) => {
  const roleId = req.params.roleId;

  try {
    const role = await db("roles").where("id", roleId).first();
    if (!role) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(roleNotFound) }));
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage(getRoleSuccess),
        data: { role },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getRoleError) }));
  }
});

router.post("/:roleId", async (req, res) => {
  const roleId = req.params.roleId;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const role = await db("roles").where("id", roleId).first();

    if (!role) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(roleNotFound) }));
    }

    const result = await db("roles").where("id", roleId).update(newData);
    res.status(200).send(
      successResponse({
        message: getI18nMessage(roleUpdateSuccess),
        data: { result },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(roleUpdateError) }));
  }
});

router.delete("/:roleId", async (req, res) => {
  const roleId = req.params.roleId;

  try {
    const role = await db("roles").where("id", roleId).first();
    if (!role) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(roleNotFound) }));
    }
    const result = await db("roles").where("id", roleId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(roleDeleteSuccess),
        data: result,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(roleDeleteError), error }));
  }
});

module.exports = router;
