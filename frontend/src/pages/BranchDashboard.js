import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PageHeader from "./PageHeader";

export default function BranchDashboard() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Sales Dashboard",
      description: "View branch sales analytics and performance",
      path: "/branchDashboard",
      color: "primary",
      icon: "bi bi-graph-up"
    },
    {
      title: "Inventory",
      description: "Manage inventory and stock availability",
      path: "/branchInventory",
      color: "success",
      icon: "bi bi-box-seam"
    },
    {
      title: "Sales Report",
      description: "View item-wise sales reports",
      path: "/branchSalesReport",
      color: "info",
      icon: "bi bi-bar-chart"
    },
    {
      title: "Entry Report",
      description: "Track branch entries and records",
      path: "/branchEntryReport",
      color: "warning",
      icon: "bi bi-journal-text"
    },
    {
      title: "Expenses",
      description: "Manage branch expenses",
      path: "/branchExpense",
      color: "danger",
      icon: "bi bi-cash-stack"
    },
    {
      title: "Garbage Collection",
      description: "View returned and collected garbage items",
      path: "/branchGarbage",
      color: "secondary",
      icon: "bi bi-trash"
    }
  ];

  return (
    <div>
      <Header
        title="Branch Management"
        subTitle="Manage all branch operations from one place"
        dashboard = "4"
      />
 {/* <PageHeader pageName="Garbage Collection"/> */}
    
      <div className="container py-4">
        <div className="row g-4">
          {modules.map((module, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div
                className={`card border-0 shadow-sm h-100`}
                style={{
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "0.3s"
                }}
                onClick={() => navigate(module.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                }}
              >
                <div className="card-body text-center p-4">
                  <div className={`text-${module.color} mb-3`}>
                    <i
                      className={module.icon}
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>

                  <h5 className="fw-bold">{module.title}</h5>

                  <p className="text-muted mb-3">
                    {module.description}
                  </p>

                  <button
                    className={`btn btn-${module.color}`}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}