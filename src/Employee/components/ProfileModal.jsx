export default function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="avatar">{user.initials}</div>
          <div>
            <div className="modal-title">{user.name}</div>
            <div className="modal-subtitle">{user.email}</div>
          </div>
          <button className="btn ghost sm" onClick={onClose}>Close</button>
        </div>
        <div className="modal-content">
          <div className="detail-row"><span>Role</span><span>{user.role}</span></div>
          <div className="detail-row"><span>Employee ID</span><span>{user.employeeId}</span></div>
          <div className="detail-row"><span>Department</span><span>{user.department}</span></div>
          <div className="detail-row"><span>Location</span><span>{user.location}</span></div>
        </div>
      </div>
    </div>
  )
}


