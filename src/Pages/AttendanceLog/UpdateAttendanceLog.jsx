import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';
import Alert from '../../common/Alert';


const UpdateAttendanceLog = () => {
  const [statusOptions, setStatusOptions] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const [showPicker, setShowPicker] = useState(true);
  const [formData, setFormData] = useState({
    userId: '',
    date: '',
    punchIn: '',
    punchOut: '',
    totalHours: '',
    status: '',
    remarks: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();



  // Fetch status options
  useEffect(() => {
    axios
      .get('https://localhost:7204/api/AttendancelLog/status')
      .then(res => setStatusOptions(res.data))
      .catch(err => console.error("Failed to fetch status options:", err));
  }, []);

    const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };
  // Fetch existing log data by id
  useEffect(() => {
    axios
      .get(`https://localhost:7204/api/AttendancelLog/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => {
        console.error('Error fetching log:', err);
        useEffect(() => {
          axios.get(`https://localhost:7204/api/Employee/${id}`)
            .then(res => setFormData(res.data))
            .catch(err => {
              console.error('Error fetching employee:', err);
              showAlert('error', 'Failed to load AttendanceLog data');
            });
        }, [id]);
      });
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7204/api/AttendancelLog/${id}`, formData);
      showAlert('success', 'AttendanceLog updated successfully!');

      // Navigate after short delay
      setTimeout(() => {
        navigate('/Pages/Employee');
      }, 1500);
    } catch (err) {
      console.error('Failed to update log:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      showAlert('error', 'Failed to update AttendanceLog');
    }
  };

  const toggleInputType = () => {
    setShowPicker(prev => !prev);
  };

  const dateFields = ["date"];
  const timeFields = ["punchIn", "punchOut"];

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
        <h2 className="update-employee-title">Update Attendance Log</h2>
        <form className="update-employee-form" onSubmit={handleSubmit}>
          {Object.keys(formData).map(field => (
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
                  type={
                    dateFields.includes(field)
                      ? (showPicker ? "date" : "text")
                      : timeFields.includes(field)
                        ? "time"
                        : "text"
                  }
                  name={field}
                  value={formData[field] || ''}
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
              onClick={() => navigate('/Pages/AttendanceLog')}
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

export default UpdateAttendanceLog;
