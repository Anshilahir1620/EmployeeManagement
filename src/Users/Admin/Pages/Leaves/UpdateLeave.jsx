import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../common/Alert';
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
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const navigate = useNavigate();
  const { id } = useParams();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  // Fetch status options
  useEffect(() => {
    axios.get('https://localhost:7204/api/Leave/LeaveStatus')
      .then(res => setStatusOptions(res.data))
      .catch(err => showAlert('error', 'Failed to fetch leave status options'));
  }, []);

  // Fetch leave data by ID
  useEffect(() => {
    axios.get(`https://localhost:7204/api/Leave/${id}`)
      .then(res => {
        const data = res.data;
        const formatDate = val => val ? val.split("T")[0] : "";
        setFormData({
          ...data,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          appliedOn: formatDate(data.appliedOn),
        });
      })
      .catch(err => showAlert('error', 'Failed to fetch leave data'));
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://localhost:7204/api/Leave/${id}`, formData);
      showAlert('success', 'Leave updated successfully!');
      setTimeout(() => navigate('/Pages/Leaves'), 2000); // Navigate after showing alert
    } catch (err) {
      showAlert('error', `Failed to update Leave: ${err.response?.data?.message || err.message}`);
    }
  };

  const dateFields = ['startDate', 'endDate', 'appliedOn'];

  return (
    <>
      <div className="update-employee-container">
        {/* Alert Box */}
        <Alert
          show={alert.show}
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
          autoClose={true}
          duration={4000}
        />

        <h2 className="update-employee-title">Update Leave</h2>

        <form className="update-employee-form" onSubmit={handleSubmit}>
          {['userId', 'startDate', 'endDate', 'remark', 'status', 'appliedOn', 'approvedBy'].map(field => (
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
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="form-input"
                  type={dateFields.includes(field) ? (showPicker ? "date" : "text") : "text"}
                  name={field}
                  value={formData[field] ?? ""}
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
              onClick={() => navigate('/admin/leaves')}
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

export default UpdateLeave;
