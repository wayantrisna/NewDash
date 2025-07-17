import React from "react";
import { useNavigate } from "react-router-dom";
import { FaNewspaper, FaUserFriends, FaComments } from "react-icons/fa"; // Tidak pakai FaTools
import "./styles/AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>News Dash</h2>
      </div>
      <ul className="sidebar-menu">
        <li onClick={() => navigate("/admin/articles")}>
          <FaNewspaper /> Artikel
        </li>
        <li onClick={() => navigate("/admin/user")}>
          <FaUserFriends /> User
        </li>
        <li onClick={() => navigate("/admin/comments")}>
          <FaComments /> Komentar
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
