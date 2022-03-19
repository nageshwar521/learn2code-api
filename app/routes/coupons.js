const express = require("express");
const {
  couponNotFound,
  couponUpdateSuccess,
  couponUpdateError,
  couponDeleteSuccess,
  couponDeleteError,
  getCouponsSuccess,
  getCouponsError,
  getCouponSuccess,
  getCouponError,
  couponAlreadyExists,
  addCouponSuccess,
  addCouponError,
} = require("../translations/keys/couponsKeys");
const { getI18nMessage } = require("../translations");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const coupons = await db("coupons").select();

    res.status(200).send(
      successResponse({
        message: getI18nMessage(getCouponsSuccess),
        data: { coupons },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getCouponsError) }));
  }
});

router.post("/", async (req, res) => {
  const data = req.body;

  try {
    const coupon = await db("coupons").where("name", data.name).first();
    if (coupon) {
      return res
        .status(400)
        .send(errorResponse({ message: getI18nMessage(couponAlreadyExists) }));
    }
    const result = await db("coupons").insert(data);
    res.status(200).send(
      successResponse({
        message: getI18nMessage(addCouponSuccess),
        data: { result },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(addCouponError) }));
  }
});

router.get("/:couponId", async (req, res) => {
  const couponId = req.params.couponId;

  try {
    const coupon = await db("coupons").where("id", couponId).first();
    if (!coupon) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(couponNotFound) }));
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage(getCouponSuccess),
        data: { coupon },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getCouponError) }));
  }
});

router.post("/:couponId", async (req, res) => {
  const couponId = req.params.couponId;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const coupon = await db("coupons").where("id", couponId).first();

    if (!coupon) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(couponNotFound) }));
    }

    const result = await db("coupons").where("id", couponId).update(newData);
    res.status(200).send(
      successResponse({
        message: getI18nMessage(couponUpdateSuccess),
        data: { result },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(couponUpdateError) }));
  }
});

router.delete("/:couponId", async (req, res) => {
  const couponId = req.params.couponId;

  try {
    const coupon = await db("coupons").where("id", couponId).first();
    if (!coupon) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(couponNotFound) }));
    }
    const result = await db("coupons").where("id", couponId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(couponDeleteSuccess),
        data: result,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(
        errorResponse({ message: getI18nMessage(couponDeleteError), error })
      );
  }
});

module.exports = router;
