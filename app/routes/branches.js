const express = require("express");
const {
  branchNotFound,
  branchUpdateSuccess,
  branchUpdateError,
  branchDeleteSuccess,
  branchDeleteError,
  getBranchesSuccess,
  getBranchesError,
  getBranchSuccess,
  getBranchError,
  branchAlreadyExists,
  addBranchSuccess,
  addBranchError,
} = require("../translations/keys/branchesKeys");
const { getI18nMessage } = require("../translations");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const branches = await db("branches").select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage(getBranchesSuccess),
        data: { branches },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getBranchesError) }));
  }
});

router.post("/", async (req, res) => {
  const data = req.body;

  try {
    const branch = await db("branches").where("name", data.name).first();
    if (branch) {
      return res
        .status(400)
        .send(errorResponse({ message: getI18nMessage(branchAlreadyExists) }));
    }
    const result = await db("branches").insert(data);
    res.status(200).send(
      successResponse({
        message: getI18nMessage(addBranchSuccess),
        data: { result },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(addBranchError) }));
  }
});

router.get("/:branchId", async (req, res) => {
  const branchId = req.params.branchId;

  try {
    const branch = await db("branches").where("id", branchId).first();
    if (!branch) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(branchNotFound) }));
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage(getBranchSuccess),
        data: { branch },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getBranchError) }));
  }
});

router.post("/:branchId", async (req, res) => {
  const branchId = req.params.branchId;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const branch = await db("branches").where("id", branchId).first();

    if (!branch) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(branchNotFound) }));
    }

    const result = await db("branches").where("id", branchId).update(newData);
    res.status(200).send(
      successResponse({
        message: getI18nMessage(branchUpdateSuccess),
        data: { result },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(branchUpdateError) }));
  }
});

router.delete("/:branchId", async (req, res) => {
  const branchId = req.params.branchId;

  try {
    const branch = await db("branches").where("id", branchId).first();
    if (!branch) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(branchNotFound) }));
    }
    const result = await db("branches").where("id", branchId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(branchDeleteSuccess),
        data: result,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(
        errorResponse({ message: getI18nMessage(branchDeleteError), error })
      );
  }
});

module.exports = router;
