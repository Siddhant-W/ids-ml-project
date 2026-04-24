import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import TrafficChart from '../components/charts/TrafficChart';
import AttackPieChart from '../components/charts/AttackPieChart';
import HourlyChart from '../components/charts/HourlyChart';
import ProtocolChart from '../components/charts/ProtocolChart';
import { api } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import { generateSparkData } from '../utils/dataGenerators';

export default function Dashboard() {
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState({ threats: 0, detectionRate: 0, falsePositives: 0, packetsPerSec: 0 });
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    api.getTrafficStats().then(raw => setLiveStats({
      threats: raw.malicious_count || 0,
      detectionRate: 98.7,
      falsePositives: 2.1,
      packetsPerSec: raw.packets_per_second ? (raw.packets_per_second / 1000).toFixed(1) + 'K' : '0'
    })).catch(() => {});
    const iv = setInterval(() => 
      api.getTrafficStats().then(raw => setLiveStats({
        threats: raw.malicious_count || 0,
        detectionRate: Number((98.0 + Math.random()).toFixed(1)),
        falsePositives: Number((1.5 + Math.random()).toFixed(1)),
        packetsPerSec: raw.packets_per_second ? (raw.packets_per_second / 1000).toFixed(1) + 'K' : '0'
      })).catch(() => {}), 5000);
    return () => clearInterval(iv);
  }, []);
  
  useWebSocket("/ws/alerts", (alert) => {
    // Map backend fields to frontend fields
    const mapped = {
      id: alert.id,
      ts: alert.timestamp,
      sev: alert.severity,
      type: alert.type,
      src: alert.src_ip,
      dst: alert.dst_ip,
      proto: alert.protocol,
      status: alert.status
    };
    setAlerts(prev => [mapped, ...prev].slice(0, 100));
    setAlertCount(prev => prev + (alert.severity==="CRITICAL" ? 1 : 0));
  });

  const stats = liveStats;

  const [displayedAlerts, setDisplayedAlerts] = useState([]);

  useEffect(() => {
    // Only map the last 4 alerts
    setDisplayedAlerts(alerts.slice(0, 4));
  }, [alerts]);

  const handleExport = () => {
    // Fake CSV generation
    const csv = 'Timestamp,Source IP,Dest IP,Protocol,Classification\n' +
      alerts.slice(0, 100).map(a => `${a.ts},${a.src},${a.dst},${a.proto},${a.type}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cybersentinel-traffic.csv';
    link.click();
  };

  const sparkThreats = useMemo(() => generateSparkData(10, 30), []);
  const sparkRate = useMemo(() => generateSparkData(10, 30), []);
  const sparkFp = useMemo(() => generateSparkData(10, 30), []);
  const sparkPps = useMemo(() => generateSparkData(10, 30), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* SECTION 1 */}
      <div className="grid-4 section-gap">
        <StatCard 
          label="Active Threats" 
          value={stats.threats}
          change="↑ +6 from last hour"
          changePositive={false}
          icon="⚠"
          colorClass="red"
          sparkData={sparkThreats}
        />
        <StatCard 
          label="Detection Rate" 
          value={stats.detectionRate + "%"}
          change="↑ +0.3% vs yesterday" 
          changePositive={true}
          icon="✓" 
          colorClass="green" 
          sparkData={sparkRate} 
        />
        <StatCard 
          label="False Positives" 
          value={stats.falsePositives + "%"}
          change="↓ -0.4% improvement" 
          changePositive={true}
          icon="◈" 
          colorClass="orange" 
          sparkData={sparkFp} 
        />
        <StatCard 
          label="Packets/sec" 
          value={stats.packetsPerSec}
          change="↑ +2K current load" 
          changePositive={true}
          icon="≋" 
          colorClass="accent" 
          sparkData={sparkPps} 
        />
      </div>

      {/* SECTION 2 */}
      <div className="grid-2-1 section-gap">
        <Card title="Network Traffic — Malicious vs Normal" actionLabel="EXPORT ↗" action={handleExport}>
          <div className="chart-wrap tall">
            <TrafficChart />
          </div>
        </Card>
        
        <Card title="Attack Distribution">
          <div className="chart-wrap donut" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AttackPieChart />
          </div>
          <div style={{ marginTop: '12px' }}>
            {/* Attack legend rows */}
            {[
              { name: 'DoS / DDoS', count: '1,247', pct: '41%', color: 'var(--red)' },
              { name: 'Probe / Scan', count: '863', pct: '28%', color: 'var(--orange)' },
              { name: 'R2L Attack', count: '521', pct: '17%', color: 'var(--purple)' },
              { name: 'U2R Attack', count: '432', pct: '14%', color: 'var(--yellow)' },
            ].map((row, i) => (
              <div key={i} className="attack-row">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.color, flexShrink: 0 }}></div>
                <div className="attack-name">{row.name}</div>
                <div className="attack-count">{row.count}</div>
                <div className="attack-pct">{row.pct}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* SECTION 3 */}
      <div className="grid-3 section-gap">
        <Card title="Live Alerts" actionLabel="VIEW ALL" action={() => navigate('/alerts')}>
          <div id="live-alerts-feed">
            {displayedAlerts.map(alert => {
              const colors = { CRITICAL: 'var(--red)', HIGH: 'var(--orange)', MEDIUM: 'var(--yellow)', LOW: 'var(--accent)' };
              return (
                <div key={alert.id} className="alert-item fade-up">
                  <div className="alert-dot" style={{ background: colors[alert.sev] || 'var(--accent)' }}></div>
                  <div className="alert-body">
                    <div className="alert-title">{alert.type}</div>
                    <div className="alert-meta">SRC: {alert.src}</div>
                  </div>
                  <div className="alert-time">just now</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Threat Level">
          <div className="threat-dial">
            {/* SVG copied exactly from template */}
            <svg className="dial-svg" viewBox="0 0 140 80">
              <defs>
                <linearGradient id="dialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e676"/>
                  <stop offset="50%" stopColor="#ffd600"/>
                  <stop offset="100%" stopColor="#ff3860"/>
                </linearGradient>
              </defs>
              <path d="M15,70 A55,55 0 0,1 125,70" fill="none" stroke="#1e2a45" strokeWidth="10" strokeLinecap="round"/>
              <path d="M15,70 A55,55 0 0,1 125,70" fill="none" stroke="url(#dialGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray="172" strokeDashoffset="50" opacity=".8"/>
              <line id="dial-needle" x1="70" y1="70" x2="30" y2="20" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="70" cy="70" r="5" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="2"/>
            </svg>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--orange)', fontFamily: 'var(--mono)' }}>HIGH</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', marginTop: '2px' }}>Threat Index: 7.2/10</div>
            </div>
          </div>
          <hr className="divider" />
          <div className="geo-map" style={{ marginTop: '4px' }}>
            <div className="scan-line"></div>
            <div className="geo-dot" style={{ color: 'var(--red)', top: '30%', left: '20%' }}></div>
            <div className="geo-dot" style={{ color: 'var(--orange)', top: '45%', left: '65%', animationDelay: '.6s' }}></div>
            <div className="geo-dot" style={{ color: 'var(--red)', top: '55%', left: '80%', animationDelay: '1.2s' }}></div>
            <div className="geo-dot" style={{ color: 'var(--yellow)', top: '25%', left: '45%', animationDelay: '.3s' }}></div>
            <div className="geo-label">ATTACK ORIGIN MAP</div>
          </div>
        </Card>

        <Card title="ML Model Performance">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Accuracy', pct: '98.7%', color: 'var(--green)' },
              { label: 'Precision', pct: '96.3%', color: 'var(--accent)' },
              { label: 'Recall', pct: '97.1%', color: 'var(--accent-2)' },
              { label: 'F1-Score', pct: '96.7%', color: 'var(--purple)' },
              { label: 'False Positives', pct: '2.1%', color: 'var(--orange)' }
            ].map((perf, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text-2)', marginBottom: '4px' }}>
                  <span>{perf.label}</span>
                  <span style={{ color: perf.color }}>{perf.pct}</span>
                </div>
                <div className="progress-bar" style={{ marginTop: 0, height: '4px' }}>
                  <div className="progress-fill" style={{ width: perf.pct, background: perf.color }}></div>
                </div>
              </div>
            ))}
          </div>
          <hr className="divider" />
          <div style={{ fontSize: '10px', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
            Model: Random Forest · Dataset: NSL-KDD
          </div>
        </Card>
      </div>

      {/* SECTION 4 */}
      <div className="grid-2">
        <Card title="Hourly Attack Volume">
          <div className="chart-wrap tall">
            <HourlyChart />
          </div>
        </Card>
        <Card title="Protocol Distribution">
          <div className="chart-wrap tall">
            <ProtocolChart />
          </div>
        </Card>
      </div>
    </div>
  );
}
