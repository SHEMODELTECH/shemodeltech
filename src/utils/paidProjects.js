// src/utils/paidProjects.js
// Shared helpers for Paid Projects (Phase A).
//
// A paid project is posted by any account (typically a company). Each team role
// carries a payAmount (per person, set by the poster). Everyone's pay is
// visible by design. Paid projects NEVER award badges - members are
// compensated with money instead. Completion of a paid project moves it to
// 'awaiting_payment_confirmation' (owner marks paid, members confirm received
// - the confirmation/dispute UI ships in Phase B, but the data model is live
// now so earnings tracking works end to end).
//
// Earnings (member's Account page + dashboard):
//   PENDING = approved application on a paid project that is not yet
//             payment-confirmed for this member.
//   EARNED  = the member's paymentConfirmations entry is 'confirmed'.
//             The amount counted is amountPaid (set at confirmation or
//             adjusted during a dispute) falling back to the application's
//             payAmount. Dispute-page adjustments therefore flow into the
//             member's totals automatically.

import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Format a money amount. USD platform-wide for now.
export const formatMoney = (amount, currency = 'USD') => {
  const n = Number(amount) || 0;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);
  } catch {
    return `$${n.toLocaleString()}`;
  }
};

// Per-person pay range across a paid project's roles -> "$300" or "$200 - $500".
export const getPayRangeLabel = (teamRoles) => {
  const amounts = (teamRoles || []).map(r => Number(r.payAmount) || 0).filter(a => a > 0);
  if (amounts.length === 0) return null;
  const min = Math.min(...amounts), max = Math.max(...amounts);
  return min === max ? `${formatMoney(min)} / person` : `${formatMoney(min)} - ${formatMoney(max)} / person`;
};

// Total budget = sum of payAmount * count across roles.
export const computeTotalBudget = (teamRoles) =>
  (teamRoles || []).reduce((sum, r) => sum + (Number(r.payAmount) || 0) * (parseInt(r.count, 10) || 1), 0);

// Resolve this member's payment status on a paid project.
// Returns 'confirmed' | 'disputed' | 'pending' and the effective amount.
export const getMemberPaymentStatus = (project, email, applicationPayAmount) => {
  const entry = (project?.paymentConfirmations || {})[email] || null;
  const status = entry?.status || 'pending';
  const amount = Number(entry?.amountPaid ?? applicationPayAmount) || 0;
  return { status, amount };
};

// Compute a member's earnings across all paid projects they were APPROVED for.
// Source of truth for the amount is the application form (payAmount stored at
// apply time), overridden by amountPaid once payment is confirmed/adjusted.
// Returns { earnedTotal, pendingTotal, rows: [{projectId, projectTitle, role, amount, state}] }
export const computeMemberEarnings = async (uid, email) => {
  const result = { earnedTotal: 0, pendingTotal: 0, rows: [] };
  if (!uid) return result;
  try {
    const appQ = query(collection(db, 'project_applications'), where('applicantUid', '==', uid), where('status', '==', 'approved'));
    const appSnap = await getDocs(appQ);
    const paidApps = appSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(a => a.isPaid && (Number(a.payAmount) || 0) > 0);

    // Fetch each project once (dedupe project ids).
    const byProject = new Map();
    for (const a of paidApps) {
      if (!byProject.has(a.projectId)) byProject.set(a.projectId, []);
      byProject.get(a.projectId).push(a);
    }
    for (const [projectId, apps] of byProject.entries()) {
      let project = null;
      try {
        const snap = await getDoc(doc(db, 'projects', projectId));
        if (snap.exists()) project = { id: snap.id, ...snap.data() };
      } catch (_) {}
      for (const a of apps) {
        const { status, amount } = getMemberPaymentStatus(project, email || a.applicantEmail, a.payAmount);
        const projectClosed = project?.status === 'completed';
        let state;
        if (status === 'confirmed') { state = 'paid'; result.earnedTotal += amount; }
        else if (status === 'disputed') { state = 'disputed'; result.pendingTotal += amount; }
        else if (status === 'left' || status === 'forfeited') { state = 'forfeited'; }
        else if (project?.status === 'awaiting_payment_confirmation') { state = 'awaiting'; result.pendingTotal += amount; }
        else { state = projectClosed ? 'awaiting' : 'pending'; result.pendingTotal += amount; }
        result.rows.push({
          projectId,
          projectTitle: a.projectTitle || project?.projectTitle || 'Untitled',
          role: a.role || '',
          amount,
          state, // pending | awaiting | paid | disputed | forfeited
        });
      }
    }
  } catch (e) {
    console.log('Earnings computation skipped:', e.message);
  }
  return result;
};

