import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import Alert from '../../common/Alert';
import '../../assets/css/Table.css';

const HolidayDetailContent = () => {
    const [holiday, setHoliday] = useState([]);
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
        fetchHoliday();
    }, []);

    const fetchHoliday = async () => {
        try {
            const response = await axios.get('https://localhost:7204/api/Holiday');
            setHoliday(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching Holiday data:', err);
            setError('Failed to fetch Holiday data');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Holiday?')) return;
        try {
            await axios.delete(`https://localhost:7204/api/Holiday/${id}`);
            showAlert('success', 'Holiday deleted successfully!');
            fetchHoliday(); // Refresh list
        } catch (err) {
            console.error('Error deleting Holiday:', err);
            showAlert('error', 'Failed to delete Holiday');
        }
    };

    if (loading) return <div>Loading Holiday data...</div>;
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
            <h2 className="details-title">Holiday Details</h2>
            <button className="add-btn" onClick={() => navigate('/Pages/Holidays/Insert')} style={{ marginBottom: '10px' }}>Add Holiday</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Holiday Name</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>CreatedAt</th>
                        <th>ModifiedDate</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {holiday.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="no-data">No Holiday data found</td>
                        </tr>
                    ) : (
                        holiday.map(emp => {
                            const formattedDate = new Date(emp.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric"
                            });
                            return (
                                <tr key={emp.holidayId} className="row">
                                    <td>{emp.holidayName}</td>
                                    <td>{formattedDate}</td>
                                    <td>{emp.type}</td>
                                    <td>{emp.createdAt}</td>
                                    <td>{emp.modifiedDate}</td>
                                    <td>
                                        <button className="action-btn update" onClick={() => navigate(`/Pages/Holidays/UpdateHoliday/${emp.holidayId}`)}>Update</button>
                                        &nbsp;
                                        <button className="action-btn delete" onClick={() => handleDelete(emp.holidayId)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default function HolidayDetail() {
    return (
        <MainLayout>
            <HolidayDetailContent />
        </MainLayout>
    );
}
