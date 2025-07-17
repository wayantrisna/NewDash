import React from "react";
import AuthorSidebar from "./AuthorSidebar";
import AuthorNavbar from "./AuthorNavbar";
import Authorpriview from "./Authorpriview"; // ✅ ini yang benar
import "./styles/AuthorDashboard.css";

function AuthorDashboard() {
  return (
    <div className="author-dashboard">
      <AuthorSidebar />
      <div className="author-main-content">
        <AuthorNavbar />
        <div className="dashboard-content">
          <Authorpriview /> {/* ✅ sudah betul */}
        </div>
      </div>
    </div>
  );
}

export default AuthorDashboard;
