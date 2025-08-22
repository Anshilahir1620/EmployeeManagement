import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import '../../assets/css/Employee.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:7204/api/Category');
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`https://localhost:7204/api/Category/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category');
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <MainLayout>
      <div className="employee-details-container">
        <h2 className="employee-details-title">Category Details</h2>
        <button className="employee-add-btn" onClick={() => navigate('/Pages/Category/CreateCategory')} style={{ marginBottom: '10px' }}>Add Category</button>
        <table className="employee-table">
          <thead>
            <tr>
              <th>CategoryID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="employee-no-data">No category data found</td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.categoryId} className="employee-row">
                  <td>{cat.categoryId}</td>
                  <td>{cat.categoryName || cat.name}</td>
                  <td>{cat.description}</td>
                  <td>
                    <button className="employee-action-btn update" onClick={() => navigate(`/Pages/Category/UpdateCategory/${cat.categoryId}`)}>Update</button>
                    &nbsp;
                    <button className="employee-action-btn delete" onClick={() => handleDelete(cat.categoryId)}>Delete</button>
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

export default CategoryList; 