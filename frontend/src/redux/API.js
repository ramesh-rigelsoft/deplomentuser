// API.js
import { ENDPOINT } from "./config";
import { callAPI,callGetAPI,multipartAPI,loginAPI } from "./apiService";
import fileViewer from "../components/FilePreview";

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

   viewFiles(dispatch, params) {
    return callGetAPI(dispatch, ENDPOINT.VIEW_FILE, params);
  },

  billPrint(dispatch, billRequest) {
    return callAPI(dispatch, ENDPOINT.BILL_PRINT, billRequest);
  },

 openFileInBrowser(params) {
  const fullUrl = `${ENDPOINT.VIEW_FILE}?path=${params.path}&type=${params.type}&fileName=${params.fileName}`;
    fileViewer.openFile(fullUrl,params.type);
     console.log(fullUrl);
    //  window.open(fullUrl, "_blank");
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

  insertItems(dispatch, itemData) {
    return multipartAPI(dispatch, ENDPOINT.SAVE_ITEMS, itemData);
  },

  searchItems(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.SEARCH_ITEMS, requestData);
  },

  itemsListAndSearch(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.ITEMS_LISTS_AND_SEARCH, requestData);
  },

  saveSales(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.SAVE_SALES, requestData);
  },

  salesListAndSearch(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.SALES_LIST_AND_SEARCH, requestData);
  },

  salesSearch(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.SALES_SEARCH, requestData);
  },

  fetchDashboardData(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.FETCH_DASHBOARD_DATA, requestData);
  },

  inventryItemListAndSearch(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.INVENTRY_ITEMS_LIST_AND_SEARCH, requestData);
  },

  addSupplier(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.ADD_SUPPLIER, requestData);
  },

  searchSupplier(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.SEARCH_SUPPLIER, requestData);
  },

  saveExpense(dispatch, requestData) {
    return multipartAPI(dispatch, ENDPOINT.SAVE_EXPENSE, requestData);
  },

  expenseListAndSearch(dispatch, requestData) {
    return callAPI(dispatch, ENDPOINT.EXPENSE_LIST_AND_SEARCH, requestData);
  },
};

export default API;
