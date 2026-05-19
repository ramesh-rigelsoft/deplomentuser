
import React,{useState} from "react";
import logo from "./../asset/resource/logo.jpeg";
function PumpScheduleDetails(){
       return(
        <div className="row col-12 form-box">
        <h1 htmlFor="11q" className="mb-2 header-label">Pump Schedule:</h1>
        <div className="row">
           <div className="col-4">
               <span className="panel-label">Schedule</span>
               <span className="panel-label">Time I</span>
               <span className="panel-label">Time II</span>
               <span className="panel-label">Time III</span>
               <span className="panel-label">Time IV</span>
           </div>
           <div className="col-4">
               <span className="schedule-btn pump-btn-success">ON</span>
               <span className="schedule-btn pump-btn-non text-success">6:00</span>
               <span className="schedule-btn pump-btn-non text-success">16:00</span>
               <span className="schedule-btn pump-btn-non text-success">00:00</span>
               <span className="schedule-btn pump-btn-non text-success">03:08</span>
           </div>
           <div className="col-4">
               <span className="schedule-btn pump-btn-danger">OFF</span>
               <span className="schedule-btn pump-btn-non">6:00</span>
               <span className="schedule-btn pump-btn-non">16:00</span>
               <span className="schedule-btn pump-btn-non">00:00</span>
               <span className="schedule-btn pump-btn-non">03:08</span>
              
           </div>
        </div>
        
        </div>
    );
}

export default PumpScheduleDetails; 