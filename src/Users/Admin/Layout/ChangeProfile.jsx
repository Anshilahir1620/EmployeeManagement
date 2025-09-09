import React, { useState, useEffect } from "react";
import "../assets/css/profileEdit.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    userId: "",
    name: "",
    email: "",
    phoneNumber: "",
    departmentId: "",
    categoryId: "",
    password: "", // optional – only send if changed
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // get userId from localStorage
  const user_data = JSON.parse(localStorage.getItem("user"));
  const UserID = user_data?.userId || "";

  // fetch employee data
  useEffect(() => {
    if (!UserID) return;

    axios
      .get(`https://localhost:7204/api/Employee/byUserId/${UserID}`)
      .then((res) => {
        const emp = res.data;
        setFormData({
          employeeId: emp.employeeId,
          userId: emp.userId,
          name: emp.name || "",
          email: emp.email || "",
          phoneNumber: emp.phoneNumber || "",
          departmentId: emp.departmentId || "",
          categoryId: emp.categoryId || "",
          password: "", // always blank at start
          profileImage: null,
        });
        if (emp.imagePath) {
          setPreviewImage(`https://localhost:7204/${emp.imagePath}`);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching employee:", err);
      });
  }, [UserID]);

  // handle change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("EmployeeId", formData.employeeId);
      data.append("UserId", formData.userId);
      data.append("Name", formData.name);
      data.append("Email", formData.email);
      data.append("PhoneNumber", formData.phoneNumber);
      data.append("DepartmentId", formData.departmentId);
      data.append("CategoryId", formData.categoryId);
      data.append("ModifiedAt", new Date().toISOString());

      if (formData.profileImage) {
        data.append("ProfileImage", formData.profileImage);
      }

      // only send password if user typed one
      if (formData.password && formData.password.trim() !== "") {
        data.append("Password", formData.password);
      }

      await axios.put(
        `https://localhost:7204/api/Employee/${formData.userId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Employee Profile updated successfully!");
      navigate("/change-profile");

    } catch (err) {
      console.error("❌ Error updating employeeProfile:", err.response?.data);
      alert("❌ Failed to update employee");
    }
  };

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-card">
        <div className="card-header">
          <h1 className="card-title">Edit Profile</h1>
          <p className="card-subtitle">Update your profile information</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-content">
            {/* Left side form inputs */}
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name *</label>
                  <input
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label">Mobile *</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departmentId" className="form-label">Department *</label>
                  <input
                    id="departmentId"
                    name="departmentId"
                    className="form-input"
                    value={formData.departmentId}
                    onChange={handleChange}
                    placeholder="Enter department"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="categoryId" className="form-label">Category *</label>
                  <input
                    id="categoryId"
                    name="categoryId"
                    className="form-input"
                    value={formData.categoryId}
                    onChange={handleChange}
                    placeholder="Enter category"
                  />
                </div>
              </div>
            </div>

            {/* Right side: profile image */}
            <div className="profile-image-section">
              <label className="form-label">Profile Picture</label>
              <div className="image-upload-container">
                <div className="image-preview">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" />
                  ) : (
                    <div className="default-avatar">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 12C14.21 12 16 10.21 16 8C16 
                          5.79 14.21 4 12 4C9.79 4 8 
                          5.79 8 8C8 10.21 9.79 12 
                          12 12ZM12 14C9.33 14 4 
                          15.34 4 18V20H20V18C20 
                          15.34 14.67 14 12 14Z"
                          fill="#9CA3AF"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <label htmlFor="profileImage" className="upload-button">
                  <span>Choose File</span>
                </label>
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleChange}
                />
                <p className="upload-hint">JPG, PNG or GIF. Max size 2MB</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/change-profile")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
