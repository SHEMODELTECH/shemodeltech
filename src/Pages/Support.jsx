import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';

const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSeauqCwIMFBBxpnoaLtqIqNZUtu4V-0Uw-bXYYZ2yd9SK0RFA/formResponse';
const ENTRIES = { firstName: 'entry.1736029807', lastName: 'entry.1461328379', email: 'entry.1232544873', phone: 'entry.1937366356', message: 'entry.179653384' };

const Support = () => {
  const { currentUser } = useAuth();
  const getFirstName = () => currentUser?.displayName?.split(' ')[0] || '';
  const getLastName = () => { const p = (currentUser?.displayName || '').split(' '); return p.slice(1).join(' ') || ''; };

  const [form, setForm] = useState({ firstName: getFirstName(), lastName: getLastName(), email: currentUser?.email || '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    const body = new URLSearchParams();
    Object.entries(ENTRIES).forEach(([k, v]) => body.append(v, form[k]));
    try { await fetch(GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() }); } catch (_) {}
    setSending(false);
    setSubmitted(true);
  };

  const faqs = [
    { q: 'What is She Model Tech?', a: 'She Model Tech is where women build real tech experience. You join a team of women at different levels, ship a real product over eight weeks, and earn verified badges that show employers exactly what you built. Free, always.' },
    { q: 'Is She Model Tech free to use?', a: 'Yes, completely. There are no plans, no upgrades, and no paid tier for members. Every member gets unlimited collaborative projects, all six badge tracks, full Talent Board access, unlimited messaging, community and project workspaces, and a verifiable certificate on completion. Nothing is held back and nothing is metered. We are funded by the companies who hire from us, never by the women who learn here.' },
    { q: 'How do badges and Top Talent visibility work together?', a: 'Every badge you earn makes you more visible. Companies have a Top Talent view on the Proof Wall that surfaces members who recently earned badges, linking straight to their profile - and earning your first badge is what lists you on the Talent Board, where hiring companies search for talent.' },
    { q: 'How do I get the most out of the Proof Wall?', a: 'Share regular project updates so hiring companies can see your progress and real work. When you post an update, link your final result - a live site, demo, or published work - rather than your internal workspace, and add an image or screenshot where you can. Consistent, work-focused updates alongside your earned badges are what make hiring companies notice your profile.' },
    { q: 'Are companies on She Model Tech verified?', a: 'Company accounts are self-declared, and we do not currently run an identity check on them. Please do your own due diligence before sharing personal information, signing anything, or starting unpaid work: look at the company profile, its posting history, and its activity on the platform, and search for the organisation independently. Be cautious of anyone who asks for money, bank details, or identity documents. If something seems off, report it through this support page and we will look into it.' },
    { q: 'I am new to tech - where do I start?', a: 'Join a cohort. We do not teach theory here; you learn by building alongside people at different levels, with a project lead who can point you in the right direction. Pick the track closest to what you want to do, apply to a project in a role you can grow into, and ask questions as you go. Most people learn far more in eight weeks of real work than in months of tutorials.' },
    { q: 'How do projects work?', a: 'Project owners post projects with team roles, and members apply to join. Once accepted, teams collaborate through the project workspace. There are two types: FREE collaborative projects, where badges are automatically awarded on completion based on each member\'s role - these are about gaining real experience and proof of skill; and PAID projects (posted by companies), where each role carries a pay-per-person amount you see before applying - on paid projects you are compensated with money instead of badges.' },
    { q: 'Does She Model Tech have paid projects?', a: 'Yes. Companies can post paid projects: the pay per person is set for every role and is visible to everyone before applying, so you know exactly what you\'ll earn. Payment happens on verified completion - the owner marks everyone paid, and each member confirms they received it; the project only closes when all confirmations match, and any mismatch opens a dispute reviewed with the She Model Tech team. Paid projects do not award badges - you are compensated with money instead. Your earnings (paid and pending) are tracked on your Account page. Free collaborative projects remain unlimited and are how you earn badges.' },
    { q: 'What does a project lead need to provide?', a: 'As a project lead you are responsible for setting up and running the project, not just claiming it. You must provide a project submission link in the workspace Resources tab. A GitHub repository is recommended because it is free and gives the team a place to store code and track work, but you may use another platform of your choice. This submission link is required: it is how the team work is reviewed and how badges are verified on completion. As lead you also coordinate the team in the Discussion tab and mark the project complete when done. Leading earns a TechLeads (Leadership) badge.' },
    { q: 'What resources should a project lead set up?', a: 'At minimum, a submission link (GitHub or similar) where the work lives. You can also add a meeting link (Zoom or Google Meet) for team calls and a project details link such as a Google Doc describing scope and tasks. These live in the workspace Resources tab and help the team collaborate and get the work reviewed.' },
    { q: 'How does the project approval process work?', a: 'When the work is done, the project lead submits the project for review from the Complete Project page. The submission includes the submission link from the Resources tab (a folder, such as a GitHub repository, containing all the team work, the list of team members, and the final solutions) and the project workspace link, which is added automatically. The She Model Tech team reviews it and can: (1) Approve it, after which the lead can assign badges to the team; (2) Request changes, sending it back with feedback so the team can improve and re-submit (this can happen as many times as needed); or (3) Reject it, in which case no badges are assigned and the project cannot be re-submitted. The lead, and the team, are notified at each step.' },
    { q: 'What makes a strong final project submission?', a: 'Your final presentation should speak to both technical and non-technical audiences: explain what the project does and why it matters in plain language, and also show the technical depth (architecture, key decisions, code). Deploy the project to a live URL if it is something that should run online, or provide a working prototype if a full deployment is not needed. Your submission folder should clearly include all team members and their roles, the final solution and source code, and any documentation or demo links. The goal is that a reviewer, technical or not, can understand what was built, who built it, and how to see it working.' },
    { q: 'How are badges earned, and how do levels work?', a: 'Badges are earned automatically when a project is completed, based on your role: developers earn TechDev, QA earn TechQA, product/project owners earn TechPO, leaders earn TechLeads, low/no-code builders earn TechArchs, security specialists earn TechGuard. Levels progress with how many badges you hold in a track: Novice (1 badge, steel ring), Associate (2-5, bronze ring), Advanced (6-10, silver ring), Expert (11+, gold ring).' },
    { q: 'What are the 6 TechTalent Badges?', a: 'TechDev (Coding Developers), TechArchs (Low/No-Code Developers), TechQA (Quality Testers), TechGuard (Network & Cybersecurity, Cloud & DevOps), TechPO (Product/Project Owners), and TechLeads (Non-Technical Roles). Each has 4 levels: Novice, Associate, Advanced, and Expert.' },
    { q: 'Do project owners earn badges too?', a: 'Yes! Project owners automatically receive a TechLeads (Leadership) badge when they complete a project, plus a certificate documenting the project, team size, and badges awarded.' },
    { q: 'Can I control who sees my email?', a: 'Yes. Go to Settings and toggle Email Visibility on or off. When set to private, your email is hidden from other members. They can still message you through the platform.' },
    { q: 'What is the Talent Board?', a: 'The Talent Board is a searchable directory where companies discover women by skill track, experience level, and badges earned. Being LISTED is free: you appear automatically once you earn your first badge by completing a project, and the more badges you earn, the stronger your profile looks. Browsing is free too - every signed-in member has full access to the board and can message anyone on it, with no caps.' },
    { q: 'How do I report inappropriate content or users?', a: 'Use this support form below to report any issues. Include the username, content description, and any screenshots. Our team will review and take action.' },
    { q: 'Is my data safe?', a: 'Yes. All data is stored securely with encrypted connections. See our Privacy Policy for full details.' },
  ];

  const inputClass = "w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-all";

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Support</h1>
      <p className="text-gray-500 text-sm mb-8">Find answers or contact us.</p>

      {/* Direct contact - open to every member */}
      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-8">
        <p className="text-gray-900 text-sm font-semibold">Email us directly</p>
        <p className="text-gray-600 text-xs">
          Every member can reach the team at{' '}
          <a href={`mailto:${BRAND.supportEmail}`} className="text-pink-600 font-medium hover:underline">{BRAND.supportEmail}</a>, or use the form below.
        </p>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-gray-900 text-sm font-medium pr-4">{faq.q}</span>
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h2>
        {submitted ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-pink-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-900 font-semibold mb-1">Message sent!</p>
            <p className="text-gray-500 text-sm">We'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">First Name *</label>
                <input type="text" value={form.firstName} onChange={handleChange('firstName')} className={inputClass} required />
              </div>
              <div>
                <label className="block text-gray-700 text-xs font-medium mb-1">Last Name</label>
                <input type="text" value={form.lastName} onChange={handleChange('lastName')} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">Email *</label>
              <input type="email" value={form.email} onChange={handleChange('email')} className={inputClass} required />
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">Message *</label>
              <textarea value={form.message} onChange={handleChange('message')} rows={4} className={inputClass + " resize-none"} placeholder="Describe your issue or question..." required />
            </div>
            <button type="submit" disabled={sending} className="bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-50">
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Support;
