import React from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={overlayStyle}>
      <div className="modal" onClick={e => e.stopPropagation()} style={modalStyle}>
        <div className="modal-header" style={headerStyle}>
          <span className="modal-title" style={titleStyle}>{title}</span>
          <span className="modal-close" onClick={onClose} style={closeStyle}>&times;</span>
        </div>
        <div className="modal-content" style={contentStyle}>
          {children}
        </div>
        {footer && <div className="modal-footer" style={footerStyle}>{footer}</div>}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(5, 8, 16, 0.8)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-light)',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: 'var(--shadow)',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid var(--border-light)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const titleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: 'var(--text-1)',
  fontFamily: 'var(--mono)'
};

const closeStyle = {
  fontSize: '24px',
  color: 'var(--text-3)',
  cursor: 'pointer',
  lineHeight: '1'
};

const contentStyle = {
  padding: '20px',
};

const footerStyle = {
  padding: '16px 20px',
  borderTop: '1px solid var(--border-light)',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px'
};
