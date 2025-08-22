import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    phoneNumber: '',
    departmentId: '',
    categoryId: '',
    role: '',
  });

  useEffect(() => {
    axios.get(`https://localhost:7204/api/Employee/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => {
        console.error('Error fetching employee:', err);
        alert('Failed to load employee');
      });
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7204/api/Employee/${id}`, formData);
      navigate('/Layout/Employee');
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee');
    }
  };

  return (
    <MainLayout>
      <div className="update-employee-container">
        <h2 className="update-employee-title">Update Employee</h2>
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
            <button className="form-btn primary" type="submit">Update</button>
            <button className="form-btn" type="button" onClick={() => navigate('/Pages/Employee/')} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default UpdateEmployee;
