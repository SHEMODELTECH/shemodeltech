// src/Pages/company/CompanyCohortDetail.jsx
//
// Where a member sees a company-hosted paid project and applies to a role.
//
// Two things are stated plainly on this page, because members deserve to know
// what they're signing up for:
// 1. Pay is shown BEFORE applying, always, per role.
// 2. This project awards NO badge. The company owns and reviews the work;
// we didn't assess it, so we can't certify it. She receives a paid
// work-experience record instead.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
 applyToCompanyCohort, canApplyToCompanyCohort, reportParty,
 COMPANY_COHORT_STATUS,
} from '../../utils/companyCohorts';
import { formatMoney } from '../../utils/paidProjects';

const CompanyCohortDetail = () => {
 const { cohortId } = useParams();
 const { currentUser } = useAuth();
 const navigate = useNavigate();

 const [cohort, setCohort] = useState(null);
 const [loading, setLoading] = useState(true);
 const [eligibility, setEligibility] = useState(null);
 const [myApp, setMyApp] = useState(null);
 const [selectedRole, setSelectedRole] = useState('');
 const [coverNote, setCoverNote] = useState('');
 const [applying, setApplying] = useState(false);
 const [reporting, setReporting] = useState(false);
 const [reportText, setReportText] = useState('');

 useEffect(() => {
 if (!currentUser) { navigate('/login'); return; }
 let dead = false;

 (async () => {
 try {
 const snap = await getDoc(doc(db, 'company_cohorts', cohortId));
 if (dead) return;
 if (!snap.exists()) { setLoading(false); return; }
 setCohort({ id: snap.id, ...snap.data() });

 const [elig, apps] = await Promise.all([
 canApplyToCompanyCohort(currentUser.uid),
 getDocs(query(
 collection(db, 'company_cohort_applications'),
 where('cohortId', '==', cohortId),
 where('applicantUid', '==', currentUser.uid),
 )),
 ]);
 if (dead) return;
 setEligibility(elig);
 if (!apps.empty) setMyApp({ id: apps.docs[0].id, ...apps.docs[0].data() });
 } catch (e) {
 console.error(e);
 toast.error('Could not load this project.');
 } finally {
 if (!dead) setLoading(false);
 }
 })();

 return () => { dead = true; };
 }, [cohortId, currentUser, navigate]);

 const apply = async () => {
 setApplying(true);
 try {
 await applyToCompanyCohort({
 cohortId,
 applicant: {
 uid: currentUser.uid,
 email: currentUser.email,
 displayName: currentUser.displayName,
 photoURL: currentUser.photoURL,
 },
 roleTitle: selectedRole,
 coverNote,
 });
 toast.success('Applied. The company reviews applications directly.');
 setMyApp({ status: 'submitted', roleTitle: selectedRole });
 } catch (e) {
 toast.error(e.message || 'Could not apply.');
 }
 setApplying(false);
 };

 const submitReport = async () => {
 try {
 await reportParty({
 cohortId,
 reporter: { email: currentUser.email, uid: currentUser.uid },
 against: 'company',
 reason: reportText,
 });
 toast.success('Reported. Our team will look into it.');
 setReporting(false);
 setReportText('');
 } catch (e) {
 toast.error(e.message || 'Could not send the report.');
 }
 };

 if (loading) {
 return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>;
 }
 if (!cohort) {
 return (
 <div className="max-w-2xl mx-auto px-4 py-16 text-center">
 <p className="text-gray-600">This project isn&rsquo;t available.</p>
 <Link to="/company-cohorts" className="text-pink-600 font-semibold hover:underline">
 Browse paid projects
 </Link>
 </div>
 );
 }

 const open = cohort.status === COMPANY_COHORT_STATUS.HIRING;

 return (
 <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
 {/* Company header */}
 <div className="flex items-center gap-3 mb-5">
 {cohort.companyLogo && (
 <img src={cohort.companyLogo} alt="" className="w-11 h-11 rounded-lg object-contain bg-gray-50" />
 )}
 <div>
 <p className="font-bold text-gray-900 flex items-center gap-2">
 {cohort.companyName}
 {cohort.companyVerified && (
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 uppercase">
 Verified
 </span>
 )}
 </p>
 <p className="text-gray-500 text-xs">Company-hosted paid project</p>
 </div>
 </div>

 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{cohort.title}</h1>
 <p className="text-gray-700 text-sm whitespace-pre-wrap mb-6 leading-relaxed">
 {cohort.description}
 </p>

 <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8">
 <span><strong className="text-gray-900">Budget:</strong> {formatMoney(cohort.totalBudget)}</span>
 {cohort.startDate && <span><strong className="text-gray-900">Starts:</strong> {cohort.startDate}</span>}
 <span><strong className="text-gray-900">Target:</strong> {cohort.endDate}</span>
 </div>

 {/* What this is and isn't */}
 <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
 <p className="text-gray-900 text-sm font-bold mb-1">This is paid work, not a badge project</p>
 <p className="text-gray-600 text-xs leading-relaxed">
 {cohort.companyName} owns this brief, reviews applications, and pays you
 directly. Because we don&rsquo;t review the work, <strong>no badge is
 awarded</strong>, you&rsquo;ll receive a verified paid
 work-experience record for your profile instead. Badges come from She
 Model Tech cohorts.
 </p>
 </div>

 {/* Roles */}
 <h2 className="font-bold text-gray-900 mb-3">Open roles</h2>
 <div className="space-y-2 mb-8">
 {(cohort.roles || []).map((r, i) => {
 const chosen = selectedRole === r.title;
 return (
 <button
 key={i}
 type="button"
 disabled={!open || !!myApp}
 onClick={() => setSelectedRole(r.title)}
 className={`w-full text-left p-4 rounded-xl border transition-all disabled:opacity-70 ${
 chosen ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white hover:border-gray-300'
 }`}
 >
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <p className="font-semibold text-gray-900 text-sm">{r.title}</p>
 {r.skills && <p className="text-gray-500 text-xs mt-0.5">{r.skills}</p>}
 <p className="text-gray-400 text-xs mt-0.5">
 {r.count} {r.count === 1 ? 'position' : 'positions'}
 </p>
 </div>
 <span className="shrink-0 font-bold text-green-700 text-sm">
 {formatMoney(r.payAmount)}
 </span>
 </div>
 </button>
 );
 })}
 </div>

 {/* Apply */}
 {myApp ? (
 <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
 <p className="text-gray-900 text-sm font-semibold">
 You applied for {myApp.roleTitle}
 </p>
 <p className="text-gray-500 text-xs mt-1">
 Status: {myApp.status}. {cohort.companyName} reviews applications directly.
 </p>
 </div>
 ) : !open ? (
 <p className="text-gray-500 text-sm">Applications are closed for this project.</p>
 ) : eligibility && !eligibility.allowed ? (
 <div className="bg-pink-50 border border-pink-200 rounded-xl p-5">
 <p className="text-gray-900 text-sm font-bold mb-1">Earn a badge first</p>
 <p className="text-gray-600 text-xs mb-3 leading-relaxed">{eligibility.reason}</p>
 <Link to="/cohort" className="text-pink-700 text-sm font-semibold hover:underline">
 See the current cohort
 </Link>
 </div>
 ) : (
 <>
 <textarea
 value={coverNote}
 onChange={e => setCoverNote(e.target.value)}
 rows={4}
 placeholder="Why you're a fit for this role. Mention what you built on your badge project."
 className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none resize-y mb-3"
 />
 <button
 type="button"
 onClick={apply}
 disabled={applying || !selectedRole}
 className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm px-8 py-3 rounded-lg transition-all"
 >
 {applying ? 'Applying…' : selectedRole ? `Apply as ${selectedRole}` : 'Choose a role'}
 </button>
 </>
 )}

 {/* Report */}
 <div className="mt-10 pt-6 border-t border-gray-100">
 {reporting ? (
 <>
 <textarea
 value={reportText}
 onChange={e => setReportText(e.target.value)}
 rows={3}
 placeholder="What happened?"
 className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500 resize-y mb-2"
 />
 <div className="flex gap-3">
 <button onClick={submitReport}
 className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg">
 Send report
 </button>
 <button onClick={() => setReporting(false)}
 className="text-gray-500 text-xs">Cancel</button>
 </div>
 </>
 ) : (
 <button onClick={() => setReporting(true)}
 className="text-gray-400 hover:text-gray-700 text-xs underline">
 Report a problem with this company
 </button>
 )}
 </div>
 </div>
 );
};

export default CompanyCohortDetail;
