import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import config from "../config";
import "../styles/Editprofile.css";

function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profileImage: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const navigate = useNavigate();

  const localUser = JSON.parse(localStorage.getItem("user"));
  const role = localUser?.role;

  useEffect(() => {
    const userId = localUser?.id;
    if (!userId) {
      alert("User ID tidak ditemukan, login ulang!");
      return;
    }

    axios
      .get(`${config.API_BASE_URL}/api/profile/users/${userId}`)
      .then((response) => {
        const user = response.data;
        setUserData({
          username: user.username,
          email: user.email,
          profileImage: user.profileImage || "",
        });

        const imageUrl = user.profileImage?.startsWith("/uploads")
          ? `${config.API_BASE_URL}${user.profileImage}`
          : "/default-avatar.png";

        setProfileImagePreview(imageUrl);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        setIsLoading(false);
      });
  }, [localUser?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prevData) => ({ ...prevData, profileImage: file }));
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("email", userData.email);

    if (userData.profileImage instanceof File) {
      formData.append("profileImage", userData.profileImage);
    }

    const userId = localUser?.id;
    if (!userId) {
      alert("User ID tidak ditemukan, login ulang!");
      return;
    }

    try {
      await axios.put(
        `${config.API_BASE_URL}/api/profile/update/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Profile updated successfully");

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "author") {
        navigate("/author/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <>
      {role === "user" && <Navbar />}

      <div className="profile-page">
        <div className="profile-container">
          {(role === "admin" || role === "author") && (
            <button
              className="back-button"
              onClick={() =>
                navigate(
                  role === "admin" ? "/admin/dashboard" : "/author/dashboard"
                )
              }
            >
              ❌
            </button>
          )}

          <h2>Edit Profile</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="profileImage">Profile Picture</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleImageChange}
                accept="image/*"
              />
              {profileImagePreview && (
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="profile-avatar"
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="profile-submit-button">
              Update Profile
            </button>
          </form>
        </div>
      </div>

      {role === "user" && <Footer />}
    </>
  );
}

export default Profile;
