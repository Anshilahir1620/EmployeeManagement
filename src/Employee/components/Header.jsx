export default function Header({ activeView, setActiveView, onOpenProfile, onLogout }) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">UD</span>
        <span className="brand-name">UserDisplay</span>
      </div>

      <nav className="top-nav">
        <button className={`nav-chip ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>Dashboard</button>
        <button className={`nav-chip ${activeView === 'leave' ? 'active' : ''}`} onClick={() => setActiveView('leave')}>Leave</button>
        <button className={`nav-chip ${activeView === 'holiday' ? 'active' : ''}`} onClick={() => setActiveView('holiday')}>Holiday</button>
      </nav>

      <div className="header-actions">
        <div className="search-box">
          <input placeholder="Search..." />
        </div>
        <button className="avatar small" onClick={onOpenProfile}>AJ</button>
        <button className="btn danger" onClick={onLogout}>Logout</button>
      </div>
    </header>
  )
}




