import React from "react";

function PumpDetails(){

    return(<div className="col-12 row form-box">
        <label htmlFor="pumpdetails">Pump Details : </label>
        
        <div className="col-6">
            <div className="col-12 container-fluid">
                <div className="row">
                    <div className="col-8 pumpdetails">
                        <label className="pump-label" htmlFor="1">Data Stamp</label>
                        <label className="pump-label" htmlFor="2">Power Status</label>
                        <label className="pump-label" htmlFor="3">Pump mode</label>
                        <label className="pump-label" htmlFor="4">Voltage LN</label>
                        <label className="pump-label" htmlFor="5">Voltage RN</label>
                        <label className="pump-label" htmlFor="6">Voltage YN</label>
                        <label className="pump-label" htmlFor="7">Temperature</label>
                    </div>
                    <div className="col-4 pumpdetails">
                        <label className="pump-btn pump-btn-non" htmlFor="20">25 July</label>
                        <label className="pump-btn pump-btn-success" htmlFor="8">N/A</label>
                        <label className="pump-btn pump-btn-danger" htmlFor="9">Auto</label>
                        <label className="pump-btn pump-btn-danger" htmlFor="10">0</label>
                        <label className="pump-btn pump-btn-danger" htmlFor="11">0</label>
                        <label className="pump-btn pump-btn-danger" htmlFor="12">0</label>
                        <label className="pump-btn pump-btn-danger" htmlFor="13"><p>0.0&deg;C</p></label>
                    </div>
                </div>
            </div>
          
        </div>
        <div className="col-6">
             <div className="col-12 container-fluid">
                <div className="row">
                    <div className="col-8 pumpdetails">
                        <label className="pump-label" htmlFor="14">Network</label>
                        <label className="pump-label" htmlFor="14">Trip</label>
                        <label className="pump-label" htmlFor="15">Pump Sta</label>
                        <label className="pump-label" htmlFor="16">Amp R</label>
                        <label className="pump-label" htmlFor="17">YN B</label>
                        <label className="pump-label" htmlFor="18">YN B</label>
                        <label className="pump-label" htmlFor="19">Trip Reason</label>
                    </div>
                    <div className="col-4 pumpdetails">                  
                        <label className="pump-btn pump-btn-non" htmlFor="20">0.0%</label>
                        <label className="pump-btn pump-btn-non" htmlFor="20">---</label>
                        <label className="pump-btn pump-btn-danger" htmlFor="21">stop</label>
                        <label className="pump-btn pump-btn-orange" htmlFor="22">0</label>
                        <label className="pump-btn pump-btn-orange" htmlFor="23">0</label>
                        <label className="pump-btn pump-btn-orange" htmlFor="24">0</label>
                        <label className="pump-btn pump-btn-orange" htmlFor="25">---</label>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default PumpDetails;