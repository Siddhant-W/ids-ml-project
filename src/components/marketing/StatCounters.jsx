import React, { useEffect, useMemo, useState } from 'react';
import { useInViewOnce } from './useInViewOnce';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(active, to, durationMs = 1100) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(p);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to, durationMs]);

  return val;
}

export default function StatCounters({ items }) {
  const { ref, inView } = useInViewOnce({ threshold: 0.25 });
  const data = useMemo(
    () =>
      items ?? [
        { to: 50, suffix: '+', label: 'Clients & deployments' },
        { to: 10, suffix: '+', label: 'Years of security research' },
        { to: 431, suffix: '', label: 'Incidents triaged (demo)' },
        { to: 99, suffix: '%', label: 'Detection confidence' },
      ],
    [items]
  );

  return (
    <div ref={ref} className="stats-counters" aria-label="Key metrics">
      {data.map((it) => (
        <CounterCard key={it.label} active={inView} {...it} />
      ))}
    </div>
  );
}

function CounterCard({ active, to, suffix = '', label }) {
  const val = useCountUp(active, to);
  return (
    <div className="stats-counter-card">
      <div className="stats-counter-val">
        {val}
        {suffix}
      </div>
      <div className="stats-counter-label">{label}</div>
    </div>
  );
}

