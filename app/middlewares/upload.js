const path = require("path");
const dropboxV2Api = require("dropbox-v2-api");
const { DBX_ACCESS_TOKEN } = require("../constants");
const { serverError } = require("../translations/keys/commonKeys");
const { getI18nMessage } = require("../translations");
const { errorResponse } = require("../utils");

const dropbox = dropboxV2Api.authenticate({
  token: DBX_ACCESS_TOKEN,
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
          path: `/${filename}`,
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
