import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../common/Alert';
import '../../assets/css/UpdateEmployee.css';

const UpdateHoliday = () => {
    const [showPicker, setShowPicker] = useState(true);
    const [statusOptions, setStatusOptions] = useState([]);
    const [formData, setFormData] = useState({
        holidayName: '',
        date: '',
        type: ''
    });
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

    const navigate = useNavigate();
    const { id } = useParams();

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
    };

    const hideAlert = () => {
        setAlert({ show: false, type: 'info', message: '' });
    };

    useEffect(() => {
        axios.get(`https://localhost:7204/api/Holiday/${id}`)
            .then(res => setFormData(res.data))
            .catch(err => {
                console.error("Failed to fetch holiday data:", err);
                cosole.error('Error response:', err.response?.data);
                console.error('Error status:', err.response?.status);
                showAlert('error', 'Failed to fetch holiday data');
            });
    }, [id]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://localhost:7204/api/Holiday/${id}`, formData);
            console.log('Holiday updated successfully:', response.data);
            showAlert('success', 'Holiday updated successfully!');
            setTimeout(() => navigate('/Pages/Holidays'), 2000); // Navigate after showing alert
        } catch (err) {
            console.error('Failed to update Holiday:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            showAlert('error', `Failed to update Holiday: ${err.response?.data?.message || err.message}`);
        }
    };

    const toggleInputType = () => {
        setShowPicker(prev => !prev);
    };

    const dateFields = ['date'];

    return (
        <>
            <div className="update-employee-container">
                <Alert
                    show={alert.show}
                    type={alert.type}
                    message={alert.message}
                    onClose={hideAlert}
                    autoClose={true}
                    duration={4000}
                />
                <h2 className="update-employee-title">Update Holiday</h2>

                <form className="update-employee-form" onSubmit={handleSubmit}>
                    {['holidayName', 'date', 'type'].map(field => (
                        <div key={field} className="form-group">
                            <label className="form-label">{field}:</label>
                            <input
                                className="form-input"
                                type={dateFields.includes(field) ? (showPicker ? "date" : "text") : "text"}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}

                    <div className="form-actions">
                        <button className="form-btn primary" type="submit">Update</button>
                        <button
                            className="form-btn"
                            type="button"
                            onClick={() => navigate('/admin/holidays')}
                            style={{ marginLeft: '10px' }}
                        >
                            Cancel
                        </button>

                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateHoliday;
