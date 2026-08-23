import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import Header from "./Header";

export default function RBACPermissionPanel() {
  const ownerId = parseInt(Cookies.get("secretCode"));
  const dispatch = useDispatch();

  const [pages, setPages] = useState([]);
  const [permittedPages, setPermittedPages] = useState([]);
  const [branches, setBranches] = useState([]);

  const roles = [
    { id: 2, name: "Manager" },
    { id: 3, name: "Employee" },
    { id: 4, name: "User" }
  ];

  const [permissions, setPermissions] = useState({
    id: null,
    roleId: 2,
    pageId: "",
    ownerId: ownerId,
    branchCode: ""
  });

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    fetchPages();
    fetchBranches();
  }, []);

  // ==========================================
  // FETCH PAGES
  // ==========================================
  const fetchPages = async () => {
    try {
      const res = await API.fetchPermission(dispatch, {
        itemType: "pages"
      });

      if (res?.payload?.code === "200") {
        const list = res?.payload?.data?.pages || [];

        setPages(list);

        // First page automatically select
        if (list.length > 0) {
          setPermissions((prev) => ({
            ...prev,
            pageId: Number(list[0].id)
          }));
        }
      } else {
        fail(
          res?.payload?.message ||
            "Failed to fetch pages"
        );
      }
    } catch (error) {
      console.error(error);
      fail("Server Down");
    }
  };

  // ==========================================
  // FETCH BRANCHES
  // ==========================================
  const fetchBranches = async () => {
    try {
      if (!ownerId) {
        return;
      }

      const res = await API.fetchOfficeBranch(
        dispatch,
        {
          userId: ownerId
        }
      );

      const list =
        res?.payload?.data?.branchList || [];

      setBranches(list);

      // First branch automatically select
      if (list.length > 0) {
        setPermissions((prev) => ({
          ...prev,
          branchCode: list[0].branchCode
        }));
      }
    } catch (error) {
      console.error(error);
      fail("Failed to fetch branches");
    }
  };

  // ==========================================
  // FETCH ASSIGNED PAGES
  // ROLE + BRANCH
  // ==========================================
  useEffect(() => {
    if (
      permissions.roleId &&
      permissions.branchCode
    ) {
      fetchPermittedPages();
    }
  }, [
    permissions.roleId,
    permissions.branchCode
  ]);

  const fetchPermittedPages = async () => {
    try {
      const res = await API.fetchPermittedPagesRoleWise(dispatch,
          {
            userId: ownerId,
            roleId: permissions.roleId,
            branchCode: permissions.branchCode
          }
        );

      if (res?.payload?.code === "200") {
        const list = res?.payload?.data?.pages || [];

        setPermittedPages(list);
      } else {
        setPermittedPages([]);
      }
    } catch (error) {
      console.error(error);

      setPermittedPages([]);

      fail(
        "Failed to fetch assigned permissions"
      );
    }
  };

  // ==========================================
  // BRANCH CHANGE
  // ==========================================
  const handleBranchChange = (e) => {
    const branchCode = e.target.value;

    setPermissions((prev) => ({
      ...prev,
      branchCode: branchCode
    }));
  };

  // ==========================================
  // ROLE CHANGE
  // ==========================================
  const handleRoleChange = (e) => {
    const roleId = Number(e.target.value);

    setPermissions((prev) => ({
      ...prev,
      roleId: roleId,
      id: 0
    }));
  };

  // ==========================================
  // PAGE CHANGE
  // ==========================================
  const handlePageChange = (e) => {
    const pageId = Number(e.target.value);

    setPermissions((prev) => ({
      ...prev,
      pageId: pageId,
      id: 0
    }));
  };

  // ==========================================
  // SELECTED PAGE
  // ==========================================
  const selectedPage = pages.find(
    (page) =>
      Number(page.id) ===
      Number(permissions.pageId)
  );

  // ==========================================
  // CHECK PAGE PERMISSION
  //
  // API response:
  // {
  //   id: 5,
  //   canAll: true,
  //   ...
  // }
  //
  // Here "id" is being used as pageId
  // according to your current API response.
  // ==========================================
  const selectedPermission =
    permittedPages.find(
      (item) =>
        Number(item.id) ===
        Number(permissions.pageId)
    );

  const isPermissionAssigned =
    !!selectedPermission;

  // ==========================================
  // ADD PERMISSION
  // ==========================================
  const handleAddPermission = async () => {
    if (!permissions.branchCode) {
      fail("Please select branch");
      return;
    }

    if (!permissions.roleId) {
      fail("Please select role");
      return;
    }

    if (!permissions.pageId) {
      fail("Please select page");
      return;
    }

    const payload = {
      id: null,

      roleId: {
        id: permissions.roleId
      },

      pageId: {
        id: permissions.pageId
      },

      canAll: true,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,

      ownerId: ownerId,

      branchCode: permissions.branchCode
    };

    try {
      const res =
        await API.saveRolePermissionUser(
          dispatch,
          payload
        );

      if (res?.payload?.code === "200") {
        success("Permission added successfully");

        await fetchPermittedPages();
      } else {
        fail(
          res?.payload?.message ||
            "Failed to add permission"
        );
      }
    } catch (error) {
      console.error(error);
      fail("Server Down");
    }
  };

  // ==========================================
  // REMOVE FROM LEFT LIST
  // ==========================================
  const handleRemovePermissionById = async (
    permissionId
  ) => {
    const confirmDelete =
      window.confirm("Are you sure you want to remove permission?");

    if (!confirmDelete) {
      return;
    }

    try {
      const res =
        await API.removePermisstion(
          dispatch,
          {
            id: permissionId,
            userId:ownerId,
            branchCode:permissions.branchCode
          }
        );

      if (res?.payload?.code === "200") {
        success(
          "Permission removed successfully"
        );

        await fetchPermittedPages();
      } else {
        fail(
          res?.payload?.message ||
            "Failed to remove permission"
        );
      }
    } catch (error) {
      console.error(error);
      fail("Server Down");
    }
  };

  // ==========================================
  // SELECT PAGE FROM LEFT LIST
  // ==========================================
  const handleSelectAssignedPage = (item) => {
    setPermissions((prev) => ({
      ...prev,
      pageId: Number(item.id)
    }));
  };

  return (
    <div className="bg-light min-vh-100 page-scroll">

      {/* ========================================
          HEADER
      ======================================== */}
      <Header
        title="RBAC Permission"
        subTitle="Manage role based page access"
        dashboard="1"
      />

      <div className="container-fluid px-3 py-3">

        {/* ========================================
            COMMON BRANCH + ROLE HEADER
        ======================================== */}
        <div className="card border-0 shadow-sm mb-3">

          <div className="card-header bg-white">

            <div className="row align-items-center g-3">

              {/* TITLE */}
              <div className="col-lg-5">

                <h5 className="mb-1 fw-bold">
                  Access Management
                </h5>

                <small className="text-muted">
                  Manage page access for selected
                  branch and role
                </small>

              </div>

              {/* BRANCH */}
              <div className="col-lg-3">

                <label className="form-label fw-semibold mb-1">
                  Branch
                </label>

                <select
                  className="form-select"
                  value={
                    permissions.branchCode
                  }
                  onChange={
                    handleBranchChange
                  }
                >

                  {/* <option value="">
                    Select Branch
                  </option> */}

                  {branches.map(
                    (branch) => (
                      <option
                        key={branch.id}
                        value={
                          branch.branchCode
                        }
                      >
                        {branch.branchName}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* ROLE */}
              <div className="col-lg-3">

                <label className="form-label fw-semibold mb-1">
                  Role
                </label>

                <select
                  className="form-select"
                  value={
                    permissions.roleId
                  }
                  onChange={
                    handleRoleChange
                  }
                >

                  {roles.map(
                    (role) => (
                      <option
                        key={role.id}
                        value={role.id}
                      >
                        {role.name}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* ========================================
            MAIN CONTENT
        ======================================== */}
        <div className="row g-3">

           {/* ======================================
              LEFT SIDE
          ======================================= */}
          <div className="col-lg-7">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-header bg-dark text-white">

                <h6 className="mb-0 fw-bold">
                  Page Permission
                </h6>

              </div>

              <div className="card-body">

                {/* PAGE SELECT */}
                <div className="mb-4">

                  <label className="form-label fw-bold">
                    Select Page
                  </label>

                  <select
                    className="form-select form-select-lg"
                    value={
                      permissions.pageId ||
                      ""
                    }
                    onChange={
                      handlePageChange
                    }
                    disabled={
                      !permissions.branchCode
                    }
                  >

                    <option value="">
                      Select Page
                    </option>

                    {pages.map(
                      (page) => (

                        <option
                          key={page.id}
                          value={page.id}
                        >
                          {page.label ||
                            page.pageName ||
                            `Page ${page.id}`}
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* SELECTED PAGE */}
                {selectedPage && (

                  <div className="border rounded p-3 mb-4 bg-light">

                    <div className="d-flex justify-content-between align-items-center">

                      <div>

                        <small className="text-muted">
                          Selected Page
                        </small>

                        <div className="fw-bold fs-5">

                          {selectedPage.label ||
                            selectedPage.pageName ||
                            `Page ${selectedPage.id}`}

                        </div>

                      </div>

                      <span className="badge bg-primary">
                        ID:{" "}
                        {
                          selectedPage.id
                        }
                      </span>

                    </div>

                  </div>

                )}

                {/* BRANCH + ROLE INFO */}
                <div className="row g-3 mb-4">

                  <div className="col-md-6">

                    <div className="border rounded p-3">

                      <small className="text-muted">
                        Branch
                      </small>

                      <div className="fw-bold">

                        {branches.find(
                          (branch) =>
                            branch.branchCode ===
                            permissions.branchCode
                        )?.branchName ||
                          permissions.branchCode ||
                          "-"}

                      </div>

                    </div>

                  </div>

                  <div className="col-md-6">

                    <div className="border rounded p-3">

                      <small className="text-muted">
                        Role
                      </small>

                      <div className="fw-bold">

                        {
                          roles.find(
                            (role) =>
                              role.id ===
                              permissions.roleId
                          )?.name
                        }

                      </div>

                    </div>

                  </div>

                </div>

                {/* =================================
                    ADD BUTTON
                ================================== */}

                  <button
                    type="button"
                    className="btn btn-primary w-100 py-2 fw-bold"
                    onClick={
                      handleAddPermission
                    }
                  >
                    Add Permission
                  </button>
              </div>

            </div>

          </div>


          {/* ======================================
              RIGHT SIDE
          ======================================= */}
          <div className="col-lg-5">

            <div className="card border-0 shadow-sm h-100">

              <div className="card-header bg-primary text-white">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6 className="mb-0 fw-bold">
                      Assigned Pages
                    </h6>

                    <small>
                      {
                        roles.find(
                          (r) =>
                            r.id ===
                            permissions.roleId
                        )?.name
                      }
                    </small>

                  </div>

                  <span className="badge bg-light text-primary">
                    {permittedPages.length}
                  </span>

                </div>

              </div>

              <div className="card-body p-0">

                {!permissions.branchCode ? (

                  <div className="text-center py-5 text-warning">

                    <div className="mb-2">
                      Please select a branch
                    </div>

                  </div>

                ) : permittedPages.length ===
                  0 ? (

                  <div className="text-center py-5 text-muted">

                    <div className="mb-2">
                      No permissions assigned
                    </div>

                    <small>
                      Select a page and click
                      Add Permission.
                    </small>

                  </div>

                ) : (

                  <div
                    style={{
                      maxHeight:
                        "500px",
                      overflowY:
                        "auto"
                    }}
                  >

                    {permittedPages.map(
                      (item) => {

                        const active =
                          Number(
                            item.id
                          ) ===
                          Number(
                            permissions.pageId
                          );

                        return (

                          <div
                            key={
                              item.id
                            }
                            className={`p-3 border-bottom ${
                              active
                                ? "bg-primary bg-opacity-10"
                                : ""
                            }`}
                          >

                            <div className="d-flex justify-content-between align-items-center gap-2">

                              <div
                                className="flex-grow-1"
                                style={{
                                  cursor:
                                    "pointer"
                                }}
                                onClick={() =>
                                  handleSelectAssignedPage(
                                    item
                                  )
                                }
                              >

                                <div className="fw-semibold">

                                  {item.pageLabel}

                                </div>

                                <small className="text-muted">
                                  Page ID:{" "}
                                  {
                                    item.pagePermittedId
                                  }
                                </small>

                              </div>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleRemovePermissionById(
                                    item.pagePermittedId
                                  )
                                }
                              >
                                Remove
                              </button>

                            </div>

                          </div>

                        );
                      }
                    )}

                  </div>

                )}

              </div>

            </div>

          </div>

         
        </div>

      </div>

    </div>
  );
}
