import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';

const CreateDepartment = () => {
  const [formData, setFormData] = useState({
    departmentName: '',
    description: '',
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7204/api/Department', formData);
      navigate('/Pages/Department/');
    } catch (err) {
      console.error('Failed to create Department:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      alert(`Failed to create Department: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <MainLayout>
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
            <button className="form-btn" type="button" onClick={() => navigate('/Pages/Department')} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateDepartment; 