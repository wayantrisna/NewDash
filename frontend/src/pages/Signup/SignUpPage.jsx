import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import config from "../../config";
import "./SignUp.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (data.message) {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login"); // Redirect ke halaman login setelah registrasi berhasil
      }
    } catch (error) {
      console.error("Error registrasi:", error);
      alert("Registrasi gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Repeat password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-button">
          Sign Up
        </button>

        <p className="register-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
