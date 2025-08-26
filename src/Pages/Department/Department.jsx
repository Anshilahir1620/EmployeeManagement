import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import Alert from '../../common/Alert';
import '../../assets/css/Table.css';

const DepartmentDetailContent = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: 'info', message: '' });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('https://localhost:7204/api/Department');
      setDepartments(response.data);
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
      fetchDepartments();
    } catch (err) {
      console.error('Error deleting Department:', err);
      showAlert('error', 'Failed to delete Department');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString();
  };

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
        onClick={() => navigate('/Pages/Department/CreateDepartment')}
        style={{ marginBottom: '10px' }}
      >
        Add Department
      </button>

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
        <tbody>
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
                    onClick={() => navigate(`/Pages/Department/UpdateDepartment/${dept.departmentId}`)}
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
    </div>
  );
};

export default function DepartmentDetail() {
  return (
    <MainLayout>
      <DepartmentDetailContent />
    </MainLayout>
  );
}
