// src/components/DeadlineBanner.jsx
//
// Shows the whole team where they stand against the deadline, and lets the
// lead request a one-week extension.
//
// Extensions must be APPROVED by a reviewer rather than granted
// automatically. If a lead can extend at will, the deadline stops meaning
// anything and the cohort loses the one thing that makes people finish.

import React, { useState } from 'react';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';
import { daysUntil, GRACE_PERIOD_DAYS } from '../utils/cohorts';

const DeadlineBanner = ({ project }) => {
 const [requesting, setRequesting] = useState(false);
 const [reason, setReason] = useState('');
 const [open, setOpen] = useState(false);

 if (!project?.endDate) return null;
 if (['completed', 'awaiting_payment_confirmation', 'cancelled'].includes(project.status)) {
 return null;
 }

 const daysLeft = daysUntil(project.endDate);
 if (daysLeft === null) return null;

 const graceWindow = GRACE_PERIOD_DAYS + (project.extensionDays || 0);
 const graceUsed = -daysLeft;
 const inGrace = daysLeft < 0 && graceUsed <= graceWindow;
 const lapsed = project.status === 'lapsed' || graceUsed > graceWindow;
 const pending = project.extensionRequest?.status === 'pending';

 const requestExtension = async () => {
 if (!reason.trim()) { toast.error('Tell us briefly why, it helps us say yes.'); return; }
 setRequesting(true);
 try {
 await updateDoc(doc(db, 'projects', project.id), {
 extensionRequest: {
 reason: reason.trim(),
 requestedAt: new Date().toISOString(),
 status: 'pending',
 },
 });
 await addDoc(collection(db, 'admin_notifications'), {
 type: 'extension_requested',
 projectId: project.id,
 projectTitle: project.projectTitle || project.title || 'A project',
 message: reason.trim(),
 isRead: false,
 createdAt: serverTimestamp(),
 });
 toast.success('Extension requested. We\u2019ll come back to you shortly.');
 setOpen(false);
 } catch (e) {
 toast.error('Could not send the request.');
 }
 setRequesting(false);
 };

 // --- Lapsed -------------------------------------------------------
 if (lapsed) {
 return (
 <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-5">
 <p className="text-gray-900 font-bold text-sm mb-1">This project has lapsed</p>
 <p className="text-gray-600 text-xs leading-relaxed">
 The deadline and grace period have passed. Your work stays here and stays
 visible, nothing is deleted. You can still submit late, and a reviewer
 can still award badges for genuine contributions. Talk to us if you want
 to finish it.
 </p>
 </div>
 );
 }

 // --- Grace period -------------------------------------------------
 if (inGrace) {
 const left = graceWindow - graceUsed + 1;
 return (
 <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-5">
 <p className="text-amber-900 font-bold text-sm mb-1">
 Grace period, {left} day{left === 1 ? '' : 's'} left
 </p>
 <p className="text-amber-800 text-xs leading-relaxed">
 The deadline has passed, but you still have time. Badges and certificates
 are awarded after review, so it&rsquo;s worth finishing.
 </p>
 </div>
 );
 }

 // --- Counting down ------------------------------------------------
 const urgent = daysLeft <= 7;
 return (
 <div className={`rounded-xl p-4 mb-5 border ${
 urgent ? 'bg-pink-50 border-pink-300' : 'bg-white border-gray-200'
 }`}>
 <div className="flex items-center justify-between gap-3 flex-wrap">
 <div>
 <p className={`font-bold text-sm ${urgent ? 'text-pink-900' : 'text-gray-900'}`}>
 {daysLeft === 0
 ? 'Deadline is today'
 : `${daysLeft} day${daysLeft === 1 ? '' : 's'} to the deadline`}
 </p>
 <p className="text-gray-500 text-xs mt-0.5">
 Due {project.endDate}
 {project.extensionDays ? ` (extended by ${project.extensionDays} days)` : ''}
 </p>
 </div>
 {pending ? (
 <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 uppercase">
 Extension requested
 </span>
 ) : (
 urgent && (
 <button
 type="button"
 onClick={() => setOpen(!open)}
 className="text-pink-700 text-xs font-semibold underline"
 >
 Request an extension
 </button>
 )
 )}
 </div>

 {open && !pending && (
 <div className="mt-3 pt-3 border-t border-pink-200">
 <textarea
 value={reason}
 onChange={e => setReason(e.target.value)}
 rows={2}
 placeholder="What's held things up? A sentence is fine."
 className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none resize-y mb-2"
 />
 <button
 type="button"
 disabled={requesting}
 onClick={requestExtension}
 className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 text-white text-xs font-semibold px-4 py-2 rounded-lg"
 >
 {requesting ? 'Sending…' : 'Send request'}
 </button>
 </div>
 )}
 </div>
 );
};

export default DeadlineBanner;
