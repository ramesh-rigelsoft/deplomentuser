
export const BASE_URL = process.env.REACT_APP_API_URL;

export const ENDPOINT = {

  LOGIN: `${BASE_URL}/user/login`,
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
   FETCH_USERLIST: `${BASE_URL}/access/userList`,

   BRANCH_ADD: `${BASE_URL}/branch/save`,
   BRANCH_LIST: `${BASE_URL}/branch/search`,

   ///branch
  SEARCH_ITEMS: `${BASE_URL}/items/search`,
  SALES_LIST_AND_SEARCH: `${BASE_URL}/sales/search`,
  FETCH_DASHBOARD_DATA: `${BASE_URL}/dashboard/view`, 
  INVENTRY_LIST: `${BASE_URL}/inventory/search`,
  EXPENSE_LIST_AND_SEARCH: `${BASE_URL}/expense/search`,
  GARBAGE_SEARCH: `${BASE_URL}/garbage/search`
};
