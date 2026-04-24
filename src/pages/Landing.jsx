import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, AlertTriangle, Eye, ArrowRight, Activity, Server, Database, Check, Menu } from 'lucide-react';
import OverlayNav from '../components/marketing/OverlayNav';
import StatCounters from '../components/marketing/StatCounters';
import LogoMarquee from '../components/marketing/LogoMarquee';
import FAQAccordion from '../components/marketing/FAQAccordion';
import VendorRow from '../components/marketing/VendorRow';
import NewsletterSignup from '../components/marketing/NewsletterSignup';
import MarqueeTicker from '../components/marketing/MarqueeTicker';
import './Landing.css';

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const counters = useMemo(
    () => [
      { to: 50, suffix: '+', label: 'Clients' },
      { to: 20, suffix: '+', label: 'Threat types tracked' },
      { to: 431, suffix: '', label: 'Events processed (demo)' },
      { to: 99, suffix: '%', label: 'Detection confidence' },
    ],
    []
  );

  return (
    <div className="landing-page" id="top">
      {/* Background Ambience */}
      <div className="ambient-glow" style={{ top: '-10%', left: '-10%', width: '800px', height: '800px' }}></div>
      <div className="ambient-glow purple" style={{ top: '40%', right: '-20%' }}></div>
      
      {/* Navigation */}
      <nav className="navbar fade-up">
        <div className="container nav-content">
          <div className="brand">
            <div className="brand-icon"><Shield size={24} color="var(--bg-deep)" fill="var(--accent)" /></div>
            <span className="brand-text">CyberSentinel</span>
          </div>
          <div className="nav-links nav-links-desktop">
            <a href="#why">Why now</a>
            <a href="#offer">What’s included</a>
            <a href="#trust">Outcomes</a>
            <Link to="/login" className="btn-outline btn-nav">Client Login</Link>
          </div>
          <button
            className="menu-btn"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
            Menu
          </button>
        </div>
      </nav>
      <OverlayNav open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Hero Section */}
      <section className="hero fade-up delay-100">
        <div className="container">
          <div className="hero-content">
            <div className="badge fade-up delay-200">
              <span className="pulse-dot"></span> Next-Generation Intrusion Detection
            </div>
            <h1 className="hero-title fade-up delay-200">
              Bringing clarity to
              <span className="text-gradient-accent d-block">messy security environments.</span>
            </h1>
            <p className="hero-subtitle fade-up delay-300">
              Most teams don’t “choose” to build an IDS. They end up there after months of growing complexity, unclear visibility, and alerts that don’t help. CyberSentinel gives you real-time signal, context, and control—without the noise.
            </p>
            <div className="landing-stats fade-up delay-350" aria-label="Key value metrics">
              <div className="stat-chip">
                <div className="stat-chip-value">Real‑time</div>
                <div className="stat-chip-label">WebSocket live feeds</div>
              </div>
              <div className="stat-chip">
                <div className="stat-chip-value">ML‑assisted</div>
                <div className="stat-chip-label">Heuristics + scoring</div>
              </div>
              <div className="stat-chip">
                <div className="stat-chip-value">RBAC</div>
                <div className="stat-chip-label">Admin / Analyst / Viewer</div>
              </div>
            </div>
            <div className="hero-actions fade-up delay-400">
              <Link to="/login" className="btn-primary">
                Launch the demo <ArrowRight size={18} />
              </Link>
              <a href="#why" className="btn-outline">
                Why teams need this
              </a>
            </div>
            <button
              className="scroll-down"
              type="button"
              onClick={() => document.getElementById('why')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              Scroll Down
              <span className="scroll-down-arrow">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trust badges + counters */}
      <section id="trust-badges" className="section-py trust-badges-section">
        <div className="container">
          <div className="trust-badges-grid" aria-label="Credentials">
            <div className="trust-badge">
              <div className="trust-badge-icon"><Shield size={18} /></div>
              <div className="trust-badge-title">ISO 27001 Ready</div>
              <div className="trust-badge-sub">Controls aligned for audits</div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon"><Lock size={18} /></div>
              <div className="trust-badge-title">Security by design</div>
              <div className="trust-badge-sub">RBAC + token auth</div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon"><Activity size={18} /></div>
              <div className="trust-badge-title">Live monitoring</div>
              <div className="trust-badge-sub">WebSocket streams</div>
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon"><Eye size={18} /></div>
              <div className="trust-badge-title">Clarity-first UI</div>
              <div className="trust-badge-sub">Fast decisions, less noise</div>
            </div>
          </div>

          <div className="trust-badges-counters">
            <StatCounters items={counters} />
          </div>

          <div className="trust-badges-marquee">
            <LogoMarquee />
          </div>
        </div>
      </section>

      {/* Why section (need for product) */}
      <section id="why" className="section-py threat-section">
        <div className="ambient-glow red" style={{ top: '10%', left: '30%' }}></div>
        <div className="container">
          <div className="section-header text-center fade-up">
            <h2 className="section-title">The cost of <span className="text-gradient" style={{ color: "var(--red)" }}>guesswork</span></h2>
            <p className="section-subtitle">
              When visibility is fragmented, incident response becomes opinion-driven. CyberSentinel turns packets into decisions: what happened, where, how severe, and what to do next.
            </p>
          </div>

          <div className="threat-grid">
            <div className="glass-panel threat-card fade-up delay-100">
              <div className="threat-icon"><AlertTriangle size={36} color="var(--red)" /></div>
              <h3>Alert overload</h3>
              <p>Hundreds of “detections” per day with no prioritisation. Teams either miss real threats—or burn out chasing false positives.</p>
              <div className="stat">Fix: <span style={{ color: "var(--red)" }}>scored, structured alerts</span></div>
            </div>

            <div className="glass-panel threat-card fade-up delay-200">
              <div className="threat-icon"><Server size={36} color="var(--orange)" /></div>
              <h3>Blind spots</h3>
              <p>Traditional perimeter tools can’t explain east‑west traffic and lateral movement. That’s where modern intrusions hide.</p>
              <div className="stat">Fix: <span style={{ color: "var(--orange)" }}>live traffic monitoring</span></div>
            </div>

            <div className="glass-panel threat-card fade-up delay-300">
              <div className="threat-icon"><Lock size={36} color="var(--purple)" /></div>
              <h3>Slow response</h3>
              <p>By the time you correlate logs across tools, the attacker has already established persistence or exfiltrated data.</p>
              <div className="stat">Fix: <span style={{ color: "var(--purple)" }}>one console, faster action</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="offer" className="section-py solution-section">
        <div className="container">
          <div className="solution-grid">
            <div className="solution-text fade-up">
              <div className="badge">What’s on offer</div>
              <h2 className="section-title" style={{ marginTop: '16px' }}>
                Everything you need to move from reactive to <span className="text-gradient-accent">ready.</span>
              </h2>
              <p className="solution-desc">
                Inspired by the clarity-first structure of modern MSP sites, CyberSentinel is built around outcomes: visibility, prioritisation, and workflow. You get a clean UI, consistent navigation, and demo-ready data streams for every module.
              </p>
              <ul className="offer-list">
                <li><Check size={18} /> Live alerts feed (acknowledge + block workflows)</li>
                <li><Check size={18} /> Traffic monitoring + stats cards</li>
                <li><Check size={18} /> Policy manager (toggle + simulate)</li>
                <li><Check size={18} /> ML engine dashboards + training actions</li>
                <li><Check size={18} /> Reports & exports</li>
                <li><Check size={18} /> Users & RBAC overview</li>
              </ul>
              <div className="hero-actions" style={{ justifyContent: 'flex-start', marginTop: 28 }}>
                <Link to="/login" className="btn-primary">Open the console</Link>
                <a href="#trust" className="btn-outline">See outcomes</a>
              </div>
            </div>
            <div className="solution-visual fade-up delay-200">
              <div className="glass-panel visual-card">
                <div className="scan-line-anim"></div>
                {/* We'll use a CSS-based aesthetic representation of the dashboard instead of a static image so it feels alive */}
                <div className="mock-dash-header">
                  <div className="mock-dot red"></div>
                  <div className="mock-dot yellow"></div>
                  <div className="mock-dot green"></div>
                </div>
                <div className="mock-chart">
                  <div className="mock-bar" style={{height: '30%'}}></div>
                  <div className="mock-bar" style={{height: '50%'}}></div>
                  <div className="mock-bar focus" style={{height: '90%'}}></div>
                  <div className="mock-bar" style={{height: '40%'}}></div>
                  <div className="mock-bar" style={{height: '60%'}}></div>
                </div>
                <div className="mock-alert text-gradient" style={{color: 'var(--red)'}}>
                  ⚠ THREAT DETECTED: SSH BRUTE FORCE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="section-py trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-copy fade-up">
              <h2 className="section-title" style={{ marginBottom: 14 }}>
                Built for teams with <span className="text-gradient-accent">bigger things</span> to do.
              </h2>
              <p className="section-subtitle" style={{ textAlign: 'left', margin: 0, maxWidth: 680 }}>
                The best security tooling disappears into your workflow: clear navigation, consistent screens, and actions that make sense. CyberSentinel is designed to feel modern, credible, and easy to demo end‑to‑end.
              </p>
            </div>
            <div className="trust-cards fade-up delay-150">
              <div className="trust-card">
                <div className="trust-kicker">Consistency</div>
                <div className="trust-title">One design system</div>
                <div className="trust-desc">Typography, spacing, and surfaces aligned across login, landing, and console pages.</div>
              </div>
              <div className="trust-card">
                <div className="trust-kicker">Clarity</div>
                <div className="trust-title">Decision-first UI</div>
                <div className="trust-desc">Every module answers “what’s happening” and “what should I do next”.</div>
              </div>
              <div className="trust-card">
                <div className="trust-kicker">Demo-ready</div>
                <div className="trust-title">Sequential navigation</div>
                <div className="trust-desc">You can walk through every page in order without dead-ends.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section-py faq-section">
        <div className="container">
          <div className="section-header text-center fade-up">
            <h2 className="section-title">FAQs</h2>
            <p className="section-subtitle">Quick answers to common questions about the demo and the product.</p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      <section id="vendors" className="section-py vendors-section">
        <div className="container">
          <div className="vendors-head">
            <div>
              <div className="vendors-kicker">Vendors</div>
              <div className="vendors-title">Our partners</div>
              <div className="vendors-sub">Technology we integrate with in real deployments.</div>
            </div>
          </div>
          <VendorRow />
        </div>
      </section>

      <section id="newsletter" className="section-py newsletter-section">
        <div className="container">
          <NewsletterSignup />
        </div>
      </section>

      <MarqueeTicker />

      {/* Call to Action Footer */}
      <footer className="footer-cta footer-split fade-up">
        <div className="ambient-glow" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '300px' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="footer-top">
            <div className="footer-brand">
              <div className="brand">
                <div className="brand-icon"><Shield size={20} color="var(--bg-deep)" fill="var(--accent)" /></div>
                <span className="brand-text">CyberSentinel</span>
              </div>
              <div className="footer-note">
                Intrusion detection, traffic visibility, and workflow—designed for clarity.
              </div>
              <div style={{ marginTop: 16 }}>
                <Link to="/login" className="btn-primary" style={{ padding: '14px 20px' }}>
                  Launch Interactive Demo <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="footer-contacts" aria-label="Department contacts">
              <div className="footer-col">
                <div className="footer-col-title">Sales</div>
                <a href="tel:+918000000000">+91 80000 00000</a>
                <a href="mailto:sales@cybersentinel.example">sales@cybersentinel.example</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Support</div>
                <a href="tel:+918000000001">+91 80000 00001</a>
                <a href="mailto:support@cybersentinel.example">support@cybersentinel.example</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Billing</div>
                <a href="tel:+918000000002">+91 80000 00002</a>
                <a href="mailto:billing@cybersentinel.example">billing@cybersentinel.example</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-social" aria-label="Social links">
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube</a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
            </div>
            <div className="footer-legal">© {new Date().getFullYear()} CyberSentinel. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
