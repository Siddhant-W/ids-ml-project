import React, { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

function Item({ idx, q, a, open, onToggle }) {
  const contentRef = useRef(null);
  const [h, setH] = useState(0);
  const uid = useId();

  useLayoutEffect(() => {
    if (!open) return;
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.scrollHeight));
    setH(el.scrollHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-header" type="button" onClick={onToggle} aria-expanded={open} aria-controls={uid}>
        <span className="faq-num">{idx}</span>
        <span className="faq-q">{q}</span>
        <span className="faq-icon" aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>
      <div
        id={uid}
        className="faq-panel"
        style={{ height: open ? h : 0 }}
        aria-hidden={!open}
      >
        <div ref={contentRef} className="faq-panel-inner">
          {a}
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ items }) {
  const data = useMemo(
    () =>
      items ?? [
        {
          q: 'What is an IDS in simple terms?',
          a: 'An Intrusion Detection System monitors network traffic and alerts you when something looks suspicious—like scanning, brute force, or abnormal behaviour.',
        },
        {
          q: 'How do I access the demo pages?',
          a: 'Open Client Login, sign in (admin@aegis.sec / password), then navigate through Dashboard → Traffic → Alerts → Threats → Policy → ML → Reports → Users → Settings.',
        },
        {
          q: 'Why do I need WebSockets?',
          a: 'They stream live alerts/traffic without constantly polling, which makes the UI feel responsive and real-time.',
        },
        {
          q: 'Can roles limit actions?',
          a: 'Yes. Admin / Analyst / Viewer can be used to hide or disable sensitive actions while keeping read-only access for stakeholders.',
        },
      ],
    [items]
  );

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="faq" aria-label="Frequently asked questions">
      {data.map((it, i) => (
        <Item
          key={it.q}
          idx={i + 1}
          q={it.q}
          a={it.a}
          open={openIdx === i}
          onToggle={() => setOpenIdx((cur) => (cur === i ? -1 : i))}
        />
      ))}
    </div>
  );
}

