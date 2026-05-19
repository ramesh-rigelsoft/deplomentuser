import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header1 from "./Header1";
import SupplierList from "./SupplierList";
import Supplier from "./Supplier";

  export default function AddSupplierForm() {
  
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-12 col-md-3 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-9 p-0">
          <Header1 />
          <Supplier/>
          {/* <SupplierList/> */}
        </div>
      </div>
    </div>
  );
};