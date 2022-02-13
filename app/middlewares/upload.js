const request = require("request");
const fs = require("fs");
const path = require("path");
const dropboxV2Api = require("dropbox-v2-api");
const { DROPBOX_ACCESS_TOKEN } = require("../constants");
const { serverError } = require("../translations/keys");
const { getI18nMessage } = require("../translations/messages");
const { errorResponse } = require("../utils");

const uploadFile = (req, response, next) => {
  const file = req.body.file;
  // console.log(file, "file");
  if (!file) {
    return next();
  }
  const filename = path.basename(file.uri);
  console.log(filename, "filename");
  // const content = fs.readFileSync(file);
  // console.log(file.base64, "file.base64");
  const options = {
    method: "POST",
    url: "https://api.dropboxapi.com/2/account/set_profile_photo",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + DROPBOX_ACCESS_TOKEN,
      "Dropbox-API-Arg":
        '{"mode": "overwrite","autorename": true,"mute": false}',
    },
    body: {
      photo: {
        ".tag": "base64_data",
        base64_data: file.base64,
      },
    },
    json: true,
  };
  request(options, function (err, res, body) {
    console.log("Err : " + err);
    console.log("res : " + JSON.stringify(res));
    console.log("body : " + JSON.stringify(body));
    const uploadError =
      res && res.body && res.body.error && res.body.error[".tag"];
    if (err || uploadError) {
      return response.status(400).send(
        errorResponse({
          message: getI18nMessage(serverError),
          error: err || uploadError,
        })
      );
    }
    next();
  });
};

const dropbox = dropboxV2Api.authenticate({
  token: DROPBOX_ACCESS_TOKEN,
});

const uploadFile2 = (req, res, next) => {
  console.log("uploadFile req file");
  const file = req.body.file;
  if (!file) {
    next();
  } else {
    const filename = path.basename(file.uri);
    console.log(filename, "filename");
    dropbox(
      {
        resource: "files/upload",
        parameters: {
          path: `/heydoc/${filename}`,
          mode: "overwrite",
          autorename: true,
          mute: false,
        },
        body: {
          photo: {
            ".tag": "base64_data",
            base64_data: file.base64,
          },
        },
      },
      (err, result, response) => {
        //upload completed
        console.log("uploadFile err, result, response");
        console.log(err, result);
        if (err) {
          return res
            .status(400)
            .send(errorResponse({ message: getI18nMessage(serverError) }));
        }
        req.uploadedFile = result;
        next();
      }
    );
  }
};

module.exports = { uploadFile: uploadFile2 };
