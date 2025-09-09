// LeaveDashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Calendar, Umbrella, Coffee, Users } from "lucide-react";
import "../Admin/assets/css/LeaveDashboard.css"; // custom CSS file

const leaveBalance = [
  { type: "Sick Leaves", used: 5, total: 10, icon: <Calendar size={28} color="#7C3AED" /> },
  { type: "Vacation", used: 3, total: 10, icon: <Umbrella size={28} color="#2563EB" /> },
  { type: "Casual Leaves", used: 6, total: 10, icon: <Coffee size={28} color="#EA580C" /> },
  { type: "Maternity/Paternity", used: 2, total: 10, icon: <Users size={28} color="#DB2777" /> },
];

const leaveHistory = [
  { type: "Sick", dates: "Apr 25", reason: "Flu recovery", submitted: "Apr 25", status: "Pending", assigned: "N/A" },
  { type: "Casual", dates: "Apr 15 - Apr 18", reason: "Home shifting", submitted: "Apr 07", status: "Approved", assigned: "Sarah M." },
  { type: "Vacation", dates: "Mar 30", reason: "Going out station", submitted: "Mar 29", status: "Pending", assigned: "N/A" },
  { type: "Sick", dates: "Mar 02", reason: "Fever recovery", submitted: "Mar 02", status: "Rejected", assigned: "Danish Ali" },
  { type: "Casual", dates: "Feb 15 - Feb 20", reason: "Friends meetup", submitted: "Feb 13", status: "Pending", assigned: "N/A" },
  { type: "Paternity", dates: "Feb 11", reason: "Family Issues", submitted: "Feb 10", status: "Approved", assigned: "Ali Zubairi" },
  { type: "Casual", dates: "Feb 02", reason: "Family outing", submitted: "Feb 01", status: "Rejected", assigned: "Ali Zubairi" },
  { type: "Sick", dates: "Jan 29", reason: "Asthma", submitted: "Jan 29", status: "Approved", assigned: "Ali Zubairi" },
  { type: "Vacation", dates: "Jan 01", reason: "New year eve", submitted: "Jan 01", status: "Approved", assigned: "Ali Zubairi" },
];

const LeaveDashboard = () => {
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <h1>Leave Balance</h1>
        <button className="apply-btn">Apply Leave</button>
      </div>

      {/* Leave Balance Cards */}
      <div className="cards">
        {leaveBalance.map((leave, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="card"
          >
            <div className="icon">{leave.icon}</div>
            <h2>{leave.type}</h2>
            <p>{leave.used} / {leave.total} Days Used</p>
          </motion.div>
        ))}
      </div>

      {/* Leave Request History */}
      <div className="history">
        <h2>Leave Request History</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>StartDate</th>
                <th>EndDate</th>
                <th>Remark</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>ApproveBy</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave, i) => (
                <tr key={i}>
                  <td>{leave.type}</td>
                  <td>{leave.dates}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.submitted}</td>
                  <td>
                    <span className={`status ${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>{leave.assigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;
