import Cookies from "js-cookie";

// set cookie
// Cookies.set("secret", "abc123", { expires: 1 }); // 1 day// utils/auth.js
export const isAuthenticated = () => {
  const secret = Cookies.get("secret");
  return !secret;
};

export const getLocal = (msg) => {
  let tab = Cookies.get("tab");
  return tab;
};

export const activeTabs = (tab) => {
  Cookies.set("tab", tab, { expires: 1 });
  // localStorage.setItem("tab", tab);
};
export const login = (secret) => {
  // localStorage.setItem("secret", secret);
  Cookies.set("secret", secret, { expires: 1 }); // 1 day
};

export const logout = () => {
  Cookies.remove("secret");
  Cookies.remove("fileName");
  Cookies.remove("secretCode");  
  Cookies.remove("user");
  Cookies.remove("tab");
  Cookies.remove("username");
  Cookies.remove("companyName");
  Cookies.remove("token");   
  
};
