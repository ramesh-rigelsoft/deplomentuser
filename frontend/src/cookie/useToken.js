import { useState } from "react";
import Cookies from "js-cookie";

function useToken() {
  const [token, setToken] = useState(() => Cookies.get("token"));

  const saveToken = (token) => {
    Cookies.set("token", token, { expires: 7 });
    setToken(token);
  };

  const removeToken = () => {
    Cookies.remove("token");
    setToken(null);
  };

  return { token, saveToken, removeToken };
}
