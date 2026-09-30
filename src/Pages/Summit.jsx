// src/Pages/Summit.jsx
// Public Summit page: details, agenda, speakers, workshops, free registration
// (members one click; others create a free account first), partner options with
// an inquiry form, and sponsors (logos and names only).
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import SocialLinks from '../components/SocialLinks';
import LimitHint, { countWords } from '../components/LimitHint';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { useFeatures } from '../utils/features';
import { hasPerk } from '../config/tiers';
import {
  PARTNER_OPTIONS,
  PARTNER_OPTION_PERK,
  SUMMIT_LIMITS,
  createPartnerRequest,
  getCurrentSummit,
  getMyRegistration,
  registerForSummit,
  notifyMe,
  getMyInterest,
  workshopTaken,
  updateMyWorkshops,
} from '../utils/summit';

const TYPE_STYLE = {
  keynote: 'bg-pink-100 text-pink-800',
  panel: 'bg-violet-100 text-violet-800',
  workshop: 'bg-amber-100 text-amber-800',
  break: 'bg-gray-100 text-gray-700',
};
const TYPE_LABEL = { keynote: 'Keynote', panel: 'Panel', workshop: 'Workshop', break: 'Break' };

// Days, hours, and minutes until the start date.
const Countdown = ({ date }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);
  if (!date) return null;
  const ms = new Date(`${date}T09:00:00`).getTime() - now;
  if (ms <= 0) return null;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return (
    <div className="flex gap-2 mt-5" aria-label={`${d} days, ${h} hours, ${m} minutes to go`}>
      {[[d, 'days'], [h, 'hours'], [m, 'min']].map(([v, l]) => (
        <div key={l} className="bg-white border border-pink-100 rounded-xl px-3 py-2 text-center min-w-[64px]">
          <p className="text-xl font-bold text-gray-900">{v}</p>
          <p className="text-[11px] text-gray-500">{l}</p>
        </div>
      ))}
    </div>
  );
};
const fmtDate = (d) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '');

