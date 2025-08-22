import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/Employee.css';

const EmployeeDetailContent = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://localhost:7204/api/Employee');
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError('Failed to fetch employee data');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`https://localhost:7204/api/Employee/${id}`);
      fetchEmployees(); // Refresh list
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete employee');
    }
  };

  if (loading) return <div>Loading employee data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="employee-details-container">
      <h2 className="employee-details-title">Employee Details</h2>
      <button className="employee-add-btn" onClick={() => navigate('/Pages/Employee/CreateEmployee')} style={{ marginBottom: '10px' }}>Add Employee</button>
      <table className="employee-table">
        <thead>
          <tr>
            <th>EmployeeID</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Category</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="9" className="employee-no-data">No employee data found</td>
            </tr>
          ) : (
            employees.map(emp => (
              <tr key={emp.employeeId} className="employee-row">
                <td>{emp.employeeId}</td>
                <td>{emp.userId}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.departmentId}</td>
                <td>{emp.categoryId}</td>
                <td>{emp.role}</td>
                <td>
                  <button className="employee-action-btn update" onClick={() => navigate(`/Pages/UpdatedEmployee/${emp.employeeId}`)}>Update</button>
                  &nbsp;
                  <button className="employee-action-btn delete" onClick={() => handleDelete(emp.employeeId)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function EmployeeDetail() {
  return (
    <MainLayout>
      <EmployeeDetailContent />
    </MainLayout>
  );
}
