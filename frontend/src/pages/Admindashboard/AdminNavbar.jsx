import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import "./styles/AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${config.API_BASE_URL}/api/profile/users/${user.id}`
        );
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("❌ Gagal ambil data user:", error);
      }
    };

    if (user?.id) {
      fetchUser();
    }
  }, [user?.id]);

  const profileImageUrl = user?.profileImage
    ? `${config.API_BASE_URL}${user.profileImage}`
    : "/default-avatar.png";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <div className="navbar admin-navbar">
      <h2>Admin Dashboard</h2>

      <div className="admin-profile">
        <div className="admin-profile-menu">
          <img
            src={profileImageUrl}
            alt="Admin Avatar"
            className="avatar"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Klik untuk menu"
          />

          {dropdownOpen && (
            <div className="admin-dropdown-menu">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/editprofile");
                      setDropdownOpen(false);
                    }}
                  >
                    Edit Profile
                  </button>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setDropdownOpen(false);
                  }}
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
