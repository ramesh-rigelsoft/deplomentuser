import React,{useState} from 'react';
import Sidebar from "./Sidebar";
import Header1 from './Header1';
import OutBondItem from "./OutBondItem";
// import InternaBound from "./InternalBoundItem";

export default function OutBound() {

  const [selected, setSelected] = useState("InternaBound");

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
          <div className="sales-page text-muted fs-6" style={{padding:"16px 16px 0px 16px"}}>
            <div className="card-header">
              <div className="dropdown-container">
                {/* <select
                  className="entry-dropdown"
                  value={selected}
                  name="entrydropdown"
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option className="text-muted fs-6" value="InternaBound">Internal Entry</option>
                  <option className="text-muted fs-6" value="OutBound">Customer Entry</option>
                </select> */}
              </div>
            </div>
          </div>
          <OutBondItem/>   
        </div>
      </div>
    </div>
  );
}