// ============================================================================
// COMPANY VIEW: money OUT, not earnings.
// Company accounts don't earn - they pay. This computes:
//   DISBURSED = total money confirmed received by members across all the
//               company's paid projects (amountPaid, incl. dispute-adjusted).
//   PENDING   = total still to be sent out: unconfirmed amounts on projects
//               awaiting payment confirmation, plus the committed amount on
//               ongoing paid projects - i.e. the total owed to all persons
//               currently approved on those projects.
// Returns { disbursedTotal, pendingTotal, rows: [{projectId, projectTitle, amount, state}] }
export const computeCompanyDisbursements = async (uid) => {
  const result = { disbursedTotal: 0, pendingTotal: 0, rows: [] };
  if (!uid) return result;
  try {
    const projSnap = await getDocs(query(collection(db, 'projects'), where('submitterId', '==', uid)));
    const paidProjects = projSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.isPaid);

    for (const p of paidProjects) {
      const entries = Object.values(p.paymentConfirmations || {});
      let disbursed = 0, pending = 0, state;

      if (entries.length > 0) {
        // Payment phase reached: count per-entry statuses.
        for (const e of entries) {
          if (!e) continue;
          const amount = Number(e.amountPaid ?? e.amountDue) || 0;
          if (e.status === 'confirmed') disbursed += amount;
          else if (e.status === 'pending' || e.status === 'disputed') pending += amount;
          // forfeited / left entries owe nothing
        }
        state = p.status === 'completed' ? 'completed'
          : entries.some(e => e?.status === 'disputed') ? 'disputed'
          : 'awaiting';
      } else if (p.status !== 'completed') {
        // Ongoing project, payment phase not reached yet: the pending amount
        // is the total to be paid to all persons currently on the project
        // (sum of pay across approved members).
        try {
          const appSnap = await getDocs(query(collection(db, 'project_applications'), where('projectId', '==', p.id), where('status', '==', 'approved')));
          pending = appSnap.docs.reduce((s, d) => s + (Number(d.data().payAmount) || 0), 0);
        } catch (_) {}
        state = 'ongoing';
      } else {
        state = 'completed';
      }

      result.disbursedTotal += disbursed;
      result.pendingTotal += pending;
      result.rows.push({
        projectId: p.id,
        projectTitle: p.projectTitle || 'Untitled',
        amount: disbursed + pending,
        disbursed,
        pending,
        state, // ongoing | awaiting | disputed | completed
      });
    }
  } catch (e) {
    console.log('Company disbursement computation skipped:', e.message);
  }
  return result;
};

// ============================================================================
// PHASE B - Closing flow & disputes
// ----------------------------------------------------------------------------
// Lifecycle of a paid project's close:
//   1. Owner marks work done (ProjectCompletion)  -> status 'awaiting_payment_confirmation'
//   2. Owner clicks "I've paid everyone"          -> ownerPaidAll: true, members notified
//   3. Each member confirms "received"            -> their entry 'confirmed'
//      ...or reports "not received"               -> their entry 'disputed' (+ reason)
//   4. All confirmed + ownerPaidAll               -> status 'completed', moves to Project Vault
//      Any dispute                                -> project lives on the Dispute page
//        - owner/admin can adjust a member's amount (amountPaid), member re-confirms
//        - admin "Mark Resolved" force-confirms remaining entries and completes
// She Model Tech verifies that BOTH SIDES CONFIRMED payment - it does not process
// payments and does not guarantee them. All history is recorded in
// disputeHistory for the paper trail.
// ============================================================================

// The paymentConfirmations map is keyed by member email. Emails contain dots,
// which Firestore updateDoc field paths interpret as nesting - so all writes
// to the map are read-modify-write of the WHOLE map, never dotted paths.
const writeConfirmations = async (projectId, map, extra = {}) =>
  updateDoc(doc(db, 'projects', projectId), { paymentConfirmations: map, ...extra });

const historyEntry = (memberName, memberEmail, action, extra = {}) => ({
  memberName, memberEmail, action, at: new Date().toISOString(), ...extra,
});

// Notify a user by uid (non-blocking pattern - callers wrap in try/catch).
const notifyUid = async (userId, type, message, projectId, projectTitle) => {
  if (!userId) return;
  await addDoc(collection(db, 'notifications'), {
    userId, type, message, projectId, projectTitle: projectTitle || null,
    isRead: false, read: false, createdAt: serverTimestamp(),
  });
};

// Find a user's uid by email (users collection).
const uidByEmail = async (email) => {
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
    return snap.empty ? null : snap.docs[0].id;
  } catch { return null; }
};

