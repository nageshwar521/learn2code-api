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
    const order = await db("orders").where("email", data.email).first();
    // console.log(order);

    if (order) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage(orderAlreadyExists),
        })
      );
    }
    const hash = await bcrypt.hash(data.password, 10);
    await db("orders").insert({
      ...data,
      password: hash,
    });
    const newOrder = await db("orders").where("email", data.email).first();
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
