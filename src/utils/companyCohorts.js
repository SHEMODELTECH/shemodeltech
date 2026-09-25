// src/utils/companyCohorts.js
//
// COMPANY-HOSTED COHORTS
//
// A subscribing company runs its own project on the platform: it owns the
// brief, sets the timeline, hires every role (including the lead), reviews
// and approves applicants itself, and PAYS the members directly.
//
// HOW THIS DIFFERS FROM A SHE MODEL TECH COHORT
//
// SMT cohort Company cohort
// Brief SMT generates Company writes
// Timeline Fixed 8 weeks Company decides
// Lead SMT interviews+assigns Company hires the lead too
// Applicants Lead reviews Company reviews
// Final review SMT reviews + approves Company approves
// BADGES YES, SMT verified NO. Never.
// Money None (or SMT stipend) Company pays members
// Certificate Issued by SMT Issued in company's name
//
// WHY COMPANIES CAN NEVER AWARD BADGES
// The badge is the only asset this platform really has, and its entire value
// is that WE verified it, commit history, review, evidence. If a company
// could mint badges, anyone could register a company account, run a token
// project and issue credentials. The badge collapses, and with it everything
// we sell to every other employer.
//
// WHAT MEMBERS GET INSTEAD
// A VERIFIED WORK EXPERIENCE record: paid, dated, role-attributed, and
// clearly marked as the company's engagement rather than our assessment.
// It makes a different claim, "she was hired and paid" instead of "we
// assessed her work", so it carries real weight without diluting the badge.
//
// ELIGIBILITY
// Applicants need at least one earned badge. This makes the free SMT cohort
// the on-ramp to paid work: earn a badge, become eligible. Companies get
// pre-vetted applicants, members get a concrete reason to finish the unpaid
// programme, and the badge acquires cash value, which is what makes it
// worth having.
//
// NON-PAYMENT
// Members will hold US responsible if a company doesn't pay, and they're
// right to, we made the introduction. Defences: verified companies only,
// the existing payment-confirmation + dispute flow, and the subscription
// itself as leverage (don't pay members, lose hosting AND your plan).

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { isPartner } from '../config/companyAccess';

export const COMPANY_COHORT_STATUS = {
  DRAFT: 'draft',
  HIRING: 'hiring', // roles open, company reviewing applicants
  ACTIVE: 'active', // team assembled, work underway
  DELIVERED: 'delivered', // company marked the work complete
  AWAITING_PAYMENT: 'awaiting_payment',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
};

export const WORK_RECORD_TYPE = 'verified_work_experience';

// ---------------------------------------------------------------------
// Eligibility
// ---------------------------------------------------------------------

/**
 * A company must be verified and hold an active subscription to host.
 * Admins and editors bypass both, so the hosting flow can be tested before
 * launch without creating a fake verified company.
 */
export const canHostCohort = (company) => {
  if (company?.role === 'admin' || company?.role === 'editor') return { allowed: true };
  if (!company?.isCompany) {
    return { allowed: false, reason: 'Only company accounts can host a cohort.' };
  }
  if (!company.isVerified) {
    return {
      allowed: false,
      reason:
        'Your company must be verified before hosting. Verification is free, submit your registration details.',
    };
  }
  if (!isPartner(company)) {
    return {
      allowed: false,
      reason: 'Hosting your own cohort is part of the Talent Access plan.',
    };
  }
  return { allowed: true };
};

/** Members need at least one earned badge to apply to paid company work. */
export const canApplyToCompanyCohort = async (uid, viewer = null) => {
  // Reviewers bypass the badge requirement so the apply flow can be tested
  // before anyone has earned a badge.
  if (viewer?.role === 'admin' || viewer?.role === 'editor') {
    return { allowed: true, badgeCount: 0 };
  }
  try {
    const snap = await getDocs(
      query(collection(db, 'member_badges'), where('memberUid', '==', uid))
    );
    if (snap.empty) {
      return {
        allowed: false,
        reason: 'Earn your first badge on a She Model Tech cohort to unlock paid company projects.',
      };
    }
    return { allowed: true, badgeCount: snap.size };
  } catch (e) {
    console.error('badge eligibility check failed:', e);
    // Fail CLOSED, never grant access to paid work on a read error.
    return { allowed: false, reason: 'Could not verify your badges. Please try again.' };
  }
};

// ---------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------

/**
 * Create a company-hosted cohort. The company owns everything here, brief,
 * roles, pay, timeline. We are the venue, not the contractor.
 */
