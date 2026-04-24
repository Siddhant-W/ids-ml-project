import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { api } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PolicyManager() {
  const { role } = useAuth();
  const { addToast } = useToast();
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    api.getPolicies().then(res => setPolicies(res.policies)).catch(console.error);
  }, []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [simForm, setSimForm] = useState({ ip: "", protocol: "TCP", rate: "" });

  const [newRule, setNewRule] = useState({ name: '', type: 'FIREWALL', severity: 'MEDIUM', condition: '', action: 'BLOCK' });

  const isViewer = role === 'Viewer';

  const togglePolicy = (id) => {
    if (isViewer) return;
    api.togglePolicy(id).then(updated => {
      addToast(`Policy "${updated.name}" ${updated.enabled ? 'enabled' : 'disabled'}`, 'info');
      setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: updated.enabled } : p));
    }).catch(err => addToast(`Failed to toggle policy: ${err.message}`, 'error'));
  };

  const handleSimulate = () => {
    const rate = parseInt(simForm.rate, 10) || 0;
    api.simulateRule({
      ip: simForm.ip || "192.168.1.100",
      protocol: simForm.protocol,
      pps: rate
    }).then(res => setSimResult({
      hit: res.matched,
      ip: simForm.ip || "192.168.1.100",
      rule: res.rule
    })).catch(err => addToast(`Simulation error: ${err.message}`, 'error'));
  };

  const handleAddRule = () => {
    const ruleData = {
      name: newRule.name || 'Custom Rule',
      type: newRule.type,
      severity: newRule.severity,
      condition: newRule.condition,
      action: newRule.action
    };
    api.createPolicy(ruleData).then(created => {
      setPolicies(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      addToast('New policy rule created successfully', 'success');
      setNewRule({ name: '', type: 'FIREWALL', severity: 'MEDIUM', condition: '', action: 'BLOCK' });
    }).catch(err => addToast(`Failed to create policy: ${err.message}`, 'error'));
  };

  const activeCount = policies.filter(p => p.enabled).length;
  const disabledCount = policies.length - activeCount;

  const counts = { FIREWALL:0, IDS:0, IPS:0, MONITOR:0, WAF:0, ML:0 };
  policies.forEach(p => { if(counts[p.type] !== undefined) counts[p.type]++; });
  
  const chartData = {
    labels: ['FIREWALL', 'IDS', 'IPS', 'WAF', 'ML', 'MONITOR'],
    datasets: [{
      data: [counts.FIREWALL, counts.IDS, counts.IPS, counts.WAF, counts.ML, counts.MONITOR],
      backgroundColor: ['#ff3860', '#ff8c42', '#9c6eff', '#00e676', '#00d4ff', '#8899bb'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="grid-1-2">
        <Card 
          title="Security Policies" 
          actionLabel={isViewer ? null : "+ ADD RULE"}
          action={() => {
            if (isViewer) addToast("Viewers cannot create policies", "error");
            else setIsAddModalOpen(true);
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {policies.map(p => (
              <div key={p.id} className="policy-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div 
                    className={`policy-toggle ${p.enabled ? 'on' : ''}`} 
                    onClick={() => togglePolicy(p.id)}
                    style={{ 
                      width: '36px', height: '20px', borderRadius: '10px', 
                      background: p.enabled ? 'var(--accent)' : 'var(--bg-lighter)',
                      position: 'relative', cursor: isViewer ? 'not-allowed' : 'pointer',
                      transition: '0.3s'
                    }}
                  >
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: '2px', left: p.enabled ? '18px' : '2px',
                      transition: '0.3s'
                    }}></div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', marginTop: '4px' }}>
                      {p.type} · {p.severity}
                    </div>
                  </div>
                </div>
                <div>
                  <Badge label={p.enabled ? 'ACTIVE' : 'DISABLED'} variant={p.enabled ? 'normal' : 'low'} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="Policy Overview">
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <div style={{ flex: 1, background: 'rgba(0, 230, 118, 0.1)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--green)' }}>
                <div style={{ fontSize: '24px', color: 'var(--green)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{activeCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-2)', textTransform: 'uppercase' }}>Active Policies</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(136, 153, 187, 0.1)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--text-3)' }}>
                <div style={{ fontSize: '24px', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{disabledCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-2)', textTransform: 'uppercase' }}>Disabled Rules</div>
              </div>
            </div>
            <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
              <Doughnut data={chartData} options={{...chartData, plugins: { legend: { position: 'right', labels: { color: '#8899bb', font: { family: 'Space Mono', size: 10} } } }, cutout:'70%'}} />
            </div>
          </Card>

          <Card title="Rule Simulator">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="login-field">
                <label className="login-label">Test Source IP</label>
                <input className="form-input" placeholder="e.g. 192.168.1.50" value={simForm.ip} onChange={e=>setSimForm({...simForm, ip: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="login-field" style={{ flex: 1 }}>
                  <label className="login-label">Protocol</label>
                  <select className="form-input" value={simForm.protocol} onChange={e=>setSimForm({...simForm, protocol: e.target.value})}>
                    <option>TCP</option>
                    <option>UDP</option>
                    <option>ICMP</option>
                    <option>HTTP</option>
                  </select>
                </div>
                <div className="login-field" style={{ flex: 1 }}>
                  <label className="login-label">Packet Rate (pkt/s)</label>
                  <input type="number" className="form-input" placeholder="1000" value={simForm.rate} onChange={e=>setSimForm({...simForm, rate: e.target.value})} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleSimulate}>▶ SIMULATE</button>

              {simResult && (
                <div style={{ 
                  marginTop: '12px', padding: '12px', borderRadius: '6px', fontFamily: 'var(--mono)', fontSize: '12px',
                  background: simResult.hit ? 'rgba(255,56,96,0.1)' : 'rgba(0,230,118,0.1)',
                  border: `1px solid ${simResult.hit ? 'var(--red)' : 'var(--green)'}`,
                  color: 'var(--text-1)'
                }}>
                  {simResult.hit ? (
                    <>
                      <div style={{ color: 'var(--red)', marginBottom: '4px' }}>[BLOCKED] Traffic from {simResult.ip}</div>
                      <div>Matched Rule: <span style={{ color: 'var(--accent)' }}>{simResult.rule}</span></div>
                    </>
                  ) : (
                    <div style={{ color: 'var(--green)' }}>[ALLOWED] Traffic from {simResult.ip} passed all active policies.</div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Create Security Policy"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>CANCEL</button>
            <button className="btn btn-primary" onClick={handleAddRule}>CREATE RULE</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="login-field">
            <label className="login-label">Rule Name</label>
            <input className="form-input" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} placeholder="e.g. Block Malicious IP Range" />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="login-field" style={{ flex: 1 }}>
              <label className="login-label">Rule Type</label>
              <select className="form-input" value={newRule.type} onChange={e => setNewRule({...newRule, type: e.target.value})}>
                <option>FIREWALL</option><option>IDS</option><option>IPS</option><option>WAF</option><option>ML</option>
              </select>
            </div>
            <div className="login-field" style={{ flex: 1 }}>
              <label className="login-label">Severity</label>
              <select className="form-input" value={newRule.severity} onChange={e => setNewRule({...newRule, severity: e.target.value})}>
                <option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option>
              </select>
            </div>
          </div>
          <div className="login-field">
            <label className="login-label">Match Condition expression</label>
            <input className="form-input" value={newRule.condition} onChange={e => setNewRule({...newRule, condition: e.target.value})} placeholder="src_ip == '10.0.*.*' && dport == 22" />
          </div>
          <div className="login-field">
            <label className="login-label">Action</label>
            <select className="form-input" value={newRule.action} onChange={e => setNewRule({...newRule, action: e.target.value})}>
              <option>BLOCK</option><option>ALERT</option><option>DROP</option><option>LOG</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
