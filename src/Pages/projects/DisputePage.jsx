// src/Pages/projects/DisputePage.jsx - Payment disputes on paid projects.
//
// Who can access a project's dispute room: the ADMIN, the PROJECT OWNER, and
// that project's MEMBERS. A disputed paid project lives here (instead of the
// Project Vault) until it's marked complete - then it moves to the Vault.
//
// What happens here:
//   - Everyone sees the payment table: each member's amount due, adjusted
//     amount (if any), and confirmation status. All pay is visible by design.
//   - A conversation thread lets the admin, owner, and members talk it out.
//     (Mirrors the workspace forum; messages are the dispute's paper trail.)
//   - Owner/Admin can ADJUST a member's amount - the member then confirms the
//     new amount, and their Account earnings update to the adjusted figure.
//   - Members confirm "received" (or the dispute stays open).
//   - Admin "Mark Resolved" force-closes: remaining entries confirm at their
//     current amount and the project moves to the Project Vault.
//
// Routes: /disputes (list: admin sees all open disputes; users see their own)
//         /disputes/:projectId (detail / conversation room)

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, collection, query, where, getDocs, addDoc, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import {
  formatMoney, hasOpenDispute, confirmPaymentReceived, disputePayment,
  adjustMemberPayment, resolveDispute, markOwnerPaidAll,
  isReadyToComplete, healPaidProjectStatus,
} from '../../utils/paidProjects';

const statusPill = (status) => {
  const map = {
    confirmed: ['Confirmed', 'bg-green-100 text-green-700'],
    disputed: ['Disputed', 'bg-red-100 text-red-700'],
    pending: ['Pending', 'bg-amber-100 text-amber-700'],
    forfeited: ['Forfeited', 'bg-gray-200 text-gray-500'],
    left: ['Left', 'bg-gray-200 text-gray-500'],
  };
  const [label, cls] = map[status] || map.pending;
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
};

