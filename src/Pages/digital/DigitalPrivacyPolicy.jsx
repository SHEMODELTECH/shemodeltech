// src/pages/PrivacyPolicy.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [tocOpen, setTocOpen] = useState(false);

  const sections = [
    { id: 'overview',    label: 'Overview' },
    { id: 'information', label: 'Information We Collect' },
    { id: 'how-we-use',  label: 'How We Use It' },
    { id: 'sharing',     label: 'Sharing & Disclosure' },
    { id: 'cookies',     label: 'Cookies & Tracking' },
    { id: 'retention',   label: 'Data Retention' },
    { id: 'rights',      label: 'Your Rights' },
    { id: 'security',    label: 'Security' },
    { id: 'children',    label: "Children's Privacy" },
    { id: 'third-party', label: 'Third-Party Links' },
    { id: 'changes',     label: 'Policy Changes' },
    { id: 'contact',     label: 'Contact Us' },
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
          {/* Real She Model Tech logo */}
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
              style={{ display: 'none', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '6px 10px', color: '#818cf8', fontSize: 12, fontFamily: 'system-ui,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
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
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, color: activeSection === s.id ? '#818cf8' : '#9ca3af', textDecoration: 'none', fontFamily: 'system-ui,sans-serif', background: activeSection === s.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)', border: activeSection === s.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s' }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Page layout ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px 80px', display: 'flex', gap: 0, alignItems: 'flex-start' }} className="pp-page-layout">

        {/* Sidebar TOC - desktop only */}
        <aside className="pp-toc" style={{ position: 'sticky', top: 80, width: 200, flexShrink: 0, display: 'none' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 14, fontFamily: 'system-ui,sans-serif' }}>Contents</p>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              display: 'block', padding: '6px 10px', marginBottom: 3, borderRadius: 6, fontSize: 12,
              color: activeSection === s.id ? '#818cf8' : '#9ca3af',
              textDecoration: 'none', fontFamily: 'system-ui,sans-serif',
              borderLeft: activeSection === s.id ? '2px solid #818cf8' : '2px solid transparent',
              background: activeSection === s.id ? 'rgba(129,140,248,0.07)' : 'transparent',
              transition: 'all 0.2s'
            }}>{s.label}</a>
          ))}
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Hero */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ color: '#818cf8', fontSize: 12, fontFamily: 'system-ui,sans-serif', letterSpacing: '0.05em' }}>Legal Document</span>
            </div>
            <h1 style={{ fontSize: 'clamp(26px,6vw,54px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 14, letterSpacing: '-1px', background: 'linear-gradient(135deg,#ffffff 40%,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', wordBreak: 'break-word' }}>
              Privacy Policy
            </h1>
            <p style={{ color: '#9ca3af', fontFamily: 'system-ui,sans-serif', fontSize: 14, lineHeight: 1.7 }}>
              Effective Date: {new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}<br />
              Last Updated: {new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
            </p>
          </div>

          {/* Intro callout */}
          <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(34,197,94,0.06))', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 14, padding: '20px 22px', marginBottom: 44 }}>
            <p style={{ color: '#e0e7ff', fontFamily: 'system-ui,sans-serif', fontSize: 15, lineHeight: 1.8, margin: 0 }}>
              At <strong style={{ color: '#818cf8' }}>She Model Tech</strong>, your privacy matters deeply to us. This Privacy Policy explains how we collect, use, protect, and share your information when you interact with our website (<strong style={{ color: '#22c55e' }}>shemodeltech.com</strong>) or any of our services. By using our platform, you agree to the practices described in this policy.
            </p>
          </div>

          {/* ─── 01 Overview ─── */}
          <PPSection id="overview" number="01" title="Overview" icon="🏢">
            <p>She Model Tech is a digital innovation organization specializing in the design, development, and transformation of web and mobile applications using intelligent and cutting-edge technologies - including Artificial Intelligence (AI), machine learning, predictive analytics, and automation systems.</p>
            <p>This policy applies to all visitors, clients, and users of <strong style={{ color: '#22c55e' }}>shemodeltech.com</strong>. We are committed to handling your data responsibly, transparently, and in alignment with applicable privacy laws.</p>
          </PPSection>

          {/* ─── 02 Information We Collect ─── */}
          <PPSection id="information" number="02" title="Information We Collect" icon="📥" highlight>
            <Subsection title="Information You Provide Directly">
              <p>We collect information you voluntarily submit through forms, account registration, consultations, or direct communication, including:</p>
              <ul>
                <li>Full name, email address, and phone number</li>
                <li>Business name, industry, and project requirements (for service inquiries)</li>
                <li>Payment information for consultation fees and project invoices (processed securely through third-party payment providers)</li>
                <li>Messages sent through our chatbot, contact forms, or email</li>
                <li>Responses to assessments, surveys, or onboarding questionnaires</li>
              </ul>
            </Subsection>

            <Subsection title="Information Collected Automatically">
              <p>When you visit our platform, we may automatically collect certain technical information, including:</p>
              <ul>
                <li>IP address, browser type, operating system, and device information</li>
                <li>Pages visited, time spent on pages, and navigation paths</li>
                <li>Referral source (how you found our website)</li>
                <li>Clickstream data and interaction logs</li>
                <li>Cookie and session data (see Section 5 for details)</li>
              </ul>
            </Subsection>

            <Subsection title="Information from Third Parties">
              <p>We may receive information about you from third-party platforms such as social media platforms (LinkedIn, Instagram, Facebook, YouTube), analytics providers, and payment processors.</p>
            </Subsection>
          </PPSection>

          {/* ─── 03 How We Use It ─── */}
          <PPSection id="how-we-use" number="03" title="How We Use Your Information" icon="⚙️">
            <Subsection title="To Deliver Our Services">
              <ul>
                <li>Process consultation requests and deliver custom project proposals</li>
                <li>Facilitate project development, communication, and delivery</li>
                <li>Manage project milestones and client communications</li>
              </ul>
            </Subsection>
            <Subsection title="To Communicate With You">
              <ul>
                <li>Respond to inquiries, consultation requests, and support messages</li>
                <li>Send project updates, invoices, and service-related notifications</li>
                <li>Send marketing communications (you may opt out at any time)</li>
              </ul>
            </Subsection>
            <Subsection title="To Improve Our Platform">
              <ul>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Diagnose technical issues and optimize platform performance</li>
                <li>Conduct internal research and product development</li>
                <li>Train and improve our AI-powered tools and systems</li>
              </ul>
            </Subsection>
            <Subsection title="To Comply With Legal Obligations">
              <ul>
                <li>Maintain records required by applicable law</li>
                <li>Respond to lawful requests from regulatory authorities</li>
                <li>Enforce our Terms of Service and protect our legal rights</li>
              </ul>
            </Subsection>
          </PPSection>

          {/* ─── 04 Sharing ─── */}
          <PPSection id="sharing" number="04" title="Sharing & Disclosure" icon="🔗">
            <PPCallout color="#ef4444" icon="🔒" title="We Do Not Sell Your Data">
              She Model Tech does not sell, rent, or trade your personal information to third parties for their marketing purposes. Period.
            </PPCallout>
            <Subsection title="Service Providers & Partners">
              <p>We work with trusted third-party providers who assist in delivering our services - including payment processors, cloud hosting providers, email tools, analytics platforms, and AI service providers. All partners are contractually required to handle your data securely.</p>
            </Subsection>
            <Subsection title="Within Our Organization">
              <p>Your information may be accessed by She Model Tech team members - project managers, developers, and support staff - who need it to deliver services to you.</p>
            </Subsection>
            <Subsection title="Legal Requirements">
              <p>We may disclose your information if required to do so by law, court order, or in response to valid requests from government or law enforcement authorities. We will notify you of such requests where legally permitted.</p>
            </Subsection>
            <Subsection title="Business Transfers">
              <p>In the event of a merger, acquisition, or sale of all or part of our business, your information may be transferred as part of that transaction. We will notify you in advance and ensure continued protection of your data.</p>
            </Subsection>
            <Subsection title="With Your Consent">
              <p>We may share your information with other parties when you have explicitly consented to such sharing.</p>
            </Subsection>
          </PPSection>

          {/* ─── 05 Cookies ─── */}
          <PPSection id="cookies" number="05" title="Cookies & Tracking Technologies" icon="🍪">
            <p>We use cookies and similar tracking technologies to enhance your experience on our platform.</p>
            <Subsection title="Types of Cookies We Use">
              <ul>
                <li><strong style={{ color: '#f9fafb' }}>Essential Cookies:</strong> Required for core platform functionality, such as maintaining your session and enabling secure authentication.</li>
                <li><strong style={{ color: '#f9fafb' }}>Analytics Cookies:</strong> Help us understand how visitors interact with our platform and where users experience difficulty.</li>
                <li><strong style={{ color: '#f9fafb' }}>Preference Cookies:</strong> Remember your settings and preferences to personalize your experience on return visits.</li>
                <li><strong style={{ color: '#f9fafb' }}>Marketing Cookies:</strong> Used to deliver relevant content and track the effectiveness of our outreach campaigns.</li>
              </ul>
            </Subsection>
            <Subsection title="Managing Cookies">
              <p>You can control or disable cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our platform.</p>
            </Subsection>
          </PPSection>

          {/* ─── 06 Data Retention ─── */}
          <PPSection id="retention" number="06" title="Data Retention" icon="🗄️">
            <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.</p>
            <ul>
              <li><strong style={{ color: '#f9fafb' }}>Client & Project Data:</strong> Retained for the duration of the engagement and for a reasonable period thereafter to fulfill legal and business continuity obligations.</li>
              <li><strong style={{ color: '#f9fafb' }}>Communication Records:</strong> Inquiry and consultation records are retained for operational and legal reference.</li>
              <li><strong style={{ color: '#f9fafb' }}>Analytics Data:</strong> Aggregated and anonymized usage data may be retained indefinitely for platform improvement purposes.</li>
            </ul>
            <p>When your data is no longer needed, we securely delete or anonymize it in accordance with our internal data management practices.</p>
          </PPSection>

          {/* ─── 07 Your Rights ─── */}
          <PPSection id="rights" number="07" title="Your Rights & Choices" icon="⚖️" highlight>
            <p>Depending on your location, you may have certain rights regarding your personal data. She Model Tech respects and honors these rights:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,230px),1fr))', gap: 12, marginTop: 18, marginBottom: 22 }}>
              {[
                { icon: '👁️', title: 'Right to Access',      desc: 'Request a copy of the personal data we hold about you.' },
                { icon: '✏️', title: 'Right to Correct',     desc: 'Request correction of inaccurate or incomplete information.' },
                { icon: '🗑️', title: 'Right to Delete',      desc: 'Request deletion of your personal data, subject to legal obligations.' },
                { icon: '📦', title: 'Right to Portability', desc: 'Request your data in a structured, machine-readable format.' },
                { icon: '🚫', title: 'Right to Object',      desc: 'Object to certain types of processing, including direct marketing.' },
                { icon: '📧', title: 'Opt-Out of Marketing', desc: 'Unsubscribe from marketing emails at any time via the link in any email.' },
              ].map((r, i) => (
                <div key={i} style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 20, marginBottom: 7 }}>{r.icon}</div>
                  <div style={{ color: '#f9fafb', fontWeight: 700, fontSize: 13, marginBottom: 5, fontFamily: 'system-ui,sans-serif' }}>{r.title}</div>
                  <div style={{ color: '#9ca3af', fontSize: 12, fontFamily: 'system-ui,sans-serif', lineHeight: 1.6 }}>{r.desc}</div>
                </div>
              ))}
            </div>
            <p>To exercise any of these rights, please contact us using the details in Section 12. We will respond to all valid requests within a reasonable timeframe in accordance with applicable law.</p>
          </PPSection>

          {/* ─── 08 Security ─── */}
          <PPSection id="security" number="08" title="Security" icon="🛡️">
            <p>Protecting your personal information is a priority at She Model Tech. We implement industry-standard security measures to safeguard your data, including:</p>
            <ul>
              <li>Encrypted data transmission using SSL/TLS protocols</li>
              <li>Secure access controls and authentication for internal systems</li>
              <li>Regular security assessments and vulnerability monitoring</li>
              <li>Limited employee access to personal data on a need-to-know basis</li>
              <li>Secure third-party payment processing - we do not store full payment card details</li>
            </ul>
            <PPCallout color="#f59e0b" icon="⚠️" title="Important Notice">
              While we take extensive precautions, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but commit to promptly notifying affected users in the event of a data breach where required by law.
            </PPCallout>
          </PPSection>

          {/* ─── 09 Children ─── */}
          <PPSection id="children" number="09" title="Children's Privacy" icon="👶">
            <p>She Model Tech's services are not directed to individuals under the age of 13, and we do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately and we will take prompt steps to delete that information.</p>
          </PPSection>

          {/* ─── 10 Third-Party ─── */}
          <PPSection id="third-party" number="10" title="Third-Party Links & Platforms" icon="🔗">
            <p>Our website may contain links to third-party websites, social media platforms, and external resources including LinkedIn, Instagram, Facebook, and YouTube. This Privacy Policy applies only to She Model Tech's owned platform and does not govern the privacy practices of any third-party site.</p>
            <p>We encourage you to review the privacy policies of any third-party platforms you visit through links on our website. She Model Tech is not responsible for the privacy practices or content of external sites.</p>
          </PPSection>

          {/* ─── 11 Changes ─── */}
          <PPSection id="changes" number="11" title="Changes to This Policy" icon="🔄">
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or business operations. When we make material changes, we will:</p>
            <ul>
              <li>Update the "Last Updated" date at the top of this page</li>
              <li>Post a prominent notice on our website or send an email notification to registered users</li>
            </ul>
            <p>We encourage you to review this policy periodically. Your continued use of our platform after any changes constitutes your acceptance of the updated policy.</p>
          </PPSection>

          {/* ─── 12 Contact ─── */}
          <PPSection id="contact" number="12" title="Contact Us" icon="✉️">
            <p>If you have any questions, concerns, or requests related to this Privacy Policy or your personal data, our team is ready to help.</p>
            <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(34,197,94,0.06))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 14, padding: '22px 24px', marginTop: 18, marginBottom: 22 }}>
              <p style={{ margin: '0 0 6px 0', fontWeight: 700, color: '#818cf8', fontFamily: 'system-ui,sans-serif', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                💬 Chat with us directly on our homepage
              </p>
              <p style={{ margin: '0 0 18px 0', color: '#d1d5db', fontFamily: 'system-ui,sans-serif', fontSize: 14, lineHeight: 1.75 }}>
                The fastest way to reach us is through the <strong style={{ color: '#f9fafb' }}>AI chat on our home page</strong>. Head back to the homepage and use the chat to send us your question - our team reviews every conversation.
              </p>
              <Link to="/solutions" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#6366f1,#22c55e)', borderRadius: 10, padding: '11px 20px', textDecoration: 'none', color: '#fff', fontFamily: 'system-ui,sans-serif', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                🏠 Go to Homepage & Chat with Us
              </Link>
            </div>
            <p style={{ color: '#9ca3af', fontFamily: 'system-ui,sans-serif', fontSize: 14 }}>
              We take all privacy inquiries seriously and will respond within a reasonable timeframe. By using She Model Tech's platform, you acknowledge that you have read and understood this Privacy Policy.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
              <Link to="/solutions/terms" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '10px 16px', textDecoration: 'none', color: '#818cf8', fontFamily: 'system-ui,sans-serif', fontSize: 14, fontWeight: 600 }}>
                📋 Terms of Service
              </Link>
              <Link to="/solutions" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '10px 16px', textDecoration: 'none', color: '#22c55e', fontFamily: 'system-ui,sans-serif', fontSize: 14, fontWeight: 600 }}>
                🏠 Back to Home
              </Link>
            </div>
          </PPSection>

          {/* Footer */}
          <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
            <p style={{ color: '#4b5563', fontFamily: 'system-ui,sans-serif', fontSize: 13 }}>
              © {new Date().getFullYear()} She Model Tech. All rights reserved.&nbsp;·&nbsp;
              <Link to="/solutions" style={{ color: '#22c55e', textDecoration: 'none' }}>Home</Link>&nbsp;·&nbsp;
              <Link to="/solutions/terms" style={{ color: '#818cf8', textDecoration: 'none' }}>Terms of Service</Link>
            </p>
          </div>
        </main>
      </div>

      <style>{`
        /* Desktop sidebar */
        @media (min-width: 900px) {
          .pp-toc { display: block !important; }
          .mobile-toc-btn { display: none !important; }
          .mobile-toc-panel { display: none !important; }
          .pp-page-layout { gap: 40px !important; }
        }
        /* Mobile TOC button */
        @media (max-width: 899px) {
          .mobile-toc-btn { display: flex !important; align-items: center; }
          .pp-page-layout { gap: 0 !important; }
        }
        @media (max-width: 640px) {
          .pp-page-layout { padding: 24px 12px 60px !important; }
        }
        * { box-sizing: border-box; }
        p  { color: #d1d5db; font-family: system-ui,sans-serif; font-size: 15px; line-height: 1.85; margin-bottom: 14px; }
        ul { color: #d1d5db; font-family: system-ui,sans-serif; font-size: 15px; line-height: 1.85; padding-left: 20px; margin-bottom: 14px; }
        li { margin-bottom: 8px; }
        strong { color: #f9fafb; }
        a  { color: #22c55e; }
        @media (max-width: 480px) { p, ul { font-size: 14px; line-height: 1.75; } li { margin-bottom: 6px; } }
        .pp-section-body { padding-left: 0; }
        @media (min-width: 600px) { .pp-section-body { padding-left: 54px; } }
      `}</style>
    </div>
  );
};

