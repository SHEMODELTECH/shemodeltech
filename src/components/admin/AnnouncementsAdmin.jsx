// src/components/admin/AnnouncementsAdmin.jsx
// Admin → Overview: send a one-time announcement to members. Always goes to the
// bell (and phones with notifications on); email is optional. Emails stop at
// 400 per send to stay under Gmail's daily limit.
import React, { useState } from 'react';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { notifyMember, sendEmailNow } from '../../utils/staffAlerts';

// The address emails are sent from (Gmail hides messages you send to yourself).
const SENDER = 'shemodeltech@gmail.com';

const AUDIENCES = [
  ['all', 'All members'],
  ['adults', 'Members 18 and older'],
  ['leads', 'Project leads only'],
];
const EMAIL_CAP = 400;

// Accept any way of writing a link: "/projects", "projects", "shemodeltech.com/summit",
// "https://shemodeltech.com/summit" (all become a page on the site), or another
// website's address (opened as is).
export const normalizeLink = (raw) => {
  const v = String(raw || '').trim();
  if (!v) return '';
  const own = v.match(/^(?:https?:\/\/)?(?:www\.)?shemodeltech\.com(\/.*)?$/i);
  if (own) return own[1] || '/';
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[\w-]+(\.[\w-]+)*\.[a-z]{2,}(\/.*)?$/i.test(v)) return `https://${v}`;
  return v.startsWith('/') ? v : `/${v}`;
};

const AnnouncementsAdmin = () => {
  const { currentUser } = useAuth();
  const [f, setF] = useState({ title: '', body: '', link: '', audience: 'all', email: true });
  const [busy, setBusy] = useState(false);
  const [testTo, setTestTo] = useState('');
  const [testResult, setTestResult] = useState(null); // { ok, text }

  const recipients = async () => {
    const users = (await getDocs(collection(db, 'users'))).docs.map((d) => ({ uid: d.id, ...d.data() }))
      .filter((u) => !u.isCompany && u.onboardingComplete);
    if (f.audience === 'adults') return users.filter((u) => !u.isMinor);
    if (f.audience === 'leads') {
      const ps = (await getDocs(collection(db, 'projects'))).docs.map((d) => d.data())
        .filter((p) => ['setup', 'active', 'overdue'].includes(p.status));
      const leads = new Set(ps.map((p) => p.submitterId).filter(Boolean));
      return users.filter((u) => leads.has(u.uid));
    }
    return users;
  };

  const payload = () => ({
    type: 'announcement',
    title: f.title.trim(),
    body: f.body.trim(),
    link: normalizeLink(f.link) || '/dashboard',
    ctaLabel: 'Open She Model Tech',
  });

  const valid = () => {
    if (f.title.trim().length < 3) { toast.error('Add a title.'); return false; }
    if (f.body.trim().length < 10) { toast.error('Write a short message (at least 10 characters).'); return false; }
    return true;
  };

  const test = async () => {
    if (!valid()) return;
    const to = (testTo.trim() || currentUser.email || '').toLowerCase();
    setBusy(true);
    setTestResult(null);
    // The bell notice goes to you; the email goes to the address above.
    await notifyMember(currentUser.uid, { ...payload(), sendEmail: false });
    if (!f.email) {
      setTestResult({ ok: true, text: 'Test sent to your bell (email is turned off for this announcement).' });
      setBusy(false);
      return;
    }
    const r = await sendEmailNow(to, payload());
    setTestResult(r.ok
      ? { ok: true, text: `Bell notice sent, and the email was accepted for ${to}.${to === SENDER ? ' This is the same address emails are sent from, so Gmail puts it in Sent, not your Inbox. Try your personal email instead.' : ' Check the Inbox, and the Spam or Promotions folder.'}` }
      : { ok: false, text: `Bell notice sent, but the email failed: ${r.error}` });
    setBusy(false);
  };

  const send = async () => {
    if (!valid()) return;
    setBusy(true);
    try {
      const people = await recipients();
      if (!people.length) { toast.error('Nobody matches that audience yet.'); setBusy(false); return; }
      if (!window.confirm(`Send "${f.title.trim()}" to ${people.length} member${people.length === 1 ? '' : 's'}${f.email ? ' (bell and email)' : ' (bell only)'}?`)) { setBusy(false); return; }
      let emailed = 0;
      for (const u of people) {
        const withEmail = f.email && emailed < EMAIL_CAP && u.email;
        await notifyMember(u.uid, { ...payload(), sendEmail: !!withEmail, emailTo: u.email });
        if (withEmail) emailed += 1;
      }
      await addDoc(collection(db, 'announcements'), {
        ...payload(), audience: f.audience, email: f.email, sentTo: people.length, emailed, sentBy: currentUser.email, createdAt: serverTimestamp(),
      }).catch(() => {});
      toast.success(`Sent to ${people.length} member${people.length === 1 ? '' : 's'}${f.email ? `, ${emailed} by email` : ''}.`);
      if (f.email && people.length > EMAIL_CAP) toast.info(`Emails stopped at ${EMAIL_CAP} (Gmail's daily limit). Everyone still got the bell notice.`);
      setF({ title: '', body: '', link: '', audience: 'all', email: true });
    } catch (e) {
      toast.error('Could not send the announcement.');
    }
    setBusy(false);
  };

  const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm';
  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
      <h2 className="text-lg font-bold text-gray-900">Send an announcement</h2>
      <p className="text-xs text-gray-500 mb-3">Goes to members’ notification bell (and phones with notifications on). Email is optional.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-xs font-semibold text-gray-700 sm:col-span-2">Title
          <input className={input} maxLength={90} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="For example: Cohort applications close Friday" />
        </label>
        <label className="text-xs font-semibold text-gray-700 sm:col-span-2">Message
          <textarea className={input} rows={4} maxLength={800} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Link (optional)
          <input className={input} value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} placeholder="shemodeltech.com/projects" />
          <span className="block font-normal text-gray-500 mt-1">Any page on She Model Tech, or another website.{f.link.trim() ? ` Opens: ${normalizeLink(f.link)}` : ''}</span>
        </label>
        <label className="text-xs font-semibold text-gray-700">Who
          <select className={input} value={f.audience} onChange={(e) => setF({ ...f, audience: e.target.value })}>
            {AUDIENCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
          <input type="checkbox" checked={f.email} onChange={(e) => setF({ ...f, email: e.target.checked })} />
          Also send it by email
        </label>
      </div>
      <label className="block text-xs font-semibold text-gray-700 mt-3">Send the test email to
        <input className={input} type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder={`${currentUser?.email || ''} (or your personal email)`} />
      </label>
      {testResult && (
        <p className={`mt-2 text-sm rounded-lg px-3 py-2 ${testResult.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-800'}`}>{testResult.text}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        <button type="button" onClick={test} disabled={busy} className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg disabled:opacity-50">Send a test to me</button>
        <button type="button" onClick={send} disabled={busy} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">{busy ? 'Sending…' : 'Send'}</button>
      </div>
    </div>
  );
};

export default AnnouncementsAdmin;