export const createCompanyCohort = async ({
  company,
  title,
  description,
  roles,
  startDate,
  endDate,
  notes,
}) => {
  const gate = canHostCohort(company);
  if (!gate.allowed) throw new Error(gate.reason);

  if (!title?.trim()) throw new Error('Give your project a title.');
  if (!roles?.length) throw new Error('Add at least one role.');
  if (!endDate) throw new Error('Set a target completion date.');

  const unpaid = roles.filter((r) => !(Number(r.payAmount) > 0));
  if (unpaid.length) {
    throw new Error(
      'Every role must carry a pay amount. Unpaid company work is not permitted on She Model Tech.'
    );
  }

  const totalBudget = roles.reduce(
    (sum, r) => sum + (Number(r.payAmount) || 0) * (parseInt(r.count, 10) || 1),
    0
  );

  const ref = await addDoc(collection(db, 'company_cohorts'), {
    companyId: company.uid,
    companyName: company.companyName || company.displayName,
    companyLogo: company.photoURL || null,
    companyVerified: !!company.isVerified,

    title: title.trim(),
    description: (description || '').trim(),
    roles, // [{ title, count, payAmount, skills }]
    totalBudget,
    currency: 'USD',

    startDate: startDate || null,
    endDate, // company sets its own timeline

    status: COMPANY_COHORT_STATUS.HIRING,
    // Explicit, so nothing downstream ever mistakes this for an SMT cohort.
    awardsBadges: false,
    reviewedBySMT: false,
    isCompanyOwned: true,

    notes: (notes || '').trim() || null,
    members: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

/** Member applies. Badge-gated. */
export const applyToCompanyCohort = async ({ cohortId, applicant, roleTitle, coverNote }) => {
  const gate = await canApplyToCompanyCohort(applicant.uid);
  if (!gate.allowed) throw new Error(gate.reason);

  const dupes = await getDocs(
    query(
      collection(db, 'company_cohort_applications'),
      where('cohortId', '==', cohortId),
      where('applicantUid', '==', applicant.uid)
    )
  );
  if (!dupes.empty) throw new Error('You have already applied to this project.');

  const ref = await addDoc(collection(db, 'company_cohort_applications'), {
    cohortId,
    applicantUid: applicant.uid,
    applicantEmail: applicant.email,
    applicantName: applicant.displayName || applicant.email,
    applicantPhoto: applicant.photoURL || null,
    badgeCount: gate.badgeCount,
    roleTitle,
    coverNote: (coverNote || '').trim() || null,
    status: 'submitted',
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

/**
 * The COMPANY decides, approve, reject, or invite to interview. We take no
 * part in this. Their project, their team, their call.
 */
export const decideApplication = async ({
  applicationId,
  decision,
  payAmount,
  roleTitle,
  message,
  interviewAt,
  meetLink,
}) => {
  const valid = ['approved', 'rejected', 'interview'];
  if (!valid.includes(decision)) throw new Error('Unknown decision.');

  const updates = {
    status: decision,
    decidedAt: serverTimestamp(),
    decisionMessage: message || null,
  };
  if (decision === 'approved') {
    if (!(Number(payAmount) > 0)) throw new Error('Set the pay amount before approving.');
    updates.payAmount = Number(payAmount);
    updates.roleTitle = roleTitle || null;
  }
  if (decision === 'interview') {
    updates.interviewAt = interviewAt || null;
    updates.meetLink = meetLink || null;
  }

  await updateDoc(doc(db, 'company_cohort_applications', applicationId), updates);

  const snap = await getDoc(doc(db, 'company_cohort_applications', applicationId));
  const app = snap.data();

  if (decision === 'approved') {
    await updateDoc(doc(db, 'company_cohorts', app.cohortId), {
      members: arrayUnion(app.applicantUid),
      [`payments.${app.applicantEmail}`]: {
        amountDue: Number(payAmount),
        amountPaid: 0,
        status: 'pending',
        role: roleTitle || null,
      },
      updatedAt: serverTimestamp(),
    });
  }

  await notify(app.applicantUid, {
    type: `company_cohort_${decision}`,
    title:
      decision === 'approved'
        ? 'You\u2019re on the team'
        : decision === 'interview'
          ? 'A company wants to interview you'
          : 'Update on your application',
    body: message || null,
    link: `/company-cohorts/${app.cohortId}`,
  });
};

/**
 * Company marks the work complete. NO badge is awarded and NOTHING is
 * submitted to us for review, we did not assess this work and cannot
 * certify it.
 *
 * Each member receives a VERIFIED WORK EXPERIENCE record: paid, dated,
 * role-attributed, issued in the company's name with us named as the
 * platform that facilitated it.
 */
export const markDelivered = async ({ cohortId, company }) => {
  const snap = await getDoc(doc(db, 'company_cohorts', cohortId));
  if (!snap.exists()) throw new Error('Project not found.');
  const c = snap.data();
  if (c.companyId !== company.uid) throw new Error('Only the hosting company can do this.');

  await updateDoc(doc(db, 'company_cohorts', cohortId), {
    status: COMPANY_COHORT_STATUS.AWAITING_PAYMENT,
    deliveredAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const apps = await getDocs(
    query(
      collection(db, 'company_cohort_applications'),
      where('cohortId', '==', cohortId),
      where('status', '==', 'approved')
    )
  );

  for (const a of apps.docs) {
    const app = a.data();
    try {
      // eslint-disable-next-line no-await-in-loop
      await addDoc(collection(db, 'work_records'), {
        type: WORK_RECORD_TYPE,
        memberUid: app.applicantUid,
        memberEmail: app.applicantEmail,
        companyId: c.companyId,
        companyName: c.companyName,
        companyLogo: c.companyLogo || null,
        companyVerified: c.companyVerified,
        projectTitle: c.title,
        roleTitle: app.roleTitle || null,
        startDate: c.startDate || null,
        endDate: c.endDate,
        paid: true,
        payAmount: app.payAmount || null,
        // Stated on the record itself so it can never be mistaken for a badge.
        issuedBy: c.companyName,
        facilitatedBy: 'She Model Tech',
        isBadge: false,
        verifiedBySMT: false,
        createdAt: serverTimestamp(),
      });

      // eslint-disable-next-line no-await-in-loop
      await notify(app.applicantUid, {
        type: 'work_record_issued',
        title: 'Your work experience record is ready',
        body: `${c.companyName} marked "${c.title}" complete. Confirm when you\u2019ve been paid.`,
        link: '/account?tab=work',
      });
    } catch (e) {
      console.error('work record failed for', app.applicantEmail, e);
    }
  }
};

/** Member confirms payment received, or disputes it. Reuses the dispute room. */
export const confirmPayment = async ({ cohortId, memberEmail, received, amount, note }) => {
  const key = `payments.${memberEmail}`;
  await updateDoc(doc(db, 'company_cohorts', cohortId), {
    [`${key}.status`]: received ? 'confirmed' : 'disputed',
    [`${key}.amountPaid`]: received ? Number(amount) || 0 : 0,
    [`${key}.confirmedAt`]: new Date().toISOString(),
    [`${key}.note`]: note || null,
    ...(received
      ? {}
      : {
          disputeHistory: arrayUnion({
            by: memberEmail,
            reason: note || 'Payment not received',
            at: new Date().toISOString(),
          }),
          status: COMPANY_COHORT_STATUS.AWAITING_PAYMENT,
        }),
    updatedAt: serverTimestamp(),
  });

  if (!received) {
    // A non-payment report is the most serious signal on the platform: it
    // threatens the company's hosting access AND their subscription.
    try {
      await addDoc(collection(db, 'admin_notifications'), {
        type: 'payment_dispute',
        cohortId,
        message: `${memberEmail} reports non-payment. ${note || ''}`.trim(),
        severity: 'high',
        isRead: false,
        createdAt: serverTimestamp(),
      });
    } catch (_) {
      /* non-blocking */
    }
  }
};

/** Either side can report the other. Goes straight to admin. */
export const reportParty = async ({ cohortId, reporter, against, reason }) => {
  if (!reason?.trim()) throw new Error('Please tell us what happened.');
  await addDoc(collection(db, 'admin_notifications'), {
    type: 'company_cohort_report',
    cohortId,
    reportedBy: reporter.email,
    reportedByUid: reporter.uid || null,
    against,
    message: reason.trim(),
    severity: 'high',
    isRead: false,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'company_cohorts', cohortId), {
    reports: arrayUnion({
      by: reporter.email,
      against,
      reason: reason.trim(),
      at: new Date().toISOString(),
    }),
  });
};

// ---------------------------------------------------------------------
export const getOpenCompanyCohorts = async () => {
  const snap = await getDocs(
    query(collection(db, 'company_cohorts'), where('status', '==', COMPANY_COHORT_STATUS.HIRING))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getMyWorkRecords = async (uid) => {
  const snap = await getDocs(query(collection(db, 'work_records'), where('memberUid', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const notify = async (uid, payload) => {
  if (!uid) return;
  try {
    await addDoc(collection(db, 'notifications'), {
      userId: uid,
      recipientId: uid,
      isRead: false,
      read: false,
      createdAt: serverTimestamp(),
      ...payload,
    });
  } catch (e) {
    console.error('notify failed:', e);
  }
};
