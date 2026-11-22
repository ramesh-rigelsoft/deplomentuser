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
  fetchPermittedPagesRoleWise(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.FETCH_PERMITTED_PAGES, requestData);
  },
  removePermisstion(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.REMOVE_PERMITTED_PAGES, requestData);
  },
  fetchSubUser(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.FETCH_USERLIST, requestData);
  },
  fetchSubscriptionPlan(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.SUBSCRIPTION_LIST, requestData);
  },
  fetchUserSubscription(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.USER_SUBSCRIPTION_LIST, requestData);
  },
  paySubscription(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.SAVE_USER_SUBSCRIPTION, requestData);
  },
  saveOfficeBranch(dispatch, requestData) {
    return multipartAPI(dispatch, ENDPOINT.BRANCH_ADD, requestData);
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
  saveLowStockAlert(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.LOW_STOCK_ALERT_SAVE, requestData);
  },
  fetchLowStockAlerts(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.LOW_STOCK_ALERT_LIST, requestData);
  },
  updateLowStockAlertStatus(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.LOW_STOCK_ALERT_STATUS, requestData);
  },
  deleteLowStockAlert(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.LOW_STOCK_ALERT_DELETE, requestData);
  },
  saveBranchCategory(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.BRANCH_CATEGORY_SAVE, requestData);
  },
  fetchBranchCategories(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.BRANCH_CATEGORY_LIST, requestData);
  },
  deleteBranchCategory(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.BRANCH_CATEGORY_DELETE, requestData);
  },
  clearBranchCategories(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.BRANCH_CATEGORY_CLEAR_BRANCH, requestData);
  },
};

export default API;