// All admin uids (for dispute alerts).
export const getAdminUids = async () => {
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'admin')));
    return snap.docs.map(d => d.id);
  } catch { return []; }
};

// Does this project have an open payment dispute?
export const hasOpenDispute = (project) =>
  project?.status === 'awaiting_payment_confirmation'
  && Object.values(project?.paymentConfirmations || {}).some(c => c?.status === 'disputed');

// Entries that still block completion (pending or disputed; forfeited/left don't block).
const blockingEntries = (map) =>
  Object.values(map || {}).filter(c => c && (c.status === 'pending' || c.status === 'disputed'));

// Complete the project if it's ready: owner marked paid AND no entry is
// pending/disputed. This performs the ACTUAL status flip to 'completed'
// client-side (security rules allow signed-in updates on projects), so the
// project immediately leaves "Awaiting Payment Confirmation" everywhere -
// the owner's dashboard, the team's Project Vault, and the dispute list -
// and moves to the completed wall.
export const checkAndCompleteProject = async (project, map) => {
  if (!project?.ownerPaidAll) return false;
  if (blockingEntries(map).length !== 0) return false;
  try {
    await updateDoc(doc(db, 'projects', project.id), {
      status: 'completed',
      paymentCompletedAt: serverTimestamp(),
    });
  } catch (e) {
    // Non-blocking: if this session can't flip the status, the self-heal in
    // the Project Vault / dispute pages will complete it on next load.
    console.error('Could not mark paid project completed:', e);
  }
  return true;
};

// Is this paid project fully confirmed but still (incorrectly) sitting in
// 'awaiting_payment_confirmation'? Used by pages to self-heal stuck projects.
export const isReadyToComplete = (project) =>
  project?.status === 'awaiting_payment_confirmation'
  && !!project?.ownerPaidAll
  && blockingEntries(project?.paymentConfirmations).length === 0;

