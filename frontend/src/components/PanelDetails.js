import React,{useState} from "react";
import logo from "./../asset/resource/logo.jpeg";
function PanelDetails(){
       return(
        <div className="row col-12 form-box">
        <h1 htmlFor="11q" className="mb-2 header-label">Panel Details:</h1>
        <div className="row">
           <div className="col-4">
               <span className="panel-label">Modem Type</span>
               <span className="panel-label">Pump HP</span>
               <span className="panel-label">Date of Installation</span>
               <span className="panel-label">SIM Number</span>
               <span className="panel-label">Latitude</span>
               <span className="panel-label">Operator Details</span>
           </div>
           <div className="col-8">
                <span className="panel-details-btn pump-btn-non">UNQ400MSG-1.0|HTTP|4G|PR0232</span>
                <span className="panel-details-btn pump-btn-non">15HP</span>
                <div className="col-12">
                    <div className="row">
                        <div className="col-4">
                             <span className="panel-details-btn pump-btn-non">14-02-2022</span>
                             <span className="panel-details-btn pump-btn-non">876456722</span>
                             <span className="panel-details-btn pump-btn-non">25.34567898</span>
                        </div>
                        <div className="col-4">
                             <span className="panel-label d-flex justify-content-center">IMEI No</span>
                             <span className="panel-label d-flex justify-content-center">SIM Type</span>
                             <span className="d-flex justify-content-center">Longitude</span>
                        </div>
                        <div className="col-4">
                            <span className="panel-details-btn pump-btn-non">14022022</span>
                            <span className="panel-details-btn pump-btn-non">Airtel(Post)</span>
                            <span className="panel-details-btn pump-btn-non">80.8</span>
                        </div>
                    </div>
                </div>
                <span className="panel-details-btn pump-btn-non">Ramesh Kumar(9872904782)</span>
           </div>
        </div>
        
        </div>
    );
}

export default PanelDetails; 