import React, { useMemo } from 'react';

function LogoPill({ label }) {
  return (
    <div className="logo-pill" aria-label={label}>
      <span className="logo-pill-mark">{label.slice(0, 2).toUpperCase()}</span>
      <span className="logo-pill-text">{label}</span>
    </div>
  );
}

export default function LogoMarquee({ logos }) {
  const items = useMemo(
    () =>
      logos ?? [
        'Microsoft',
        'Fortinet',
        'Sophos',
        'Veeam',
        'Jamf',
        'Apple',
        'Cloudflare',
        'Okta',
      ],
    [logos]
  );

  // Duplicate to ensure seamless loop
  const loop = [...items, ...items];

  return (
    <div className="marquee" aria-label="Partner logos marquee">
      <div className="marquee-track" aria-hidden="true">
        {loop.map((l, idx) => (
          <LogoPill key={`${l}-${idx}`} label={l} />
        ))}
      </div>
    </div>
  );
}

