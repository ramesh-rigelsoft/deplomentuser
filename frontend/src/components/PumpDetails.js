import React from "react";

function PumpDetails() {
  const leftLabels = ["Data Stamp", "Power Status", "Pump mode", "Voltage LN", "Voltage RN", "Voltage YN", "Temperature"];
  const leftValues = ["25 July", "N/A", "Auto", "0", "0", "0", "0.0°C"];

  const rightLabels = ["Network", "Trip", "Pump Sta", "Amp R", "YN B", "YN B", "Trip Reason"];
  const rightValues = ["0.0%", "---", "stop", "0", "0", "0", "---"];

  return (
    <div className="row col-12 form-box">
      <h1 htmlFor="11q" className="mb-2 header-label">Pump Details:<span>976||Bajipur</span></h1>
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

export default PumpDetails;
