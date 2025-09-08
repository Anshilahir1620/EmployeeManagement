import { useMemo } from 'react'

export default function UserDashboard() {
  const stats = useMemo(
    () => ({
      pendingLeaves: 5,
      reimbursement: 2,
      critical: 1,
      profileEdits: 3,
      attendancePercent: 92,
    }),
    []
  )

  const quickItems = useMemo(
    () => [
      { id: 1, title: 'Today Present', value: 270, subtitle: 'Employees Currently In' },
      { id: 2, title: 'On Leave', value: 12, subtitle: 'Approved Today' },
      { id: 3, title: 'Late Arrivals', value: 7, subtitle: 'Last 24h' },
      { id: 4, title: 'New Joiners', value: 4, subtitle: 'This Month' },
    ],
    []
  )

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Dashboard</h2>
        <div className="hint-muted">Overview</div>
      </div>

      <div className="grid">
        <div className="card accent">
          <div className="card-title">Sick Leave</div>
          <div className="big-num">{stats.pendingLeaves}</div>
          <div className="card-meta">Pending approvals</div>
        </div>
        <div className="card">
          <div className="card-title">Reimbursement requests</div>
          <div className="big-num">{stats.reimbursement}</div>
          <div className="card-meta">Awaiting action</div>
        </div>
        <div className="card">
          <div className="card-title">Critical</div>
          <div className="big-num">{stats.critical}</div>
          <div className="card-meta">Requires attention</div>
        </div>
        <div className="card">
          <div className="card-title">Profile edits</div>
          <div className="big-num">{stats.profileEdits}</div>
          <div className="card-meta">Waiting review</div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card" style={{ display: 'grid', placeItems: 'center', padding: 20 }}>
          <div className="progress-ring" style={{ ['--value']: `${stats.attendancePercent}` }}>
            <span>{stats.attendancePercent}%</span>
          </div>
          <div className="card-meta" style={{ marginTop: 8 }}>Attendance</div>
        </div>
        {quickItems.map((q) => (
          <div key={q.id} className="card">
            <div className="card-title">{q.title}</div>
            <div className="big-num">{q.value}</div>
            <div className="card-meta">{q.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


