import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(3);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🛡</div>
        <div>
          <div className="logo-text">CYBERSENTINEL</div>
          <div className="logo-sub">IDS PLATFORM</div>
        </div>
      </div>

      <div className="nav-section-label">Monitor</div>
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">⬡</span>
        Dashboard
        <span className="nav-badge" id="alert-badge">{alertCount}</span>
      </NavLink>
      <NavLink to="/traffic" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">◈</span>Traffic Monitor
      </NavLink>
      <NavLink to="/alerts" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">◉</span>Alerts &amp; Events
      </NavLink>
      <NavLink to="/threats" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">◎</span>Threat Intel
      </NavLink>

      <div className="nav-section-label">Management</div>
      <NavLink to="/policy" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">◧</span>Policy Manager
      </NavLink>
      <NavLink to="/ml-engine" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">◈</span>ML Engine
      </NavLink>
      <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">◫</span>Reports
      </NavLink>

      <div className="nav-section-label">System</div>
      {role === 'Admin' && (
        <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} id="users-nav">
          <span className="nav-icon">◐</span>Users &amp; RBAC
        </NavLink>
      )}
      <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">◑</span>Settings
      </NavLink>

      <div className="sidebar-footer">
        <div className="user-card" onClick={handleLogout} title="Logout">
          <div className="avatar" id="user-avatar">{user?.avatar || 'A'}</div>
          <div>
            <div className="user-name" id="user-name">{user?.name || 'Admin User'}</div>
            <div className="user-role" id="user-role">{role ? role.toUpperCase() : 'SYSTEM ADMIN'}</div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '16px', cursor: 'pointer', color: 'var(--text-3)' }}>
            ⏻
          </span>
        </div>
      </div>
    </nav>
  );
}
