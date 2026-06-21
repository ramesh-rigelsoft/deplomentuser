import React, { useState,useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail} from "../redux/WebTostar";
import Cookies from "js-cookie";
import Header from "../components/Header";
import PageHeader from "./PageHeader";
// import BorderHeader from "./BorderHeader";
  /* ---------------- EXPENSE LIST ---------------- */

const BranchExpense = () => {
  
  const secret2 = Cookies.get("secretCode");
  const [expenses, setExpenses] = useState([]);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [office, setOffice] = useState("all");
  
 const [criteria, setCriteria] = useState({
  startIndex: 0,
  maxRecords: 10, 
  year: new Date().getFullYear(),   // 🔥 current year auto
  month: 0,
  scope: null,
  type: null,
  ownerid: 0,
  userId: secret2
});


  useEffect(() => {
    searchExpenses();
  }, [criteria]);

  const clearFilter = async () => {
     setPreviousIndex(0);
     setCriteria({
        startIndex: 0,
        maxRecords: 10, 
        year: new Date().getFullYear(),   // 🔥 current year auto
        month: 0,
        scope: "",
        type: "",
        ownerid: 0,
        userId: secret2
      });

  }
  const searchExpenses = async () => {
    try {
      API.expenseListAndSearch(dispatch, criteria)
        .then(res => {
          let expense = res.payload;
          setExpenses(expense.data.expenses || []);
      
          // success(expense.message);
          // if(expense.code=='200'){
          //   success(expense.message);
          // }else{
          //   fail(expense.message);
          // }
        })
        .catch(err => {
          fail("Please contact To Service Provider");
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (field, value) => {
    setCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalAmount = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const viewBill = (fileName, path) => {
     try {
       let payload={
        fileName:fileName,
        path:"expense",
        type:1
      };
      API.openFileInBrowser(payload);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handlePagination = (index) => {
    setPreviousIndex(index);
    setCriteria(prev => ({
      ...prev,
      startIndex: index*criteria.maxRecords
    }));
  }

  return (
    <div>
       <Header
        title="Branch Mangement"
        subTitle="Manage everything in one place"
        dashboard = "2"
      />
    <div className="card p-3 ">
      <PageHeader pageName="Expense" />
      {/* Header with Total Top Right */}
      {/* <div className="d-flex justify-content-between align-items-center">
        <h5>📄 Expense </h5>
        <h6><b>Total: ₹ {totalAmount}</b></h6>
      </div> */}

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Year"
            value={criteria.year}
            onChange={(e) =>
              handleChange("year", e.target.value ? Number(e.target.value) : 0)
            }
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-control"
            onChange={(e) =>
              handleChange("month", e.target.value ? Number(e.target.value) : 0)
            }
          >
           <option value="">Month</option>
            {[
              "January", "February", "March", "April",
              "May", "June", "July", "August",
              "September", "October", "November", "December"
            ].map((month, i) => (
              <option key={i} value={i + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
{/* 
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Scope"
            onChange={(e) => handleChange("scope", e.target.value)}
          />
        </div> */}

        <div className="col-md-2">
           <select
              className="form-control"
              defaultValue=""
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="" disabled hidden>
                Expense Type
              </option>
               <optgroup label="Shop Expenses">
                <option value="Rent">Shop Rent</option>
                <option value="Electricity">Shop Electricity</option>
                <option value="Water">Shop Water</option>
                <option value="Internet">Internet</option>
                <option value="Maintenance">Maintenance</option>
              </optgroup>

              <optgroup label="Employee">
                <option value="Salary">Salary</option>
                <option value="Bonus">Bonus</option>
                <option value="Commission">Commission</option>
              </optgroup>

              <optgroup label="Transport">
                <option value="Traveling">Traveling</option>
                <option value="Courier">Courier Charge</option>
                <option value="Fuel">Fuel</option>
              </optgroup>

              <optgroup label="Other">
                <option value="Marketing">Marketing</option>
                <option value="Repair">Repair</option>
                <option value="Other">Other</option>
              </optgroup>
            </select>
        </div>
        <div className="col-md-2">
          <div className="w-auto">
            <select
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              className="form-control"
            >
              <option value="bar">All</option>
              <option value="line">Office_01</option>
            </select>
          </div>
        </div>
        <div className="col-md-2">
          <span className="btn btn-primary">
              Excel Download
          </span>
        </div>
        <div className="col-md-2">
          <input type="Button" className="modern-clear-btn" onClick={clearFilter} value="Clear" />
        </div>
        {/* <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Owner Id"
            onChange={(e) =>
              handleChange("ownerid", e.target.value ? Number(e.target.value) : 0)
            }
          />
        </div> */}
      </div>

      {/* Table */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Scope</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Bill</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Data Found
              </td>
            </tr>
          ) : (
            expenses.map((e, i) => (
              <tr key={e.id}>
                <td>{criteria.startIndex + i + 1}</td>
                <td>{e.type}</td>
                <td>{e.scope}</td>
                <td>{e.description}</td>
                <td>₹ {e.amount}</td>
                <td>
                  {new Date(e.expenseDate).toLocaleDateString("en-IN", {
                    // weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
             
                <td>
                  {e.proof ? (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => viewBill(e.proof)}
                    >
                      👁 View Bill
                    </button>
                  ) : (
                    <span className="text-muted">No Bill</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

       {/* Pagination */}
    <nav aria-label="Page navigation" className="mt-3 pagination-position">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${previousIndex === 0 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePagination(previousIndex - 1)}>
            Previous
          </button>
        </li>
        {
          (() => {
            let start = previousIndex - 2;

            // ensure minimum 0 se start ho
            if (start < 0) start = 0;

            // hamesha 3 items generate karo
            const pages = [start, start + 1, start + 2];

            return pages.map((pageIndex) => (
              <li
                key={pageIndex}
                className={`page-item ${previousIndex === pageIndex ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePagination(pageIndex)}
                >
                  {pageIndex + 1}
                </button>
              </li>
            ));
          })()
        }
        <li className={`page-item ${expenses.length === 0 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePagination(previousIndex + 1)}>
            Next
          </button>
        </li>

        </ul>
       </nav>
     </div>
    </div>
  );
};

export default BranchExpense;
