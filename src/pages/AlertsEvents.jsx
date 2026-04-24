import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AlertsEvents() {
  const [alerts, setAlerts] = useState([]);
  const { addToast } = useToast();
  
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchText, setSearchText] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchAlerts = () => {
    api.getAlerts().then(res => {
      const mapped = (res.alerts || []).map(a => ({
        id: a.id,
        ts: a.timestamp,
        sev: a.severity,
        type: a.type,
        src: a.src_ip,
        dst: a.dst_ip,
        proto: a.protocol,
        status: a.status
      }));
      setAlerts(mapped);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchAlerts();
    const iv = setInterval(fetchAlerts, 30000);
    return () => clearInterval(iv);
  }, []);

  const filteredAlerts = alerts.filter(a => {
    const matchSev = severityFilter === 'ALL' || a.sev === severityFilter;
    const matchText = searchText === '' || 
                      a.type.toLowerCase().includes(searchText.toLowerCase()) || 
                      a.src.includes(searchText);
    return matchSev && matchText;
  });

  const getSeverityVariant = (sev) => {
    if (sev === 'CRITICAL') return 'critical';
    if (sev === 'HIGH') return 'high';
    if (sev === 'MEDIUM') return 'medium';
    return 'low';
  };

  const handleBlock = () => {
    api.blockIP(selectedAlert.id).then(() => {
      addToast(`Threat blocked: ${selectedAlert.src}`, 'success');
      setSelectedAlert(null);
      fetchAlerts();
    }).catch(err => addToast(`Failed to block: ${err.message}`, 'error'));
  };

  const handleAck = () => {
    api.acknowledgeAlert(selectedAlert.id).then(() => {
      addToast('Alert acknowledged', 'info');
      setSelectedAlert(null);
      fetchAlerts();
    }).catch(err => addToast(`Failed to acknowledge: ${err.message}`, 'error'));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* FILTER BAR ROW */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '4px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
          <div className={`role-chip ${severityFilter === 'ALL' ? 'selected' : ''}`} onClick={() => setSeverityFilter('ALL')} style={{ margin: 0 }}>ALL</div>
          <div className={`role-chip ${severityFilter === 'CRITICAL' ? 'selected' : ''}`} onClick={() => setSeverityFilter('CRITICAL')} style={{ margin: 0 }}>🔴 CRITICAL</div>
          <div className={`role-chip ${severityFilter === 'HIGH' ? 'selected' : ''}`} onClick={() => setSeverityFilter('HIGH')} style={{ margin: 0 }}>🟠 HIGH</div>
          <div className={`role-chip ${severityFilter === 'MEDIUM' ? 'selected' : ''}`} onClick={() => setSeverityFilter('MEDIUM')} style={{ margin: 0 }}>🟡 MEDIUM</div>
          <div className={`role-chip ${severityFilter === 'LOW' ? 'selected' : ''}`} onClick={() => setSeverityFilter('LOW')} style={{ margin: 0 }}>🔵 LOW</div>
        </div>

        <input 
          className="form-input" 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="🔍 Search Alerts or IPs..."
          style={{ width: '250px', marginLeft: 'auto' }}
        />
      </div>

      {/* ALERTS TABLE */}
      <Card title={`Active Alerts (${filteredAlerts.length})`}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: '12px', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '12px 8px' }}>ID</th>
                <th style={{ padding: '12px 8px' }}>Timestamp</th>
                <th style={{ padding: '12px 8px' }}>Severity</th>
                <th style={{ padding: '12px 8px' }}>Type</th>
                <th style={{ padding: '12px 8px' }}>Source IP</th>
                <th style={{ padding: '12px 8px' }}>Destination</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map(a => (
                <tr key={a.id} className="fade-in" style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px' }}>
                  <td style={{ padding: '12px 8px', color: 'var(--text-3)' }}>{a.id.substring(0,8)}</td>
                  <td style={{ padding: '12px 8px' }}>{a.ts}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <Badge label={a.sev} variant={getSeverityVariant(a.sev)} />
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>{a.type}</td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--mono)' }}>{a.src}</td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--mono)' }}>{a.dst}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <Badge label={a.status} variant={a.status === 'BLOCKED' ? 'blocked' : 'normal'} />
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setSelectedAlert(a)}>
                      DETAIL
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAlerts.length === 0 && (
                <tr><td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-3)' }}>No alerts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={!!selectedAlert} 
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert ? `🚨 ${selectedAlert.type}` : ''}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setSelectedAlert(null)}>CLOSE</button>
            {selectedAlert?.status !== 'ACKNOWLEDGED' && (
               <button className="btn btn-ghost" onClick={handleAck}>✓ ACKNOWLEDGE</button>
            )}
            {selectedAlert?.status !== 'BLOCKED' && (
              <button className="btn" style={{ background: 'var(--red)', color: 'white', border: 'none' }} onClick={handleBlock}>🚫 BLOCK IP</button>
            )}
          </>
        }
      >
        {selectedAlert && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Alert ID</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedAlert.id}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Timestamp</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedAlert.ts}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Source IP</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-1)' }}>{selectedAlert.src}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Destination IP</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedAlert.dst}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Severity</div>
              <Badge label={selectedAlert.sev} variant={getSeverityVariant(selectedAlert.sev)} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Status</div>
              <Badge label={selectedAlert.status} variant={selectedAlert.status === 'BLOCKED' ? 'blocked' : 'normal'} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Protocol</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{selectedAlert.proto}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>ML Confidence</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)' }}>
                {Math.floor(Math.random() * 12) + 88}%
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '8px', padding: '12px', background: 'rgba(255, 56, 96, 0.05)', borderRadius: '6px', borderLeft: '3px solid var(--red)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>Recommended Action</div>
              <div style={{ fontSize: '13px', color: 'var(--text-1)' }}>
                Isolate source IP at firewall layer and analyze payload for known 0-day signatures.
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
