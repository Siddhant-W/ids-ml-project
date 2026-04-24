import React from 'react';

export default function Card({ title, actionLabel, action, children, style }) {
  return (
    <div className="card" style={style}>
      <div className="card-header">
        <span className="card-title">{title}</span>
        {actionLabel && (
          <span className="card-action" onClick={action}>
            {actionLabel}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
