import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import config from "../../config";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    const start = Date.now();

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const elapsed = Date.now() - start;
      const delay = Math.max(0, 2000 - elapsed); // minimum 2 detik

      setTimeout(() => {
        if (data.token && data.user) {
          if (rememberMe) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("email", data.user.email);
          } else {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
            localStorage.removeItem("email");
          }

          if (data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (data.user.role === "author") {
            navigate("/author/dashboard");
          } else {
            navigate("/");
          }

          window.location.reload();
        } else {
          setErrorMessage("Email atau password salah.");
        }

        setIsLoading(false);
      }, delay);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Terjadi kesalahan saat login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon-wrapper">
          <FaUserCircle size={64} className="login-icon" />
        </div>
        <p className="login-subtitle">Silakan login ke akun Anda.</p>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Masukkan password Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              style={{ marginRight: "6px" }}
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Ingat saya
          </label>
          <Link to="#" className="forgot-password">
            Lupa password?
          </Link>
        </div>

        <button type="submit" className="login-btn" disabled={isLoading}>
          Login
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <p className="signup-text">
          Belum punya akun? <Link to="/SignUp">Daftar</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
