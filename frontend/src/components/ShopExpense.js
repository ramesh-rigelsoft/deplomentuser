import React, { useState,useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail} from "../redux/WebTostar";
import Cookies from "js-cookie";

const PAGE_SIZE = 10;

const ShopExpense = () => {

  const secret = Cookies.get("secretCode");
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("entry");
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* ---------------- EXPENSE ENTRY FORM ---------------- */
  const ExpenseEntry = () => {
    const [form, setForm] = useState({
      type: "",
      scope: "Owner",
      description: "",
      amount: "",
      proof: null,
      date: "",
      ownerId:secret,
    });

  const [errors, setErrors] = useState({});
  
    const validate = (formData) => {
      const newErrors = {};

      if (!formData.type) newErrors.type = "Expense type is required";

      if (!formData.scope) newErrors.scope = "Scope is required";

      if (!formData.description || formData.description.trim() === "")
        newErrors.description = "Description is required";

      if (!formData.amount || Number(formData.amount) <= 0)
        newErrors.amount = "Valid amount is required";

      if (!formData.date) 
        newErrors.date = "Expense date is required";

      return newErrors;
    };

   const changeHandle = (field, value) => {
      const updatedForm = {
        ...form,
        [field]: value
      };

      setForm(updatedForm);
      setErrors(validate(updatedForm));
    };


    const handleSubmit = (e) => {
       e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitted(true);
      API.saveExpense(dispatch,form).then(res => {
         let expense = res.payload;
         success(expense.message);
         setForm({
            type: "",
            scope: "",
            description: "",
            amount: "",
            proof: null,
            date: "",
          });
          setIsSubmitted(false);
      })
      .catch(err => {
          fail("Please contact To Service Provider");
      });
    }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const maxSize = 1 * 1024 * 1024;

        if (file.size > maxSize) {
          fail("File size must be less than 1MB");
          e.target.value = null;
          return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

        if (!allowedTypes.includes(file.type)) {
          fail("Only JPG, PNG, PDF allowed");
          e.target.value = null;
          return;
        }

        // store safely
        setForm((prev) => ({
          ...prev,
          proof: file
        }));
    };

    return (
      <div className="card p-3 mt-3">
        <h5>💸 Expense Entry</h5>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <label>Expense Type</label>
              <select
                className={`form-control ${errors.type ? "is-invalid" : ""}`}
                value={form.type}
                onChange={(e) => (changeHandle("type", e.target.value))}
              >
             <option value="">Select</option>
              <optgroup label="Shop Expenses">
                <option value="Rent">Shop Rent</option>
                <option value="Electricity">Shop Current</option>
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

            <div className="col-md-4">
              <label>Scope</label>
              <select
                className="form-control"
                value={form.scope}
                onChange={(e) => changeHandle("scope", e.target.value)}
                
              >
                {/* <option value="">Select</option> */}
                <option value="Owner" >Owner</option>
                {/* <option>User1</option>
                <option>User2</option>
                <option>User3</option>
                <option>User4</option> */}
              </select>
            </div>

            <div className="col-md-4">
              <label>Amount</label>
              <input
                type="number"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                placeholder="Enter Amount"
                value={form.amount}
                onChange={(e) => changeHandle("amount", e.target.value)}
                
              />
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-4">
             <div className="col-md-6">
              <label className="mt-2">Date</label><br/> 
              <DatePicker
                className={`form-control full-width-datepicker ${errors.date ? "is-invalid" : ""}`}
                locale={enUS}
                popperPlacement="bottom-start"
                dateFormat="yyyy-MM-dd"
                placeholderText="yyyy-mm-dd"
                selected={form.date ? new Date(form.date) : null}
                onChange={(date) => changeHandle("date",date ? date.getTime() : null)}
                popperProps={{
                  strategy: "fixed"
                }}
              />
               {/* <DatePicker 
                style={{ width: "100% !important" }}
                locale={enUS} 
                popperPlacement="bottom-start"
                dateFormat="yyyy-MM-dd"
                placeholderText="yyyy-mm-dd"
                selected={form.date} 
                onChange={(selectedDate) =>setForm({...form,date: new Date(selectedDate).getTime()})}
                popperProps={{
                  strategy: "fixed"
                }}
             /> */}
              </div>
              <div className="col-md-12">
               <label className="mt-2">Upload Bill</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
              </div>
            </div>

            <div className="col-md-8">
              <label>Description</label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                rows="4"
                value={form.description}
                placeholder="Enter Description"
                onChange={(e) => changeHandle("description",e.target.value)}
              />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary" type="submit" disabled={isSubmitted}>
              Save Expense
            </button>
          </div>
        </form>
      </div>
    );
  };

  /* ---------------- EXPENSE LIST ---------------- */

const ExpenseList = () => {
  
  const secret2 = Cookies.get("secretCode");
  const [expenses, setExpenses] = useState([]);
  const [previousIndex, setPreviousIndex] = useState(0);

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

  const searchExpenses = async () => {
    try {
      API.expenseListAndSearch(dispatch, criteria)
        .then(res => {
          let expense = res.payload;
          // success(expense.message);
          setExpenses(expense.data.expenses || []);
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
    <div className="card p-3 mt-3">

      {/* Header with Total Top Right */}
      <div className="d-flex justify-content-between align-items-center">
        <h5>📄 Expense List</h5>
        <h6><b>Total: ₹ {totalAmount}</b></h6>
      </div>

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
              <option value="Traveling">Traveling</option>
              <option value="Shop Rent">Shop Rent</option>
              <option value="Shop Current">Shop Current</option>
              <option value="Salary">Salary</option>
              <option value="Shop Water">Shop Water</option>
              <option value="Courier Charge">Courier Charge</option>
              <option value="Other">Other</option>
            </select>
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
                  {new Date(e.date).toLocaleDateString("en-IN", {
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
  );
};

  /* ---------------- UI ---------------- */
  return (
    <div className="page scrollable-div mb-5">
      <h3 className="text-center mb-3">🏪 Shop Expense</h3>

      <div className="row">
       <div className="tabs">
          {["entry","list"].map((tab) => (
            <button
              key={tab}
              className={`rigel-tabs col-6 ${activeTab === tab ? "rigel-tabs-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
       </div>
      </div>

      {activeTab === "entry" && <ExpenseEntry />}
      {activeTab === "list" && <ExpenseList />}
    </div>
  );
};

export default ShopExpense;
