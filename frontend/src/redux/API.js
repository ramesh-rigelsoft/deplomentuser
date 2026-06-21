// API.js
import { ENDPOINT } from "./config";
import { callAPI,callGetAPI,multipartAPI,loginAPI,branchApiCall } from "./apiService";

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
  },
  saveOfficeBranch(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.BRANCH_ADD, requestData);
  },
  fetchOfficeBranch(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.BRANCH_LIST, requestData);
  },
  /// branch
  expenseListAndSearch(dispatch, requestData) {
    return branchApiCall(dispatch, ENDPOINT.EXPENSE_LIST_AND_SEARCH, requestData);
  },
  salesSearch(dispatch, requestData) {
    return branchApiCall(dispatch, ENDPOINT.SALES_SEARCH, requestData);
  },
  salesListAndSearch(dispatch, requestData) {
    return branchApiCall(dispatch, ENDPOINT.SALES_LIST_AND_SEARCH, requestData);
  },
  fetchDashboardData(dispatch, requestData) {
    return branchApiCall(dispatch, ENDPOINT.FETCH_DASHBOARD_DATA, requestData);
  },
  itemsListAndSearch(dispatch, requestData) {
    return branchApiCall(dispatch, ENDPOINT.ITEMS_LISTS_AND_SEARCH, requestData);
  },
  inventryItemList(dispatch, requestData) {
    return branchApiCall(dispatch, ENDPOINT.INVENTRY_LIST, requestData);
  },
  searchItems(dispatch, requestData) {
    return branchApiCall(dispatch, ENDPOINT.SEARCH_ITEMS, requestData);
  },
  searchGarbage(dispatch, requestData) {
    return branchApiCall(dispatch, ENDPOINT.GARBAGE_SEARCH, requestData);
  },
};

export default API;
