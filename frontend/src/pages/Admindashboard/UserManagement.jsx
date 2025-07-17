import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import "./styles/UserManagement.css";

const API_URL = config.API_BASE_URL || "http://localhost:5000";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) throw new Error("Gagal mengubah role");

      fetchUsers(); // refresh data setelah update
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="admin-users-container">
      <div className="header-users">
        <h2>Daftar Users</h2>
        <button
          className="btn-back"
          onClick={() => navigate("/admin/dashboard")}
        >
          ⬅ Kembali ke Dashboard
        </button>
      </div>

      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Tanggal</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "-"}
              </td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
