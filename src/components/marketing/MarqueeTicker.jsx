import React from 'react';

export default function MarqueeTicker({ text = "Let's Work Together —" }) {
  const items = new Array(12).fill(text);
  return (
    <div className="ticker" aria-label="Call to action ticker">
      <div className="ticker-track" aria-hidden="true">
        {items.concat(items).map((t, i) => (
          <span key={i} className="ticker-item">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

