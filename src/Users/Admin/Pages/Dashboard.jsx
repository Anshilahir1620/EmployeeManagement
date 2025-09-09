import React, { useState,useEffect } from "react";
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaUsers, FaBuilding, FaRegCalendarCheck, FaClipboardList, FaUserPlus, FaCheckCircle, FaEdit } from "react-icons/fa";
import "../../Admin/assets/css/Dashboard.css";

import {
  Container,
  Card,
  Form,
  Badge,
  Row,
  Col,
  Button,
} from "react-bootstrap";

export default function Dashboard() {
  const [employeecount, setemployeecount] = useState();
  const [departmentcount, setdepartmentcount] = useState(); 
  const [paddingLeavecount, setpaddingLeavecount] = useState();  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchemployeeCount();
    fetchdepartmentcount();
    fetchLeaveCount();
  }, []);

  const fetchemployeeCount = async () => {
    try {
      const response = await axios.get('https://localhost:7204/api/Employee/total-employees');
      setemployeecount(response.data.totalEmployees);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employee count:', err);
      setError('Failed to fetch employee count');
      setLoading(false);
    }
  };

  const fetchdepartmentcount = async () => {
    try {
      const response = await axios.get('https://localhost:7204/api/Department/total-departments');
      setdepartmentcount(response.data.totalDepartments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching department count:', err);
      setError('Failed to fetch department count');
      setLoading(false);
    }
  };

  const fetchLeaveCount = async () => {
    try {
      const response = await axios.get('https://localhost:7204/api/LeaveRequest/total-pending-leaves');
      setpaddingLeavecount(response.data.totalPendingLeaves);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leave count:', err);
      setError('Failed to fetch leave count');
      setLoading(false);
    }
  };



  // Sample data
  const employeeStats = [
    { name: "HR", employees: 5 },
    { name: "Development", employees: 12 },
    { name: "Sales", employees: 8 },
  ];

  const leaveStats = [
    { month: "Jan", leaves: 3 },
    { month: "Feb", leaves: 6 },
    { month: "Mar", leaves: 4 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const recentActivities = [
    { id: 1, name: "John Doe", activity: "Added Employee", time: "2 hours ago" },
    { id: 2, name: "Jane Smith", activity: "Approved Leave", time: "1 day ago" },
    { id: 3, name: "Michael Lee", activity: "Updated Department", time: "3 days ago" },
  ];

  return (
 <>
    <div className="dashboard-container">
      <div className="metrics-grid">
        <div className="metrics-scroll-container">
          <Card className="metric-card">
            <Card.Body className="metric-content">
              <div className="metric-header">
                <div className="metric-info">
                  <div className="metric-label">Total Employee</div>
                  <h3 className="metric-value">
                    {employeecount}
                  </h3>
                  <div className="metric-change">Active Employee</div>
                </div>
                <div className="metric-icon users-icon">
                  <FaUsers />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="metric-card">
            <Card.Body className="metric-content">
              <div className="metric-header">
                <div className="metric-info">
                  <div className="metric-label">Total Pending Leave</div>
                  <h3 className="metric-value">
                   {paddingLeavecount}
                  </h3>
                  <div className="metric-change">Pending Leave</div>
                </div>
                <div className="metric-icon workouts-icon">
                  <FaRegCalendarCheck />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="metric-card">
            <Card.Body className="metric-content">
              <div className="metric-header">
                <div className="metric-info">
                  <div className="metric-label">Total Department</div>
                  <h3 className="metric-value">
                   {departmentcount}
                  </h3>
                  <div className="metric-change">Department</div>
                </div>
                <div className="metric-icon meals-icon">
                  <FaBuilding />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="metric-card">
            <Card.Body className="metric-content">
              <div className="metric-header">
                <div className="metric-info">
                  <div className="metric-label">Total Categories</div>
                  <h3 className="metric-value">
                    {employeecount + departmentcount}
                  </h3>
                  <div className="metric-change">Total Categories</div>
                </div>
                <div className="metric-icon revenue-icon">
                  <FaClipboardList />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container fade-in">
        <div className="chart-card">
          <h4>Employees per Department</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={employeeStats}
                dataKey="employees"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {employeeStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Monthly Leaves</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leaveStats}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leaves" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activity-card fade-in">
        <h4>Recent Activities</h4>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Activity</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.map((item) => (
              <tr key={item.id} className="slide-in-left">
                <td>{item.name}</td>
                <td>
                  {item.activity.includes("Added") && <FaUserPlus style={{ marginRight: '6px', color: 'green' }} />}
                  {item.activity.includes("Approved") && <FaCheckCircle style={{ marginRight: '6px', color: 'blue' }} />}
                  {item.activity.includes("Updated") && <FaEdit style={{ marginRight: '6px', color: 'orange' }} />}
                  {item.activity}
                </td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