const formatTime = (ts) => {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const DisputePage = () => {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // List mode
  const [disputes, setDisputes] = useState([]);

  // Detail mode
  const [project, setProject] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [adjusting, setAdjusting] = useState(null); // memberEmail being adjusted
  const [adjustAmount, setAdjustAmount] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [resolveNote, setResolveNote] = useState('');
  const [showResolve, setShowResolve] = useState(false);
  const messagesEndRef = useRef(null);

  // Load current user's admin status
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then(snap => setIsAdmin(snap.exists() && snap.data().role === 'admin'))
      .catch(() => {})
      .finally(() => setProfileLoaded(true));
  }, [currentUser]);

  // Fetch the project (detail mode) or the dispute list (list mode)
  const refreshProject = async () => {
    const snap = await getDoc(doc(db, 'projects', projectId));
    if (!snap.exists()) { toast.error('Project not found'); navigate('/disputes'); return null; }
    const data = { id: snap.id, ...snap.data() };
    // SELF-HEAL: if the owner marked everyone paid and every member confirmed,
    // the project should be 'completed' - flip it now so it stops showing as
    // "awaiting confirmation" for the owner and the team.
    if (isReadyToComplete(data)) {
      const healed = await healPaidProjectStatus(data);
      if (healed) data.status = 'completed';
    }
    setProject(data);
    return data;
  };

  useEffect(() => {
    if (!currentUser || !profileLoaded) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        if (projectId) {
          const data = await refreshProject();
          if (data) {
            // Access: admin + owner + members (incl. anyone in the payment table)
            const isOwner = data.submitterId === currentUser.uid || data.submitterEmail === currentUser.email;
            const isMember = (data.members || []).includes(currentUser.uid)
              || Object.keys(data.paymentConfirmations || {}).includes(currentUser.email);
            if (!isAdmin && !isOwner && !isMember) setAccessDenied(true);
          }
        } else {
          // LIST. Admin -> every open dispute. Everyone else -> paid projects
          // that involve them and are still in the payment-confirmation phase
          // (any entry pending OR disputed), so a member can find the project
          // here to confirm receipt or report a problem. Projects drop off once
          // all payments are confirmed and the project completes (moving to the
          // Project Vault).
          const found = new Map();
          // Unresolved = paid, in the payment phase, with at least one entry that
          // still needs action.
          const unresolved = (p) =>
            p.isPaid && p.status === 'awaiting_payment_confirmation'
            && Object.values(p.paymentConfirmations || {}).some(c => c && (c.status === 'pending' || c.status === 'disputed'));

          if (isAdmin) {
            const snap = await getDocs(query(collection(db, 'projects'), where('status', '==', 'awaiting_payment_confirmation')));
            snap.docs.forEach(d => { const p = { id: d.id, ...d.data() }; if (hasOpenDispute(p)) found.set(p.id, p); });
          } else {
            const involved = new Map();
            try {
              const memberSnap = await getDocs(query(collection(db, 'projects'), where('members', 'array-contains', currentUser.uid)));
              memberSnap.docs.forEach(d => involved.set(d.id, { id: d.id, ...d.data() }));
            } catch (e) { console.log('Member disputes query:', e.message); }
            try {
              const ownerSnap = await getDocs(query(collection(db, 'projects'), where('submitterId', '==', currentUser.uid)));
              ownerSnap.docs.forEach(d => involved.set(d.id, { id: d.id, ...d.data() }));
            } catch (e) { console.log('Owner disputes query:', e.message); }
            // Safety net: catch projects where the user only appears in the
            // payment table by email (their uid may not be in `members`).
            try {
              const paySnap = await getDocs(query(collection(db, 'projects'), where('status', '==', 'awaiting_payment_confirmation')));
              paySnap.docs.forEach(d => {
                const p = { id: d.id, ...d.data() };
                if (Object.keys(p.paymentConfirmations || {}).includes(currentUser.email)) involved.set(d.id, p);
              });
            } catch (e) { console.log('Payee disputes query:', e.message); }

            for (const [id, p] of Array.from(involved.entries())) {
              // Self-heal fully-confirmed projects that are still stuck in
              // the awaiting-confirmation status before filtering.
              if (isReadyToComplete(p)) { if (await healPaidProjectStatus(p)) p.status = 'completed'; }
              if (unresolved(p)) found.set(id, p);
            }
          }
          setDisputes(Array.from(found.values()));
        }
      } catch (e) { console.error('Dispute fetch error:', e); }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, projectId, isAdmin, profileLoaded]);

  // Live conversation thread (mirrors the workspace forum pattern)
  useEffect(() => {
    if (!projectId) return;
    const q = query(collection(db, 'projects', projectId, 'dispute_messages'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, e => console.log('Dispute messages listener:', e.message));
    return unsub;
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isOwner = project && (project.submitterId === currentUser?.uid || project.submitterEmail === currentUser?.email);
  const myEntry = project?.paymentConfirmations?.[currentUser?.email] || null;
  const myAuthorRole = isAdmin ? 'admin' : isOwner ? 'owner' : 'member';

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'projects', projectId, 'dispute_messages'), {
        text: newMessage.trim(),
        authorUid: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL || null,
        authorRole: myAuthorRole, // admin | owner | member
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (e) { toast.error('Could not send message.'); }
    setSending(false);
  };

  const withRefresh = async (fn, successMsg) => {
    setBusy(true);
    try {
      await fn();
      if (successMsg) toast.success(successMsg);
      await refreshProject();
    } catch (e) { toast.error(e.message || 'Action failed.'); }
    setBusy(false);
  };

  const handleConfirmReceived = () => withRefresh(async () => {
    const { completed } = await confirmPaymentReceived(project, currentUser);
    if (completed) { toast.success('All payments confirmed - project moved to the Project Vault!'); navigate('/project-vault'); }
  }, 'Payment confirmed. Thank you!');

  const handleDispute = () => {
    if (!disputeReason.trim()) { toast.error('Please describe the issue - a reason is required.'); return; }
    withRefresh(async () => {
      await disputePayment(project, currentUser, disputeReason.trim());
      setShowDisputeForm(false); setDisputeReason('');
    }, 'Dispute recorded. The owner and admin have been alerted.');
  };

  const handleAdjust = (memberEmail) => {
    const amount = parseFloat(adjustAmount);
    if (!amount || amount < 0) { toast.error('Enter a valid adjusted amount.'); return; }
    withRefresh(async () => {
      await adjustMemberPayment(project, memberEmail, amount, currentUser);
      setAdjusting(null); setAdjustAmount('');
    }, 'Amount adjusted. The member has been asked to confirm the new amount, and their earnings will update once confirmed.');
  };

  const handleOwnerPaidAll = () => withRefresh(async () => {
    const completed = await markOwnerPaidAll(project, currentUser);
    if (completed) { toast.success('All confirmed - project moved to the Project Vault!'); navigate('/project-vault'); }
  }, 'Marked as paid. Members have been asked to confirm receipt.');

  const handleResolve = () => withRefresh(async () => {
    await resolveDispute(project, currentUser, resolveNote.trim() || null);
    setShowResolve(false);
    toast.success('Dispute resolved. Project moved to the Project Vault.');
    navigate('/disputes');
  });

  if (loading || !profileLoaded) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  }

  // ---------------------------------------------------------------- LIST ----
  if (!projectId) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payments &amp; Disputes</h1>
        <p className="text-gray-500 text-sm mb-6">
          {isAdmin
            ? 'All open payment disputes on paid projects. Open one to join the conversation and resolve it.'
            : 'Paid projects that involve you and are awaiting payment confirmation, plus any open disputes. Open one to confirm you were paid or report a problem. A project stays here until every payment is confirmed and it\'s marked complete (then it moves to the Project Vault).'}
        </p>
        {disputes.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-gray-900 font-semibold text-lg mb-2">{isAdmin ? 'No open disputes' : 'Nothing awaiting confirmation'}</p>
            <p className="text-gray-400 text-sm">Completed paid projects with confirmed payments live in the <Link to="/project-vault" className="text-blue-600 hover:underline">Project Vault</Link>.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {disputes.map(p => {
              const entries = Object.values(p.paymentConfirmations || {});
              const disputedCount = entries.filter(e => e?.status === 'disputed').length;
              const pendingCount = entries.filter(e => e?.status === 'pending').length;
              const hasDispute = disputedCount > 0;
              return (
                <div key={p.id} onClick={() => navigate(`/disputes/${p.id}`)} className={`bg-white border rounded-xl p-5 cursor-pointer hover:shadow-sm transition-all ${hasDispute ? 'border-red-200 hover:border-red-400' : 'border-amber-200 hover:border-amber-400'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-gray-900 font-bold text-sm sm:text-base truncate">{p.projectTitle}</h3>
                      <p className="text-gray-500 text-xs mt-1">{entries.length} members · {pendingCount} pending · {disputedCount} disputed · owner: {p.contactName || p.submitterEmail}</p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${hasDispute ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{hasDispute ? 'DISPUTE OPEN' : 'AWAITING CONFIRMATION'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------- DETAIL ----
  if (accessDenied) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-900 font-bold text-lg mb-2">This dispute room is private</p>
        <p className="text-gray-500 text-sm mb-4">Only the admin, the project owner, and that project's members can access it.</p>
        <Link to="/dashboard" className="text-blue-600 text-sm font-semibold hover:underline">Back to Dashboard</Link>
      </div>
    );
  }
  if (!project) return null;

  const entries = Object.entries(project.paymentConfirmations || {});
  const isResolvedOrComplete = project.status === 'completed';

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/disputes" className="inline-flex items-center text-gray-400 hover:text-gray-900 text-sm font-semibold mb-4 transition-colors">← All Disputes</Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{project.projectTitle}</h1>
            <p className="text-gray-500 text-xs mt-1">Owner: {project.contactName || project.submitterEmail} · {isAdmin ? 'You are viewing as ADMIN' : isOwner ? 'You are the project owner' : 'You are a team member'}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">PAID PROJECT</span>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isResolvedOrComplete ? 'bg-blue-100 text-blue-700' : hasOpenDispute(project) ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
              {isResolvedOrComplete ? 'RESOLVED - IN VAULT' : hasOpenDispute(project) ? 'DISPUTE OPEN' : 'AWAITING CONFIRMATIONS'}
            </span>
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-3">She Model Tech verifies that both sides confirmed payment - it does not process or guarantee payments. Everything said and done here is recorded as the dispute's paper trail.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT: Payment table + history */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">Payments</h2>
            <div className="space-y-2">
              {entries.length === 0 && <p className="text-gray-400 text-xs">No payment records on this project.</p>}
              {entries.map(([email, e]) => {
                const isMe = email === currentUser.email;
                const effective = e.amountPaid ?? e.amountDue;
                const wasAdjusted = e.amountPaid != null && Number(e.amountPaid) !== Number(e.amountDue);
                return (
                  <div key={email} className={`rounded-lg border p-3 ${e.status === 'disputed' ? 'bg-red-50 border-red-200' : e.status === 'confirmed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-gray-900 text-sm font-semibold truncate">{e.memberName || email}{isMe ? ' (you)' : ''}</p>
                        <p className="text-gray-500 text-xs">{e.role || 'Team member'} · {email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-gray-900 text-sm font-black">{formatMoney(effective)}</p>
                          {wasAdjusted && <p className="text-gray-400 text-[10px] line-through">{formatMoney(e.amountDue)}</p>}
                        </div>
                        {statusPill(e.status)}
                      </div>
                    </div>
                    {e.disputeReason && (
                      <p className="text-red-700 text-xs mt-2 bg-red-100/60 rounded-md p-2"><strong>Dispute reason:</strong> {e.disputeReason}</p>
                    )}
                    {wasAdjusted && (
                      <p className="text-blue-700 text-[10px] mt-1.5">Adjusted amount - once confirmed, this is what shows in the member's Account earnings.</p>
                    )}

                    {/* Row actions */}
                    {!isResolvedOrComplete && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {/* Member: confirm / dispute my own entry */}
                        {isMe && (e.status === 'pending' || e.status === 'disputed') && (
                          <>
                            <button onClick={handleConfirmReceived} disabled={busy}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
                              I Received {formatMoney(effective)}
                            </button>
                            {e.status === 'pending' && (
                              <button onClick={() => setShowDisputeForm(v => !v)} disabled={busy}
                                className="text-red-600 border border-red-200 hover:bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                                I Was Not Paid
                              </button>
                            )}
                          </>
                        )}
                        {/* Owner/Admin: adjust the amount */}
                        {(isOwner || isAdmin) && !isMe && e.status !== 'confirmed' && (
                          adjusting === email ? (
                            <div className="flex items-center gap-2 w-full">
                              <input type="number" min="0" step="0.01" value={adjustAmount} onChange={ev => setAdjustAmount(ev.target.value)}
                                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none" placeholder={`New amount (was ${formatMoney(effective)})`} />
                              <button onClick={() => handleAdjust(email)} disabled={busy} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50">Save</button>
                              <button onClick={() => { setAdjusting(null); setAdjustAmount(''); }} className="text-gray-500 text-xs px-2">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => { setAdjusting(email); setAdjustAmount(String(effective)); }} disabled={busy}
                              className="text-blue-600 border border-blue-200 hover:bg-blue-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all">
                              Adjust Amount
                            </button>
                          )
                        )}
                      </div>
                    )}
                    {/* Member dispute form */}
                    {isMe && showDisputeForm && !isResolvedOrComplete && (
                      <div className="mt-2 bg-white border border-red-200 rounded-lg p-3">
                        <label className="block text-red-700 text-xs font-semibold mb-1">What happened? * (required)</label>
                        <textarea value={disputeReason} onChange={ev => setDisputeReason(ev.target.value)} rows={2}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-red-400 focus:outline-none resize-none mb-2"
                          placeholder="e.g., I have not received the payment as of today..." />
                        <button onClick={handleDispute} disabled={busy} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg disabled:opacity-50">
                          Open Dispute
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Owner: mark all paid (after adjustments this resets and must be clicked again) */}
            {isOwner && !isResolvedOrComplete && !project.ownerPaidAll && (
              <button onClick={handleOwnerPaidAll} disabled={busy}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-lg transition-all disabled:opacity-50">
                I've Paid Everyone - Ask Members to Confirm
              </button>
            )}
            {project.ownerPaidAll && !isResolvedOrComplete && (
              <p className="text-gray-400 text-xs mt-3 text-center">Owner has marked all payments sent. The project closes when every member confirms receipt.</p>
            )}
          </div>

          {/* Departure records */}
          {(project.leaveReasons || []).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-3">Departures</h2>
              <div className="space-y-2">
                {project.leaveReasons.map((l, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <p className="text-gray-900 text-sm font-semibold">{l.name} <span className="text-gray-400 text-xs font-normal">left as {l.role || 'member'} · pay forfeited</span></p>
                    <p className="text-gray-600 text-xs mt-1">Reason: {l.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History timeline */}
          {(project.disputeHistory || []).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-3">History</h2>
              <div className="space-y-1.5">
                {project.disputeHistory.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${h.action === 'disputed' ? 'bg-red-500' : h.action === 'confirmed' ? 'bg-green-500' : h.action === 'resolved' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <p className="text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-900">{h.memberName}</span> {h.action.replace(/_/g, ' ')}{h.reason ? ` - "${h.reason}"` : ''}{h.note ? ` - ${h.note}` : ''}
                      <span className="text-gray-400"> · {formatTime(h.at)}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin resolution */}
          {isAdmin && !isResolvedOrComplete && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-1">Admin Resolution</h2>
              <p className="text-gray-600 text-xs mb-3">When the conversation reaches an outcome, mark this resolved. Remaining entries confirm at their current (adjusted) amounts, everyone is notified, and the project moves to the Project Vault.</p>
              {showResolve ? (
                <div>
                  <textarea value={resolveNote} onChange={e => setResolveNote(e.target.value)} rows={2}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none mb-2"
                    placeholder="Resolution note (optional but recommended)..." />
                  <div className="flex gap-2">
                    <button onClick={handleResolve} disabled={busy} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-50">
                      Mark Resolved & Move to Vault
                    </button>
                    <button onClick={() => setShowResolve(false)} className="text-gray-500 text-xs px-2">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowResolve(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg">
                  Resolve Dispute
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Conversation */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col" style={{ maxHeight: '640px' }}>
          <h2 className="text-base font-bold text-gray-900 mb-1">Conversation</h2>
          <p className="text-gray-400 text-xs mb-3">Admin, project owner, and team members can talk here to work out the dispute.</p>
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-[200px]">
            {messages.length === 0 && <p className="text-gray-400 text-xs text-center py-8">No messages yet. Start the conversation.</p>}
            {messages.map(m => {
              const mine = m.authorUid === currentUser.uid;
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 ${mine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <p className={`text-[10px] font-bold mb-0.5 ${mine ? 'text-blue-100' : 'text-gray-500'}`}>
                      {m.authorName}
                      {m.authorRole === 'admin' && <span className="ml-1 bg-blue-100 text-blue-700 px-1 py-0 rounded font-black">ADMIN</span>}
                      {m.authorRole === 'owner' && <span className={`ml-1 px-1 py-0 rounded font-black ${mine ? 'bg-blue-500 text-white' : 'bg-amber-100 text-amber-700'}`}>OWNER</span>}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                    <p className={`text-[9px] mt-1 ${mine ? 'text-blue-200' : 'text-gray-400'}`}>{formatTime(m.createdAt)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 min-h-[44px] text-gray-900 text-sm focus:border-blue-500 focus:outline-none transition-all"
              placeholder="Write a message..." />
            <button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 rounded-xl transition-all disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputePage;
