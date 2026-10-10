// src/Pages/Contact.jsx
// Contact us (shemodeltech.com/contact): a short form for anyone, signed in or
// not, so the team's email address is never shown publicly. Messages land in
// Admin → Contact messages and the team inbox (api/public-request), and the
// sender gets a confirmation email.
//   ?topic=letter|certificate|account|privacy  pre-selects the topic
//   ?ref=<certificate ID>                       fills in the reference
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { hasLink, NO_LINKS_MSG } from '../utils/noLinks';

export const CONTACT_TOPICS = [
  ['general', 'General question'],
  ['letter', 'Letter request (recommendation or volunteer service)'],
  ['certificate', 'Check a certificate'],
  ['account', 'Sign-in or account help'],
  ['privacy', 'Privacy or my data'],
  ['other', 'Something else'],
];
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

const Contact = () => {
  const { currentUser } = useAuth();
  const [params] = useSearchParams();
  const startTopic = CONTACT_TOPICS.some(([k]) => k === params.get('topic')) ? params.get('topic') : 'general';
  const [f, setF] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    topic: startTopic,
    reference: (params.get('ref') || '').slice(0, 120),
    message: '',
    website: '', // left empty by people; bots fill it in
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.website) { setDone(true); return; } // spam bot: pretend it worked
    if (f.name.trim().length < 2) return toast.error('Enter your full name.');
    if (!isEmail(f.email)) return toast.error('Enter a valid email address, so we can reply.');
    if (f.message.trim().length < 10) return toast.error('Tell us a little more, so we can help.');
    if ([f.name, f.reference, f.message].some(hasLink)) return toast.error(NO_LINKS_MSG);
    setBusy(true);
    try {
      const ref = await addDoc(collection(db, 'contact_messages'), {
        name: f.name.trim().slice(0, 120),
        email: f.email.trim().toLowerCase().slice(0, 200),
        topic: f.topic,
        reference: f.topic === 'certificate' ? f.reference.trim().slice(0, 120) : '',
        message: f.message.trim().slice(0, 3000),
        status: 'new',
        createdAt: serverTimestamp(),
      });
      fetch('/api/public-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'contact', id: ref.id }) }).catch(() => {});
      setDone(true);
    } catch (err) {
      toast.error('Could not send your message. Please try again.');
    }
    setBusy(false);
  };

  const input = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-normal text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200';
  const label = 'block text-sm font-semibold text-gray-800';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-12">
        <div className="max-w-6xl mx-auto [&>*]:max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact us</h1>
          <p className="text-gray-600 mt-1">Send us a message and we’ll reply by email within a few working days.</p>

          {done ? (
            <div className="mt-6 bg-white border border-pink-200 rounded-2xl p-6" role="status">
              <h2 className="text-lg font-bold text-gray-900">Thank you</h2>
              <p className="text-sm text-gray-700 mt-2">We received your message. A copy is on its way to your email.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className={label}>Your name *
                  <input value={f.name} onChange={set('name')} maxLength={120} autoComplete="name" className={input} />
                </label>
                <label className={label}>Email *
                  <input type="email" value={f.email} onChange={set('email')} maxLength={200} autoComplete="email" className={input} />
                </label>
              </div>
              <label className={label}>What is it about?
                <select value={f.topic} onChange={set('topic')} className={input}>
                  {CONTACT_TOPICS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </label>
              {f.topic === 'certificate' && (
                <label className={label}>Certificate ID
                  <input value={f.reference} onChange={set('reference')} maxLength={120} className={input} placeholder="Printed at the bottom of the certificate" />
                </label>
              )}
              <label className={label}>Message * <span className="font-normal text-gray-500">(no web links, please)</span>
                <textarea rows={5} value={f.message} onChange={set('message')} maxLength={3000} className={input}
                  placeholder={f.topic === 'letter' ? 'Which letter you need, what it’s for, and when you need it by.' : 'How can we help?'} />
              </label>
              {/* Spam trap: hidden from people */}
              <input type="text" name="website" value={f.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <button type="submit" disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
                {busy ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
