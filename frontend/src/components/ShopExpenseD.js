import React from 'react';
import Sidebar from "./Sidebar";
import Header1 from './Header1';
import ShopExpense from './ShopExpense';


export default function ShopExpenseD() {
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
          <ShopExpense/>
        </div>
      </div>
    </div>
  );
}
