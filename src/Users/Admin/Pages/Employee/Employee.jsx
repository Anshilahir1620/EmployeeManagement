import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Employee.css';
import Alert from '../../common/Alert';

const EmployeeDetailContent = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const showAlert = (type, message) => setAlert({ show: true, type, message });
  const hideAlert = () => setAlert({ show: false, type: 'info', message: '' });

  useEffect(() => {
    fetchEmployees(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const fetchEmployees = async (page, size) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://localhost:7204/api/Employee/GetPaged?pageNumber=${page}&pageSize=${size}`
      );
      setEmployees(response.data.data);
      const totalRecords = response.data.totalRecords;
      setTotalPages(Math.ceil(totalRecords / size));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError('Failed to fetch employee data');
      setLoading(false);
      showAlert('error', 'Failed to fetch employee data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`https://localhost:7204/api/Employee/${id}`);
      showAlert('success', 'Employee deleted successfully!');
      fetchEmployees(pageNumber, pageSize);
    } catch (err) {
      console.error('Error deleting employee:', err);
      showAlert('error', 'Failed to delete employee');
    }
  };

  const handlePrevPage = () => pageNumber > 1 && setPageNumber(prev => prev - 1);
  const handleNextPage = () => pageNumber < totalPages && setPageNumber(prev => prev + 1);

  // Debounced page size input (hot reload)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pageSize < 1) setPageSize(1);
      fetchEmployees(pageNumber, pageSize);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pageSize]);

  const handlePageSizeChange = (e) => setPageSize(parseInt(e.target.value) || 1);

  if (error) return <div className="error">{error}</div>;

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
        <h2 className="employee-details-title">Employee Details</h2>
        <button
          className="employee-add-btn"
          onClick={() => navigate('/admin/employees/create')}
          style={{ marginBottom: '10px' }}
        >
          Add Employee
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

        {/* Employee Table */}
        <table className="employee-table" style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <thead style={{ backgroundColor: '#4a90e2', color: '#fff', textAlign: 'left' }}>
            <tr>
              <th>EmployeeID</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Category</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody key={pageNumber}>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '15px' }}>
                  No employee data found
                </td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.employeeId} className="fade-in-row" style={{ borderBottom: '1px solid #eee' }}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.userId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phoneNumber}</td>
                  <td>{emp.departmentId}</td>
                  <td>{emp.categoryId}</td>
                  <td>{emp.imagePath}</td>
                  <td>
                    <button
                      className="employee-action-btn update"
                      onClick={() => navigate(`/admin/employees/${emp.employeeId}`)}
                    >
                      Update
                    </button>

                    <button
                      className="employee-action-btn delete"
                      onClick={() => handleDelete(emp.employeeId)}
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

export default EmployeeDetailContent;
