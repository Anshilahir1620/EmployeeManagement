import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Employee.css';
import Alert from '../../common/Alert';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5); // default rows per page
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const showAlert = (type, message) => setAlert({ show: true, type, message });
  const hideAlert = () => setAlert({ show: false, type: 'info', message: '' });

  useEffect(() => {
    fetchCategories(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const fetchCategories = async (page, size) => {
    try {
      const response = await axios.get(`https://localhost:7204/api/Category/GetPaged?pageNumber=${page}&pageSize=${size}`);
      setCategories(response.data.data);
      const totalRecords = response.data.totalRecords;
      setTotalPages(Math.ceil(totalRecords / size));
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
      showAlert('error', 'Failed to fetch category data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`https://localhost:7204/api/Category/${id}`);
      showAlert('success', 'Category deleted successfully!');
      fetchCategories(pageNumber, pageSize);
    } catch (err) {
      console.error('Error deleting category:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      showAlert('error', 'Failed to delete category');
    }
  };

  const handlePrevPage = () => pageNumber > 1 && setPageNumber(prev => prev - 1);
  const handleNextPage = () => pageNumber < totalPages && setPageNumber(prev => prev + 1);

  // Hot reload pageSize (2 seconds debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pageSize < 1) setPageSize(1);
      fetchCategories(pageNumber, pageSize);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pageSize]);

  const handlePageSizeChange = (e) => setPageSize(parseInt(e.target.value) || 1);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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
        <button
          className="employee-add-btn"
          onClick={() => navigate('/admin/categories/create')}
          style={{ marginBottom: '10px' }}
        >
          Add Category
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

        {/* Category Table */}
        <table className="employee-table">
          <thead>
            <tr>
              <th>CategoryID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody key={pageNumber}>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="employee-no-data">
                  No category data found
                </td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.categoryId} className="employee-row">
                  <td>{cat.categoryId}</td>
                  <td>{cat.categoryName || cat.name}</td>
                  <td>{cat.description}</td>
                  <td>
                    <button
                      className="employee-action-btn update"
                      onClick={() => navigate(`/admin/categories/${cat.categoryId}`)}
                    >
                      Update
                    </button>

                    &nbsp;
                    <button
                      className="employee-action-btn delete"
                      onClick={() => handleDelete(cat.categoryId)}
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
          <span style={{ fontWeight: 'bold' }}>
            Page {pageNumber} of {totalPages}
          </span>
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

export default CategoryList;
