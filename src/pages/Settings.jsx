import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { addToast } = useToast();
  const [integrations, setIntegrations] = useState([
    { id: 'syslog', name: 'Syslog Export', enabled: true },
    { id: 'splunk', name: 'Splunk Forwarder', enabled: false },
    { id: 'smtp', name: 'Email SMTP', enabled: true },
    { id: 'slack', name: 'Slack Webhooks', enabled: true },
    { id: 'pd', name: 'PagerDuty', enabled: false },
    { id: 'api', name: 'REST API Endpoint', enabled: true },
  ]);

  const [settingsForm, setSettingsForm] = useState({
    interface: 'eth0',
    captureMode: 'PROMISCUOUS',
    email: 'soc@cybersentinel.local',
    retention: 90,
    threshold: 85
  });

  const handleSave = () => {
    addToast('System settings saved successfully', 'success');
  };

  const toggleInt = (id) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="grid-2">
        <Card title="System Configuration">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="login-field">
              <label className="login-label">Network Interface</label>
              <input className="form-input" value={settingsForm.interface} onChange={e=>setSettingsForm({...settingsForm, interface: e.target.value})} />
            </div>
            
            <div className="login-field">
              <label className="login-label">Capture Mode</label>
              <select className="form-input" value={settingsForm.captureMode} onChange={e=>setSettingsForm({...settingsForm, captureMode: e.target.value})}>
                <option value="PROMISCUOUS">Promiscuous (All Traffic)</option>
                <option value="DIRECT">Direct (Host Only)</option>
                <option value="INLINE">Inline IPS</option>
              </select>
            </div>

            <div className="login-field">
              <label className="login-label">Alert Notification Email</label>
              <input type="email" className="form-input" value={settingsForm.email} onChange={e=>setSettingsForm({...settingsForm, email: e.target.value})} />
            </div>

            <div className="login-field">
              <label className="login-label">Data Retention (Days)</label>
              <input type="number" className="form-input" value={settingsForm.retention} onChange={e=>setSettingsForm({...settingsForm, retention: e.target.value})} />
            </div>

            <div className="login-field">
              <label className="login-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>ML Anomaly Threshold</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{settingsForm.threshold}%</span>
              </label>
              <input 
                type="range" min="50" max="99" 
                value={settingsForm.threshold} 
                onChange={(e) => setSettingsForm({...settingsForm, threshold: e.target.value})}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
            </div>

            <div style={{ marginTop: '12px' }}>
              <button className="btn btn-primary" onClick={handleSave}>💾 SAVE SETTINGS</button>
            </div>
          </div>
        </Card>

        <Card title="External Integrations">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {integrations.map(int => (
              <div key={int.id} className="policy-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div 
                    className={`policy-toggle ${int.enabled ? 'on' : ''}`} 
                    onClick={() => toggleInt(int.id)}
                    style={{ 
                      width: '36px', height: '20px', borderRadius: '10px', 
                      background: int.enabled ? 'var(--green)' : 'var(--bg-lighter)',
                      position: 'relative', cursor: 'pointer', transition: '0.3s'
                    }}
                  >
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: '2px', left: int.enabled ? '18px' : '2px',
                      transition: '0.3s'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500 }}>{int.name}</div>
                </div>
                <div style={{ fontSize: '11px', color: int.enabled ? 'var(--green)' : 'var(--text-3)' }}>
                  {int.enabled ? 'CONNECTED' : 'DISCONNECTED'}
                </div>
              </div>
            ))}

            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,212,255,0.05)', border: '1px dashed var(--accent)', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '8px', fontWeight: 500 }}>CyberSentinel Master API Key</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1, fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-3)', padding: '8px', background: 'black', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                  sk_live_9f8a84b3d2e1c0x...
                </div>
                <button className="btn btn-ghost" style={{ padding: '8px 12px' }} onClick={() => addToast('API Key copied to clipboard', 'info')}>COPY</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