/* ─── Sub-components ─── */

const PPSection = ({ id, number, title, icon, children, highlight }) => (
  <section id={id} style={{ marginBottom: 52, scrollMarginTop: 90 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
      <div style={{ minWidth: 42, width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: highlight ? 'linear-gradient(135deg,rgba(34,197,94,0.15),rgba(99,102,241,0.15))' : 'rgba(255,255,255,0.05)', border: highlight ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)', fontSize: 19 }}>{icon}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', fontFamily: 'system-ui,sans-serif', marginBottom: 2 }}>Section {number}</span>
        <h2 style={{ margin: 0, fontSize: 'clamp(16px,2.8vw,22px)', fontWeight: 700, letterSpacing: '-0.3px', color: '#f3f4f6', fontFamily: "'Georgia',serif", wordBreak: 'break-word' }}>{title}</h2>
      </div>
    </div>
    <div className="pp-section-body">{children}</div>
    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginTop: 44 }} />
  </section>
);

const Subsection = ({ title, children }) => (
  <div style={{ marginBottom: 26 }}>
    <h3 style={{ fontFamily: "'Georgia',serif", fontSize: 'clamp(13px,2vw,15px)', fontWeight: 600, color: '#e5e7eb', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{title}</h3>
    {children}
  </div>
);

const PPCallout = ({ color, icon, title, children }) => {
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

export default PrivacyPolicy;
