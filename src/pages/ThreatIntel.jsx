import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ThreatIntel() {
  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      { label: 'DoS / DDoS', data: [120, 180, 250, 140, 190, 80, 60], backgroundColor: 'rgba(255,56,96,.8)' },
      { label: 'Probe / Scan', data: [90, 110, 80, 130, 150, 50, 40], backgroundColor: 'rgba(255,140,66,.8)' },
      { label: 'R2L Access', data: [30, 40, 20, 50, 60, 20, 10], backgroundColor: 'rgba(156,110,255,.8)' },
      { label: 'U2R Exploit', data: [10, 5, 15, 8, 12, 4, 2], backgroundColor: 'rgba(255,214,0,.8)' },
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#8899bb', font: { family: "'Space Mono', monospace" } } }
    },
    scales: {
      x: { stacked: true, ticks: { color: '#4a5878' }, grid: { display: false } },
      y: { stacked: true, ticks: { color: '#4a5878' }, grid: { color: 'rgba(30,42,69,.6)' } }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Card title="Attack Signatures by Volume (7 Days)">
        <div className="chart-wrap tall">
          <Bar data={data} options={options} />
        </div>
      </Card>

      <div className="grid-2">
        <Card title="Top Attacker IPs">
           <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: '12px', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '12px 8px' }}>IP Address</th>
                <th style={{ padding: '12px 8px' }}>Country</th>
                <th style={{ padding: '12px 8px' }}>Attacks</th>
                <th style={{ padding: '12px 8px' }}>Severity</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                {ip: '45.33.32.156', cty: 'RU', v: '8,432', sev: 'CRITICAL', st: 'BLOCKED'},
                {ip: '203.0.113.14', cty: 'CN', v: '5,129', sev: 'HIGH', st: 'BLOCKED'},
                {ip: '198.51.100.7', cty: 'KP', v: '3,844', sev: 'HIGH', st: 'BLOCKED'},
                {ip: '192.0.2.100', cty: 'IR', v: '1,930', sev: 'MEDIUM', st: 'MONITORING'},
                {ip: '10.0.2.55', cty: 'UNKNOWN', v: '542', sev: 'LOW', st: 'MONITORING'}
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px' }}>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--mono)', color: 'var(--text-1)' }}>{row.ip}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-3)' }}>{row.cty}</td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--mono)' }}>{row.v}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <Badge label={row.sev} variant={row.sev === 'CRITICAL' ? 'critical' : row.sev === 'HIGH' ? 'high' : row.sev === 'MEDIUM' ? 'medium' : 'low'} />
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <Badge label={row.st} variant={row.st === 'BLOCKED' ? 'blocked' : 'normal'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Attack Timeline (Last 24h)">
          <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { time: "14:32:01", title: "SYN Flood Detected (Target: Core API)", body: "Automated mitigation engaged. Edge router dropped 45k PPS from matching signatures." },
              { time: "11:15:44", title: "ML Heuristic Trigger", body: "Suspicious lateral movement detected on internal subnet (10.0.4.x). Machine learning model scored 92% anomaly." },
              { time: "09:05:12", title: "Known Threat Actor IP Blocked", body: "Ingress connection attempt from flagged C2 server matched global threat intel list." },
              { time: "04:12:00", title: "Database Port Scan", body: "Sequential port scan detected aiming at Redis/Postgres ports. Source IP throttled and logged." },
              { time: "01:45:33", title: "Failed SSH Brute Force", body: "40 failed login attempts to root within 60 seconds. IP blacklisted for 24 hours." }
            ].map((t, i) => (
              <div key={i} className="timeline-item" style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border-light)' }}>
                <div style={{ position: 'absolute', left: '-6px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg-card)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ color: 'var(--accent)', fontWeight: 500, fontSize: '13px' }}>{t.title}</div>
                  <div style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: '11px' }}>{t.time}</div>
                </div>
                <div style={{ color: 'var(--text-2)', fontSize: '12px', lineHeight: 1.5 }}>
                  {t.body}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
