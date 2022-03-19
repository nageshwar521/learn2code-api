const express = require("express");
const { uploadFile } = require("../middlewares/upload");
const {
  transactionNotFound,
  updateTransactionSuccess,
  updateTransactionError,
  deleteTransactionSuccess,
  deleteTransactionError,
  getTransactionsSuccess,
  getTransactionsError,
  getTransactionSuccess,
  getTransactionError,
  transactionAlreadyExists,
  addTransactionSuccess,
  addTransactionError,
} = require("../translations/keys/transactionsKeys");
const { getI18nMessage } = require("../translations");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const bcrypt = require("bcryptjs");
const { missingRequiredFields } = require("../translations/keys/commonKeys");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const transactions = await db("transactions")
      .select()
      .transactionBy("created_at", "desc");

    res.status(200).send(
      successResponse({
        message: getI18nMessage(getTransactionsSuccess),
        data: { transactions },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getTransactionsError) }));
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
    const transaction = await db("transactions")
      .where("email", data.email)
      .first();
    // console.log(transaction);

    if (transaction) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage(transactionAlreadyExists),
        })
      );
    }
    const hash = await bcrypt.hash(data.password, 10);
    await db("transactions").insert({
      ...data,
      password: hash,
    });
    const newTransaction = await db("transactions")
      .where("email", data.email)
      .first();
    res.status(201).send(
      successResponse({
        message: getI18nMessage(addTransactionSuccess),
        data: { transaction: newTransaction },
      })
    );
  } catch (error) {
    res
      .status(500)
      .send(
        errorResponse({ message: getI18nMessage(addTransactionError), error })
      );
  }
});

router.get("/:transactionId", async (req, res) => {
  const transactionId = req.params.transactionId;

  try {
    const transaction = await db("transactions")
      .where("id", transactionId)
      .first();
    if (!transaction) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(transactionNotFound) }));
    }
    const { password, ...transactionDetails } = transaction;
    res.status(200).send(
      successResponse({
        message: getI18nMessage(getTransactionSuccess),
        data: { transaction: transactionDetails },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getTransactionError) }));
  }
});

router.use(uploadFile).post("/:transactionId", async (req, res) => {
  const transactionId = req.params.transactionId;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const transaction = await db("transactions")
      .where("id", transactionId)
      .first();

    if (!transaction) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage(transactionNotFound),
          error: { transaction },
        })
      );
    }
    // if (req?.uploadedFile?.path_lower) {
    //   newData = {
    //     ...data,
    //     profile_img_url: `${DBX_API_DOMAIN}${DBX_GET_TEMPORARY_LINK_PATH}${req.uploadedFile.path_lower}`,
    //   };
    // }

    await db("transactions").update(newData).where("id", transactionId);
    const newTransaction = await db("transactions")
      .where("id", transactionId)
      .first();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(updateTransactionSuccess),
        data: { transaction: newTransaction },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage(updateTransactionError),
        error: { transactionId, data },
      })
    );
  }
});

router.delete("/:transactionId", async (req, res) => {
  const transactionId = req.params.transactionId;

  try {
    const transaction = await db("transactions")
      .where("id", transactionId)
      .first();
    if (!transaction) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(transactionNotFound) }));
    }
    const result = await db("transactions").where("id", transactionId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(deleteTransactionSuccess),
        data: result,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(
        errorResponse({
          message: getI18nMessage(deleteTransactionError),
          error,
        })
      );
  }
});

module.exports = router;
