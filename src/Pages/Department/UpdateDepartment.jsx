import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';

const UpdateDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    departmentName: '',
    description: '',
  });

  useEffect(() => {
    axios.get(`https://localhost:7204/api/Department/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => {
        console.error('Error fetching department:', err);
        alert('Failed to load department');
      });
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7204/api/Department/${id}`, formData);
      navigate('/Pages/Department');
    } catch (err) {
      console.error('Failed to update department:', err);
      alert('Failed to update department');
    }
  };

  return (
    <MainLayout>
      <div className="update-employee-container">
        <h2 className="update-employee-title">Update Department</h2>
        <form className="update-employee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Department Name: </label>
            <input
              className="form-input"
              type="text"
              name="departmentName"
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
            <button className="form-btn primary" type="submit">Update</button>
            <button className="form-btn" type="button" onClick={() => navigate('/Pages/Department')} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default UpdateDepartment; 