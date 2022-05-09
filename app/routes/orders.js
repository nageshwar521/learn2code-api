const express = require("express");
const { uploadFile } = require("../middlewares/upload");
const {
  orderNotFound,
  updateOrderSuccess,
  updateOrderError,
  deleteOrderSuccess,
  deleteOrderError,
  getOrdersSuccess,
  getOrdersError,
  getOrderSuccess,
  getOrderError,
  orderAlreadyExists,
  addOrderSuccess,
  addOrderError,
} = require("../translations/keys/ordersKeys");
const { getI18nMessage } = require("../translations");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const bcrypt = require("bcryptjs");
const { missingRequiredFields } = require("../translations/keys/commonKeys");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await db("orders").select().orderBy("created_at", "desc");

    res.status(200).send(
      successResponse({
        message: getI18nMessage(getOrdersSuccess),
        data: { orders },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getOrdersError) }));
  }
});

router.post("/", async (req, res) => {
  const data = req.body;
  const missingFieldMessage = getI18nMessage(missingRequiredFields);

  try {
    await db("orders").insert(data);
    const newOrder = await db("orders").where("employee_id", data.employee_id).first();
    res.status(201).send(
      successResponse({
        message: getI18nMessage(addOrderSuccess),
        data: { order: newOrder },
      })
    );
  } catch (error) {
    res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(addOrderError), error }));
  }
});

router.get("/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await db("orders").where("id", orderId).first();
    if (!order) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(orderNotFound) }));
    }
    const { password, ...orderDetails } = order;
    res.status(200).send(
      successResponse({
        message: getI18nMessage(getOrderSuccess),
        data: { order: orderDetails },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getOrderError) }));
  }
});

router.use(uploadFile).post("/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const order = await db("orders").where("id", orderId).first();

    if (!order) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage(orderNotFound),
          error: { order },
        })
      );
    }
    // if (req?.uploadedFile?.path_lower) {
    //   newData = {
    //     ...data,
    //     profile_img_url: `${DBX_API_DOMAIN}${DBX_GET_TEMPORARY_LINK_PATH}${req.uploadedFile.path_lower}`,
    //   };
    // }

    await db("orders").update(newData).where("id", orderId);
    const newOrder = await db("orders").where("id", orderId).first();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(updateOrderSuccess),
        data: { order: newOrder },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage(updateOrderError),
        error: { orderId, data },
      })
    );
  }
});

router.delete("/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await db("orders").where("id", orderId).first();
    if (!order) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(orderNotFound) }));
    }
    const result = await db("orders").where("id", orderId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(deleteOrderSuccess),
        data: result,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(
        errorResponse({ message: getI18nMessage(deleteOrderError), error })
      );
  }
});

module.exports = router;
