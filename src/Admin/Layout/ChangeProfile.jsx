import React, { useState, useEffect } from "react";
import "../assets/css/profileEdit.css";
import axios from "axios";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    role: "",
    password: "",
    phoneNumber: "",
    departmentId: "",
    categoryId: "",
     userId: "",
    profileImage: null,
   
  });

  const [previewImage, setPreviewImage] = useState(null);

  // get userId from localStorage
  const user_data = JSON.parse(localStorage.getItem("user"));

  console.log("User data from localStorage:", user_data);


  const UserID = user_data?.userId || "";
  const password = user_data?.password || "";
  const role = user_data?.role || "";
  console.log("Extracted UserID:", UserID);

  // fetch employee data
  useEffect(() => {
    if (!UserID) return;

    axios
      .get(`https://localhost:7204/api/Employee/byUserId/${UserID}`)
      .then((res) => {
        const emp = res.data;
        setFormData({
          name: emp.name || "",
          email: emp.email || "",
          phoneNumber: emp.phoneNumber || "",
          departmentId: emp.departmentId || "",
          categoryId: emp.categoryId || "",
          userId: emp.userId || "",
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
//Submit


const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7204/api/Employee/${UserID}`, formData);
      showAlert('success', 'Employee Profile updated successfully!');

      // Navigate after short delay
      setTimeout(() => {
        navigate('/change-profile');
      }, 1500);

    } catch (err) {
      console.error('Error updating employeeProfile:', err);
        console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      showAlert('error', 'Failed to update employee');
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
            {/* Left side: form inputs */}
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    First Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email ID *
                  </label>
                  <input
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>


              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="role" className="form-label">
                    Role *
                  </label>
                  <input
                    id="role"
                    name="role"
                    className="form-input"
                    value={role}
                    onChange={handleChange}
                    placeholder="Enter role"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    password  *
                  </label>
                  <input
                    id="password"
                    name="password"
                    className="form-input"
                    value={password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </div>
              </div>


              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departmentId" className="form-label">
                    Department *
                  </label>
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
                  <label htmlFor="userId" className="form-label">
                    User ID *
                  </label>
                  <input
                    id="userId"
                    name="userId"
                    className="form-input"
                    value={formData.userId}
                    onChange={handleChange}
                    placeholder="Enter USer ID"
                  />
                </div>

              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label">
                    Mobile *
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    className="form-input"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="categoryId" className="form-label">
                    Category *
                  </label>
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
              <label className="form-label">Profile Picture *</label>
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
                          d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
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
            <button type="button" className="btn btn-secondary">
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
