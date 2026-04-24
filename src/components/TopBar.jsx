import React from 'react';
import { Bell, Maximize, RefreshCw } from 'lucide-react';

const TopBar = () => {
  return (
    <div style={{
      height: '80px',
      backgroundColor: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-1)' }}>Overview Dashboard</h2>
        <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--mono)', marginTop: '4px' }}>System status: Optimal · Last updated: Just now</div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--green-dim)', border: '1px solid rgba(0, 230, 118, 0.3)', padding: '6px 14px', borderRadius: '20px', color: 'var(--green)', fontSize: '11px', fontFamily: 'var(--mono)', fontWeight: '600' }}>
          <div className="pulse-dot" style={{ width: '8px', height: '8px', backgroundColor: 'var(--green)', borderRadius: '50%', boxShadow: '0 0 10px var(--green)', animation: 'pulse 2s infinite' }}></div>
          MONITORING ACTIVE
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="icon-btn" style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.2s' }}>
            <RefreshCw size={18} />
          </button>
          <button className="icon-btn" style={{ width: '40px', height: '40px', display: 'grid', placeItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Bell size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
