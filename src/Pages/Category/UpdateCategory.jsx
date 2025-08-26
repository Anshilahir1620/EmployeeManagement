import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import Alert from '../../common/Alert';
import '../../assets/css/UpdateEmployee.css';

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  useEffect(() => {
    axios.get(`https://localhost:7204/api/Category/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => {
        console.error('Error fetching category:', err);
        showAlert('error', 'Failed to load category');
      });
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7204/api/Category/${id}`, formData);
      showAlert('success', 'Category updated successfully!');
      setTimeout(() => {
        navigate('/Pages/Categories/');
      }, 1500);
    } catch (err) {
      console.error('Failed to update category:', err);
      showAlert('error', 'Failed to update category');
    }
  };

  return (
    <MainLayout>
      <Alert 
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={hideAlert}
        autoClose={true}
        duration={4000}
      />
      <div className="update-employee-container">
        <h2 className="update-employee-title">Update Category</h2>
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
            <button className="form-btn primary" type="submit">Update</button>
            <button className="form-btn" type="button" onClick={() => navigate('/Pages/Categories')} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default UpdateCategory;
