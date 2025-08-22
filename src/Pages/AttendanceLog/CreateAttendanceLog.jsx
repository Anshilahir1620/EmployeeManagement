import React, { useState,useEffect  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';

const CreateAttendanceLog = () => {
   const [statusOptions, setStatusOptions] = useState([]);
   const [showPicker, setShowPicker] = useState(true);
  const [formData, setFormData] = useState({
    userId: '',
    date: '',
    punchIn: '',
    punchOut: '',
    totalHours: '',
    status: '',
    remarks: '',
     

  });

  const navigate = useNavigate();


   useEffect(() => {
        axios.get('https://localhost:7204/api/AttendancelLog/status')
          .then(res => setStatusOptions(res.data))
          .catch(err => console.error("Failed to fetch status options:", err));
      }, []);



  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7204/api/AttendancelLog', formData);
      navigate('/Pages/AttendanceLog');
    } catch (err) {
      console.error('Failed to create log:', err);
      alert('Failed to create log');
    }
  };
   const toggleInputType = () => {
      setShowPicker(prev => !prev);
    };
const dateFields = ["date"];
const timeFields = ["punchIn", "punchOut"];
// const textFields = ["userId", "totalHours", "remarks"];

  return (
    <MainLayout>
      <div className="update-employee-container">
        <h2 className="update-employee-title">Add Attendance Log</h2>
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
                    type={dateFields.includes(field)? (showPicker ? "date" : "text"): timeFields.includes(field)? "time": "text"
  }                 name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            ))}

          <div className="form-actions">
            <button className="form-btn primary" type="submit">Submit</button>
            <button className="form-btn" type="button" onClick={() => navigate('/Pages/AttendanceLog')} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateAttendanceLog; 