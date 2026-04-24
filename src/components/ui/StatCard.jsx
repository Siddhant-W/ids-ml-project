import React from 'react';

export default function StatCard({ label, value, change, changePositive, icon, colorClass, sparkData }) {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="scan-line"></div>
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${colorClass}`}>{value}</div>
      <div className="stat-change">
        <span className={changePositive ? 'up' : ''}>{change}</span>
      </div>
      <div className="stat-icon">{icon}</div>
      {sparkData && (
        <div className="sparkline" style={{ marginTop: '10px' }}>
          {sparkData.map((h, i) => (
            <div 
              key={i} 
              className="spark-bar" 
              style={{
                // Normalize height between ~8px and ~30px for visual realism
                height: `${8 + (h / Math.max(...sparkData)) * 22}px`, 
                background: `var(--${colorClass})`, 
                opacity: 0.7 
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
