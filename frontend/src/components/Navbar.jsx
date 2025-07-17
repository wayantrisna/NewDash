import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";
import {
  FaNewspaper,
  FaUserCircle,
  FaEdit,
  FaSignOutAlt,
  FaFire,
  FaBookmark,
  FaHome,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import config from "../config";

function LogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        <h2>Log out NewsDash?</h2>
        <p>You can always log back in anytime.</p>
        <div className="logout-actions">
          <button className="btn-logout" onClick={onConfirm}>
            Log out
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const menuRef = useRef(null);

  const loadUser = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/api/profile/users/${storedUser.id}`
        );
        const freshUser = await response.json();

        setUser(freshUser);
        setIsLoggedIn(true);
        setUserRole(freshUser.role);

        localStorage.setItem("user", JSON.stringify(freshUser));
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUser(storedUser);
        setIsLoggedIn(true);
        setUserRole(storedUser.role);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    loadUser();
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("userUpdated"));

    setShowMenu(false);
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileImage = user?.profileImage
    ? `${config.API_BASE_URL}${user.profileImage}`
    : "/default-avatar.png";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link
          to={
            userRole === "admin"
              ? "/admin/dashboard"
              : userRole === "author"
              ? "/author/dashboard"
              : "/"
          }
          className="navbar-logo"
        >
          <FaNewspaper className="logo-icon" />
          <span className="logo-text">NewsDash</span>
        </Link>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Cari berita..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            <FiSearch className="search-icon-inside" />
          </button>
        </div>

        {isLoggedIn && (userRole === "admin" || userRole === "author") && (
          <button
            className="create-news-button"
            onClick={() =>
              navigate(
                userRole === "admin" ? "/admin/dashboard" : "/author/dashboard"
              )
            }
            title="Dashboard"
          >
            <FaHome className="admin-home-icon" />
          </button>
        )}

        <div className="menu-wrapper" ref={menuRef}>
          {isLoggedIn && user ? (
            <img
              src={profileImage}
              alt="Profile"
              className="navbar-avatar"
              onClick={() => setShowMenu((prev) => !prev)}
              title="Menu"
            />
          ) : (
            <button
              className="menu-toggle"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <FiMenu />
            </button>
          )}

          {showMenu && (
            <div className="dropdown-menu">
              <Link to="/trending" className="dropdown-item">
                <FaFire style={{ marginRight: 8 }} /> Trending
              </Link>
              <Link to="/bookmarks" className="dropdown-item">
                <FaBookmark style={{ marginRight: 8 }} /> Tersimpan
              </Link>

              {isLoggedIn ? (
                <>
                  <Link to="/editprofile" className="dropdown-item">
                    <FaEdit style={{ marginRight: 6 }} /> Edit Profil
                  </Link>
                  <div
                    className="dropdown-item"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <FaSignOutAlt style={{ marginRight: 6 }} /> Logout
                  </div>
                </>
              ) : (
                <Link to="/login" className="dropdown-item">
                  <FaUserCircle style={{ marginRight: 8 }} /> Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </nav>
  );
}

export default Navbar;
