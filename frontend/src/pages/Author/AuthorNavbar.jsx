import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AuthorNavbar.css";

function AuthorNavbar() {
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
        console.error("❌ Gagal mengambil data user:", error);
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
    <div className="navbar author-navbar">
      <h2>Author Dashboard</h2>

      <div className="author-profile">
        <div className="author-profile-menu">
          <img
            src={profileImageUrl}
            alt="Author Avatar"
            className="avatar"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Klik untuk opsi"
          />

          {dropdownOpen && (
            <div className="author-dropdown-menu">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/editprofile");
                      setDropdownOpen(false);
                    }}
                  >
                    Edit Profil
                  </button>
                  <button onClick={handleLogout}>Keluar</button>
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

export default AuthorNavbar;