const Summit = () => {
  const features = useFeatures();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [summit, setSummit] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [reg, setReg] = useState(null);
  const [share, setShare] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pForm, setPForm] = useState({ companyName: '', contactName: '', contactEmail: '', option: 'booth', message: '' });
  const [pSent, setPSent] = useState(false);
  const [attendees, setAttendees] = useState(null); // recruiters: attendees who opted in
  const [interested, setInterested] = useState(false); // "Notify me" already set
  const [pick, setPick] = useState([]); // workshops to reserve
  const [seats, setSeats] = useState({}); // sessionId -> seats taken
  const [editingWs, setEditingWs] = useState(false);

  useEffect(() => {
    getCurrentSummit().then(setSummit).catch(() => setSummit(null));
  }, []);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => {
      const p = s.data() || {};
      setProfile(p);
      if (p.isCompany) setPForm((f) => ({ ...f, companyName: p.companyProfile?.companyName || p.displayName || '', contactEmail: currentUser.email || '' }));
    }).catch(() => {});
  }, [currentUser]);
  const interestId = summit?.id && !summit.published ? summit.id : 'next';
  useEffect(() => {
    if (!currentUser || summit === undefined) return;
    getMyInterest(summit?.published ? summit.id : summit?.id || 'next', currentUser.uid).then(setInterested).catch(() => {});
  }, [currentUser, summit]);
  const workshops = (summit?.sessions || []).filter((x) => x.type === 'workshop');
  useEffect(() => {
    if (!summit?.published) return;
    Promise.all(workshops.map((w) => workshopTaken(summit.id, w.id).then((n) => [w.id, n]).catch(() => [w.id, 0])))
      .then((pairs) => setSeats(Object.fromEntries(pairs)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summit]);
  const seatsLeft = (w) => (w.seats ? Math.max(0, Number(w.seats) - (seats[w.id] || 0)) : null);
  const askNotify = async () => {
    if (!currentUser) {
      try { sessionStorage.setItem('smt_return_to', '/summit'); } catch (_) { /* ignore */ }
      return navigate('/login');
    }
    try {
      await notifyMe(interestId, currentUser, profile?.displayName);
      setInterested(true);
      toast.success('We’ll email you when registration opens.');
    } catch (e) {
      toast.error('Could not save that. Please try again.');
    }
  };
  const saveMyWorkshops = async () => {
    try {
      await updateMyWorkshops(summit.id, currentUser.uid, pick);
      setReg((r) => ({ ...r, workshops: pick }));
      setEditingWs(false);
      toast.success('Your workshop seats are saved.');
    } catch (e) {
      toast.error('Could not save your workshops.');
    }
  };
  useEffect(() => {
    if (currentUser && summit?.id) getMyRegistration(summit.id, currentUser.uid).then((r) => { setReg(r); if (r?.workshops) setPick(r.workshops); }).catch(() => {});
    if (currentUser && (summit?.recruiterUids || []).includes(currentUser.uid)) {
      getDocs(query(collection(db, 'summitRegistrations'), where('summitId', '==', summit.id), where('shareProfile', '==', true)))
        .then((snap) => setAttendees(snap.docs.map((d) => d.data())))
        .catch(() => setAttendees([]));
    }
  }, [currentUser, summit]);

  const register = async () => {
    if (!currentUser) {
      try {
        sessionStorage.setItem('smt_return_to', '/summit');
      } catch (_) {
        /* ignore */
      }
      return navigate('/login');
    }
    setBusy(true);
    try {
      const full = workshops.filter((w) => pick.includes(w.id) && seatsLeft(w) === 0);
      if (full.length) {
        toast.error(`${full[0].title} is full. Choose another workshop.`);
        setBusy(false);
        return;
      }
      await registerForSummit(summit, currentUser, profile, share, pick);
      setReg({ checkedIn: false, shareProfile: share, workshops: pick });
      toast.success('You’re registered. See you at the Summit!');
    } catch (e) {
      toast.error('Could not register you. Please try again.');
    }
    setBusy(false);
  };

  const sendPartner = async (e) => {
    e.preventDefault();
    if (!pForm.companyName.trim()) return toast.error('Add your company name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pForm.contactEmail.trim())) return toast.error('Add a valid contact email.');
    if (countWords(pForm.message) < SUMMIT_LIMITS.messageMinWords)
      return toast.error(`Tell us a little about what you have in mind: at least ${SUMMIT_LIMITS.messageMinWords} words (you have ${countWords(pForm.message)}).`);
    setBusy(true);
    try {
      const ref = await createPartnerRequest(summit.id, pForm, currentUser && profile?.isCompany ? currentUser.uid : null);
      // Alert the team (inbox + staff) and confirm to the sender, signed in or not.
      fetch('/api/public-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'partner', id: ref.id }) }).catch(() => {});
      setPSent(true);
    } catch (e2) {
      toast.error('Could not send your request. Please try again.');
    }
    setBusy(false);
  };

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  const label = 'block text-sm font-semibold text-gray-800 mb-1';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {summit === undefined ? (
          <p className="text-gray-500">Loading...</p>
        ) : !summit ? (
          <section className="rounded-3xl bg-[#FDF4F8] border border-pink-100 p-8 sm:p-12 text-center">
            <p className="text-pink-700 text-sm font-bold uppercase tracking-widest">She Model Tech Summit</p>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">Our annual conference for women in tech</h1>
            <p className="text-gray-700 mt-3 max-w-xl mx-auto">Keynotes, panels, and hands-on workshops. Details are coming soon.</p>
            <div className="mt-6">
              {interested ? (
                <p className="font-semibold text-emerald-800">✓ We’ll email you when registration opens.</p>
              ) : (
                <button onClick={askNotify} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg">Notify me</button>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Top: the conference at a glance */}
            <section className="rounded-3xl bg-[#FDF4F8] border border-pink-100 p-6 sm:p-10">
              <p className="text-pink-700 text-sm font-bold uppercase tracking-widest">She Model Tech Summit · our annual conference for women in tech</p>
              <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mt-2 tracking-tight">{summit.theme || summit.title}</h1>
              {summit.theme && summit.title && <p className="text-base font-semibold text-gray-700 mt-1">{summit.title}</p>}
              {summit.tagline && <p className="text-lg text-gray-700 mt-2">{summit.tagline}</p>}
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-gray-800 text-sm">
                <span><strong>{fmtDate(summit.startDate)}</strong>{summit.endDate && summit.endDate !== summit.startDate ? ` to ${fmtDate(summit.endDate)}` : ''}</span>
                <span>{summit.venue || 'Location to be announced'}</span>
                <span>Free for members</span>
              </div>
              <Countdown date={summit.startDate} />

              <div className="mt-6">
                {!summit.published ? (
                  interested ? (
                    <p className="font-semibold text-emerald-800">✓ We’ll email you when registration opens.</p>
                  ) : (
                    <button onClick={askNotify} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg">Notify me</button>
                  )
                ) : reg ? (
                  <div>
                    <p className="font-semibold text-emerald-800">✓ You’re registered{reg.checkedIn ? ' and checked in' : ''}.</p>
                    {workshops.length > 0 && !editingWs && (
                      <p className="text-sm text-gray-700 mt-1">
                        Your workshops: {(reg.workshops || []).length ? workshops.filter((w) => (reg.workshops || []).includes(w.id)).map((w) => w.title).join(', ') : 'none yet'}{' '}
                        <button onClick={() => { setPick(reg.workshops || []); setEditingWs(true); }} className="text-pink-700 font-semibold underline">Change</button>
                      </p>
                    )}
                  </div>
                ) : profile?.isCompany ? (
                  <a href="#partner" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg">Take part as a company</a>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <button onClick={register} disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-60">
                      {currentUser ? 'Register free' : 'Create a free account to register'}
                    </button>
                    {currentUser && !profile?.isMinor && (
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} />
                        Let recruiting companies at the Summit see my Talent Board profile
                      </label>
                    )}
                  </div>
                )}
              </div>

              {/* Reserve workshop seats (when registering, or changing later) */}
              {summit.published && currentUser && !profile?.isCompany && workshops.length > 0 && (!reg || editingWs) && (
                <fieldset className="mt-5 bg-white border border-pink-100 rounded-2xl p-4">
                  <legend className="px-1 text-sm font-bold text-gray-900">Reserve workshop seats <span className="font-normal text-gray-500">(optional)</span></legend>
                  <div className="space-y-2 mt-1">
                    {workshops.map((w) => {
                      const left = seatsLeft(w);
                      const mine = (reg?.workshops || []).includes(w.id);
                      const full = left === 0 && !mine;
                      return (
                        <label key={w.id} className={`flex items-start gap-2 text-sm ${full ? 'text-gray-400' : 'text-gray-800'}`}>
                          <input type="checkbox" className="mt-1" disabled={full} checked={pick.includes(w.id)}
                            onChange={(e) => setPick((p) => (e.target.checked ? [...p, w.id] : p.filter((x) => x !== w.id)))} />
                          <span>
                            <strong>{w.title}</strong>{w.start ? ` · ${w.start}${w.end ? `–${w.end}` : ''}` : ''}{w.room ? ` · ${w.room}` : ''}
                            <span className="block text-xs text-gray-500">{left === null ? 'Open seating' : full ? 'Full' : `${left} seat${left === 1 ? '' : 's'} left`}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {reg && editingWs && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={saveMyWorkshops} className="text-sm font-semibold bg-pink-600 text-white px-4 py-2 rounded-lg">Save my workshops</button>
                      <button onClick={() => setEditingWs(false)} className="text-sm font-semibold text-gray-600 px-3 py-2">Cancel</button>
                    </div>
                  )}
                </fieldset>
              )}
            </section>

            {summit.description && <p className="text-gray-700 mt-8 whitespace-pre-wrap leading-relaxed max-w-3xl">{summit.description}</p>}

            {/* Agenda */}
            <section id="agenda" className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
              {(summit.sessions || []).length === 0 ? (
                <p className="text-gray-600 mt-2">Agenda coming soon.</p>
              ) : (
                <ul className="mt-4 divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-white">
                  {[...summit.sessions].sort((x, y) => String(x.start || '').localeCompare(String(y.start || ''))).map((x) => (
                    <li key={x.id} className="flex flex-wrap sm:flex-nowrap gap-3 p-4">
                      <span className="w-24 shrink-0 text-sm font-semibold text-gray-700">{x.start || ''}{x.end ? `–${x.end}` : ''}</span>
                      <div className="min-w-0 flex-1">
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${TYPE_STYLE[x.type] || TYPE_STYLE.break}`}>{TYPE_LABEL[x.type] || 'Session'}</span>
                        <p className="font-semibold text-gray-900 mt-1">{x.title}</p>
                        <p className="text-sm text-gray-600">
                          {[x.room, ...(x.speakerIds || []).map((id) => (summit.speakerList || []).find((sp) => sp.id === id)?.name).filter(Boolean)].filter(Boolean).join(' · ')}
                          {x.type === 'workshop' && x.seats ? ` · ${x.seats} seats` : ''}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Speakers (only once added) */}
            {(summit.speakerList || []).length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">Speakers</h2>
                <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {summit.speakerList.map((sp) => (
                    <li key={sp.id} className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
                      {sp.photoUrl ? (
                        <img src={sp.photoUrl} alt="" className="w-20 h-20 rounded-full object-cover mx-auto" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-800 font-bold text-xl flex items-center justify-center mx-auto">{(sp.name || '?').charAt(0)}</div>
                      )}
                      <p className="font-semibold text-gray-900 mt-2">{sp.name}</p>
                      <p className="text-xs text-gray-600">{[sp.role, sp.company].filter(Boolean).join(', ')}</p>
                      {sp.bio && <p className="text-xs text-gray-500 mt-2">{sp.bio}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Exhibitors and partners (approved Summit requests) */}
            {(summit.exhibitors || []).length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">Exhibitors and partners</h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {summit.exhibitors.map((e) => (
                    <li key={e.id} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm">
                      <span className="font-semibold text-gray-900">{e.name}</span>
                      <span className="text-gray-500"> · {PARTNER_OPTIONS[e.option] || e.option}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs */}
            {(summit.faqs || []).length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
                <div className="mt-4 space-y-2">
                  {summit.faqs.map((f, i) => (
                    <details key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                      <summary className="font-semibold text-gray-900 cursor-pointer">{f.q}</summary>
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {(summit.sponsors || []).length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-gray-900">Thank you to our sponsors</h2>
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  {summit.sponsors.map((s) => (
                    <a key={s.name} href={s.url || undefined} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                      {s.logoUrl ? <img src={s.logoUrl} alt={s.name} className="h-12 w-auto object-contain" /> : null}
                      <span className="text-sm font-semibold text-gray-700">{s.name}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {attendees && (
              <section className="mt-10 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6">
                <h2 className="text-xl font-bold text-gray-900">Attendees open to recruiters ({attendees.length})</h2>
                <p className="text-sm text-gray-600 mt-1">Only attendees who chose to share their Talent Board profile appear here.</p>
                <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                  {attendees.map((a) => (
                    <li key={a.uid} className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{a.name}</span>
                      <Link to={`/profile/${encodeURIComponent(a.email)}`} className="text-xs font-semibold text-indigo-700 hover:underline">View profile</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section id="partner" className="mt-12 rounded-2xl border border-gray-200 p-6 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900">Partner with the Summit</h2>
              <p className="text-sm text-gray-600 mt-1">
                Meet women building real tech careers. Sponsored workshops are labeled as sponsored, and sponsorships are
                acknowledged with your logo and name.
              </p>
              <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.values(PARTNER_OPTIONS).map((o) => <li key={o} className="rounded-lg bg-gray-50 px-3 py-2">{o}</li>)}
              </ul>
              {summit.partnerOptions && <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{summit.partnerOptions}</p>}
              {pSent ? (
                <p className="mt-5 font-semibold text-emerald-800">Thank you. We’ll be in touch at {pForm.contactEmail}.</p>
              ) : features.companyTiers && !Object.keys(PARTNER_OPTIONS).some((k) => hasPerk(profile, PARTNER_OPTION_PERK[k], true)) ? (
                <p className="mt-5 text-sm text-gray-700">
                  Summit tables, workshops, panels, and speaking slots come with our company tiers.{' '}
                  <a href="/premium" className="text-pink-700 font-semibold underline">See the tiers</a>
                </p>
              ) : (
                <form onSubmit={sendPartner} className="mt-5 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label} htmlFor="p-co">Company</label>
                    <input id="p-co" className={input} maxLength={150} value={pForm.companyName} onChange={(e) => setPForm({ ...pForm, companyName: e.target.value })} />
                  </div>
                  <div>
                    <label className={label} htmlFor="p-opt">Option</label>
                    <select id="p-opt" className={input} value={!features.companyTiers || hasPerk(profile, PARTNER_OPTION_PERK[pForm.option], true) ? pForm.option : ''} onChange={(e) => setPForm({ ...pForm, option: e.target.value })}>
                      {Object.entries(PARTNER_OPTIONS)
                        .filter(([k]) => !features.companyTiers || hasPerk(profile, PARTNER_OPTION_PERK[k], true))
                        .map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={label} htmlFor="p-name">Contact name</label>
                    <input id="p-name" className={input} value={pForm.contactName} onChange={(e) => setPForm({ ...pForm, contactName: e.target.value })} />
                  </div>
                  <div>
                    <label className={label} htmlFor="p-email">Contact email</label>
                    <input id="p-email" type="email" className={input} value={pForm.contactEmail} onChange={(e) => setPForm({ ...pForm, contactEmail: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label} htmlFor="p-msg">
                      Message <span className="font-normal text-gray-500">(at least {SUMMIT_LIMITS.messageMinWords} words, up to {SUMMIT_LIMITS.messageMaxChars} characters)</span>
                    </label>
                    <textarea id="p-msg" rows={3} className={input} maxLength={SUMMIT_LIMITS.messageMaxChars} value={pForm.message} onChange={(e) => setPForm({ ...pForm, message: e.target.value })} />
                    <LimitHint text={pForm.message} minWords={SUMMIT_LIMITS.messageMinWords} maxChars={SUMMIT_LIMITS.messageMaxChars} />
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={busy} className="bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">Send partner request</button>
                  </div>
                </form>
              )}
            </section>
          </>
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

export default Summit;
