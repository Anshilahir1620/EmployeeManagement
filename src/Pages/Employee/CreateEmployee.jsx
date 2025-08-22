import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    phoneNumber: '',
    departmentId: '',
    categoryId: '',
    role: '',
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Sending data:', formData);
      const response = await axios.post('https://localhost:7204/api/Employee', formData);
      console.log('Success response:', response.data);
      navigate('/Pages/Employee/');
    } catch (err) {
      console.error('Failed to create employee:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      alert(`Failed to create employee: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <MainLayout>
      <div className="update-employee-container">
        <h2 className="update-employee-title">Add New Employee</h2>
        <form className="update-employee-form" onSubmit={handleSubmit}>
          {['userId', 'name', 'email', 'phoneNumber', 'departmentId', 'categoryId', 'role'].map(field => (
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
          <div className="form-actions">
            <button className="form-btn primary" type="submit">Submit</button>
            <button className="form-btn" type="button" onClick={() => navigate('/Pages/Employee/')} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateEmployee;
