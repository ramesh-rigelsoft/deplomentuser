import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import Header from "./Header";

export default function RBACPermissionPanel() {
  
  const ownerId = parseInt(Cookies.get("secretCode"))
  const dispatch = useDispatch();

  // Pages
  const [pages, setPages] = useState([]);

  // Roles
  const roles = [
    { id: 2, name: "Manager" },
    { id: 3, name: "Employee" },
    { id: 4, name: "User" }
  ];

  // ✅ OBJECT STATE ONLY (NO ARRAY)
  const [permissions, setPermissions] = useState({
    id: 0,
    roleId: 0,
    pageId: 0,
    canAll: false,
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    ownerId:ownerId
  });

  // Load pages
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await API.fetchPermission(dispatch, { itemType: "pages" });

      if (res.payload.code === "200") {
        setPages(res.payload.data.pages || []);
      } else {
        fail(res.payload.message);
      }
    } catch (err) {
      fail("Server Down");
    }
  };

useEffect(() => {
  fetchPermissionByRolePage();
}, [permissions.roleId, permissions.pageId]);

const fetchPermissionByRolePage = async () => {
  try {
     const res = await API.fetchPermission(dispatch, { 
      itemType: "permision" ,userId:ownerId,roleId: permissions.roleId,
      pageId: permissions.pageId});
      const apiData = res.payload?.data?.access?.[0];
      if (apiData) {
      setPermissions((prev) => ({
        ...prev,
        ...apiData   // merge API values safely
      }));
    } else {
      // reset if not found
      setPermissions((prev) => ({
        ...prev,
        id: 0,
        canAll: false,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        ownerId:ownerId
      }));
    }
  } catch (err) {
    fail("Server Down");
  }
};

  // current permission object
  const permission = permissions;

  // handle change
  const handleChange = (field, value) => {
    setPermissions((prev) => {
      let updated = { ...prev };

      if (field === "canAll") {
        updated.canAll = value;
        updated.canView = value;
        updated.canCreate = value;
        updated.canEdit = value;
        updated.canDelete = value;
      } else {
        updated[field] = value;
        updated.canAll = false;
      }

      return updated;
    });
  };

  // SAVE
  const handleSave = () => {
    const current = permissions;

    const hasPermission =
      current.canAll ||
      current.canView ||
      current.canCreate ||
      current.canEdit ||
      current.canDelete;

    if (!hasPermission) {
      fail("Select any permission");
      return;
    }

    const payload = {
      id: current.id,
      roleId: { id: current.roleId },
      pageId: { id: current.pageId },
      canAll: current.canAll,
      canView: current.canView,
      canCreate: current.canCreate,
      canEdit: current.canEdit,
      canDelete: current.canDelete,
      ownerId: ownerId
    };

    submit(payload);
  };

  const submit = async (payload) => {
    try {
      const res = await API.saveRolePermissionUser(dispatch, payload);
      if (res.payload.code === "200") {
        success(res.payload.message);
      } else {
        fail(res.payload.message);
      }
    } catch (err) {
      fail("Server Down");
    }
  };

  return (
    <div className="min-vh-100 bg-light p-4">

      <Header
        title="RBAC Dashboard"
        subTitle="Manage role-based permissions"
      />

      <div className="row justify-content-center">
        <div className="col-lg-12">

          <div className="card shadow">
            <div className="card-body">

              <h2 className="text-center mb-4">
                RBAC Permission Management
              </h2>

              {/* ROLE + PAGE */}
              <div className="row g-3 mb-4">

                <div className="col-md-6">
                  <label className="form-label fw-bold">Role</label>
                  <select
                    className="form-select"
                    value={permissions.roleId}
                    onChange={(e) =>
                      setPermissions((prev) => ({
                        ...prev,
                        roleId: Number(e.target.value)
                      }))
                    }
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Page</label>
                  <select
                    className="form-select"
                    value={permissions.pageId}
                    onChange={(e) =>
                      setPermissions((prev) => ({
                        ...prev,
                        pageId: Number(e.target.value)
                      }))
                    }
                  >
                    {pages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <hr />

              <h5 className="mb-3">
                Page: {pages.find((p) => p.id === permissions.pageId)?.pageName}
              </h5>

              {/* PERMISSIONS */}
              <div className="d-flex flex-column gap-2">

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={permission.canAll}
                    onChange={(e) => handleChange("canAll", e.target.checked)}
                  />
                  <label className="form-check-label fw-bold text-success">
                    All Access
                  </label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={permission.canView}
                    onChange={(e) => handleChange("canView", e.target.checked)}
                  />
                  <label>View</label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={permission.canCreate}
                    onChange={(e) => handleChange("canCreate", e.target.checked)}
                  />
                  <label>Create</label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={permission.canEdit}
                    onChange={(e) => handleChange("canEdit", e.target.checked)}
                  />
                  <label>Edit</label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={permission.canDelete}
                    onChange={(e) => handleChange("canDelete", e.target.checked)}
                  />
                  <label>Delete</label>
                </div>

              </div>

              {/* SAVE BUTTON */}
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
}