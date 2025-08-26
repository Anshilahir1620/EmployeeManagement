import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../../common/axios';
import { setToken, isAuthenticated } from '../../common/Auth';
import '../../assets/css/UpdateEmployee.css';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Log exactly what we're sending
    const requestData = { 
      Email: email,        // API expects "Email" (capital E)
      Password: password,  // API expects "Password" (capital P)
      Role: role          // API expects "Role" (capital R)
    };
    
    console.log('Sending login data:', requestData);
    
    try {
      
      const { data } = await api.post('/MstUser/login/', requestData);

      
            console.log('Login response:');

      console.log('Login response:', data);
      
      // Check for token in different possible fields
      const token = data.token || data.access_token || data.jwt || data.accessToken;
      if (token) {
        setToken(token);
        navigate('/');
      } else {
        alert('No token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Log the specific validation errors
      if (err.response?.data?.errors) {
        console.error('Validation errors:', err.response.data.errors);
        console.error('Error details:', JSON.stringify(err.response.data.errors, null, 2));
      }
      
      // Show detailed error message
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed';
      alert(`Login failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f7fafc' }}>
      <div className="update-employee-container" style={{ maxWidth: 380 }}>
        <h2 className="update-employee-title">Sign In</h2>
        <form className="update-employee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input className="form-input" type="text" value={role} onChange={(e)=>setRole(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button className="form-btn primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

