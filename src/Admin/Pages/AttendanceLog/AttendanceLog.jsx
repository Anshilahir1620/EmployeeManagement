import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '../../common/Alert';
import '../../assets/css/Employee.css';

const AttendanceLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const showAlert = (type, message) => setAlert({ show: true, type, message });
  const hideAlert = () => setAlert({ show: false, type: 'info', message: '' });

  useEffect(() => {
    fetchLogs(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const fetchLogs = async (page, size) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://localhost:7204/api/AttendancelLog/GetPaged?pageNumber=${page}&pageSize=${size}`);
      setLogs(response.data.data);
      const totalRecords = response.data.totalRecords;
      setTotalPages(Math.ceil(totalRecords / size));
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
      fetchLogs(pageNumber, pageSize);
    } catch (err) {
      console.error('Error deleting log:', err);
      showAlert('error', 'Failed to delete log');
    }
  };

  // Hot reload pageSize (2 seconds debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pageSize < 1) setPageSize(1);
      fetchLogs(pageNumber, pageSize);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pageSize]);

  const handlePageSizeChange = (e) => setPageSize(parseInt(e.target.value) || 1);
  const handlePrevPage = () => pageNumber > 1 && setPageNumber(prev => prev - 1);
  const handleNextPage = () => pageNumber < totalPages && setPageNumber(prev => prev + 1);

  if (loading) return <div>Loading attendance logs...</div>;


  return (
    <>
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
          onClick={() => navigate('/admin/attendance-log/create')}
          style={{ marginBottom: '10px' }}
        >
          Add Log
        </button>


        {/* Page Size Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px', marginRight: '10px' }}>
            Rows per page:
          </label>
          <input
            type="number"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: '60px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            min="1"
          />
        </div>

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
          <tbody key={pageNumber}>
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
                      onClick={() => navigate(`/admin/attendance-log/${log.attendanceLogId}`)}
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

        {/* Pagination Controls */}
        <div className="pagination" style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handlePrevPage}
            disabled={pageNumber === 1}
            style={{
              padding: '5px 10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: pageNumber === 1 ? '#eee' : '#4a90e2',
              color: pageNumber === 1 ? '#999' : '#fff',
              cursor: pageNumber === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          <span style={{ fontWeight: 'bold' }}>Page {pageNumber} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={pageNumber === totalPages}
            style={{
              padding: '5px 10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: pageNumber === totalPages ? '#eee' : '#4a90e2',
              color: pageNumber === totalPages ? '#999' : '#fff',
              cursor: pageNumber === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AttendanceLogList;
