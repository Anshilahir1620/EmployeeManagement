import React , {useEffect,useState} from 'react';
import axios from 'axios';
import {useNavigate} from  'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/Table.css';


const DepartmentDetailContent = () => {
  const [deparments, setDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

    useEffect(() => {
      fetchDepartment();
    }, []);

      const fetchDepartment = async () => {
        try {
          const response = await axios.get('https://localhost:7204/api/Department');
          setDepartment(response.data);
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
      fetchDepartment(); // Refresh list
    } catch (err) {
      console.error('Error deleting Department:', err);
      alert('Failed to delete Department');
    }
  };
  if (loading) return <div>Loading Department data...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;


 return (
    <div className="details-container">
      <h2 className="details-title">Department Details</h2>
      <button className="add-btn" onClick={() => navigate('/Pages/Department/CreateDepartment')} style={{ marginBottom: '10px' }}>Add Department</button>
      <table className="table">
        <thead>
          <tr>
            <th>DepartmentID</th>
            <th>DeptName</th>
            <th>Description</th>
            <th>CreatedAt</th>
            <th>ModifiedDate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deparments.length === 0 ? (
            <tr>
              <td colSpan="9" className="no-data">No Department data found</td>
            </tr>
          ) : (
            deparments.map(emp => (
              <tr key={emp.departmentId} className="row">
                <td>{emp.departmentId}</td>
                <td>{emp.deptName}</td>
                <td>{emp.description}</td>
                <td>{emp.createdAt}</td>
                <td>{emp.modifiedDate}</td>
               
                <td>
                  <button className="action-btn update" onClick={() => navigate(`/Pages/Department/UpdatedDepartment/${emp.departmentId}`)}>Update</button>
                  &nbsp;
                  <button className="action-btn delete" onClick={() => handleDelete(emp.departmentId)}>Delete</button>
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