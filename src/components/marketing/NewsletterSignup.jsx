import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | success | error

  const submit = async (e) => {
    e.preventDefault();
    setState('loading');
    try {
      // Demo behaviour: simulate request latency + basic validation.
      await new Promise((r) => setTimeout(r, 650));
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      if (!ok) throw new Error('invalid');
      setState('success');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="newsletter" aria-label="Newsletter signup">
      <div className="newsletter-copy">
        <div className="newsletter-kicker">Subscribe</div>
        <div className="newsletter-title">Get the latest CyberSentinel updates</div>
        <div className="newsletter-sub">Threat intel summaries, product updates, and release notes.</div>
      </div>

      {state === 'success' ? (
        <div className="newsletter-result success" role="status">
          Thanks for signing up. Check your inbox.
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={submit}>
          <label className="newsletter-label" htmlFor="nl-email">
            Email
          </label>
          <div className="newsletter-inline">
            <input
              id="nl-email"
              className="newsletter-input"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === 'loading'}
              required
            />
            <button className="newsletter-btn" type="submit" disabled={state === 'loading'}>
              {state === 'loading' ? 'Submitting…' : 'Sign up'}
            </button>
          </div>
          {state === 'error' && (
            <div className="newsletter-result error" role="status">
              Oops! Something went wrong. Please try again.
            </div>
          )}
        </form>
      )}
    </div>
  );
}

