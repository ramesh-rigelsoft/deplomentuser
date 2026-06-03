import React, { useState } from "react";

export default function RBACPermissionPanel() {
  // Roles
  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "Employee" },
    { id: 4, name: "User" }
  ];

  // Pages from your system
  const pages = [
    { id: 1, name: "Dashboard", route: "/dashboard" },
    { id: 2, name: "Inventory", route: "/inventory" },
    { id: 3, name: "Outbound", route: "/outbound" },
    { id: 4, name: "Vendor List", route: "/listVender" },
    { id: 5, name: "Add Vendor", route: "/addVender" },
    { id: 6, name: "Reports", route: "/summaryReport" },
    { id: 7, name: "Transactions", route: "/trans" }
  ];

  // Selected Role & Page
  const [roleId, setRoleId] = useState(1);
  const [pageId, setPageId] = useState(1);

  // Permissions state
  const [permissions, setPermissions] = useState([
    {
      roleId: 1,
      pageId: 1,
      canVisit: true,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true
    }
  ]);

  // Get current permission
  const getPermission = () => {
    return (
      permissions.find(
        p => p.roleId === roleId && p.pageId === pageId
      ) || {
        roleId,
        pageId,
        canVisit: true,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false
      }
    );
  };

  const permission = getPermission();

  // Handle checkbox change
  const handleChange = (field, value) => {
    const index = permissions.findIndex(
      p => p.roleId === roleId && p.pageId === pageId
    );

    if (index >= 0) {
      const updated = [...permissions];
      updated[index][field] = value;
      setPermissions(updated);
    } else {
      setPermissions([
        ...permissions,
        {
          roleId,
          pageId,
          canVisit: true,
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          [field]: value
        }
      ]);
    }
  };

  // Save handler (API ready)
  const handleSave = () => {
    const data = permissions.filter(
      p => p.roleId === roleId
    );

    console.log("Saved Permissions:", data);
    alert("Permissions Saved Successfully");
  };

  return (
  <div className="container py-4">
    <div className="row justify-content-center">
      <div className="col-lg-8">

        <div className="card shadow">
          <div className="card-body">

            <h2 className="card-title mb-4 text-center">
              RBAC Permission Management
            </h2>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Role
                </label>

                <select
                  className="form-select"
                  value={roleId}
                  onChange={(e) =>
                    setRoleId(Number(e.target.value))
                  }
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Page
                </label>

                <select
                  className="form-select"
                  value={pageId}
                  onChange={(e) =>
                    setPageId(Number(e.target.value))
                  }
                >
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr />

            <h5 className="mb-3">
              Page: {pages.find((p) => p.id === pageId)?.name}
            </h5>

            <div className="d-flex flex-column gap-2">

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="visit"
                  checked={permission.canVisit}
                  onChange={(e) =>
                    handleChange(
                      "canVisit",
                      e.target.checked
                    )
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="visit"
                >
                  Visit
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="view"
                  checked={permission.canView}
                  onChange={(e) =>
                    handleChange(
                      "canView",
                      e.target.checked
                    )
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="view"
                >
                  View
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="create"
                  checked={permission.canCreate}
                  onChange={(e) =>
                    handleChange(
                      "canCreate",
                      e.target.checked
                    )
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="create"
                >
                  Create
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="edit"
                  checked={permission.canEdit}
                  onChange={(e) =>
                    handleChange(
                      "canEdit",
                      e.target.checked
                    )
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="edit"
                >
                  Edit
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="delete"
                  checked={permission.canDelete}
                  onChange={(e) =>
                    handleChange(
                      "canDelete",
                      e.target.checked
                    )
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor="delete"
                >
                  Delete
                </label>
              </div>
            </div>

            <button
              className="btn btn-primary mt-4"
              onClick={handleSave}
            >
              Save Permissions
            </button>

          </div>
        </div>

      </div>
    </div>
  </div>
);
};