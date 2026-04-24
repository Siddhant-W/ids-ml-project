export const formatIP = (ip) => ip; // Usually just returns the string

export const formatTimestamp = (date) => {
  return new Date(date).toLocaleTimeString('en-US', { hour12: false });
};

export const formatBytes = (n) => {
  if (n < 1000) return n + 'B';
  if (n < 1000000) return (n / 1000).toFixed(1) + 'K';
  return (n / 1000000).toFixed(1) + 'M';
};

export const severityColor = (sev) => {
  const colors = {
    CRITICAL: 'var(--red)',
    HIGH: 'var(--orange)',
    MEDIUM: 'var(--yellow)',
    LOW: 'var(--accent)'
  };
  return colors[sev] || 'var(--accent)';
};

export const severityClass = (sev) => {
  const classes = {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  };
  return classes[sev] || 'low';
};
