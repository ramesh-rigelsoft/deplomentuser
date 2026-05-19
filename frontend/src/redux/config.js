
export const BASE_URL = process.env.REACT_APP_API_URL;

export const ENDPOINT = {
  LOGIN: `${BASE_URL}/user/login`,
  SIGNUP: `${BASE_URL}/user/signup`,
  VALIDATE_TOKEN: `${BASE_URL}/user/token/validate`,
  
  VIEW_FILE: `${BASE_URL}/user/view/file`,
  FILE_UPLOAD: `${BASE_URL}/files/upload`,

  RESET_PASSWORD: `${BASE_URL}/user/password/reset`,
  SAVE_OTP: `${BASE_URL}/user/send/otp`,
  
  BILL_PRINT: `${BASE_URL}/print/bill`,
  
  SAVE_ITEMS: `${BASE_URL}/items/save`,
  SEARCH_ITEMS: `${BASE_URL}/items/search`,
  ITEMS_LISTS_AND_SEARCH: `${BASE_URL}/items/search`,
  
  SAVE_SALES: `${BASE_URL}/buyer/save`,
  SALES_LIST_AND_SEARCH: `${BASE_URL}/sales/search`,

  SALES_SEARCH: `${BASE_URL}/sales/search`,
 
  FETCH_DASHBOARD_DATA: `${BASE_URL}/dashboard/view`, 
  INVENTRY_ITEMS_LIST_AND_SEARCH: `${BASE_URL}/inventory/search`,

  ADD_SUPPLIER: `${BASE_URL}/supplier/save`,
  SEARCH_SUPPLIER: `${BASE_URL}/supplier/search`,

  SAVE_EXPENSE: `${BASE_URL}/expense/save`, 
  EXPENSE_LIST_AND_SEARCH: `${BASE_URL}/expense/search`, 
  
};
