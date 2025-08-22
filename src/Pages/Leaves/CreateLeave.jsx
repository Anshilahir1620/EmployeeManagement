  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import MainLayout from '../../Layout/MainLayout';
  import '../../assets/css/UpdateEmployee.css';

  const CreateLeave = () => {
    const [showPicker, setShowPicker] = useState(true);
    const [statusOptions, setStatusOptions] = useState([]);
    const [formData, setFormData] = useState({
      userId: '',
      startDate: '',
      endDate: '',  
      remark: '',
      status: '',
      appliedOn: '',
      approvedBy: '',
    });

    const navigate = useNavigate();

    // ✅ Fetch status options once component mounts
    useEffect(() => {
      axios.get('https://localhost:7204/api/Leave/LeaveStatus')
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
        const response = await axios.post('https://localhost:7204/api/Leave', formData);
        console.log('Success response:', response.data);
        navigate('/Pages/Leaves');
      } catch (err) {
        console.error('Failed to create Leave:', err);
        alert(`Failed to create Leave: ${err.response?.data?.message || err.message}`);
      }
    };

    const toggleInputType = () => {
      setShowPicker(prev => !prev);
    };

    const dateFields = ['startDate', 'endDate', 'appliedOn'];

    return (
      <MainLayout>
        <div className="update-employee-container">
          <h2 className="update-employee-title">Apply Leave</h2>

          <form className="update-employee-form" onSubmit={handleSubmit}>
            {Object.keys(formData).map(field => (
              <div key={field} className="form-group">
                <label className="form-label">{field}:</label>

                {/* ✅ Custom select input for status */}
                {field === 'status' ? (
                  <select
                    className="form-input"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="form-input"
                    type={dateFields.includes(field) ? (showPicker ? "date" : "text") : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            ))}

            <div className="form-actions">
              <button className="form-btn primary" type="submit">Submit</button>
              <button
                className="form-btn"
                type="button"
                onClick={() => navigate('/Pages/Leaves')}
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

  export default CreateLeave;
