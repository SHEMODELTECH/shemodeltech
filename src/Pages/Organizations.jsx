// src/Pages/Organizations.jsx
// Public "For Organizations" page: training contracts and course licensing,
// with one request form. ?course=Title pre-fills a course (from Learning).
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import SocialLinks from '../components/SocialLinks';
import LimitHint, { countWords } from '../components/LimitHint';
import { useAuth } from '../context/AuthContext';
import { ORG_LIMITS, ORG_TYPES, REQUEST_TYPES, STATUS_LABELS, createOrgRequest, listMyOrgRequests } from '../utils/organizations';
import { getStaff } from '../utils/staffAlerts';
import { useFeatures } from '../utils/features';

const EMPTY = {
  type: 'training',
  orgName: '',
  orgType: 'school',
  learners: '',
  topics: '',
  courses: '',
  format: 'online',
  timeline: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  message: '',
};

const Organizations = () => {
  const { currentUser } = useAuth();
  const [params] = useSearchParams();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const features = useFeatures();
  const interestOnly = !features.orgTraining; // focus mode: register interest
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  // Signed-in requesters see their requests and can chat with our team.
  const [mine, setMine] = useState([]);
  const [teamUid, setTeamUid] = useState(null);
  useEffect(() => {
    if (!currentUser) return;
    listMyOrgRequests(currentUser.uid).then(setMine).catch(() => {});
    getStaff(['admin']).then((s) => s[0] && setTeamUid(s[0].uid)).catch(() => {});
  }, [currentUser, sent]);
  const signIn = () => {
    try {
      sessionStorage.setItem('smt_return_to', `/organizations${window.location.search}#request`);
    } catch (_) {
      /* ignore */
    }
    navigate('/login');
  };

  useEffect(() => {
    const course = params.get('course');
    if (course) {
      setForm((f) => ({ ...f, type: 'licensing', courses: course }));
      setTimeout(() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  }, [params]);

  useEffect(() => {
    if (currentUser?.email) setForm((f) => ({ ...f, contactEmail: f.contactEmail || currentUser.email, contactName: f.contactName || currentUser.displayName || '' }));
  }, [currentUser]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.orgName.trim()) return toast.error('Add your organization’s name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) return toast.error('Add a valid contact email.');
    if (countWords(form.topics) < ORG_LIMITS.topicsMinWords)
      return toast.error(`Describe the topics or courses in at least ${ORG_LIMITS.topicsMinWords} words (you have ${countWords(form.topics)}).`);
    setBusy(true);
    try {
      const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
      const ref = await createOrgRequest(clean, currentUser?.uid || null);
      // Alert the team (inbox + staff) and confirm to the sender, signed in or not.
      fetch('/api/public-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'org', id: ref.id }) }).catch(() => {});
      setSent(true);
    } catch (err) {
      console.error(err);
      toast.error('Could not send your request. Please try again, or email shemodeltech@gmail.com.');
    }
    setBusy(false);
  };

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  const label = 'block text-sm font-semibold text-gray-800 mb-1';
  const hint = 'font-normal text-gray-500';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-pink-600 text-sm font-semibold uppercase tracking-widest">For organizations</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Train your people with She Model Tech</h1>
        <p className="text-gray-600 text-lg mt-3 max-w-3xl">
          Schools, universities, companies, and nonprofits work with us to train students and staff in tech skills.
          Every fee supports our mission as a registered 501(c)(3) nonprofit.
        </p>
        {interestOnly && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-gray-800 max-w-3xl">
            <strong>Training partnerships open soon.</strong> We’re focused on our first training cohorts right now.
            Register your interest below and we’ll contact you when we open training and curriculum partnerships.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5 mt-10">
          <section className="rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Training contracts</h2>
            <p className="text-sm text-gray-600 mt-2">
              We design and deliver training for your learners or staff, online or in person. Our selected mentors
              lead the sessions, and our members can join as paid assistants, gaining real work experience.
            </p>
            <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>Coding, low/no-code, quality testing, cybersecurity, product, and non-technical tech roles</li>
              <li>Hands-on projects, not just lectures</li>
              <li>Certificates for everyone who completes the training</li>
            </ul>
          </section>
          <section className="rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">License our courses</h2>
            <p className="text-sm text-gray-600 mt-2">
              Individual learners always learn free. A license adds what an organization needs to run our courses
              with its own learners.
            </p>
            <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>A dashboard of your learners’ progress, badges, and certificates (with their consent)</li>
              <li>Instructor editions, so your own teachers can run the course</li>
              <li>Invite links that bring your learners onto the platform under your organization</li>
            </ul>
          </section>
        </div>

        <section id="request" className="mt-12 rounded-2xl border border-pink-200 bg-pink-50/40 p-6 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900">Request training or a license</h2>
          <p className="text-sm text-gray-600 mt-1">We reply within a few working days. There’s no commitment until we agree a proposal.</p>
          {!currentUser ? (
            <div className="mt-5 rounded-xl bg-white border border-gray-200 p-5">
              <p className="font-semibold text-gray-900">Sign in to send a request</p>
              <p className="text-sm text-gray-700 mt-1">
                Create a free account (or sign in) first. You’ll follow your request here, get updates in your
                notifications and by email, and can chat with our team before we finalize anything.
              </p>
              <button onClick={signIn} className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2.5 rounded-lg">
                Sign in or create an account
              </button>
            </div>
          ) : sent ? (
            <div className="mt-5 rounded-xl bg-white border border-emerald-200 p-5">
              <p className="font-semibold text-emerald-800">Thank you. Your request has been sent.</p>
              <p className="text-sm text-gray-700 mt-1">
                It went to the She Model Tech team, and we’ve emailed a confirmation to {form.contactEmail}. You’ll get
                updates in your notifications and by email, and you can follow it below.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <span className={label}>What are you interested in?</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(REQUEST_TYPES).map(([k, v]) => (
                    <button key={k} type="button" aria-pressed={form.type === k} onClick={() => setForm({ ...form, type: k })}
                      className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${form.type === k ? 'bg-pink-600 border-pink-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}>{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={label} htmlFor="o-name">Organization name <span className={hint}>(up to {ORG_LIMITS.nameMaxChars} characters)</span></label>
                <input id="o-name" className={input} maxLength={ORG_LIMITS.nameMaxChars} value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="o-type">Organization type</label>
                <select id="o-type" className={input} value={form.orgType} onChange={(e) => setForm({ ...form, orgType: e.target.value })}>
                  {Object.entries(ORG_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="o-learners">Number of learners <span className={hint}>(approximate)</span></label>
                <input id="o-learners" type="number" min="1" className={input} value={form.learners} onChange={(e) => setForm({ ...form, learners: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="o-format">Format</label>
                <select id="o-format" className={input} value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                  <option value="online">Online</option>
                  <option value="in_person">In person</option>
                  <option value="hybrid">Both</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="o-topics">Topics or courses <span className={hint}>(at least {ORG_LIMITS.topicsMinWords} words, up to {ORG_LIMITS.topicsMaxChars} characters)</span></label>
                <textarea id="o-topics" rows={3} className={input} maxLength={ORG_LIMITS.topicsMaxChars} value={form.topics}
                  placeholder="For example: an introduction to Python and web development for 40 first-year students."
                  onChange={(e) => setForm({ ...form, topics: e.target.value })} />
                <LimitHint text={form.topics} minWords={ORG_LIMITS.topicsMinWords} maxChars={ORG_LIMITS.topicsMaxChars} />
              </div>
              {(form.type !== 'training' || form.courses) && (
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="o-courses">Courses you’d like to license <span className={hint}>(optional)</span></label>
                  <input id="o-courses" className={input} value={form.courses} onChange={(e) => setForm({ ...form, courses: e.target.value })} />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className={label} htmlFor="o-timeline">Timeline <span className={hint}>(optional)</span></label>
                <input id="o-timeline" className={input} value={form.timeline} placeholder="For example: starting in January, for 8 weeks" onChange={(e) => setForm({ ...form, timeline: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="o-cname">Contact name</label>
                <input id="o-cname" className={input} value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="o-cemail">Contact email</label>
                <input id="o-cemail" type="email" className={input} value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor="o-cphone">Phone <span className={hint}>(optional)</span></label>
                <input id="o-cphone" type="tel" className={input} value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="o-msg">Anything else? <span className={hint}>(optional, up to {ORG_LIMITS.messageMaxChars} characters)</span></label>
                <textarea id="o-msg" rows={3} className={input} maxLength={ORG_LIMITS.messageMaxChars} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <LimitHint text={form.message} maxChars={ORG_LIMITS.messageMaxChars} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-60">
                  {busy ? 'Sending...' : interestOnly ? 'Register interest' : 'Send request'}
                </button>
              </div>
            </form>
          )}
        </section>

        {currentUser && mine.length > 0 && (
          <section id="my-requests" className="mt-10 scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-900">Your requests</h2>
              {teamUid && (
                <button
                  onClick={() => navigate(`/messages?to=${teamUid}&text=${encodeURIComponent('Hi She Model Tech team, I have a question about our organization request: ')}`)}
                  className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg"
                >
                  Message the She Model Tech team
                </button>
              )}
            </div>
            <ul className="mt-4 space-y-2">
              {mine.map((r) => (
                <li key={r.id} className="border border-gray-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{r.orgName} <span className="font-normal text-gray-500">· {REQUEST_TYPES[r.type]}</span></p>
                    <p className="text-xs text-gray-500">
                      Sent {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : 'just now'}
                    </p>
                  </div>
                  {r.workspaceProjectId && (
                    <a href={`/projects/${r.workspaceProjectId}/workspace`} className="text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg">Open workspace</a>
                  )}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.status === 'declined' ? 'bg-gray-100 text-gray-600' : ['completed', 'active', 'signed', 'approved'].includes(r.status) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                    {STATUS_LABELS[r.status] || r.status}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-2">Final agreements and invoices are handled by email.</p>
          </section>
        )}
      </main>
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>SHE MODEL TECH Inc., a registered 501(c)(3) nonprofit.</p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
};

export default Organizations;
