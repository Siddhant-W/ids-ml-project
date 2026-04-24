import React, { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';

export default function OverlayNav({ open, onClose }) {
  const links = useMemo(
    () => [
      { n: 1, label: 'Home', href: '#top' },
      { n: 2, label: 'Why now', href: '#why' },
      { n: 3, label: 'Trust', href: '#trust-badges' },
      { n: 4, label: 'What’s included', href: '#offer' },
      { n: 5, label: 'FAQs', href: '#faq' },
      { n: 6, label: 'Partners', href: '#vendors' },
      { n: 7, label: 'Newsletter', href: '#newsletter' },
    ],
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className={`ovnav ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="ovnav-scrim" onClick={onClose} />
      <div className="ovnav-panel" role="dialog" aria-modal="true" aria-label="Navigation">
        <button className="ovnav-close" onClick={onClose} aria-label="Close menu">
          <X size={18} />
          Close
        </button>

        <div className="ovnav-grid">
          <div className="ovnav-links" aria-label="Overlay navigation links">
            {links.map((l) => (
              <a
                key={l.n}
                className="ovnav-link"
                href={l.href}
                onClick={(e) => {
                  // Smooth-scroll to section then close
                  const id = l.href.startsWith('#') ? l.href.slice(1) : null;
                  if (id) {
                    const el = document.getElementById(id);
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                  onClose?.();
                }}
              >
                <span className="ovnav-num">{l.n}</span>
                <span className="ovnav-text">{l.label}</span>
              </a>
            ))}
          </div>

          <aside className="ovnav-aside" aria-label="Contact details">
            <div className="ovnav-aside-title">Contact</div>
            <div className="ovnav-aside-block">
              <div className="ovnav-aside-kicker">Sales</div>
              <a className="ovnav-aside-link" href="tel:+918000000000">
                +91 80000 00000
              </a>
              <a className="ovnav-aside-link" href="mailto:sales@cybersentinel.example">
                sales@cybersentinel.example
              </a>
            </div>
            <div className="ovnav-aside-block">
              <div className="ovnav-aside-kicker">Support</div>
              <a className="ovnav-aside-link" href="tel:+918000000001">
                +91 80000 00001
              </a>
              <a className="ovnav-aside-link" href="mailto:support@cybersentinel.example">
                support@cybersentinel.example
              </a>
            </div>
            <div className="ovnav-aside-muted">
              Built for demo. Replace these contacts in `src/components/marketing/OverlayNav.jsx`.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

