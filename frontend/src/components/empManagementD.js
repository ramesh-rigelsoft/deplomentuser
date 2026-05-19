import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "./Sidebar";
import Header1 from "./Header1";
import { Placeholder } from "react-bootstrap";
import LiveInventory from "./LiveInventory";
import InventoryDashboardAdvanced from "./InventoryDashboardAdvanced";
import MobileInfo from "./MobileInfo";
import EmployeeManagement from "./EmployeeManagement";

export default function Dashboards() {

  let accountName="Rigel Automation";

  return (
    <div className="container-fluid min-vh-100">
      <div className="row">
        {/* Sidebar */}
        <div className="col-12 col-md-3 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-9 p-0 bg-light">
          <Header1 />
          <EmployeeManagement/>
        </div>
      </div>
    </div>
  );
}
