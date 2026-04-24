import React, { useEffect } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const { role } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'Admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [role, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="grid-2-1">
        <Card title="User Management" actionLabel="+ ADD USER" action={() => addToast("Connect to backend to provision users", "info")}>
          <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: '12px', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '12px 8px' }}>User</th>
                <th style={{ padding: '12px 8px' }}>Email</th>
                <th style={{ padding: '12px 8px' }}>Role</th>
                <th style={{ padding: '12px 8px' }}>Last Login</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Admin User', email: 'admin@cybersentinel.local', role: 'Admin', ll: '2 mins ago', st: 'ACTIVE', av: 'A' },
                { name: 'Sarah Chen', email: 'schen@cybersentinel.local', role: 'Analyst', ll: '1 hour ago', st: 'ACTIVE', av: 'S' },
                { name: 'Mark Reeves', email: 'mreeves@cybersentinel.local', role: 'Analyst', ll: '2 days ago', st: 'OFFLINE', av: 'M' },
                { name: 'Viewer Demo', email: 'demo@cybersentinel.local', role: 'Viewer', ll: '5 mins ago', st: 'ACTIVE', av: 'V' }
              ].map((u, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '13px' }}>
                  <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>{u.av}</div>
                    <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>{u.name}</span>
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-3)' }}>{u.email}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <Badge label={u.role} variant={u.role === 'Admin' ? 'high' : u.role === 'Analyst' ? 'medium' : 'low'} />
                  </td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--mono)' }}>{u.ll}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <Badge label={u.st} variant={u.st === 'ACTIVE' ? 'normal' : 'low'} />
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '11px' }}>EDIT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="RBAC Permission Matrix">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px', border: '1px solid var(--accent)', borderRadius: '6px', background: 'rgba(0, 212, 255, 0.05)' }}>
              <div style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>Admin Role</div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-2)', fontSize: '12px', lineHeight: 1.6 }}>
                <li>Full read/write access to all modules</li>
                <li>Can create and modify ML security policies</li>
                <li>Can train and deploy predictive models</li>
                <li>Can provision and suspend users</li>
                <li>Access to system configuration</li>
              </ul>
            </div>
            
            <div style={{ padding: '12px', border: '1px solid var(--green)', borderRadius: '6px', background: 'rgba(0, 230, 118, 0.05)' }}>
              <div style={{ color: 'var(--green)', fontWeight: 600, marginBottom: '8px' }}>Analyst Role</div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-2)', fontSize: '12px', lineHeight: 1.6 }}>
                <li>View global Dashboards and network streams</li>
                <li>Acknowledge and Block specific IPs via Alerts</li>
                <li>Manage active Firewall/IPS policies</li>
                <li style={{ color: 'var(--text-3)', textDecoration: 'line-through' }}>Cannot train or deploy ML models</li>
                <li style={{ color: 'var(--text-3)', textDecoration: 'line-through' }}>Cannot manage system users</li>
              </ul>
            </div>
            
            <div style={{ padding: '12px', border: '1px solid var(--text-3)', borderRadius: '6px' }}>
              <div style={{ color: 'var(--text-2)', fontWeight: 600, marginBottom: '8px' }}>Viewer Role</div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-3)', fontSize: '12px', lineHeight: 1.6 }}>
                <li>Read-only access to Dashboards, Traffic, Reports</li>
                <li>View existing threat intelligence data</li>
                <li style={{ textDecoration: 'line-through' }}>Cannot modify policies or block threats</li>
                <li style={{ textDecoration: 'line-through' }}>Cannot acknowledge alerts</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