// Self-heal: flip a fully-confirmed paid project to 'completed'. Returns true
// if the project was (or is now) completed.
export const healPaidProjectStatus = async (project) => {
  if (!isReadyToComplete(project)) return false;
  try {
    await updateDoc(doc(db, 'projects', project.id), {
      status: 'completed',
      paymentCompletedAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error('Could not heal paid project status:', e);
    return false;
  }
};

// OWNER: "I've paid everyone." Members are then asked to confirm receipt.
export const markOwnerPaidAll = async (project, currentUser) => {
  const map = { ...(project.paymentConfirmations || {}) };
  const hist = historyEntry(currentUser.displayName || currentUser.email, currentUser.email, 'owner_marked_paid', {
    note: 'Owner marked all members as paid.',
  });
  await updateDoc(doc(db, 'projects', project.id), {
    ownerPaidAll: true,
    ownerPaidAt: serverTimestamp(),
    disputeHistory: arrayUnion(hist),
  });
  // Ask each still-pending member to confirm.
  try {
    for (const [email, entry] of Object.entries(map)) {
      if (entry?.status !== 'pending') continue;
      const uid = await uidByEmail(email);
      if (uid) await notifyUid(uid, 'payment_confirmation', `The owner of "${project.projectTitle}" marked your payment of ${formatMoney(entry.amountPaid ?? entry.amountDue)} as sent. Please confirm you received it (or report if you didn't) - the project closes when everyone confirms.`, project.id, project.projectTitle);
    }
  } catch (_) {}
  // Edge case: everyone already confirmed before the owner clicked.
  return checkAndCompleteProject({ ...project, ownerPaidAll: true }, map);
};

// MEMBER: "I received my payment."
export const confirmPaymentReceived = async (project, currentUser) => {
  const map = { ...(project.paymentConfirmations || {}) };
  const entry = map[currentUser.email];
  if (!entry) throw new Error('No payment record found for your account on this project.');
  map[currentUser.email] = {
    ...entry,
    status: 'confirmed',
    amountPaid: entry.amountPaid ?? entry.amountDue,
    confirmedAt: new Date().toISOString(),
  };
  await writeConfirmations(project.id, map, {
    disputeHistory: arrayUnion(historyEntry(currentUser.displayName || currentUser.email, currentUser.email, 'confirmed', {
      note: `Confirmed receipt of ${formatMoney(map[currentUser.email].amountPaid)}.`,
    })),
  });
  try {
    if (project.submitterId) await notifyUid(project.submitterId, 'payment_confirmed', `${currentUser.displayName || currentUser.email} confirmed receiving ${formatMoney(map[currentUser.email].amountPaid)} for "${project.projectTitle}".`, project.id, project.projectTitle);
  } catch (_) {}
  const completed = await checkAndCompleteProject(project, map);
  return { map, completed };
};

// MEMBER: "I was NOT paid" - opens a dispute. Reason required.
export const disputePayment = async (project, currentUser, reason) => {
  const map = { ...(project.paymentConfirmations || {}) };
  const entry = map[currentUser.email];
  if (!entry) throw new Error('No payment record found for your account on this project.');
  map[currentUser.email] = {
    ...entry,
    status: 'disputed',
    disputeReason: reason,
    disputedAt: new Date().toISOString(),
  };
  await writeConfirmations(project.id, map, {
    disputeHistory: arrayUnion(historyEntry(currentUser.displayName || currentUser.email, currentUser.email, 'disputed', { reason })),
  });
  // Alert owner + all admins.
  try {
    const msg = `${currentUser.displayName || currentUser.email} disputed their payment on "${project.projectTitle}": ${reason}`;
    if (project.submitterId) await notifyUid(project.submitterId, 'payment_disputed', msg, project.id, project.projectTitle);
    for (const adminUid of await getAdminUids()) {
      if (adminUid !== project.submitterId) await notifyUid(adminUid, 'payment_disputed', `[Admin] ${msg}`, project.id, project.projectTitle);
    }
  } catch (_) {}
  return map;
};

// OWNER/ADMIN: adjust a member's payment amount (e.g. an agreed correction
// during a dispute). Resets that entry to 'pending' so the member confirms
// the NEW amount. The member's Account earnings read amountPaid, so once
// confirmed the adjusted figure is what shows on their dashboard.
export const adjustMemberPayment = async (project, memberEmail, newAmount, actorUser) => {
  const map = { ...(project.paymentConfirmations || {}) };
  const entry = map[memberEmail];
  if (!entry) throw new Error('No payment record for that member.');
  const amount = Number(newAmount) || 0;
  map[memberEmail] = {
    ...entry,
    status: 'pending',
    amountPaid: amount,
    adjustedAt: new Date().toISOString(),
    adjustedBy: actorUser.email,
    disputeReason: entry.disputeReason || null,
  };
  await writeConfirmations(project.id, map, {
    ownerPaidAll: false, // owner must re-mark paid after adjusting
    disputeHistory: arrayUnion(historyEntry(actorUser.displayName || actorUser.email, actorUser.email, 'amount_adjusted', {
      note: `Adjusted ${entry.memberName || memberEmail}'s payment from ${formatMoney(entry.amountPaid ?? entry.amountDue)} to ${formatMoney(amount)}.`,
    })),
  });
  try {
    const uid = await uidByEmail(memberEmail);
    if (uid) await notifyUid(uid, 'payment_confirmation', `Your payment on "${project.projectTitle}" was adjusted to ${formatMoney(amount)}. Once you receive it, confirm on the dispute page - your Account earnings will update to the adjusted amount.`, project.id, project.projectTitle);
  } catch (_) {}
  return map;
};

// ADMIN: resolve the dispute and close the project. Remaining pending/disputed
// entries are force-confirmed at their current amount (amountPaid if adjusted,
// otherwise amountDue), the project completes, and everyone is notified. Use
// after the conversation on the dispute page reaches an outcome.
export const resolveDispute = async (project, adminUser, note) => {
  const map = { ...(project.paymentConfirmations || {}) };
  for (const [email, entry] of Object.entries(map)) {
    if (!entry) continue;
    if (entry.status === 'pending' || entry.status === 'disputed') {
      map[email] = {
        ...entry,
        status: 'confirmed',
        amountPaid: entry.amountPaid ?? entry.amountDue,
        confirmedAt: new Date().toISOString(),
        resolvedByAdmin: true,
      };
    }
  }
  await writeConfirmations(project.id, map, {
    status: 'completed',
    ownerPaidAll: true,
    paymentCompletedAt: serverTimestamp(),
    disputeResolved: { by: adminUser.email, byName: adminUser.displayName || adminUser.email, at: new Date().toISOString(), note: note || null },
    disputeHistory: arrayUnion(historyEntry(adminUser.displayName || adminUser.email, adminUser.email, 'resolved', {
      note: note || 'Dispute resolved by admin. Project moved to the Project Vault.',
    })),
  });
  try {
    const msg = `The dispute on "${project.projectTitle}" was resolved by an admin${note ? `: ${note}` : ''}. The project is now closed and in the Project Vault.`;
    if (project.submitterId) await notifyUid(project.submitterId, 'dispute_resolved', msg, project.id, project.projectTitle);
    for (const email of Object.keys(map)) {
      const uid = await uidByEmail(email);
      if (uid) await notifyUid(uid, 'dispute_resolved', msg, project.id, project.projectTitle);
    }
  } catch (_) {}
  return map;
};
