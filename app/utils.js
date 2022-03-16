const uuid = require("uuid");

const successResponse = ({ message, data = null }) => {
  return { success: true, message, data };
};

const errorResponse = ({ message, error = null }) => {
  return { success: false, message, error };
};

const generateId = () => {
  return uuid.v4();
};

const isValidEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

module.exports = { successResponse, errorResponse, generateId, isValidEmail };
