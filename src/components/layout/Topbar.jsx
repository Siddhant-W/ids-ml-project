import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title }) {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const timeString = time.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const formattedTime = timeString.replace(',', '').replace(',', ' ·');

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title" id="page-title">{title}</div>
        <div className="topbar-sub" id="page-time">{formattedTime}</div>
      </div>
      <div className="topbar-controls">
        <div className="status-indicator">
          <div className="pulse"></div>
          MONITORING ACTIVE
        </div>
        <div className="icon-btn" title="Refresh" onClick={() => window.location.reload()}>↻</div>
        <div className="icon-btn" title="Notifications" onClick={() => navigate('/alerts')}>🔔</div>
        <div className="icon-btn" title="Full screen" onClick={() => document.documentElement.requestFullscreen()}>⛶</div>
      </div>
    </div>
  );
}
