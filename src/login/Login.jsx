// src/login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Admin/common/axios";
import { setToken } from "../Admin/common/Auth";
import "../Admin/assets/css/UpdateEmployee.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
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
              password: data.user.password,
            };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", (user.role || role).toLowerCase());

        console.log("Logged in user:", user);

        // Redirect based on role
        const userRole = (user.role || role).toLowerCase();
        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (userRole === "employee") {
          navigate("/employee", { replace: true });
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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7fafc",
      }}
    >
      <div className="update-employee-container" style={{ maxWidth: 380 }}>
        <h2 className="update-employee-title">Sign In</h2>
        <form className="update-employee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <input
              className="form-input"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Admin or Employee"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button className="form-btn primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
