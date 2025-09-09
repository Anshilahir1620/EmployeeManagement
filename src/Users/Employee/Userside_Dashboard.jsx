// components/Dashboard/Dashboard.js
import React from 'react';
import '../Admin/assets/css/UserDashboard.css';

const UserDashboard = () => {
  const stats = [
    { title: 'Total Leaves', value: '12,345', icon: '👥', color: '#007bff' },
    { title: 'Revenue', value: '$45,678', icon: '💰', color: '#28a745' },
    { title: 'Orders', value: '1,234', icon: '🛍️', color: '#ffc107' },
    { title: 'Projects', value: '5', icon: '📦', color: '#dc3545' }
  ];

  const activities = [
    { text: 'New user registered', time: '2 min ago' },
    { text: 'Order #1234 completed', time: '5 min ago' },
    { text: 'Product updated', time: '10 min ago' },
    { text: 'New review received', time: '15 min ago' },
    { text: 'Payment processed', time: '20 min ago' }
  ];

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">Dashboard Overview</h2>
      
      <div className="dashboard__stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard__stat-card">
            <div className="dashboard__stat-header">
              <span 
                className="dashboard__stat-icon"
                style={{ color: stat.color }}
              >
                {stat.icon}
              </span>
              <span className="dashboard__stat-title">{stat.title}</span>
            </div>
            <div 
              className="dashboard__stat-value"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__charts-section">
        <div className="dashboard__chart-card">
          <h5 className="dashboard__chart-title">Leaves Status</h5>
          <div className="dashboard__activity-list">
            {activities.map((activity, index) => (
              <div key={index} className="dashboard__activity-item">
                <span className="dashboard__activity-dot"></span>
                <span className="dashboard__activity-text">{activity.text}</span>
                <span className="dashboard__activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard__chart-card">
          <h5 className="dashboard__chart-title">Quick Actions</h5>
          <div className="dashboard__actions">
            <button className="dashboard__action-btn dashboard__action-btn--primary">
              Apply Leave Requset
            </button>
            <button className="dashboard__action-btn dashboard__action-btn--success">
              view Holidays Details
            </button>
            <button className="dashboard__action-btn dashboard__action-btn--warning">
              Edit Profile
            </button>
            <button className="dashboard__action-btn dashboard__action-btn--info">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;