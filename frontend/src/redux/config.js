
const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    const envUrl = process.env.REACT_APP_API_URL;
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
    }
    const protocol = window.location.protocol || "http:";
    return `${protocol}//${hostname}:8089/api`;
  }
  return process.env.REACT_APP_API_URL || "http://localhost:8089/api";
};

export const BASE_URL = getApiBaseUrl();

export const ENDPOINT = {

  LOGIN: `${BASE_URL}/user/adminLogin`,
  SIGNUP: `${BASE_URL}/user/signup`,
  ADMIN_VIEW: `${BASE_URL}/user/view`,
  VALIDATE_TOKEN: `${BASE_URL}/user/token/validate`,
  
  VIEW_FILE: `${BASE_URL}/user/view/file`,
  FILE_UPLOAD: `${BASE_URL}/files/upload`,

  RESET_PASSWORD: `${BASE_URL}/user/password/reset`,
  SAVE_OTP: `${BASE_URL}/user/send/otp`,

   ADD_SUBUSER: `${BASE_URL}/access/addSubUser`,
   SAVE_ROLES_PERMISSION: `${BASE_URL}/access/saveRolePermission`,
   FETCH_PERMISSION: `${BASE_URL}/access/fetch`,
   FETCH_PERMITTED_PAGES: `${BASE_URL}/access/fetchPremittedPagesRoleWise`,
   REMOVE_PERMITTED_PAGES: `${BASE_URL}/access/removedPermission`,
   FETCH_USERLIST: `${BASE_URL}/access/userList`,
   SUBSCRIPTION_LIST: `${BASE_URL}/access/subscriptionList`,
   USER_SUBSCRIPTION_LIST: `${BASE_URL}/access/userSubscriptionList`,
   SAVE_USER_SUBSCRIPTION: `${BASE_URL}/user/userSubscription`,

   BRANCH_ADD: `${BASE_URL}/branch/save`,
   BRANCH_LIST: `${BASE_URL}/branch/search`,

   ///branch
   SEARCH_ITEMS: `${BASE_URL}/items/search`,
   SALES_LIST_AND_SEARCH: `${BASE_URL}/sales/search`,
   FETCH_DASHBOARD_DATA: `${BASE_URL}/dashboard/view`, 
   INVENTRY_LIST: `${BASE_URL}/inventory/search`,
   EXPENSE_LIST_AND_SEARCH: `${BASE_URL}/expense/search`,
   GARBAGE_SEARCH: `${BASE_URL}/garbage/search`,

   LOW_STOCK_ALERT_SAVE: `${BASE_URL}/user/low-stock-alert/save`,
   LOW_STOCK_ALERT_LIST: `${BASE_URL}/user/low-stock-alert/list`,
   LOW_STOCK_ALERT_STATUS: `${BASE_URL}/user/low-stock-alert/status`,
   LOW_STOCK_ALERT_DELETE: `${BASE_URL}/user/low-stock-alert/delete`
};
