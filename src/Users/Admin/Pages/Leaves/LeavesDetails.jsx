import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '../../common/Alert';
import '../../assets/css/Table.css';

const LeaveDetailContent = () => {
  const [leaves, setLeave] = useState([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const showAlert = (type, message) => setAlert({ show: true, type, message });
  const hideAlert = () => setAlert({ show: false, type: 'info', message: '' });

  useEffect(() => {
    fetchLeaves(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const fetchLeaves = async (page, size) => {
    try {
      const response = await axios.get(
        `https://localhost:7204/api/LeaveRequest/GetPaged?pageNumber=${page}&pageSize=${size}`
      );
      setLeave(response.data.data);
      const totalRecords = response.data.totalRecords;
      setTotalPages(Math.ceil(totalRecords / size));
    } catch (err) {
      console.error('Error fetching Leaves data:', err);
      setError('Failed to fetch Leave data');
      showAlert(
        'error',
        `Failed to fetch Leaves: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Leave?')) return;
    try {
      await axios.delete(`https://localhost:7204/api/LeaveRequest/${id}`);
      showAlert('success', 'Leave deleted successfully!');
      fetchLeaves(pageNumber, pageSize);
    } catch (err) {
      console.error('Error deleting Leave:', err);
      showAlert('error', 'Failed to delete Leave');
    }
  };

  // Hot reload pageSize (2 seconds debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pageSize < 1) setPageSize(1);
      fetchLeaves(pageNumber, pageSize);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pageSize]);

  const handlePageSizeChange = (e) =>
    setPageSize(parseInt(e.target.value) || 1);
  const handlePrevPage = () =>
    pageNumber > 1 && setPageNumber((prev) => prev - 1);
  const handleNextPage = () =>
    pageNumber < totalPages && setPageNumber((prev) => prev + 1);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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
      <div className="details-container">
        <h2 className="details-title">Leave Details</h2>
        <button
          className="add-btn"
          onClick={() => navigate('/admin/leaves/create')}
          style={{ marginBottom: '10px' }}
        >
          Apply Leave
        </button>


        {/* Page Size Input */}
        <div style={{ marginBottom: '15px' }}>
          <label
            style={{
              fontWeight: 'bold',
              fontSize: '14px',
              marginRight: '10px',
            }}
          >
            Rows per page:
          </label>
          <input
            type="number"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{
              width: '60px',
              padding: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            min="1"
          />
        </div>

        <table className="table fade-in">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Remark</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Approved By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody key={pageNumber}>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No Leave data found
                </td>
              </tr>
            ) : (
              leaves.map((emp) => (
                <tr key={emp.leaveId} className="row slide-in-left">
                  <td>{emp.userId}</td>
                  <td>{emp.startDate}</td>
                  <td>{emp.endDate}</td>
                  <td>{emp.remark}</td>
                  <td>{emp.status}</td>
                  <td>{emp.appliedOn}</td>
                  <td>{emp.approvedBy}</td>
                  <td>
                    <button
                      className="action-btn update"
                      onClick={() => navigate(`/admin/leaves/${emp.leaveId}`)}
                    >
                      Update
                    </button>

                    &nbsp;
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(emp.leaveId)}
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
        <div
          className="pagination"
          style={{
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handlePrevPage}
            disabled={pageNumber === 1}
            style={{
              padding: '5px 10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: pageNumber === 1 ? '#eee' : '#4a90e2',
              color: pageNumber === 1 ? '#999' : '#fff',
              cursor: pageNumber === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>
          <span style={{ fontWeight: 'bold' }}>
            Page {pageNumber} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={pageNumber === totalPages}
            style={{
              padding: '5px 10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: pageNumber === totalPages ? '#eee' : '#4a90e2',
              color: pageNumber === totalPages ? '#999' : '#fff',
              cursor: pageNumber === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default LeaveDetailContent;
