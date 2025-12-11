import React, { useState,useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { authAPI } from "../../api/auth";
import "./Dashboard.css";

function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const location = useLocation();

 

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const getAdminProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        console.log("Admin Profile:", response);
        setAdminProfile(response.user);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    getAdminProfile();
  }, []);
  
  const handleLogout = () => {
    authAPI.logout();
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="container-fluid ">
      <div className="row">
        {/* side bar */}
        <div
          className={`${
            sidebarCollapsed ? "col-1" : "col-2"
          } bg-light position-fixed min-vh-100 p-2 transition-all`}
        >
          <div className="header d-flex justify-content-between align-items-center">
            <h2 className={`text-primary ${sidebarCollapsed ? "d-none" : ""} `} style={{fontSize: '13px'}}>
              Glams
            </h2>
            <button
              className="btn  btn-sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <i
                className={`bi ${
                  sidebarCollapsed ? "bi-chevron-right" : "bi-chevron-left"
                }`}
              ></i>
            </button>
          </div>
          <hr />
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link
                className={`nav-link text-dark d-flex align-items-center ${
                  isActive("/admin/dashboard/overview") ? "active" : ""
                }`}
                to="/admin/dashboard/overview"
              >
                <i className="bi bi-grid-fill"></i>
                {!sidebarCollapsed && <span className="ms-2">Overview</span>}
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className={`nav-link text-dark d-flex align-items-center ${
                  isActive("/admin/dashboard/users") ? "active" : ""
                }`}
                to="/admin/dashboard/users"
              >
                <i className="bi bi-people-fill"></i>
                {!sidebarCollapsed && <span className="ms-2">Users</span>}
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className={`nav-link text-dark d-flex align-items-center ${
                  isActive("/admin/dashboard/orders") ? "active" : ""
                }`}
                to="/admin/dashboard/orders"
              >
                <i className="bi bi-cart-check-fill"></i>
                {!sidebarCollapsed && <span className="ms-2">Orders</span>}
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className={`nav-link text-dark d-flex align-items-center ${
                  isActive("/admin/dashboard/products") ? "active" : ""
                }`}
                to="/admin/dashboard/products"
              >
                <i className="bi bi-box-seam-fill"></i>
                {!sidebarCollapsed && <span className="ms-2">Products</span>}
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className={`nav-link text-dark d-flex align-items-center ${
                  isActive("/admin/dashboard/setting") ? "active" : ""
                }`}
                to="/admin/dashboard/setting"
              >
                <i className="bi bi-gear-fill"></i>
                {!sidebarCollapsed && <span className="ms-2">Settings</span>}
              </Link>
            </li>
            <li className="nav-item mb-2 mt-4">
              <button
                className="nav-link text-danger d-flex align-items-center btn btn-link w-100 text-start"
                onClick={openLogoutModal}
              >
                <i className="bi bi-box-arrow-right"></i>
                {!sidebarCollapsed && <span className="ms-2">Logout</span>}
              </button>
            </li>
          </ul>
        </div>
        {/* main content */}
        <div
          className="px-4 transition-all"
          style={{
            marginLeft: sidebarCollapsed ? '8.33%' : '16.67%',
            width: sidebarCollapsed ? '91.67%' : '83.33%',
            height: '100vh',
            overflowY: 'auto',
            transition: 'margin-left 0.3s ease, width 0.3s ease'
          }}
        >
          <div className="admin-header ">
            <div className="p-3 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">Welcome, {adminProfile ? adminProfile.name : "Admin"}</h5>
                <p className="text-muted mb-0">{adminProfile ? adminProfile.email : ""}</p>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                  Confirm Logout
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeLogoutModal}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to logout? You will need to login again
                  to access the admin dashboard.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeLogoutModal}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
