import React from 'react';
import { useToast } from '../../context/ToastContext';

export default function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-area" id="toast-area">
      {toasts.map((toast) => {
        let icon = 'ℹ';
        if (toast.type === 'success') icon = '✓';
        if (toast.type === 'error') icon = '⚠';

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{icon}</span>
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
