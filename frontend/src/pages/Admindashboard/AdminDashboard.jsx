import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import DashboardOverview from "./DashboardOverview";
import "./styles/AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <DashboardOverview />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
