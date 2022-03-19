const commonMsgs = require("./messages/commonMsgs");
const rolesMsgs = require("./messages/rolesMsgs");
const servicesMsgs = require("./messages/servicesMsgs");
const ordersMsgs = require("./messages/ordersMsgs");
const transactionsMsgs = require("./messages/transactionsMsgs");

const allMsgs = {
  ...commonMsgs,
  ...rolesMsgs,
  ...servicesMsgs,
  ...ordersMsgs,
  ...transactionsMsgs,
};

const getI18nMessage = (msgKey) => {
  return allMsgs[msgKey] || "";
};

module.exports = { getI18nMessage };
