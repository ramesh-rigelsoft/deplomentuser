
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
   
};
