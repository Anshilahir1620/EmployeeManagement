import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/UpdateEmployee.css';

const UpdateHoliday = () => {
    const [showPicker, setShowPicker] = useState(true);
    const [statusOptions, setStatusOptions] = useState([]);
    const [formData, setFormData] = useState({
        holidayName: '',
        date: '',
        type: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();

 


    useEffect(() => {
        axios.get(`https://localhost:7204/api/Holiday/${id}`)
            .then(res => setFormData(res.data))
            .catch(err => console.error("Failed to fetch leave data:", err));
    }, [id]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://localhost:7204/api/Holiday/${id}`, formData);
            console.log('Holidays updated successfully:', response.data);
            navigate('/Pages/Holidays');
        } catch (err) {
            console.error('Failed to update Leave:', err);
            alert(`Failed to update Holiday: ${err.response?.data?.message || err.message}`);
        }
    };

    const toggleInputType = () => {
        setShowPicker(prev => !prev);
    };

    const dateFields = ['startDate', 'endDate', 'appliedOn'];

    return (
        <MainLayout>
            <div className="update-employee-container">
                <h2 className="update-employee-title">Holiday </h2>

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
                            onClick={() => navigate('/Pages/Holidays')}
                            style={{ marginLeft: '10px' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default UpdateHoliday;
