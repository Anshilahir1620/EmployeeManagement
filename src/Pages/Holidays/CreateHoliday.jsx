import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';

const CreateHoliday = () => {
  const [showPicker, setShowPicker] = useState(true);
  const [statusOptions, setStatusOptions] = useState([]);
  const [formData, setFormData] = useState({

    holidayName: '',
    date: '',
    type: '',
  });

  const navigate = useNavigate();


  // ✅ Fetch status options once component mounts
  useEffect(() => {
    axios.get('https://localhost:7204/api/Holiday/HolidayType')
      .then(res => setStatusOptions(res.data))
      .catch(err => console.error("Failed to fetch status options:", err));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Sending data:', formData);
      const response = await axios.post('https://localhost:7204/api/Holiday', formData);
      console.log('Success response:', response.data);
      navigate('/Pages/Holidays/');
    } catch (err) {
      console.error('Failed to create Holiday:', err);
      alert(`Failed to create Holiday ${err.response?.data?.message || err.message}`);
    }
  };

  const toggleInputType = () => {
    setShowPicker(prev => !prev);
  };

  const dateFields = ['date'];

  return (
    <MainLayout>
      <div className="update-employee-container">
        <h2 className="update-employee-title">ADD Holiday </h2>

        <form className="update-employee-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Holiday Name:</label>
            <input
              className="form-input"
              type="text"
              name="holidayName"
              value={formData.holidayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              className="form-input"
              type={showPicker ? "date" : "text"}
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Type:</label>
            <select
              className="form-input"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              {statusOptions.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            
            </select>
          </div>
            <div className="form-actions">
              <button className="form-btn primary" type="submit">Submit</button>
              <button
                className="form-btn"
                type="button"
                onClick={() => navigate('/Pages/Holidays')}
                style={{ marginLeft: '10px' }}
              >
                Cancel
              </button>
            </div>
        </form>

      </div>
    </MainLayout>
  );
};

export default CreateHoliday;
