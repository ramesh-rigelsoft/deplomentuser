// API.js
import { ENDPOINT } from "./config";
import { callAPI,callGetAPI,multipartAPI,loginAPI } from "./apiService";

const API = {

  loginAccount(dispatch, requestData) {
    return loginAPI(dispatch, ENDPOINT.LOGIN, requestData);
  },
  validateToken(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.VALIDATE_TOKEN, requestData);
  },
  signupAccount(dispatch, itemData) {
    return multipartAPI(dispatch, ENDPOINT.SIGNUP, itemData);
  },
  viewAccount(dispatch, itemData) {
    return callAPI(dispatch, ENDPOINT.ADMIN_VIEW, itemData);
  },
  sendOTP(dispatch, itemData) {
    return callAPI(dispatch, ENDPOINT.SAVE_OTP, itemData);
  },
  resetPassword(dispatch, itemData) {
    return callAPI(dispatch, ENDPOINT.RESET_PASSWORD, itemData);
  },
  uploadFile(dispatch, requestData) {
    return multipartAPI(dispatch, ENDPOINT.FILE_UPLOAD, requestData);
  },
  addUser(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.ADD_SUBUSER, requestData);
  },
  saveRolePermissionUser(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.SAVE_ROLES_PERMISSION, requestData);
  },
  fetchPermission(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.FETCH_PERMISSION, requestData);
  },
  fetchSubUser(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.FETCH_USERLIST, requestData);
  }
};

export default API;
