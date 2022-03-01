const messages = {
  userNotFound: "User not found",
  userPasswordNotMatch: "Username and Password doesnot match",
  loginSuccess: "Login successful",
  logoutSuccess: "Logout successful",
  noToken: "No token found",
  tokenNotMatch: "Token doesnot match",
  userExists: "User with email or username already exists",
  serverError: "Unknown error occured",
  registerSuccess: "Registered Successfully",
  userUpdateSuccess: "User Updated Successfully",
  userUpdateError: "User Update Failed",
  userDeleteSuccess: "User Deleted Successfully",
  userDeleteError: "User Delete Failed",
  getUsersSuccess: "Get Users Successfully",
  getUsersError: "Get Users Failed",
  getUserError: "Get User Failed",
  getUserSuccess: "Get User Success",
  missingRequiredFields: "{field} is required",
  getRefreshTokenSuccess: "Get token success",
  roleUpdateSuccess: "Role Updated Successfully",
  roleUpdateError: "Role Update Failed",
  roleDeleteSuccess: "Role Deleted Successfully",
  roleDeleteError: "Role Delete Failed",
  getRolesSuccess: "Get Roles Successfully",
  getRolesError: "Get Roles Failed",
  getRoleSuccess: "Get Role Success",
  getRoleError: "Get Role Failed",
  roleNotFound: "Role not found",
  roleExists: "Role already exists",
};

const getI18nMessage = (msgKey) => {
  return messages[msgKey] || "";
};

module.exports = { getI18nMessage };
