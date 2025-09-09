import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../../common/Alert";

import "../../assets/css/UpdateEmployee.css";

const CreateEmployee = () => {
  const [alert, setAlert] = useState({ show: false, type: "info", message: "" });

  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    phoneNumber: "",
    departmentId: "",
    categoryId: "",
    image: null,

  });

  // Dropdown data states
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };
  const hideAlert = () => {
    setAlert({ show: false, type: "info", message: "" });
  };

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [empRes, deptRes, catRes] = await Promise.all([
          axios.get("https://localhost:7204/api/Employee/dropdown"),
          axios.get("https://localhost:7204/api/Department/department-dropdown"),
          axios.get("https://localhost:7204/api/Category/Category-dropdown"),
        ]);
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to load dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("UserId", formData.userId);
      fd.append("Name", formData.name);
      fd.append("Email", formData.email);
      fd.append("PhoneNumber", formData.phoneNumber);
      fd.append("DepartmentId", formData.departmentId);
      fd.append("CategoryId", formData.categoryId);
      if (formData.image) {
        fd.append("Image", formData.image);
      }

      console.log("Sending FormData:", [...fd.entries()]);

      const response = await axios.post(
        "https://localhost:7204/api/Employee/InsertEmployee",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Success response:", response.data);
      showAlert("success", "Employee created successfully!");
      setTimeout(() => navigate("/Pages/Employee/"), 1500);
    } catch (err) {
      console.error("Failed to create employee:", err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      let errorMessage =
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.message ||
        "Failed to create employee";
      showAlert("error", errorMessage);
    }
  };


  return (
    <>
      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={hideAlert}
        autoClose={true}
        duration={4000}
      />

      <div className="update-employee-container">
        <h2 className="update-employee-title">Add New Employee</h2>
        <form className="update-employee-form" onSubmit={handleSubmit}>
          {/* User (Employee) Dropdown */}
          <div className="form-group">
            <label className="form-label">User: </label>
            <select
              className="form-input"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Select User</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="form-group">
            <label className="form-label">Department: </label>
            <select
              className="form-input"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.deptName}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label className="form-label">Category: </label>
            <select
              className="form-input"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Other Inputs */}
          {["name", "email", "phoneNumber"].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">{field}: </label>
              <input
                className="form-input"
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Profile Image */}
          <div className="form-group">
            <label className="form-label">Profile Image:</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button className="form-btn primary" type="submit">
              Submit
            </button>
            <button
              className="form-btn"
              type="button"
              onClick={() => navigate("/admin/employees")}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </>
  );
};

export default CreateEmployee;
