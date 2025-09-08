import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '../../common/Alert';
import '../../assets/css/UpdateEmployee.css';

const CreateDepartment = () => {
  const [formData, setFormData] = useState({
    deptName: '',
    description: '',
  });

  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7204/api/Department', formData);
      showAlert('success', 'Department created successfully!');
      setTimeout(() => navigate('/Pages/Department'), 1500);
    } catch (err) {
      console.error('Failed to create Department:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      showAlert('error', `Failed to create Department: ${err.response?.data?.message || err.message}`);
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
        <h2 className="update-employee-title">Add New Department</h2>
        <form className="update-employee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Department Name: </label>
            <input
              className="form-input"
              type="text"
              name="deptName"
              value={formData.deptName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description: </label>
            <input
              className="form-input"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button className="form-btn primary" type="submit">Submit</button>
            <button
              className="form-btn"
              type="button"
              onClick={() => navigate('/admin/departments')}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </>
  );
};

export default CreateDepartment;
