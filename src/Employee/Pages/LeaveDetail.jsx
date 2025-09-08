import { useMemo } from 'react'

export default function LeaveDetail() {
  const leaves = useMemo(
    () => [
      { id: 1, type: 'Casual Leave', dates: '12 Oct 2025', status: 'Approved' },
      { id: 2, type: 'Sick Leave', dates: '18-19 Oct 2025', status: 'Pending' },
      { id: 3, type: 'Earned Leave', dates: '02 Nov 2025', status: 'Rejected' },
    ],
    []
  )
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Leave Detail</h2>
        <button className="btn primary">Request Leave</button>
      </div>
      <div className="table">
        <div className="table-row head">
          <div>Type</div>
          <div>Dates</div>
          <div>Status</div>
        </div>
        {leaves.map((l) => (
          <div key={l.id} className="table-row">
            <div>{l.type}</div>
            <div>{l.dates}</div>
            <div>
              <span className={`badge ${l.status.toLowerCase()}`}>{l.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


