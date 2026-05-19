import React from "react";

function FlowMeterDetails() {
  const leftLabels = ["Pressure", "Flow(Instruantaneous)"];
  const leftValues = ["N/A","Auto"];

  const rightLabels = ["Cumulative Flow(Per Day)", "Pump start"];
  const rightValues = ["---", "stop"];

  return (
    <div className="row col-12 form-box">
      <h1 htmlFor="11q" className="mb-2 header-label">Flow Meter/Presser Details:</h1>
     
      <div className="d-flex justify-content-between align-items-center mb-1">

      <div className="col-6 mb-3">
        {leftLabels.map((label, i) => (
          <div className="d-flex justify-content-between align-items-center mb-1" key={i}>
            <span className="pump-label">{label}</span>
            <span className={`pump-btn pump-btn-${i === 1 ? "success" : i === 2 ? "danger" : "danger"}`}>
              {leftValues[i]}
            </span>
          </div>
        ))}
      </div>

      <div className="col-6 mb-3">
        {rightLabels.map((label, i) => (
          <div className="d-flex justify-content-between align-items-center mb-1" key={i}>
            <span className="pump-label">{label}</span>
            <span className={`pump-btn pump-btn-${i === 2 ? "danger" : "orange"}`}>
              {rightValues[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default FlowMeterDetails;
