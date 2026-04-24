import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LayoutDashboard, Activity, AlertCircle, ShieldAlert, Settings, Users } from 'lucide-react';

const Sidebar = () => {
  return (
    <nav style={{
      width: '240px',
      height: '100vh',
      backgroundColor: 'var(--bg-panel)',
      borderRight: '1px solid var(--border)',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', borderRadius: '10px', display: 'grid', placeItems: 'center', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
          <Shield size={20} color="var(--bg-deep)" fill="var(--accent)" />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '1px', color: 'var(--text-1)', textTransform: 'uppercase' }}>CyberSentinel</div>
          <div style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--mono)', letterSpacing: '2px' }}>IDS PLATFORM</div>
        </div>
      </div>

      <div style={{ padding: '24px 24px 8px', fontSize: '10px', color: 'var(--text-3)', letterSpacing: '2px', fontFamily: 'var(--mono)' }}>MONITOR</div>
      <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
      <NavItem icon={<Activity size={18}/>} label="Traffic Monitor" />
      <NavItem icon={<AlertCircle size={18}/>} label="Alerts & Events" badge="3" />
      <NavItem icon={<ShieldAlert size={18}/>} label="Threat Intel" />

      <div style={{ padding: '24px 24px 8px', fontSize: '10px', color: 'var(--text-3)', letterSpacing: '2px', fontFamily: 'var(--mono)' }}>SYSTEM</div>
      <NavItem icon={<Users size={18}/>} label="Users & RBAC" />
      <NavItem icon={<Settings size={18}/>} label="Settings" />

      <div style={{ marginTop: 'auto', padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s', fontWeight: '500' }}>
          ← Back to Site
        </Link>
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label, active, badge }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    cursor: 'pointer',
    color: active ? 'var(--text-1)' : 'var(--text-2)',
    backgroundColor: active ? 'var(--bg-hover)' : 'transparent',
    borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
    transition: 'all 0.2s',
    fontWeight: '500',
    fontSize: '14px'
  }}>
    <span style={{ color: active ? 'var(--accent)' : 'inherit' }}>{icon}</span>
    {label}
    {badge && <span style={{ marginLeft: 'auto', background: 'var(--red)', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: '700', fontFamily: 'var(--mono)' }}>{badge}</span>}
  </div>
);

export default Sidebar;
