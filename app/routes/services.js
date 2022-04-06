const express = require("express");
const { uploadFile } = require("../middlewares/upload");
const {
  serviceNotFound,
  updateServiceSuccess,
  updateServiceError,
  deleteServiceSuccess,
  deleteServiceError,
  getServicesSuccess,
  getServicesError,
  getServiceSuccess,
  getServiceError,
  serviceAlreadyExists,
  addServiceSuccess,
  addServiceError,
} = require("../translations/keys/servicesKeys");
const { getI18nMessage } = require("../translations");
const { errorResponse, successResponse } = require("../utils");
const db = require("../db/connection");
const bcrypt = require("bcryptjs");
const { missingRequiredFields } = require("../translations/keys/commonKeys");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const services = await db("services")
      .select()
      .orderBy("created_at", "desc");

    res.status(200).send(
      successResponse({
        message: getI18nMessage(getServicesSuccess),
        data: { services },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getServicesError) }));
  }
});

router.post("/", async (req, res) => {
  const data = req.body;
  const missingFieldMessage = getI18nMessage(missingRequiredFields);

  try {
    const service = await db("services").where("name", data.name).first();
    // console.log(service);

    if (service) {
      return res.status(400).send(
        errorResponse({
          message: getI18nMessage(serviceAlreadyExists),
        })
      );
    }

    await db("services").insert(data);
    const newService = await db("services").where("name", data.name).first();
    res.status(201).send(
      successResponse({
        message: getI18nMessage(addServiceSuccess),
        data: { service: newService },
      })
    );
  } catch (error) {
    res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(addServiceError), error }));
  }
});

router.get("/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;

  try {
    const service = await db("services").where("id", serviceId).first();
    if (!service) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(serviceNotFound) }));
    }
    res.status(200).send(
      successResponse({
        message: getI18nMessage(getServiceSuccess),
        data: { service },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(errorResponse({ message: getI18nMessage(getServiceError) }));
  }
});

router.use(uploadFile).post("/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;
  const data = req.body;
  let newData = {
    ...data,
  };

  try {
    const service = await db("services").where("id", serviceId).first();

    if (!service) {
      return res.status(404).send(
        errorResponse({
          message: getI18nMessage(serviceNotFound),
          error: { service },
        })
      );
    }
    // if (req?.uploadedFile?.path_lower) {
    //   newData = {
    //     ...data,
    //     profile_img_url: `${DBX_API_DOMAIN}${DBX_GET_TEMPORARY_LINK_PATH}${req.uploadedFile.path_lower}`,
    //   };
    // }

    await db("services").update(newData).where("id", serviceId);
    const newService = await db("services").where("id", serviceId).first();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(updateServiceSuccess),
        data: { service: newService },
      })
    );
  } catch (error) {
    return res.status(500).send(
      errorResponse({
        message: getI18nMessage(updateServiceError),
        error: { serviceId, data },
      })
    );
  }
});

router.delete("/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;

  try {
    const service = await db("services").where("id", serviceId).first();
    if (!service) {
      return res
        .status(404)
        .send(errorResponse({ message: getI18nMessage(serviceNotFound) }));
    }
    const result = await db("services").where("id", serviceId).del();
    res.status(200).send(
      successResponse({
        message: getI18nMessage(deleteServiceSuccess),
        data: result,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .send(
        errorResponse({ message: getI18nMessage(deleteServiceError), error })
      );
  }
});

module.exports = router;
