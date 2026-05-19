import React from "react";
import pumprun from "./../asset/resource/activeMotor.webp";

function PumpStatus(){

    return(<div className="col-12 row form-box">
       <h1 htmlFor="11q" className="mb-2 header-label">Pump Status:</h1>
        <img  className="col-12" src={pumprun} alt="active" />
        <p>
          <div className="pumpstatus">
            <span className="pump-btn pump-btn-success col-5">Start</span><span className="pump-btn pump-btn-danger col-5">Stop</span>
          </div> 
        </p>
    </div>)
}

export default PumpStatus;