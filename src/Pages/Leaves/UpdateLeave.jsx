import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';

const UpdateLeave = () => {
  const [showPicker, setShowPicker] = useState(true);
  const [statusOptions, setStatusOptions] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    startDate: '',
    endDate: '',
    remark: '',
    status: '',
    appliedOn: '',
    approvedBy: ''
  });

  const navigate = useNavigate();
  const { id } = useParams(); 




    useEffect(() => {
          axios.get('https://localhost:7204/api/Leave/LeaveStatus')
            .then(res => setStatusOptions(res.data))
            .catch(err => console.error("Failed to fetch status options:", err));
        }, []);


 useEffect(() => {
  axios.get(`https://localhost:7204/api/Leave/${id}`)
    .then(res => {
      const data = res.data;

      // format date-only fields
      const formatDate = (val) => val ? val.split("T")[0] : "";

      setFormData({
        ...data,
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        appliedOn: formatDate(data.appliedOn),
      });
    })
    .catch(err => console.error("Failed to fetch leave data:", err));
}, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://localhost:7204/api/Leave/${id}`, formData);
      console.log('Leave updated successfully:', response.data);
      navigate('/Pages/Leaves');
    } catch (err) {
      console.error('Failed to update Leave:', err);
      alert(`Failed to update Leave: ${err.response?.data?.message || err.message}`);
    }
  };

  const toggleInputType = () => {
    setShowPicker(prev => !prev);
  };

  const dateFields = ['startDate', 'endDate', 'appliedOn'];

  return (
    <MainLayout>
      <div className="update-employee-container">
        <h2 className="update-employee-title">Update Leave</h2>

        <form className="update-employee-form" onSubmit={handleSubmit}>
          {['userId','startDate','endDate','remark','status','appliedOn','approvedBy'].map(field => (
            <div key={field} className="form-group">
              <label className="form-label">{field}:</label>

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
                  value={formData[field]?? ""}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}

          <div className="form-actions">
            <button className="form-btn primary" type="submit">Update</button>
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

export default UpdateLeave;
