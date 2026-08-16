// src/pages/TermsOfService.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  const sections = [
    { id: 'overview',     label: 'Overview' },
    { id: 'consultation', label: 'Consultation Fee' },
    { id: 'process',      label: 'Our Process' },
    { id: 'pricing',      label: 'Pricing & Timelines' },
    { id: 'refunds',      label: 'Refund Policy' },
    { id: 'ip',           label: 'Intellectual Property' },
    { id: 'liability',    label: 'Limitation of Liability' },
    { id: 'contact',      label: 'Contact' },
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i].id);
          if (el && window.scrollY >= el.offsetTop - 130) {
            setActiveSection(sections[i].id);
            break;
          }
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: '#030712', minHeight: '100vh', color: '#f9fafb', overflowX: 'hidden' }}>

      {/* ── Read progress bar ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, height: 3, zIndex: 9999, width: `${scrollProgress}%`, background: 'linear-gradient(90deg,#22c55e,#6366f1)', transition: 'width 0.1s ease' }} />

      {/* ── Header ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(3,7,18,0.93)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Logo - uses the actual She Model Tech logo image */}
          <Link to="/solutions" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <img
              src="/Images/512X512.png"
              alt="She Model Tech Logo"
              style={{ width: 38, height: 38, borderRadius: 9, objectFit: 'contain', display: 'block' }}
            />
            <span style={{ color: '#fff', fontFamily: "'Georgia',serif", fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>She Model Tech</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile TOC toggle */}
            <button
              onClick={() => setTocOpen(o => !o)}
              className="mobile-toc-btn"
              aria-label="Toggle table of contents"
              style={{ display: 'none', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '6px 10px', color: '#22c55e', fontSize: 12, fontFamily: 'system-ui,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {tocOpen ? '✕ Close' : '☰ Contents'}
            </button>
            <Link to="/solutions" style={{ color: '#22c55e', textDecoration: 'none', fontSize: 13, fontFamily: 'system-ui,sans-serif', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
              ← Home
            </Link>
          </div>
        </div>

        {/* Mobile TOC dropdown */}
        {tocOpen && (
          <div className="mobile-toc-panel" style={{ background: 'rgba(3,7,18,0.97)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px 16px' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 10, fontFamily: 'system-ui,sans-serif', marginTop: 0 }}>Jump to section</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setTocOpen(false)}
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, color: activeSection === s.id ? '#22c55e' : '#9ca3af', textDecoration: 'none', fontFamily: 'system-ui,sans-serif', background: activeSection === s.id ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: activeSection === s.id ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s' }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Page layout ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px 80px', display: 'flex', gap: 0, alignItems: 'flex-start' }} className="tos-page-layout">

        {/* Sidebar TOC - desktop only */}
        <aside className="tos-toc" style={{ position: 'sticky', top: 80, width: 200, flexShrink: 0, display: 'none' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 14, fontFamily: 'system-ui,sans-serif' }}>Contents</p>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              display: 'block', padding: '6px 10px', marginBottom: 3, borderRadius: 6, fontSize: 12,
              color: activeSection === s.id ? '#22c55e' : '#9ca3af',
              textDecoration: 'none', fontFamily: 'system-ui,sans-serif',
              borderLeft: activeSection === s.id ? '2px solid #22c55e' : '2px solid transparent',
              background: activeSection === s.id ? 'rgba(34,197,94,0.07)' : 'transparent',
              transition: 'all 0.2s'
            }}>{s.label}</a>
          ))}
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Hero */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ color: '#22c55e', fontSize: 12, fontFamily: 'system-ui,sans-serif', letterSpacing: '0.05em' }}>Legal Document</span>
            </div>
            <h1 style={{ fontSize: 'clamp(26px,6vw,54px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 14, letterSpacing: '-1px', background: 'linear-gradient(135deg,#ffffff 40%,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', wordBreak: 'break-word' }}>
              Terms of Service
            </h1>
            <p style={{ color: '#9ca3af', fontFamily: 'system-ui,sans-serif', fontSize: 14, lineHeight: 1.7 }}>
              Effective Date: {new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}<br />
              Last Updated: {new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
            </p>
          </div>

          {/* Intro callout */}
          <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.07),rgba(99,102,241,0.07))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '20px 22px', marginBottom: 44 }}>
            <p style={{ color: '#d1fae5', fontFamily: 'system-ui,sans-serif', fontSize: 15, lineHeight: 1.8, margin: 0 }}>
              Welcome to <strong style={{ color: '#22c55e' }}>She Model Tech</strong>. By accessing our website, requesting a consultation, or engaging our services, you agree to be bound by these Terms of Service. Please read them carefully before proceeding.
            </p>
          </div>

          {/* ─── 01 Overview ─── */}
          <TosSection id="overview" number="01" title="Overview" icon="🏢">
            <p>She Model Tech is a digital innovation organization specializing in the design, development, and transformation of web and mobile applications using intelligent and cutting-edge technologies - including Artificial Intelligence (AI), machine learning, predictive analytics, and automation systems.</p>
            <p>These Terms govern all engagements between She Model Tech and any individual, business, or organization ("Client") seeking our services.</p>
          </TosSection>

          {/* ─── 02 Consultation Fee ─── */}
          <TosSection id="consultation" number="02" title="Consultation Fee" icon="💳" highlight>
            <TosCallout color="#22c55e" icon="💡" title="How Our Consultation Works">
              Before any project begins, She Model Tech conducts a comprehensive discovery consultation to understand your goals, existing systems, technical requirements, and desired outcomes. This allows us to design the most effective intelligent solution for your specific needs.
            </TosCallout>

            <Subsection title="Consultation Fee Amount">
              <p>A non-refundable consultation fee of <strong style={{ color: '#22c55e', fontSize: 17 }}>$100 USD</strong> is required to initiate a formal consultation with our team.</p>
              <TosCallout color="#f59e0b" icon="📌" title="Fee Subject to Change">
                She Model Tech reserves the right to adjust the consultation fee at any time at its sole discretion. Any change to the fee will be reflected on our website prior to taking effect. The fee in place at the time you submit your consultation request is the fee that applies to your engagement.
              </TosCallout>
            </Subsection>

            <Subsection title="What the Consultation Fee Covers">
              <ul>
                <li>A dedicated discovery session with a She Model Tech solutions specialist</li>
                <li>In-depth review and analysis of your current digital infrastructure</li>
                <li>Initial scoping of the intelligent system or application you wish to build or transform</li>
                <li>Preliminary recommendations on technology approach, architecture, and AI integration</li>
                <li>A customized service proposal outlining how we operate, project timelines, and pricing specific to your requirements</li>
              </ul>
            </Subsection>

            <Subsection title="Consultation Fee as Project Credit">
              <TosCallout color="#6366f1" icon="✅" title="Good News - Your Fee Counts!">
                If you choose to move forward and engage She Model Tech to build or transform your web or mobile application following the consultation, the <strong>$100 consultation fee will be applied as a credit toward your total project payment</strong>. You will not pay this amount twice - it becomes part of your project investment.
              </TosCallout>
            </Subsection>

            <Subsection title="Non-Refundable Policy">
              <TosCallout color="#ef4444" icon="⚠️" title="Important - Please Read">
                The consultation fee of $100 is <strong>strictly non-refundable under all circumstances</strong>, including but not limited to:
                <ul style={{ marginTop: 10 }}>
                  <li>The Client decides not to proceed with any project after the consultation</li>
                  <li>The Client chooses to work with a different provider</li>
                  <li>The Client requests a refund at any point after the fee is paid</li>
                  <li>The consultation session is rescheduled or delayed by the Client</li>
                </ul>
                <p style={{ marginTop: 10, marginBottom: 0 }}>By paying the consultation fee, the Client acknowledges and agrees to this non-refundable policy.</p>
              </TosCallout>
            </Subsection>
          </TosSection>

          {/* ─── 03 Process ─── */}
          <TosSection id="process" number="03" title="Our Process - What Happens After Consultation" icon="🔄">
            <p>Upon receipt and confirmation of the consultation fee, our team will follow this structured engagement process:</p>
            <ProcessStep step={1} color="#22c55e" title="Consultation & Discovery">
              We conduct your discovery session - reviewing your goals, business model, existing platforms, and desired intelligent capabilities.
            </ProcessStep>
            <ProcessStep step={2} color="#6366f1" title="Custom Service Proposal Delivery">
              We deliver a comprehensive written proposal including: recommended solution and services, how She Model Tech operates, estimated project timeline and key milestones, transparent pricing breakdown, and technology stack and AI approach.
            </ProcessStep>
            <ProcessStep step={3} color="#f59e0b" title="Client Review & Decision">
              The Client reviews the proposal at their own discretion. There is no obligation to proceed. However, if you do not proceed, the consultation fee remains non-refundable as outlined in Section 2.
            </ProcessStep>
            <ProcessStep step={4} color="#22c55e" title="Project Agreement & Kickoff">
              If the Client agrees to move forward, both parties execute a formal Project Agreement. The $100 consultation fee is credited to the first project payment and a dedicated project team is assigned.
            </ProcessStep>
            <ProcessStep step={5} color="#6366f1" title="Development, Delivery & Support">
              Our team builds and delivers your intelligent system. Upon launch, we provide ongoing support, maintenance, and optimization services.
            </ProcessStep>
          </TosSection>

          {/* ─── 04 Pricing ─── */}
          <TosSection id="pricing" number="04" title="Pricing & Project Timelines" icon="📊">
            <p>Project pricing at She Model Tech is <strong>customized and scope-dependent</strong>. There is no one-size-fits-all rate, as every intelligent system we build is tailored to the unique needs, complexity, and goals of each Client.</p>
            <Subsection title="Factors That Influence Pricing">
              <ul>
                <li>Type of solution (web application, mobile application, AI integration, automation system, etc.)</li>
                <li>Complexity of features and intelligent capabilities required</li>
                <li>Number of platforms and integrations involved</li>
                <li>Level of AI, machine learning, or predictive analytics needed</li>
                <li>Desired timeline and urgency of delivery</li>
                <li>Ongoing support and maintenance requirements</li>
              </ul>
            </Subsection>
            <Subsection title="Pricing Transparency">
              <p>Full pricing will be provided in the custom proposal delivered after your consultation. She Model Tech is committed to transparency - you will receive a clear, itemized breakdown before any project commitment is made.</p>
            </Subsection>
            <Subsection title="Payment Structure">
              <p>Project payments are typically structured in milestone-based installments, which will be clearly defined in your Project Agreement. Specific payment schedules and terms will be agreed upon in writing before project commencement.</p>
            </Subsection>
            <Subsection title="Timeline Estimates">
              <p>Project timelines vary based on scope and complexity. Timeline estimates will be provided in your custom proposal and formalized in the Project Agreement.</p>
            </Subsection>
          </TosSection>

          {/* ─── 05 Refunds ─── */}
          <TosSection id="refunds" number="05" title="Refund Policy" icon="🔁">
            <TosCallout color="#ef4444" icon="📋" title="Summary of Refund Terms">
              <ul style={{ marginBottom: 0 }}>
                <li><strong>Consultation Fee ($100):</strong> Non-refundable under all circumstances</li>
                <li><strong>Project Payments:</strong> Subject to the terms outlined in your individual Project Agreement</li>
                <li><strong>Consultation Fee as Credit:</strong> Applied toward project cost if Client proceeds with She Model Tech</li>
              </ul>
            </TosCallout>
            <Subsection title="Consultation Fee - Non-Refundable">
              <p>The $100 consultation fee compensates She Model Tech for the time, expertise, and resources dedicated to your discovery session and custom proposal preparation. This fee is non-refundable regardless of whether the Client proceeds with a project.</p>
            </Subsection>
            <Subsection title="Project Payment Refunds">
              <p>Refund terms for project payments are determined on a case-by-case basis and will be explicitly stated in the signed Project Agreement. Once work has commenced on a milestone, payments associated with that milestone are generally non-refundable unless She Model Tech fails to deliver the agreed-upon work.</p>
            </Subsection>
            <Subsection title="Dispute Resolution">
              <p>In the event of a dispute regarding services rendered or payments made, both parties agree to attempt resolution in good faith through direct communication before pursuing any formal legal remedies.</p>
            </Subsection>
          </TosSection>

          {/* ─── 06 IP ─── */}
          <TosSection id="ip" number="06" title="Intellectual Property" icon="⚖️">
            <Subsection title="Client-Owned Deliverables">
              <p>Upon full payment of all amounts due under a Project Agreement, the Client will own all intellectual property rights to the final deliverables created specifically for that Client, including custom code, designs, and application features.</p>
            </Subsection>
            <Subsection title="She Model Tech Proprietary Assets">
              <p>She Model Tech retains ownership of all pre-existing tools, frameworks, methodologies, AI models, and proprietary systems used in delivering client projects. Use of these assets within your delivered project is licensed, not transferred.</p>
            </Subsection>
            <Subsection title="Third-Party Technologies">
              <p>Projects may incorporate third-party libraries, APIs, and platforms. The Client acknowledges that use of such technologies is subject to the respective third-party terms of service and licensing agreements.</p>
            </Subsection>
          </TosSection>

          {/* ─── 07 Liability ─── */}
          <TosSection id="liability" number="07" title="Limitation of Liability" icon="🛡️">
            <p>To the maximum extent permitted by applicable law, She Model Tech shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to the use of our services, including but not limited to loss of revenue, data, goodwill, or business opportunities.</p>
            <p>She Model Tech's total liability arising from any engagement shall not exceed the total amount paid by the Client for the specific service giving rise to the claim.</p>
            <p>She Model Tech makes no warranties - express or implied - beyond those explicitly stated in a signed Project Agreement.</p>
          </TosSection>

          {/* ─── 08 Contact ─── */}
          <TosSection id="contact" number="08" title="Contact & Questions" icon="✉️">
            <p>If you have any questions about these Terms of Service, the consultation process, pricing, or any of our services, our team is ready to help.</p>
            <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(99,102,241,0.08))', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14, padding: '22px 24px', marginTop: 18 }}>
              <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: '#22c55e', fontFamily: 'system-ui,sans-serif', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                💬 Chat with us directly on our homepage
              </p>
              <p style={{ margin: '0 0 18px 0', color: '#d1d5db', fontFamily: 'system-ui,sans-serif', fontSize: 14, lineHeight: 1.75 }}>
                The fastest way to get answers is through the <strong style={{ color: '#f9fafb' }}>AI chat on our home page</strong>. Head back to the homepage and use the chat to ask us anything - our team reviews every conversation.
              </p>
              <Link to="/solutions" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#22c55e,#6366f1)', borderRadius: 10, padding: '11px 20px', textDecoration: 'none', color: '#fff', fontFamily: 'system-ui,sans-serif', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
                🏠 Go to Homepage & Chat with Us
              </Link>
            </div>
            <p style={{ marginTop: 20, color: '#9ca3af', fontFamily: 'system-ui,sans-serif', fontSize: 14 }}>
              By engaging with She Model Tech's services or paying the consultation fee, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
              <Link to="/solutions/privacy" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '10px 16px', textDecoration: 'none', color: '#818cf8', fontFamily: 'system-ui,sans-serif', fontSize: 14, fontWeight: 600 }}>
                🔒 Privacy Policy
              </Link>
              <Link to="/solutions" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '10px 16px', textDecoration: 'none', color: '#22c55e', fontFamily: 'system-ui,sans-serif', fontSize: 14, fontWeight: 600 }}>
                🏠 Back to Home
              </Link>
            </div>
          </TosSection>

          {/* Footer */}
          <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
            <p style={{ color: '#4b5563', fontFamily: 'system-ui,sans-serif', fontSize: 13 }}>
              © {new Date().getFullYear()} She Model Tech. All rights reserved.&nbsp;·&nbsp;
              <Link to="/solutions" style={{ color: '#22c55e', textDecoration: 'none' }}>Home</Link>&nbsp;·&nbsp;
              <Link to="/solutions/privacy" style={{ color: '#818cf8', textDecoration: 'none' }}>Privacy Policy</Link>
            </p>
          </div>
        </main>
      </div>

      <style>{`
        /* Desktop sidebar */
        @media (min-width: 900px) {
          .tos-toc { display: block !important; }
          .mobile-toc-btn { display: none !important; }
          .mobile-toc-panel { display: none !important; }
          .tos-page-layout { gap: 40px !important; }
        }
        /* Mobile TOC button */
        @media (max-width: 899px) {
          .mobile-toc-btn { display: flex !important; align-items: center; }
          .tos-page-layout { gap: 0 !important; }
        }
        @media (max-width: 640px) {
          .tos-page-layout { padding: 24px 12px 60px !important; }
        }

        * { box-sizing: border-box; }
        p  { color: #d1d5db; font-family: system-ui,sans-serif; font-size: 15px; line-height: 1.85; margin-bottom: 14px; }
        ul { color: #d1d5db; font-family: system-ui,sans-serif; font-size: 15px; line-height: 1.85; padding-left: 20px; margin-bottom: 14px; }
        li { margin-bottom: 8px; }
        strong { color: #f9fafb; }
        a  { color: #22c55e; }

        /* Tighter text on small screens */
        @media (max-width: 480px) {
          p, ul { font-size: 14px; line-height: 1.75; }
          li { margin-bottom: 6px; }
        }

        /* Section body indent - only on wider screens */
        .tos-section-body { padding-left: 0; }
        @media (min-width: 600px) { .tos-section-body { padding-left: 54px; } }
      `}</style>
    </div>
  );
};

