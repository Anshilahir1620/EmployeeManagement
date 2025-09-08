export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="sidebar">
      <nav className="nav">
        <button
          className={`nav-item ${activeView === 'leave' ? 'active' : ''}`}
          onClick={() => setActiveView('leave')}
        >
          Leave Detail
        </button>
        <button
          className={`nav-item ${activeView === 'holiday' ? 'active' : ''}`}
          onClick={() => setActiveView('holiday')}
        >
          Holiday Detail
        </button>
      </nav>
    </aside>
  )
}




