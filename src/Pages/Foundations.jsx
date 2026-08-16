// src/Pages/Foundations.jsx
// Foundations is a growing library of practical, project-based courses. Courses are
// authored as markdown under src/Pages/courses/<Track>/ and pulled in at build time,
// so the library keeps expanding as new emerging-tech skills are added to the folder.
//
// The page has two levels:
// 1. A track's course library (cards, one per course, with progress).
// 2. A single course reader (full rendered markdown, jump-to-project contents,
// mark complete). Finishing a course marks the learner ready for that track.
// The community-contributions section (member-authored lessons) is unchanged.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
 submitContribution, getApprovedForTrack, rateContribution, levelForTrack, eligibleTrackList, badgeTrackIds,
} from '../utils/foundationsContributions';
import { coursesForTrack, getCourse, trackMeta, tracksWithCourses, trackHasCourses } from '../utils/foundationsCourses';
import { renderCourse } from '../utils/renderCourseMarkdown';
import { getVideoEmbed } from '../utils/videoEmbed';
import { toast } from 'react-toastify';

// Community contributions (member-authored lessons + ratings) are hidden from the UI
// for now. Backend/Firestore logic in utils/foundationsContributions.js is untouched,
// so flipping this back to true restores the feature.
const SHOW_COMMUNITY_CONTRIBUTIONS = false;

