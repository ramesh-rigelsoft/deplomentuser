import { MultipartPostRequest } from "./MultipartPostRequest";
import { postRequest } from "./postRequest";
import { getRequest } from "./getRequest";
import { loginRequest } from "./LoginRequest";
import {branchApiRequest} from "./branchApiRequest";


export const callAPI = (dispatch, url, data) => {
   return dispatch(postRequest({ url, data }));//.unwrap();
};

export const loginAPI = (dispatch, url, data) => {
   return dispatch(loginRequest({ url, data }));//.unwrap();
};

export const callGetAPI = (dispatch, url, params) => {
   return dispatch(getRequest({ url, params })); //.unwrap();
};

export const multipartAPI = (dispatch, url, data) => {
   return dispatch(MultipartPostRequest({ url, data }));//.unwrap();
};

export const branchApiCall = (dispatch, url, data) => {
   return dispatch(branchApiRequest({ domain: "branch", endpoint: url, data }));//.unwrap();   
};