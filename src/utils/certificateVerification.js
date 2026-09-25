// src/utils/certificateVerification.js
//
// WHY THIS EXISTS
//
// A certificate that can't be checked is decoration. Right now a She Model
// Tech certificate is a rendered image, anyone can open it in Photoshop,
// change the name, and produce something indistinguishable from the real
// thing. A recruiter who receives one has no way to tell.
//
// Verification fixes that: every certificate gets a unique ID and a PUBLIC
// URL that anyone can open, no account, no login, showing the real record
// straight from our database: who, which project, which role, what dates,
// which badges. If the ID isn't in our records, the page says so plainly.
//
// This is what turns "she says she completed a project" into "we can confirm
// she did", and it's the whole reason the badge system is worth anything to
// an employer.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { BRAND } from '../config/brand';

// Unambiguous alphabet: no O/0, no I/1/L. These IDs get read aloud, retyped
// from a printout, and OCR'd from a PDF, ambiguity costs real support time.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const randomBlock = (n) =>
  Array.from({ length: n }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

/** e.g. SMT-4K2P-9XRT */
export const generateCertificateId = () => `SMT-${randomBlock(4)}-${randomBlock(4)}`;

export const verificationUrl = (certificateId) => `${BRAND.url}/verify/${certificateId}`;

/**
 * QR code pointing at the verification URL, rendered on the certificate.
 * Uses a public QR image service, deliberately no extra dependency, and the
 * URL it encodes is public anyway, so nothing sensitive leaves our control.
 */
export const qrCodeUrl = (certificateId, size = 200) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    verificationUrl(certificateId)
  )}`;

/**
 * Create the verification record when a certificate is issued.
 *
 * Stored in `certificate_verifications`, which is PUBLICLY READABLE by
 * design, verification only works if someone with no account can check it.
 * It therefore holds only what belongs on the certificate itself: name,
 * project, role, dates. No email, no uid, no contact details.
 */
export const createVerificationRecord = async ({
  certificateId,
  memberName,
  memberEmail,
  projectId,
  projectTitle,
  roleTitle,
  badges,
  startDate,
  endDate,
  cohortNumber,
}) => {
  const id = certificateId || generateCertificateId();
  await setDoc(doc(db, 'certificate_verifications', id), {
    certificateId: id,
    memberName,
    // Kept only so an admin can reconcile records; never shown publicly.
    memberEmailHash: memberEmail ? btoa(memberEmail).slice(0, 16) : null,
    projectId: projectId || null,
    projectTitle: projectTitle || null,
    roleTitle: roleTitle || null,
    badges: badges || [],
    startDate: startDate || null,
    endDate: endDate || null,
    cohortNumber: cohortNumber || null,
    issuedBy: BRAND.name,
    issuedAt: serverTimestamp(),
    revoked: false,
  });
  return id;
};

/**
 * Public lookup. Returns a plain result object rather than throwing, so the
 * verify page can say "not found" without treating it as an error, an
 * invalid ID is an ordinary outcome here, not a failure.
 */
export const verifyCertificate = async (certificateId) => {
  const id = (certificateId || '').trim().toUpperCase();
  if (!id) return { found: false, reason: 'No certificate ID provided.' };

  try {
    const snap = await getDoc(doc(db, 'certificate_verifications', id));
    if (!snap.exists()) {
      return {
        found: false,
        reason: 'No certificate with this ID exists in our records.',
      };
    }
    const data = snap.data();
    if (data.revoked) {
      return {
        found: true,
        valid: false,
        reason: 'This certificate has been revoked.',
        data,
      };
    }
    return { found: true, valid: true, data };
  } catch (e) {
    console.error('verification lookup failed:', e);
    return { found: false, reason: 'Could not reach our records. Please try again.' };
  }
};

/** Back-fill an ID onto a certificate issued before verification existed. */
export const ensureCertificateId = async (certificateDocId) => {
  const ref = doc(db, 'certificates', certificateDocId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Certificate not found.');
  const data = snap.data();
  if (data.certificateId) return data.certificateId;

  const id = generateCertificateId();
  await setDoc(ref, { ...data, certificateId: id }, { merge: true });
  await createVerificationRecord({
    certificateId: id,
    memberName: data.memberName || data.recipientName,
    memberEmail: data.memberEmail,
    projectId: data.projectId,
    projectTitle: data.projectTitle,
    roleTitle: data.roleTitle || data.role,
    badges: data.badges || [],
    startDate: data.startDate,
    endDate: data.endDate || data.completedAt,
  });
  return id;
};

/** All verified certificates for a member, for their profile. */
export const getMemberCertificates = async (memberName) => {
  const snap = await getDocs(
    query(
      collection(db, 'certificate_verifications'),
      where('memberName', '==', memberName),
      limit(50)
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