const Foundations = () => {
 const { currentUser } = useAuth();
 const navigate = useNavigate();
 const location = useLocation();
 const contributeRef = useRef(null);
 const readerTopRef = useRef(null);
 const [track, setTrack] = useState(null);
 const [allTracks, setAllTracks] = useState([]); // tracks shown as tabs
 const [completed, setCompleted] = useState({}); // { courseSlug: true } for current track
 const [activeSlug, setActiveSlug] = useState(null); // open course, or null for the library view
 const [showContents, setShowContents] = useState(false);
 const [loading, setLoading] = useState(true);
 const [userData, setUserData] = useState(null);
 const [community, setCommunity] = useState([]);
 const [showContribute, setShowContribute] = useState(false);
 const [workspaceContributor, setWorkspaceContributor] = useState(false);
 const [cForm, setCForm] = useState({ title: '', url: '', description: '' });
 const [cTrack, setCTrack] = useState('');
 const [submitting, setSubmitting] = useState(false);
 const [myRatings, setMyRatings] = useState({});

 useEffect(() => {
 if (!currentUser) { setLoading(false); return; }
 let active = true;
 (async () => {
 try {
 const snap = await getDoc(doc(db, 'users', currentUser.uid));
 const data = snap.exists() ? snap.data() : {};
 if (!active) return;
 setUserData(data);

 // Which tracks does this learner see? Every track they hold a badge in, plus
 // their profile track, kept only where courses actually exist. Admins review
 // every track with courses; companies get the badges guide.
 const ordered = [];
 badgeTrackIds(data).forEach((t) => { if (t && !ordered.includes(t)) ordered.push(t); });
 if (data.primarySkillTrack && !ordered.includes(data.primarySkillTrack)) ordered.push(data.primarySkillTrack);

 let valid = ordered.filter((t) => trackHasCourses(t));
 // Foundations is free in EVERY track: individuals see all tracks with
 // courses, so a TechDev exploring TechGuard (or any other role) can
 // study that track before taking it on. Their own tracks (badges +
 // primary) stay first; the rest follow. The company badges guide is
 // excluded for individuals.
 tracksWithCourses().forEach((t) => {
 if (t !== 'company' && !valid.includes(t)) valid.push(t);
 });
 // Admins and editors review/see every track that has courses.
 if (data.role === 'admin' || data.role === 'editor') valid = tracksWithCourses();
 if (data.isCompany) valid = trackHasCourses('company') ? ['company'] : [];
 // Fallback so the page is never empty: browse whatever courses exist.
 const tabs = valid.length ? valid : tracksWithCourses();
 if (active) setAllTracks(tabs);

 const trackId = tabs[0] || null;
 setTrack(trackId);
 setCompleted((data.foundationsCourses && data.foundationsCourses[trackId]) || {});
 if (trackId) {
 try {
 const items = await getApprovedForTrack(trackId);
 if (active) setCommunity(items);
 } catch (_) { /* community optional */ }
 }
 } catch (e) {
 console.error('Foundations load error:', e);
 if (active) { const tabs = tracksWithCourses(); setAllTracks(tabs); setTrack(tabs[0] || null); }
 }
 if (active) setLoading(false);
 })();
 return () => { active = false; };
 }, [currentUser]);

 // Arriving from a dashboard/workspace "Contribute" button opens the form.
 useEffect(() => {
 if (loading) return;
 const params = new URLSearchParams(location.search);
 const fromWs = params.get('fromWorkspace') === '1';
 if (fromWs) setWorkspaceContributor(true);
 if (params.get('contribute') === '1' && (fromWs || eligibleTrackList(userData).length > 0)) {
 setShowContribute(true);
 setTimeout(() => contributeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
 }
 }, [loading, location.search, userData]);

 const courses = coursesForTrack(track);
 const doneCount = courses.filter((c) => completed[c.slug]).length;
 const total = courses.length;
 const isCompany = track === 'company';

 const markComplete = useCallback(async (slug) => {
 const wasFirst = Object.keys(completed).length === 0;
 const next = { ...completed, [slug]: true };
 setCompleted(next);
 try {
 await setDoc(doc(db, 'users', currentUser.uid), { [`foundationsCourses.${track}`]: next }, { merge: true });
 // Finishing the first course in a track marks the learner ready for it.
 if (wasFirst) {
 await updateDoc(doc(db, 'users', currentUser.uid), { [`foundationsComplete.${track}`]: true });
 await addDoc(collection(db, 'notifications'), {
 userId: currentUser.uid,
 type: 'foundations_complete',
 message: isCompany
 ? 'You finished the Badges guide. You can now read member profiles with confidence.'
 : 'You completed your first Foundations course. You are ready to join your first project.',
 isRead: false,
 createdAt: serverTimestamp(),
 });
 }
 } catch (e) { console.error('save course progress failed', e); }
 toast.success('Course marked complete.');
 }, [completed, track, currentUser, isCompany]);

 const switchTrack = async (trackId) => {
 if (trackId === track) return;
 setTrack(trackId);
 setActiveSlug(null);
 setShowContribute(false);
 setCompleted((userData?.foundationsCourses && userData.foundationsCourses[trackId]) || {});
 setCommunity([]);
 try { setCommunity(await getApprovedForTrack(trackId)); } catch (_) {}
 };

 const openCourse = (slug) => {
 setActiveSlug(slug);
 setShowContents(false);
 setTimeout(() => readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
 };

 // ---- community contribution helpers (unchanged) ----
 const badgeEligibleTracks = eligibleTrackList(userData);
 const ALL_TRACK_OPTIONS = [
 { id: 'TechDev', label: 'TechDev (Development)' },
 { id: 'TechArchs', label: 'TechArchs (Low/No-Code)' },
 { id: 'TechQA', label: 'TechQA (Quality Assurance)' },
 { id: 'TechGuard', label: 'TechGuard (Security)' },
 { id: 'TechPO', label: 'TechPO (Product/Project Owner)' },
 { id: 'TechLeads', label: 'TechLeads (Non-Technical)' },
 ];
 const myEligibleTracks = workspaceContributor ? ALL_TRACK_OPTIONS : badgeEligibleTracks;
 const eligible = myEligibleTracks.length > 0;

 const handleContribute = async () => {
 const chosenTrack = cTrack || (myEligibleTracks[0] && myEligibleTracks[0].id);
 if (!cForm.title.trim() || !cForm.url.trim() || !cForm.description.trim()) {
 toast.error('Add a title, a link to your content, and a short description.');
 return;
 }
 if (!chosenTrack) { toast.error('Select which track this lesson is for.'); return; }
 setSubmitting(true);
 try {
 const authorLevel = levelForTrack(userData, chosenTrack);
 await submitContribution({
 trackId: chosenTrack,
 title: cForm.title,
 url: cForm.url,
 description: cForm.description,
 authorId: currentUser.uid,
 authorName: userData?.displayName || 'A member',
 authorBadgeLevel: authorLevel,
 });
 toast.success('Submitted for review. We\'ll notify you once it\'s approved.');
 setCForm({ title: '', url: '', description: '' });
 setShowContribute(false);
 } catch (e) {
 toast.error('Could not submit. Please try again.');
 }
 setSubmitting(false);
 };

 const handleRate = async (contributionId, stars) => {
 setMyRatings((p) => ({ ...p, [contributionId]: stars }));
 try {
 await rateContribution(contributionId, currentUser.uid, stars);
 setCommunity((prev) => prev.map((c) => c.id === contributionId
 ? { ...c, ratingSum: (c.ratingSum || 0) + stars, ratingCount: (c.ratingCount || 0) + (myRatings[contributionId] ? 0 : 1) }
 : c));
 toast.success('Thanks for rating.');
 } catch (_) { toast.error('Could not save your rating.'); }
 };

 if (loading) {
 return <div className="max-w-6xl mx-auto"><div className="h-6 w-48 bg-gray-100 rounded animate-pulse" /></div>;
 }

 const meta = trackMeta(track);
 const activeCourse = activeSlug ? getCourse(track, activeSlug) : null;

 return (
 <div className="max-w-6xl mx-auto">
 <style>{COURSE_PROSE_CSS}</style>

 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Foundations</h1>
 <p className="text-gray-500 text-sm mb-4">Practical, beginner-friendly courses that take you from zero to your first real project.</p>

 {/* AI spotlight: the member's cached best-course pick (from the dashboard
 recommendations). Read straight off the already-loaded user doc - no
 extra API call, and the track library below stays in its normal,
 predictable order. Library view only, individuals only. */}
 {!activeSlug && !userData?.isCompany && (() => {
 const pick = userData?.aiRecs?.data?.courses?.[0];
 if (!pick || !getCourse(pick.track, pick.slug)) return null;
 if (userData?.foundationsCourses?.[pick.track]?.[pick.slug]) return null; // already completed
 const openPick = () => {
 if (pick.track !== track) switchTrack(pick.track);
 openCourse(pick.slug);
 };
 return (
 <div className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
 <div className="min-w-0 flex-1">
 <p className="text-[10px] font-bold uppercase tracking-wide text-pink-600 mb-0.5 flex items-center gap-1">
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
 Recommended for you
 </p>
 <button onClick={openPick} className="text-left text-sm font-bold text-gray-900 hover:text-pink-600 leading-snug">
 {pick.title}
 </button>
 {pick.reason && <p className="text-gray-600 text-xs mt-1">{pick.reason}</p>}
 </div>
 <button onClick={openPick} className="flex-shrink-0 self-start sm:self-center bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
 Open course →
 </button>
 </div>
 );
 })()}

 {/* Track selector, dropdown (same control style as the Projects filters) */}
 {allTracks.length > 1 && (
 <div className="mb-4">
 <label htmlFor="foundations-track-select" className="sr-only">Choose a Foundations track</label>
 <div className="relative inline-block w-full sm:w-auto">
 <select
 id="foundations-track-select"
 value={track || ''}
 onChange={(e) => switchTrack(e.target.value)}
 className="w-full sm:w-auto bg-gray-100 border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 min-h-[44px] text-sm font-semibold text-gray-900 focus:border-pink-500 focus:outline-none transition-all appearance-none cursor-pointer"
 >
 {allTracks.map((t) => (
 <option key={t} value={t}>{trackMeta(t).label}</option>
 ))}
 </select>
 <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
 </div>
 <style>{`select option { background-color: #fff; color: #111; }`}</style>
 </div>
 )}

 {!track ? (
 <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
 Courses for your track are on the way. Check back soon.
 </div>
 ) : activeCourse ? (
 /* ============================ COURSE READER ============================ */
 <CourseReader
 course={activeCourse}
 done={!!completed[activeCourse.slug]}
 showContents={showContents}
 setShowContents={setShowContents}
 onBack={() => setActiveSlug(null)}
 onComplete={() => markComplete(activeCourse.slug)}
 topRef={readerTopRef}
 />
 ) : (
 /* ============================ COURSE LIBRARY =========================== */
 <>
 <p className="text-pink-600 text-sm font-semibold mb-1">{meta.label}</p>
 <p className="text-gray-500 text-sm mb-5">{meta.intro}</p>

 {total > 0 && (
 <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-semibold text-gray-900">{doneCount} of {total} course{total === 1 ? '' : 's'} complete</span>
 {doneCount >= 1 && !isCompany && <span className="text-sm font-semibold text-green-600">Ready to join a project</span>}
 </div>
 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
 <div className="h-full bg-pink-600 transition-all" style={{ width: total ? `${(doneCount / total) * 100}%` : '0%' }} />
 </div>
 </div>
 )}

 {doneCount >= 1 && !isCompany && (
 <div className="bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-200 rounded-xl p-6 text-center mb-6">
 <h2 className="text-xl font-bold text-gray-900 mb-1">You're ready.</h2>
 <p className="text-gray-600 text-sm mb-4">You've finished a full Foundations course. Put it to work on a real project and start earning your badge. Come back any time to work through more courses.</p>
 <button onClick={() => navigate('/dashboard')} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all">
 Find your first project
 </button>
 </div>
 )}

 {total === 0 ? (
 <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
 Courses for this track are on the way. Check back soon.
 </div>
 ) : (
 <div className="grid sm:grid-cols-2 gap-4 mb-8">
 {courses.map((c) => {
 const isDone = !!completed[c.slug];
 return (
 <button key={c.slug} onClick={() => openCourse(c.slug)}
 className={`text-left rounded-2xl border p-5 transition-all hover:shadow-md ${isDone ? 'border-green-200 bg-green-50/40' : 'border-gray-200 bg-white hover:border-pink-300'}`}>
 <div className="flex items-start justify-between gap-3 mb-2">
 <h3 className="text-base font-bold text-gray-900 leading-snug">{cleanCourseTitle(c.title)}</h3>
 {isDone && (
 <span className="flex-shrink-0 text-[11px] font-semibold text-green-600 flex items-center gap-1">
 <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
 Done
 </span>
 )}
 </div>
 {c.summary && <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{c.summary}</p>}
 <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 font-medium">
 {c.projects > 0 && <span>{c.projects} hands-on project{c.projects === 1 ? '' : 's'}</span>}
 <span className="text-pink-600 font-semibold ml-auto">{isDone ? 'Review' : 'Start'} &rarr;</span>
 </div>
 </button>
 );
 })}
 </div>
 )}

 {/* From the community: member-authored lessons (hidden from UI, see flag above) */}
 {SHOW_COMMUNITY_CONTRIBUTIONS && (community.length > 0 || eligible) && (
 <div className="mt-2" ref={contributeRef}>
 <div className="flex items-center justify-between mb-3">
 <h2 className="text-base font-bold text-pink-600">From the community</h2>
 {eligible && (
 <button onClick={() => setShowContribute((s) => !s)} className="text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 px-3 py-1.5 rounded-lg">
 {showContribute ? 'Cancel' : '+ Contribute a lesson'}
 </button>
 )}
 </div>

 {eligible && !showContribute && (
 <p className="text-sm text-gray-500 mb-3">{workspaceContributor
 ? 'As a project collaborator you can contribute a lesson to any track to help newcomers and get rated. No badge needed.'
 : `You're an ${myEligibleTracks.map((t) => `${t.level} in ${t.id}`).join(', ')}. You can contribute a lesson to ${myEligibleTracks.length > 1 ? 'those tracks' : `the ${myEligibleTracks[0].id} track`} to help newcomers and boost your ranking.`}</p>
 )}

 {eligible && showContribute && (
 <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3">
 <p className="text-xs text-gray-500">Teach. Help others. Get rated.</p>
 {myEligibleTracks.length > 1 ? (
 <select value={cTrack || myEligibleTracks[0].id} onChange={(e) => setCTrack(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900">
 {myEligibleTracks.map((t) => <option key={t.id} value={t.id}>{t.id} - {t.label}{t.level ? ` (${t.level})` : ''}</option>)}
 </select>
 ) : (
 <p className="text-xs text-pink-600 font-medium">Contributing to: {myEligibleTracks[0]?.id} - {myEligibleTracks[0]?.label}{myEligibleTracks[0]?.level ? ` (${myEligibleTracks[0].level})` : ''}</p>
 )}
 <input value={cForm.title} onChange={(e) => setCForm((p) => ({ ...p, title: e.target.value }))} placeholder="Lesson title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
 <input value={cForm.url} onChange={(e) => setCForm((p) => ({ ...p, url: e.target.value }))} placeholder="Link to your content (YouTube, blog, doc...)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900" />
 <textarea value={cForm.description} onChange={(e) => setCForm((p) => ({ ...p, description: e.target.value }))} placeholder="What does it teach? (1-2 sentences)" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 resize-none" />
 <p className="text-xs text-gray-400">Lessons you publish remain part of She Model Tech's community Foundations, credited to you, even if you later leave.</p>
 <div className="flex justify-end">
 <button onClick={handleContribute} disabled={submitting} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
 {submitting ? 'Submitting...' : 'Submit for review'}
 </button>
 </div>
 </div>
 )}

 <div className="space-y-3">
 {community.map((c) => {
 const avg = c.ratingCount ? (c.ratingSum / c.ratingCount) : 0;
 const mine = myRatings[c.id] || 0;
 return (
 <div key={c.id} className="p-4 rounded-xl border border-gray-200 bg-white">
 <h4 className="text-sm font-bold text-gray-900">{c.title}</h4>
 <p className="text-xs text-gray-500 mt-0.5">By {c.authorName}{c.authorBadgeLevel ? ` · ${c.authorBadgeLevel}` : ''}{c.authorLeft ? ' · former member' : ''}</p>
 <p className="text-sm text-gray-600 mt-1">{c.description}</p>
 {(() => {
 const vid = getVideoEmbed(c.url);
 if (vid) {
 return (
 <div className="mt-3">
 <div className="relative w-full rounded-lg overflow-hidden border border-gray-200" style={{ paddingTop: '56.25%' }}>
 <iframe src={vid.embedUrl} title={c.title} className="absolute top-0 left-0 w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
 </div>
 <p className="text-xs text-gray-400 mt-1">Video by {c.authorName} · plays via {vid.provider}</p>
 </div>
 );
 }
 return (
 <div className="mt-3">
 <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
 Open lesson
 </a>
 </div>
 );
 })()}
 <div className="flex items-center gap-3 mt-3">
 <div className="flex items-center gap-0.5">
 {[1, 2, 3, 4, 5].map((s) => (
 <button key={s} onClick={() => handleRate(c.id, s)} className="text-base leading-none" title={`Rate ${s}`}>
 <span className={(mine || Math.round(avg)) >= s ? 'text-orange-500' : 'text-gray-300'}>★</span>
 </button>
 ))}
 </div>
 <span className="text-xs text-gray-400">{avg ? avg.toFixed(1) : 'No ratings'}{c.ratingCount ? ` (${c.ratingCount})` : ''}</span>
 {userData?.role === 'admin' && (
 <button
 onClick={async () => {
 if (!window.confirm('Remove this lesson from Foundations?')) return;
 try {
 const { doc: dref, deleteDoc } = await import('firebase/firestore');
 await deleteDoc(dref(db, 'foundationsContributions', c.id));
 setCommunity((prev) => prev.filter((x) => x.id !== c.id));
 toast.success('Lesson removed.');
 } catch (_) { toast.error('Could not remove.'); }
 }}
 className="text-xs text-red-500 hover:text-red-700 ml-auto">
 Remove
 </button>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 <p className="text-xs text-gray-400 mt-8 text-center">
 Foundations courses are built and maintained by She Model Tech and updated with new skills over time. Work through a course, then mark it complete to track your progress.
 </p>
 </>
 )}
 </div>
 );
};

// Strip the shared ": Hands-On Project Tutorials" suffix for a cleaner card/reader title.
const cleanCourseTitle = (title) =>
 (title || '').replace(/:?\s*Hands-?On Project Tutorials\s*$/i, '').trim() || title;

// ============================ Course reader ============================
const CourseReader = ({ course, done, showContents, setShowContents, onBack, onComplete, topRef }) => {
 const [rendered, setRendered] = useState({ html: '', toc: [] });
 const proseRef = useRef(null);

 useEffect(() => {
 setRendered(renderCourse(course.markdown));
 }, [course]);

 // Turn ```mermaid blocks into real flowcharts. Mermaid is loaded lazily so it
 // only ships to learners who actually open a course with a diagram.
 useEffect(() => {
 const container = proseRef.current;
 if (!container) return;
 const nodes = Array.from(container.querySelectorAll('.course-mermaid[data-mermaid]'));
 if (!nodes.length) return;
 let cancelled = false;
 import('mermaid').then(({ default: mermaid }) => {
 if (cancelled) return;
 mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict', fontFamily: 'inherit' });
 nodes.forEach((node, i) => {
 const src = node.textContent || '';
 node.removeAttribute('data-mermaid');
 const id = `mmd-${course.slug}-${i}-${Math.random().toString(36).slice(2, 8)}`;
 mermaid.render(id, src)
 .then(({ svg }) => { if (!cancelled) node.innerHTML = svg; })
 .catch(() => { if (!cancelled) node.textContent = src; });
 });
 }).catch(() => {});
 return () => { cancelled = true; };
 }, [rendered.html, course.slug]);

 const jumpTo = (id) => {
 setShowContents(false);
 const el = document.getElementById(id);
 if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
 };

 return (
 <div ref={topRef} className="scroll-mt-24">
 <button onClick={onBack} className="text-sm font-semibold text-gray-600 hover:text-pink-600 inline-flex items-center gap-1 mb-4">
 &larr; All courses
 </button>

 {done && (
 <div className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">
 <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
 Completed
 </div>
 )}

 {/* Contents: jump to any project */}
 {rendered.toc.length > 0 && (
 <div className="bg-white border border-gray-200 rounded-xl mb-5 overflow-hidden">
 <button onClick={() => setShowContents((s) => !s)} className="w-full flex items-center justify-between px-4 py-3 text-left">
 <span className="text-sm font-bold text-gray-900">Contents · {rendered.toc.length} project{rendered.toc.length === 1 ? '' : 's'}</span>
 <span className={`text-gray-400 transition-transform ${showContents ? 'rotate-180' : ''}`}>▾</span>
 </button>
 {showContents && (
 <div className="border-t border-gray-100 max-h-72 overflow-y-auto">
 {rendered.toc.map((h, i) => (
 <button key={h.id} onClick={() => jumpTo(h.id)}
 className="w-full text-left px-4 py-2.5 flex items-center gap-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
 <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-gray-100 text-gray-500">{i + 1}</span>
 <span className="text-sm text-gray-700">{h.text}</span>
 </button>
 ))}
 </div>
 )}
 </div>
 )}

 {/* Rendered course */}
 <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-9 shadow-sm">
 <div ref={proseRef} className="course-prose" dangerouslySetInnerHTML={{ __html: rendered.html }} />

 <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3">
 {!done ? (
 <button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 shadow-sm">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
 Mark course complete
 </button>
 ) : (
 <span className="text-sm font-semibold text-green-600">You've completed this course.</span>
 )}
 <button onClick={onBack} className="text-sm font-semibold text-gray-600 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition-all">
 Back to courses
 </button>
 </div>
 </div>
 </div>
 );
};

// Scoped styles for rendered course markdown (no typography plugin needed).
const COURSE_PROSE_CSS = `
.course-prose { color:#374151; font-size:15px; line-height:1.75; }
.course-prose h1 { font-size:1.7rem; font-weight:800; color:#111827; line-height:1.2; margin:0 0 .5rem; letter-spacing:-.01em; }
.course-prose h2 { font-size:1.3rem; font-weight:800; color:#111827; margin:2.2rem 0 .75rem; padding-top:1.2rem; border-top:1px solid #f1f5f9; scroll-margin-top:6rem; }
.course-prose h1 + p { color:#6b7280; font-size:1rem; }
.course-prose h3 { font-size:1.02rem; font-weight:700; color:#1f2937; margin:1.5rem 0 .5rem; }
.course-prose h4 { font-size:.95rem; font-weight:700; color:#1f2937; margin:1.2rem 0 .4rem; }
.course-prose p { margin:.7rem 0; }
.course-prose ul, .course-prose ol { margin:.6rem 0 .9rem; padding-left:1.4rem; }
.course-prose li { margin:.3rem 0; }
.course-prose ul { list-style:disc; }
.course-prose ol { list-style:decimal; }
.course-prose strong { color:#111827; font-weight:700; }
.course-prose a { color:#F544CB; text-decoration:underline; }
.course-prose hr { border:0; border-top:1px solid #e5e7eb; margin:2rem 0; }
.course-prose blockquote { border-left:4px solid #FCE7F3; padding:.2rem 0 .2rem 1rem; color:#475569; margin:1rem 0; }
.course-prose code { background:#f1f5f9; color:#0f172a; padding:.12rem .38rem; border-radius:.35rem; font-size:.86em; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
.course-prose pre { background:#0f172a; color:#e2e8f0; border-radius:.75rem; padding:1rem 1.15rem; overflow-x:auto; margin:1rem 0; line-height:1.6; box-shadow:0 1px 2px rgba(0,0,0,.06); }
.course-prose pre code { background:transparent; color:inherit; padding:0; font-size:.82rem; }
.course-prose table { width:100%; border-collapse:collapse; margin:1rem 0; font-size:.9rem; }
.course-prose th, .course-prose td { border:1px solid #e5e7eb; padding:.5rem .7rem; text-align:left; }
.course-prose th { background:#f8fafc; font-weight:700; color:#111827; }
.course-prose .course-mermaid { margin:1.25rem 0; padding:1rem; background:#f8fafc; border:1px solid #eef2f7; border-radius:.9rem; overflow-x:auto; text-align:center; }
.course-prose .course-mermaid svg { max-width:100%; height:auto; }
/*
 Diagram box labels were getting their last line clipped. Mermaid renders node
 text as HTML inside a foreignObject and sizes each box to fit that text using a
 tight line-height. But .course-prose sets line-height:1.75, which cascades into
 the injected label and makes the text ~40% taller than the box Mermaid drew, so
 the final line spilled below the box and was cut off. Pinning the label's
 line-height (and clearing inherited paragraph margins) makes the rendered text
 match the box Mermaid measured, so every line stays inside. Fixes all diagrams
 across every track at once.
*/
.course-prose .course-mermaid svg foreignObject,
.course-prose .course-mermaid svg foreignObject > div,
.course-prose .course-mermaid svg .nodeLabel,
.course-prose .course-mermaid svg .edgeLabel,
.course-prose .course-mermaid svg .label { line-height:1.25 !important; }
.course-prose .course-mermaid svg .nodeLabel p,
.course-prose .course-mermaid svg .edgeLabel p { margin:0 !important; line-height:1.25 !important; }
`;

export default Foundations;
