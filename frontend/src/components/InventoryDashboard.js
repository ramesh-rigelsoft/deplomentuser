import React from 'react';
import Sidebar from "./Sidebar";
import Header1 from './Header1';
import BodyData1 from './BodyData1';
import BodyData2 from './BodyData2';
import LiveInventory from "./LiveInventory";
import InventoryDashboardAdvanced from './InventoryDashboardAdvanced';


export default function InventoryDashboard() {
  return (
    <div className="container-fluid">
          <div className="row">

          {/* Sidebar (col-3 on md+, full width on mobile) */}
          <div className="col-12 col-md-3 p-0">
            <Sidebar />
          </div>

          {/* Main area */}
          <div className="col-12 col-md-9 p-0">
            <Header1 />
            {/* <BodyData1 /> */}
            <div className="scroll-area">
              <LiveInventory />
            </div>
          </div>
      </div>
    </div>
  );
}
