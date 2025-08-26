
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import Alert from '../../common/Alert';

import '../../assets/css/Table.css';


const LeaveDetailContent = () => {
  const [leaves, setLeave] = useState([]);
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
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('https://localhost:7204/api/Leave');
      setLeave(response.data);

      setLoading(false);
      

    } catch (err) {
      console.error('Error fetching Leaves data:', err);
      setError('Failed to fetch Leave data');
      setLoading(false);
      showAlert('error', `Failed to create Leave: ${err.response?.data?.message || err.message}`);

    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Leave?')) return;
    try {
      await axios.delete(`https://localhost:7204/api/Leave/${id}`);
            showAlert('success', 'Department deleted successfully!');

      fetchLeaves(); // Refresh list
    } catch (err) {
      console.error('Error deleting Leave:', err);
      showAlert('error', 'Failed to delete Department');
    }
  };

  if (loading) return <div>Loading Leave data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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
    <div className="details-container">
    
      <h2 className="details-title">Leave Details</h2>
      <button className="add-btn" onClick={() => navigate('/Pages/Leaves/CreateLeave')} style={{ marginBottom: '10px' }}>Apply Leave</button>
      <table className="table">
        <thead>
          <tr>

            <th>User ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Remark</th>
            <th>Status</th>
            <th>Appliedon</th>
            <th>Approved By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="9" className="no-data">No Leave data found</td>
            </tr>
          ) : (
            leaves.map(emp => (
              <tr key={emp.leaveId} className="row">

                <td>{emp.userId}</td>
                <td>{emp.startDate}</td>
                <td>{emp.endDate}</td>
                <td>{emp.remark}</td>
                <td>{emp.status}</td>
                <td>{emp.appliedOn}</td>
                <td>{emp.approvedBy}</td>

                <td>
                  <button className="action-btn update" onClick={() => navigate(`/Pages/Leaves/UpdateLeave/${emp.leaveId}`)}>Update</button>
                  &nbsp;
                  <button className="action-btn delete" onClick={() => handleDelete(emp.leaveId)}>Delete</button>
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
export default  LeaveDetailContent;
