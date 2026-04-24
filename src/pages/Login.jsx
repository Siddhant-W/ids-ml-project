import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [error, setError] = useState('');
  const [isLockedError, setIsLockedError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setIsLockedError(false);
    
    if (!email || !password) {
      setError('⚠ Enter email and password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password, selectedRole);
      
      if (result.success) {
        addToast('Successfully authenticated', 'success');
        navigate('/dashboard');
      } else {
        if (result?.status === 423) {
          setIsLockedError(true);
          setError('Account locked. Too many failed attempts.');
        } else {
          setError('⚠ ' + result.error);
        }
      }
    } catch (err) {
      if (err?.status === 423) {
        setIsLockedError(true);
        setError('Account locked. Too many failed attempts.');
      } else {
        setError('⚠ Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-screen">
      <div className="login-shell">
        <div className="login-header">
          <div className="login-eyebrow">Login Page</div>
          <h1 className="login-h1">Intrusion Detection System</h1>
        </div>

        <div className="login-card">
          <div className="login-visual" aria-hidden="true">
            <div className="login-visual-badge">
              <span className="login-visual-dot" />
              Secure Access
            </div>
            <div className="login-visual-graphic">
              <svg viewBox="0 0 420 280" role="presentation">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="rgba(0,212,255,.95)" />
                    <stop offset="1" stopColor="rgba(0,136,255,.95)" />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="rgba(156,110,255,.9)" />
                    <stop offset="1" stopColor="rgba(0,212,255,.7)" />
                  </linearGradient>
                  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="10" />
                  </filter>
                </defs>

                <rect x="40" y="58" width="150" height="110" rx="14" fill="rgba(20,28,48,.9)" stroke="rgba(42,58,96,.9)" />
                <rect x="70" y="86" width="150" height="110" rx="14" fill="rgba(15,21,38,.95)" stroke="rgba(30,42,69,.9)" />
                <circle cx="95" cy="115" r="10" fill="url(#g2)" />
                <rect x="115" y="110" width="70" height="10" rx="5" fill="rgba(136,153,187,.35)" />
                <rect x="90" y="140" width="115" height="10" rx="5" fill="rgba(136,153,187,.22)" />

                <g filter="url(#soft)">
                  <circle cx="260" cy="135" r="56" fill="rgba(0,212,255,.12)" />
                  <circle cx="300" cy="105" r="38" fill="rgba(156,110,255,.10)" />
                </g>

                <path
                  d="M260 72c31 18 63 18 63 18 0 74-23 108-63 130-40-22-63-56-63-130 0 0 32 0 63-18Z"
                  fill="url(#g1)"
                  opacity=".95"
                />
                <path
                  d="M235 140l18 18 40-44"
                  fill="none"
                  stroke="rgba(5,8,16,.9)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="login-form">
            <div className="login-form-title">Welcome back</div>
            <div className="login-form-sub">Authenticate to continue to the IDS console</div>

            <div className="login-field">
              <label className="login-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="form-input"
                type="email"
                autoComplete="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="form-input"
                type="password"
                autoComplete="current-password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <div className="login-meta">
                <button className="login-link" type="button" onClick={() => addToast('Password reset not implemented in demo.', 'info')}>
                  Forgot Password
                </button>
              </div>
            </div>

            <div className="login-label login-label-inline">Role</div>
            <div className="login-roles" role="tablist" aria-label="Role">
              {['Admin', 'Analyst', 'Viewer'].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-chip ${selectedRole === role ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(role)}
                  aria-pressed={selectedRole === role}
                >
                  {role}
                </button>
              ))}
            </div>

            {error && (
              <div
                className="login-error"
                style={isLockedError ? { color: 'var(--orange)' } : undefined}
              >
                {error}
              </div>
            )}

            <button
              className="btn btn-primary login-btn"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>

            <div className="login-foot">
              <div className="login-signup">
                Create new account?{' '}
                <button className="login-link" type="button" onClick={() => addToast('Sign up not implemented in demo.', 'info')}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
