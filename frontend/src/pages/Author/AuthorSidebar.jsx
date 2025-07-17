import React from "react";
import { useNavigate } from "react-router-dom";
import { FaNewspaper, FaComments } from "react-icons/fa";
import "./styles/AuthorSidebar.css";

function AuthorSidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>News Dash</h2>
      </div>
      <ul className="sidebar-menu">
        <li onClick={() => navigate("/author/my-articles")}>
          <FaNewspaper /> Artikel
        </li>
        <li onClick={() => navigate("/author/comments")}>
          <FaComments /> Komentar
        </li>
      </ul>
    </div>
  );
}

export default AuthorSidebar;
