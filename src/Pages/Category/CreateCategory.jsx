import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7204/api/Category', formData);
      navigate('/Pages/Categories/');
    } catch (err) {
      console.error('Failed to create category:', err);
      alert('Failed to create category');
    }
  };

  return (
    <MainLayout>
      <div className="update-employee-container">
        <h2 className="update-employee-title">Add New Category</h2>
        <form className="update-employee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category Name: </label>
            <input
              className="form-input"
              type="text"
              name="categoryName"
              value={formData.categoryName}
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
            />
          </div>
          <div className="form-actions">
            <button className="form-btn primary" type="submit">Submit</button>
            <button className="form-btn" type="button" onClick={() => navigate('/Pages/Categories')} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateCategory; 