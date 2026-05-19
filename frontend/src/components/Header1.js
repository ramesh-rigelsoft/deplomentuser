import React,{ useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authAlice";
import API from "../redux/API";
import Cookies from "js-cookie";

const Header1 = () => {
  const dispatch = useDispatch();
  const savedCompanyName = Cookies.get("companyName");
  const [companyName, setCompanyName] = useState(savedCompanyName || "Your Shop Name");
  const [subTitle, setSubTitle] = useState("Admin Panel");
  const [logo, setLogo] = useState("");
  const fileName = Cookies.get("fileName");
           

    useEffect(() => {
      let payload={
          path:"logo",
          fileName:fileName,
          type:1
      };
      API.viewFiles(dispatch,payload).then(res => {
        console.log(res.payload);
        setLogo(URL.createObjectURL(res.payload));
      }).catch(err => {
        console.log("Error:", err);
      });
  }, []); // empty dependency → page load pe sirf ek baar run

  
  return (
    <div className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
      
      {/* Left Side */}
      <div className="d-flex flex-column">
        <span className="fw-bold text-primary fs-5">{companyName}</span>
        <span className="text-muted small">{subTitle}</span>
      </div>

      {/* Right Side */}
      <div className="d-flex align-items-center">
        <img
          src={logo}
          alt="Company Logo"
          className="rounded-circle border border-primary"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      </div>

    </div>
  );
};

export default Header1;

// import React from "react";
// import logo from "./../asset/resource/logo.jpeg";

// const Header1 = () => {


//   return (
//     <div className="header1-container bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
//       {/* Left Side - Company Name */}
//       <div className="d-flex flex-column">
//         <span className="fw-bold text-primary fs-5">Rigel Automation</span>
//         <span className="text-muted small">Admin Panel</span>
//       </div>

//       {/* Right Side - Logo */}
//       <div className="d-flex align-items-center">
//         <img
//           src={logo}
//           alt="Rigel Automation Logo"
//           className="rounded-circle border border-primary"
//           style={{ width: "50px", height: "50px", objectFit: "cover" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Header1;

