import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import Alert from '../../common/Alert';
import '../../assets/css/Employee.css';

const AttendanceLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('https://localhost:7204/api/AttendancelLog');
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
      showAlert('error', 'Failed to fetch attendance logs');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      await axios.delete(`https://localhost:7204/api/AttendancelLog/${id}`);
      showAlert('success', 'Log deleted successfully');
      fetchLogs();
    } catch (err) {
      console.error('Error deleting log:', err);
      showAlert('error', 'Failed to delete log');
    }
  };

  if (loading) return <div>Loading attendance logs...</div>;

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
      <div className="employee-details-container">
        <h2 className="employee-details-title">Attendance Logs</h2>
        <button
          className="employee-add-btn"
          onClick={() => navigate('/Pages/AttendanceLog/CreateAttendanceLog')}
          style={{ marginBottom: '10px' }}
        >
          Add Log
        </button>
        <table className="employee-table">
          <thead>
            <tr>
              <th>userId</th>
              <th>date</th>
              <th>punchIn</th>
              <th>punchOut</th>
              <th>totalHours</th>
              <th>status</th>
              <th>remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="8" className="employee-no-data">No logs found</td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.attendanceLogId} className="employee-row">
                  <td>{log.userId}</td>
                  <td>{new Date(log.date).toISOString().split("T")[0]}</td>
                  <td>{log.punchIn}</td>
                  <td>{log.punchOut}</td>
                  <td>{log.totalHours}</td>
                  <td>{log.status}</td>
                  <td>{log.remarks}</td>
                  <td>
                    <button
                      className="employee-action-btn update"
                      onClick={() => navigate(`/Pages/AttendanceLog/UpdateAttendanceLog/${log.attendanceLogId}`)}
                    >
                      Update
                    </button>
                    &nbsp;
                    <button
                      className="employee-action-btn delete"
                      onClick={() => handleDelete(log.attendanceLogId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default AttendanceLogList;
