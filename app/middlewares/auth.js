const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../constants");
const { noToken, tokenNotMatch } = require("../translations/keys/commonKeys");
const { getI18nMessage } = require("../translations");
const { errorResponse, successResponse } = require("../utils");

const verifyToken = (req, res, next) => {
  // console.log(req, "req.authorization");
  const token =
    (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
    "";
  if (!token) {
    return res
      .status(404)
      .send(errorResponse({ message: getI18nMessage(noToken) }));
  } else {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .send(errorResponse({ message: getI18nMessage(tokenNotMatch) }));
      } else {
        req.user = user;
        next();
      }
    });
  }
};

module.exports = {
  verifyToken,
};
