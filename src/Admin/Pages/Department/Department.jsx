import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '../../common/Alert';
import '../../assets/css/Table.css';

const DepartmentDetailContent = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const showAlert = (type, message) => setAlert({ show: true, type, message });
  const hideAlert = () => setAlert({ show: false, type: 'info', message: '' });

  useEffect(() => {
    fetchDepartments(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const fetchDepartments = async (page, size) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://localhost:7204/api/Department/GetPaged?pageNumber=${page}&pageSize=${size}`
      );
      setDepartments(response.data.data);
      const totalRecords = response.data.totalRecords;
      setTotalPages(Math.ceil(totalRecords / size));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Department data:', err);
      setError('Failed to fetch Department data');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Department?')) return;
    try {
      await axios.delete(`https://localhost:7204/api/Department/${id}`);
      showAlert('success', 'Department deleted successfully!');
      fetchDepartments(pageNumber, pageSize);
    } catch (err) {
      console.error('Error deleting Department:', err);
      showAlert('error', 'Failed to delete Department');
    }
  };

  const formatDate = (dateString) => (!dateString ? '—' : new Date(dateString).toLocaleString());

  // Hot reload pageSize (2 seconds debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pageSize < 1) setPageSize(1);
      fetchDepartments(pageNumber, pageSize);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pageSize]);

  const handlePageSizeChange = (e) => setPageSize(parseInt(e.target.value) || 1);

  const handlePrevPage = () => pageNumber > 1 && setPageNumber(prev => prev - 1);
  const handleNextPage = () => pageNumber < totalPages && setPageNumber(prev => prev + 1);

  if (loading) return <div>Loading Department data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="details-container">
      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={hideAlert}
        autoClose={true}
        duration={4000}
      />
      <h2 className="details-title">Department Details</h2>
      <button
        className="add-btn"
        onClick={() => navigate('/admin/departments/create')}
        style={{ marginBottom: '10px' }}
      >
        Add Department
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

      <table className="table">
        <thead>
          <tr>
            <th>Department ID</th>
            <th>Department Name</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Modified Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody key={pageNumber}>
          {departments.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">No Department data found</td>
            </tr>
          ) : (
            departments.map(dept => (
              <tr key={dept.departmentId} className="row">
                <td>{dept.departmentId}</td>
                <td>{dept.deptName}</td>
                <td>{dept.description}</td>
                <td>{formatDate(dept.createdAt)}</td>
                <td>{formatDate(dept.modifiedDate)}</td>
                <td>
                  <button
                    className="action-btn update"
                    onClick={() => navigate(`/admin/departments/${dept.departmentId}`)}
                  >
                    Update
                  </button>

                  &nbsp;
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(dept.departmentId)}
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
        style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}
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
  );
};

export default function DepartmentDetail() {
  return (

    <DepartmentDetailContent />

  );
}
