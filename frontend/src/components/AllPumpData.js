import React,{useState} from "react";
import logo from "./../asset/resource/logo.jpeg";
import PumpStatus from "./PumpStatus";
import PumpDetails from "./PumpDetails";
import FlowMeterDetails from "./FlowMeterDetails";
import PanelDetails from "./PanelDetails";
import PumpScheduleDetails from "./PumpScheduleDetails";
import PumpGraphDetails from "./PumpGraphDetails";
function AllPumpData(){
       return(
        <div className="col-12 card">
            <div className="row">
              <div className="col-5 card">
                  <PumpDetails/>
                  <PumpStatus/>
              </div>
              <div className="col-7 card">
                  <FlowMeterDetails/>
                  <PanelDetails/>
                  <PumpScheduleDetails/>
              </div>
            </div>
            <div className="row">
              <div className="col-12 card">
                <PumpGraphDetails/>
              </div>
            </div>
        </div>
    );
}

export default AllPumpData; 