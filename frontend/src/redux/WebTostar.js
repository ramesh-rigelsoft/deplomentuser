import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// toast.success("Success message!");
// toast.error("Error message!");   // This is the equivalent of "fail"
// toast.info("Info message!");
// toast.warning("Warning message!");

 export const success = (msg) => {
    toast.success(msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored", // "light", "dark", "colored"
            style: {
              backgroundColor: "#4CAF50",  // custom bg color
              color: "#fff",               // text color
              fontSize: "16px",
              borderRadius: "8px"
            }
          });
  };

  
 export const fail = (msg) => {
    toast.error(msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored", // "light", "dark", "colored"
            style: {
              backgroundColor: "#791008ff",  // custom bg color
              color: "#fff",               // text color
              fontSize: "16px",
              borderRadius: "8px"
            }
          });
  };

   export const info = (msg) => {
    toast.info(msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored", // "light", "dark", "colored"
            style: {
              backgroundColor: "rgb(97, 127, 8)",  // custom bg color
              color: "#fff",               // text color
              fontSize: "16px",
              borderRadius: "8px"
            }
          });
  };

   export const warning = (msg) => {
    toast.warning(msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored", // "light", "dark", "colored"
            style: {
              backgroundColor: "#e6e926ff",  // custom bg color
              color: "#fff",               // text color
              fontSize: "16px",
              borderRadius: "8px"
            }
          });
  };