/* ─── Sub-components ─── */

const TosSection = ({ id, number, title, icon, children, highlight }) => (
  <section id={id} style={{ marginBottom: 52, scrollMarginTop: 90 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
      <div style={{
        minWidth: 42, width: 42, height: 42, borderRadius: 11,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
        background: highlight ? 'linear-gradient(135deg,rgba(34,197,94,0.2),rgba(99,102,241,0.2))' : 'rgba(255,255,255,0.05)',
        border: highlight ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
        fontSize: 19
      }}>{icon}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', fontFamily: 'system-ui,sans-serif', marginBottom: 2 }}>Section {number}</span>
        <h2 style={{ margin: 0, fontSize: 'clamp(16px,2.8vw,22px)', fontWeight: 700, letterSpacing: '-0.3px', color: '#f3f4f6', fontFamily: "'Georgia',serif", wordBreak: 'break-word' }}>{title}</h2>
      </div>
    </div>
    <div className="tos-section-body">{children}</div>
    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginTop: 44 }} />
  </section>
);

const Subsection = ({ title, children }) => (
  <div style={{ marginBottom: 26 }}>
    <h3 style={{ fontFamily: "'Georgia',serif", fontSize: 'clamp(13px,2vw,15px)', fontWeight: 600, color: '#e5e7eb', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{title}</h3>
    {children}
  </div>
);

const TosCallout = ({ color, icon, title, children }) => {
  const rgb = color === '#ef4444' ? '239,68,68' : color === '#f59e0b' ? '245,158,11' : color === '#22c55e' ? '34,197,94' : '99,102,241';
  return (
    <div style={{ background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.25)`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '16px 18px', marginBottom: 22 }}>
      <p style={{ margin: '0 0 8px 0', fontWeight: 700, color, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontFamily: 'system-ui,sans-serif' }}>
        <span>{icon}</span>{title}
      </p>
      <div style={{ color: '#d1d5db', fontFamily: 'system-ui,sans-serif', fontSize: 14, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
};

const ProcessStep = ({ step, color, title, children }) => {
  const rgb = color === '#22c55e' ? '34,197,94' : color === '#6366f1' ? '99,102,241' : '245,158,11';
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 24, alignItems: 'flex-start' }}>
      <div style={{ minWidth: 32, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${rgb},0.15)`, border: `2px solid ${color}`, color, fontWeight: 700, fontSize: 13, fontFamily: 'system-ui,sans-serif', flexShrink: 0, marginTop: 2 }}>{step}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ margin: '0 0 7px', color: '#f9fafb', fontFamily: "'Georgia',serif", fontSize: 'clamp(13px,2vw,15px)', wordBreak: 'break-word' }}>{title}</h4>
        <div style={{ color: '#9ca3af', fontFamily: 'system-ui,sans-serif', fontSize: 14, lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
};

export default TermsOfService;
