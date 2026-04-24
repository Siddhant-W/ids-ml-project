import React from 'react';

export default function Badge({ label, variant }) {
  return (
    <span className={`badge ${variant}`}>
      {label}
    </span>
  );
}
