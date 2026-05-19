import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";

const PAGE_SIZE = 10;

// ---------------- MOCK DATA ----------------
const generateMockEmployees = (num = 100) => {
  const names = ["John","Jane","Alex","Alice","Bob","Mary","Mike","Sara","Tom","Emma"];
  const employees = [];
  for(let i = 1; i <= num; i++){
    employees.push({
      id: i,
      name: names[i % names.length] + " " + i,
      mobile: "9000000" + (100+i),
      email: "user" + i + "@mail.com",
      isActive: i % 5 !== 0,
    });
  }
  return employees;
}

const generateMockAttendance = (num = 200) => {
  const statuses = ["Present","Absent"];
  const records = [];
  for(let i = 1; i <= num; i++){
    const date = new Date(2024, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1);
    records.push({
      id: i,
      employeeId: (Math.floor(Math.random()*50)+1).toString(),
      status: statuses[Math.floor(Math.random()*2)],
      date: date.toISOString().split("T")[0]
    });
  }
  return records;
}

// ---------------- COMPONENT ----------------
const EmployeeManagement = () => {
  const [activeBox, setActiveBox] = useState("entry");
  const [employees, setEmployees] = useState(generateMockEmployees());
  const [attendanceList, setAttendanceList] = useState(generateMockAttendance());

  const [empPage, setEmpPage] = useState(1);
  const [attPage, setAttPage] = useState(1);
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // ---------------- EMPLOYEE FORM ----------------
  const EmployeeForm = ({ employee, onSave, onCancel }) => {
    const [formData, setFormData] = useState(employee || {
      name: "",
      mobile: "",
      email: "",
      aadharFile: null,
      panFile: null,
      bankDetails: "",
      designation: "",
      salary: "",
      isActive: true,
      resigned: false,
      reason: "",
      joiningDate: "",
      dob: "",
      gender: "Male",
      address: "",
    });

    const handleFileChange = (e) => {
      const { name, files } = e.target;
      const file = files[0];
      if(file && file.type !== "application/pdf"){ alert("Only PDF files allowed!"); return; }
      setFormData({ ...formData, [name]: file });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if(employee){ onSave(employee.id, formData); }
      else { onSave(null, formData); }
    };

    return (
      <div className="card p-3 mt-3 w-100">
        <h5>{employee ? "✏️ Edit Employee" : "📝 Employee Entry"}</h5>

        <form onSubmit={handleSubmit}>
          <div className="row">

            <div className="col-md-4 mb-2">
              <label>Name</label>
              <input type="text" placeholder="Enter Name" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} required className="form-control"/>
            </div>

            <div className="col-md-4 mb-2">
              <label>Mobile</label>
              <input type="text" placeholder="Enter Mobile Number" value={formData.mobile} onChange={e=>setFormData({...formData,mobile:e.target.value})} required className="form-control"/>
            </div>

            <div className="col-md-4 mb-2">
              <label>Email</label>
              <input type="email" placeholder="Enter email id" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} required className="form-control"/>
            </div>

            <div className="col-md-4 mb-2">
              <label>Aadhar Card (PDF)</label>
              <input type="file" name="aadharFile" accept="application/pdf" onChange={handleFileChange} className="form-control"/>
            </div>

            <div className="col-md-4 mb-2">
              <label>PAN Card (PDF)</label>
              <input type="file" name="panFile" accept="application/pdf" onChange={handleFileChange} className="form-control"/>
            </div>

            {/* <div className="col-md-4 mb-2">
              <label>Bank Details</label>
              <input type="text" value={formData.bankDetails} onChange={e=>setFormData({...formData,bankDetails:e.target.value})} className="form-control"/>
            </div> */}

            <div className="col-md-4 mb-2">
              <label>Designation</label>
              <input type="text" placeholder="Enter designation" value={formData.designation} onChange={e=>setFormData({...formData,designation:e.target.value})} className="form-control"/>
            </div>

            <div className="col-md-4 mb-2">
              <label>Salary / Month</label>
              <input type="number" placeholder="Enter salary per month" value={formData.salary} onChange={e=>setFormData({...formData,salary:e.target.value})} className="form-control"/>
            </div>

            <div className="col-md-4 mb-2">
              <label><input type="checkbox" checked={formData.isActive} onChange={e=>setFormData({...formData,isActive:e.target.checked})}/> Is Active</label>
            </div>

            <div className="col-md-4 mb-2">
              <label><input type="checkbox" checked={formData.resigned} onChange={e=>setFormData({...formData,resigned:e.target.checked})}/> Resigned</label>
            </div>

           {formData.resigned && (
              <div className="col-md-8 mb-2">
                <label>Reason</label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="form-control"
                  placeholder="Enter Reason"
                />
              </div>
            )}


            <div className="col-md-4 mb-2">
              <label className="from-control">Joining Date</label>
              <br/>
              <DatePicker 
                locale={enUS} 
                popperPlacement="bottom-start"
                dateFormat="yyyy-MM-dd"
                placeholderText="yyyy-mm-dd"
                selected={formData.joiningDate} 
                onChange={(selectedDate) =>setFormData({...formData,joiningDate:selectedDate})}
             />
            </div>

            <div className="col-md-4 mb-2">
              <label>DOB</label>
              <br/>
               <DatePicker 
                popperPlacement="bottom-start"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={50}
                showMonthDropdown
                locale={enUS} 
                dateFormat="yyyy-MM-dd"
                placeholderText="yyyy-mm-dd"
                selected={formData.dob} 
                onChange={(selectedDate) =>setFormData({...formData,dob:selectedDate})}
             />
         </div>

            <div className="col-md-4 mb-2">
              <label>Gender</label>
              <select value={formData.gender} onChange={e=>setFormData({...formData,gender:e.target.value})} className="form-control">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-12 mb-2">
              <label>Address</label>
               <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-control"
                  placeholder="Enter Address"
                />
           </div>

            <div className="col-md-12 d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {employee ? "Update Employee" : "Save Employee"}
              </button>
              {employee && (
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                  Cancel
                </button>
              )}
            </div>

          </div>
        </form>
      </div>
    );
  };

  // ---------------- EMPLOYEE LIST ----------------
  const EmployeeList = () => {
    const totalPages = Math.ceil(employees.length / PAGE_SIZE);
    const paginatedEmp = employees.slice((empPage-1)*PAGE_SIZE, empPage*PAGE_SIZE);

    const handleViewEdit = (emp) => setSelectedEmployee(emp);

    return (
      <div className="card p-3 mt-3 w-100">
        <h5>👥 Employee List</h5>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Mobile</th><th>Email</th><th>Active</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmp.map(emp=>(
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.mobile}</td>
                <td>{emp.email}</td>
                <td>{emp.isActive ? "Yes":"No"}</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={()=>handleViewEdit(emp)}>View/Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-center gap-2 mt-2">
          <button className="btn btn-sm btn-secondary" disabled={empPage===1} onClick={()=>setEmpPage(empPage-1)}>Prev</button>
          <span>{empPage}/{totalPages}</span>
          <button className="btn btn-sm btn-secondary" disabled={empPage===totalPages} onClick={()=>setEmpPage(empPage+1)}>Next</button>
        </div>
      </div>
    );
  };

  // ---------------- MARK ATTENDANCE ----------------
  const MarkAttendance = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [status, setStatus] = useState("Present");
    const [reason, setReason] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if(!employeeId) return alert("Enter Employee ID");
      const today = new Date().toISOString().split("T")[0];
      const newRecord = { id: attendanceList.length+1, employeeId, status, date: today };
      setAttendanceList([...attendanceList, newRecord]);
      alert("Attendance marked!");
      setEmployeeId(""); setStatus("Present");
    };

    return (
      <div className="card p-3 mt-3 w-100">
        <h5>📅 Mark Attendance</h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-4">
              <label>Employee ID</label>
              <input placeholder="Enter Employee Id" type="text" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} required className="form-control"/>
            </div>
            <div className="col-8">
             <div className="row">
                <div className="col-12 d-flex">                  
                  <label>Present</label>
                  <input
                    type="radio"
                    name="attendance"
                    checked={status === "Present"}
                    onChange={() => setStatus("Present")}
                  />
                  <label>Absent</label>
                  <input
                    type="radio"
                    name="attendance"
                    checked={status === "Absent"}
                    onChange={() => setStatus("Absent")}
                  />
                </div>
              </div>
            </div>          
          </div>
          <div className="row">
            
           
            {status==="Absent"&&(
            <div className="col-12">
              <label for="">Reason</label><br/>
              <textarea
                id="reason"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Enter reason..."
                className="form-control"
              />
            </div>
           )}
          </div>

          <button className="btn btn-primary mt-4" type="submit">Confirm Attendance</button>
        </form>
      </div>
    );
  };

  // ---------------- MARK LEAVE ----------------
  const EmployeeLeave = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [status, setStatus] = useState("Absent");

    const [formData, setFormData] = useState({
      empId: "",
      mobile: "",
      email: "",
      reason: "",
      fromDate: "",
      toDate: ""
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if(!employeeId) return alert("Enter Employee ID");
      const today = new Date().toISOString().split("T")[0];
      const newRecord = { id: attendanceList.length+1, employeeId, status, date: today };
      setAttendanceList([...attendanceList, newRecord]);
      alert("Leave marked!");
      setEmployeeId(""); setStatus("Absent");
    };

    return (
      <div className="card p-3 mt-3 w-100">
        <h5>📅 Mark Leave</h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label>Employee ID</label>
              <input type="text" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} required className="form-control"/>
            </div>

            <div className="col-md-3 mb-2">
              <label>From Date</label>
            <DatePicker 
                locale={enUS} 
                popperPlacement="bottom-start"
                dateFormat="yyyy-MM-dd"
                placeholderText="yyyy-mm-dd"
                selected={formData.fromDate} 
                onChange={(selectedDate) =>setFormData({...formData,fromDate:selectedDate})}
             />
            </div>

            <div className="col-md-3 mb-2">
              <label>To Date</label>
              <DatePicker 
                locale={enUS} 
                popperPlacement="bottom-start"
                dateFormat="yyyy-MM-dd"
                placeholderText="yyyy-mm-dd"
                selected={formData.toDate} 
                onChange={(selectedDate) =>setFormData({...formData,toDate:selectedDate})}
             />
            </div>

            <div className="col-md-6 mb-2">
              <label>Reason</label>
              <textarea rows="3" value={formData.reason} placeholder="Enter reason" onChange={e=>setFormData({...formData,reason:e.target.value})} className="form-control"></textarea>
            </div>

            <div className="col-md-6 mb-2">
              <label>Status</label>
              <div>
                <label><input type="radio" checked={status==="Present"} disabled/> Present</label>
                <label className="ms-3"><input type="radio" checked={status==="Absent"} disabled/> Absent</label>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" type="submit">Confirm Leave</button>
        </form>
      </div>
    );
  };

  // ---------------- ATTENDANCE LIST ----------------
  const AttendanceList = () => {
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");

    const filtered = attendanceList.filter(a=>{
      const d = new Date(a.date);
      const matchY = year ? d.getFullYear().toString() === year : true;
      const matchM = month ? (d.getMonth()+1).toString().padStart(2,"0") === month : true;
      return matchY && matchM;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((attPage-1)*PAGE_SIZE, attPage*PAGE_SIZE);

    const summary = filtered.reduce((acc,a)=>{ acc[a.status]=(acc[a.status]||0)+1; return acc; },{});

    return (
      <div className="card p-3 mt-3 w-100">
        <h5>📊 Attendance List</h5>

        <div className="row">
          <div className="col-md-4 mb-2">
            <label>Year</label>
            <input type="number" value={year} onChange={e=>{setYear(e.target.value); setAttPage(1)}} placeholder="e.g. 2024" className="form-control"/>
          </div>

          <div className="col-md-4 mb-2">
            <label>Month</label>
            <select value={month} onChange={e=>{setMonth(e.target.value); setAttPage(1)}} className="form-control">
              <option value="">All</option>
              {Array.from({length:12},(_,i)=>(
                <option key={i} value={(i+1).toString().padStart(2,"0")}>{i+1}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-2">
            <label>Employee</label>
            <select value={month} onChange={e=>{setMonth(e.target.value); setAttPage(1)}} className="form-control">
              <option value="">All</option>
              {Array.from({length:12},(_,i)=>(
                <option key={i} value={(i+1).toString().padStart(2,"0")}>{i+1}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="table table-bordered table-striped mt-3">
          <thead>
            <tr>
              <th>#</th><th>Employee ID</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((a,i)=>(
              <tr key={a.id}>
                <td>{(attPage-1)*PAGE_SIZE+i+1}</td>
                <td>{a.employeeId}</td>
                <td>{a.status}</td>
                <td>{a.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-center gap-2 mt-2">
          <button className="btn btn-sm btn-secondary" disabled={attPage===1} onClick={()=>setAttPage(attPage-1)}>Prev</button>
          <span>{attPage}/{totalPages}</span>
          <button className="btn btn-sm btn-secondary" disabled={attPage===totalPages} onClick={()=>setAttPage(attPage+1)}>Next</button>
        </div>

        <div className="mt-2">
          <b>Summary:</b> Present: {summary.Present||0}, Absent: {summary.Absent||0}
        </div>
      </div>
    );
  };

  // ---------------- SAVE EMPLOYEE ----------------
  const handleSaveEmployee = (id, data) => {
    
    if(id){
      setEmployees(employees.map(emp=>emp.id===id?{...emp,...data}:emp));
      alert("Employee Updated!");
    } else {
      setEmployees([...employees,{id:employees.length+1,...data}]);
      alert("Employee Added!");
    }
    setSelectedEmployee(null);
    setActiveBox("list");
  };

  const handleCancelEdit = () => setSelectedEmployee(null);
  const [roles, setRoles] = useState([1,2,3,4,5,6,7]);
  
  const handleBoxClick = (box) => {
    setSelectedEmployee(null);
    setActiveBox(activeBox===box?"":box);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-center">👔 Employee Management</h3>

      <div className="row g-3">
        {(roles.includes(1))&&(
        <div className="col-md-3">
          <div className="card text-center p-3" style={{cursor:"pointer"}} onClick={()=>handleBoxClick("entry")}>📝 Employee Entry</div>
        </div>
        )}
        {(roles.includes(2))&&(
        <div className="col-md-3">
          <div className="card text-center p-3" style={{cursor:"pointer"}} onClick={()=>handleBoxClick("list")}>👥 Employee List</div>
        </div>
        )}
        {(roles.includes(3))&&(
        <div className="col-md-3">
          <div className="card text-center p-3" style={{cursor:"pointer"}} onClick={()=>handleBoxClick("mark")}>📅 Mark Attendance</div>
        </div>
        )}
        {(roles.includes(4))&&(
        <div className="col-md-3">
          <div className="card text-center p-3" style={{cursor:"pointer"}} onClick={()=>handleBoxClick("leave")}>📊 Leave</div>
        </div>
        )}
        {(roles.includes(5))&&(
        <div className="col-md-3">
          <div className="card text-center p-3" style={{cursor:"pointer"}} onClick={()=>handleBoxClick("attendList")}>📊 Attendance List</div>
        </div>
         )}
      </div>

      <div className="mt-3">
        {roles.includes(1)&&(selectedEmployee 
          ? <EmployeeForm employee={selectedEmployee} onSave={handleSaveEmployee} onCancel={handleCancelEdit} />
          : activeBox==="entry" && <EmployeeForm onSave={handleSaveEmployee} />
        )}
        {roles.includes(2)&&(activeBox==="list" && !selectedEmployee && <EmployeeList />)}
        {roles.includes(3)&&(activeBox==="mark" && <MarkAttendance />)}
        {roles.includes(4)&&(activeBox==="attendList" && <AttendanceList />)}
        {roles.includes(5)&&(activeBox==="leave" && <EmployeeLeave />)}
      </div>
    </div>
  );
};

export default EmployeeManagement;
