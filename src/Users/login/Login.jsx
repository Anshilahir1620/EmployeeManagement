// src/login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Admin/common/axios";
import { setToken } from "../Admin/common/Auth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post(
        "https://localhost:7204/api/MstUser/login",
        { Email: email, Password: password, Role: role }
      );

      const token = data.token || data.access_token || data.jwt || data.accessToken;

      if (token) {
        setToken(token);

        const user = data.user
          ? {
            userId: data.user.userId,
            email: data.user.email,
            role: data.user.role,
            userName: data.user.userName,
            password: data.user.password,
          }
          : {
            userId: data.userId,
            email: data.email,
            role: data.role || role,
            userName: data.userName,
            password: data.password,
          };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", (user.role || role));

        console.log("Logged in user:", user);

        // Redirect based on role (case-insensitive)
        const userRole = String(user.role || role || "").toLowerCase();
        console.log("Navigating user with role:", userRole);

        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (userRole === "employee") {
          navigate("/employee", { replace: true }); // Changed from /dashboard-2 to /employee
        } else {
          navigate("/", { replace: true });
        }
      } else {
        alert("No token received from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed";
      alert(`Login failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-illustration">
          <div className="illustration-content">
            <div className="workspace-illustration">
              <div className="person">
                <div className="head">
                  <div className="hair"></div>
                  <div className="glasses"></div>
                </div>
                <div className="body">
                  <div className="jacket"></div>
                  <div className="shirt"></div>
                </div>
                <div className="legs">
                  <div className="pants"></div>
                  <div className="shoes">
                    <div className="socks"></div>
                  </div>
                </div>
                <div className="laptop">
                  <div className="screen">
                    <div className="logo">e</div>
                  </div>
                  <div className="keyboard"></div>
                </div>
              </div>
              <div className="chair">
                <div className="seat"></div>
                <div className="back"></div>
                <div className="legs"></div>
              </div>
              <div className="plant-stand">
                <div className="stand"></div>
                <div className="pot">
                  <div className="plant-red"></div>
                </div>
              </div>
              <div className="floor-plant">
                <div className="pot-large">
                  <div className="leaves"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="login-header">
            <h2 className="login-title">Sign in</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-with-icon">
                <div className="input-icon">👤</div>
                <input
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Your Email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-with-icon">
                <div className="input-icon">🔒</div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="role-selection">
              <label className="role-label">Select Role:</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="admin"
                    name="role"
                    value="Admin"
                    checked={role === "Admin"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label htmlFor="admin">Admin</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="employee"
                    name="role"
                    value="Employee"
                    checked={role === "Employee"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label htmlFor="employee">Employee</label>
                </div>
              </div>
            </div>

            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
              />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <div className="create-account">
            <a href="#" className="create-link">Create an account</a>
          </div>

          <div className="social-login">
            <p className="social-text">Or login with</p>
            <div className="social-icons">
              <div className="social-icon facebook">f</div>
              <div className="social-icon twitter">🐦</div>
              <div className="social-icon google">G</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;