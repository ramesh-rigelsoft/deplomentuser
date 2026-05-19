import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "./Sidebar";
import Header1 from "./Header1";
import { Placeholder } from "react-bootstrap";

export default function AccountSettings() {

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
    
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        {/* <div className="card-header bg-primary text-white text-center">
          <h3>Inbound Product Form</h3>
        </div> */}
        <div className="card-body p-4">
          <form>
            {/* Product Details */}
            <h5 className="text-primary mb-3 border-bottom pb-2">About Account</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label">Account Name</label>
                <div className="form-label">{accountName}</div>
              </div>
              <div className="col-md-4">
                <label className="form-label">GST Number</label>
                <div className="form-label">GST2345678867765</div>
              </div>
                <div className="col-md-4">
                <label className="form-label">Address</label>
                <div className="form-label">First Floor SCF11, Gulmohar Complex Desu Majra, Sector 125 , Kharar, Sahibzada Ajit Singh Nagar, Punjab 140301</div>
              </div>
            </div>
            <h5 className="text-primary mb-3 border-bottom pb-2">Account Settings</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label">Operators</label>
                 <ul>
                  <li>
                    <div className="d-flex align-items-center">
                      <label className="me-2">Operator1 </label>
                      <input type="password" placeholder='New Password' className={`me-2 form-control rounded-1`} />
                      <input type="button" name="update" value={`update`} className="btn btn-success me-2" />
                    </div>
                  </li>
                 </ul>
              </div>
              <div className="col-md-2">
                <label className="form-label">Is Multiple Storage Location</label>
                <div className="d-flex gap-3 flex-wrap scale-200">
                    <div className="form-check">
                      <label for="red" className="form-check-label gap-3">Yes</label>
                      <input type="radio" className="form-check-input gap-3" id="red" name="color" value="red"/>
                    </div>
                    <div className="form-check">
                      <label for="blue" className="form-check-label gap-3">No</label>
                      <input type="radio" className="form-check-input gap-3" id="blue" name="color" value="blue"/>
                    </div>                    
                </div>
              </div>
               <div className="col-md-2">
                <label className="form-label">Are you menufacturer?</label>
                <div className="d-flex gap-3 flex-wrap scale-200">
                    <div className="form-check">
                      <label for="red" className="form-check-label gap-3">Yes</label>
                      <input type="radio" className="form-check-input gap-3" id="red" name="color" value="red"/>
                    </div>
                    <div className="form-check">
                      <label for="blue" className="form-check-label gap-3">No</label>
                      <input type="radio" className="form-check-input gap-3" id="blue" name="color" value="blue"/>
                    </div>                    
                </div>
              </div>
                <div className="col-md-4">
                <label className="form-label">Address</label>
                <div className="form-label">First Floor SCF11, Gulmohar Complex Desu Majra, Sector 125 , Kharar, Sahibzada Ajit Singh Nagar, Punjab 140301</div>
              </div>
            </div>
           
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
    </div>
      </div>
    </div>
  );
}
