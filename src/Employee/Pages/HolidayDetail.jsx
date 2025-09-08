 import { useMemo } from 'react'

export default function HolidayDetail() {
  const holidays = useMemo(
    () => [
      { id: 1, name: 'Diwali', date: '31 Oct 2025', day: 'Friday' },
      { id: 2, name: 'Christmas', date: '25 Dec 2025', day: 'Thursday' },
      { id: 3, name: 'New Year', date: '01 Jan 2026', day: 'Thursday' },
    ],
    []
  )
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Holiday Detail</h2>
        <button className="btn ghost">Add Reminder</button>
      </div>
      <div className="grid">
        {holidays.map((h) => (
          <div key={h.id} className="card">
            <div className="card-title">{h.name}</div>
            <div className="card-subtitle">{h.date}</div>
            <div className="card-meta">{h.day}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


        