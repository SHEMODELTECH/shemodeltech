// src/utils/gifts.js
// Record a gift received outside the donation tool (bank transfer, cheque) and
// email the donor a written acknowledgment for their taxes. Donors don't need a
// She Model Tech account: the letter goes to the email you enter.
//   gifts/{id}: donorName, donorEmail, organization, amount, receivedOn, method,
//     benefits ('none' | 'recognition'), note, recordedBy, acknowledgedAt, createdAt
import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { authFetch } from './authFetch';
import { ORG_EIN, ORG_LEGAL_NAME } from '../config/nonprofit';

const esc = (t) => String(t || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const nice = (d) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

export const letterBody = (g) => {
  const benefit = g.benefits === 'recognition'
    ? 'No goods or services were provided in exchange for this contribution, other than recognition of your support (your name and logo on our sponsors section).'
    : 'No goods or services were provided in exchange for this contribution.';
  return [
    `Dear ${esc(g.donorName)},`,
    `Thank you for your generous gift to ${ORG_LEGAL_NAME}${g.organization ? `, on behalf of ${esc(g.organization)}` : ''}. Your support helps women build real-world skills through She Model Tech cohorts.`,
    `<strong>Gift received:</strong> ${money(g.amount)}<br/><strong>Date received:</strong> ${nice(g.receivedOn)}<br/><strong>Method:</strong> ${esc(g.method)}`,
    benefit,
    `${ORG_LEGAL_NAME} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code (EIN ${ORG_EIN}). Your gift is tax-deductible to the extent allowed by law. Please keep this letter for your records.`,
    'With gratitude,<br/>The She Model Tech team',
  ].join('<br/><br/>');
};

const sendLetter = (g) =>
  authFetch('/api/notifications/send-generic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: g.donorEmail,
      subject: `Thank you for your gift to ${ORG_LEGAL_NAME}`,
      heading: 'Thank you for your gift',
      body: letterBody(g),
    }),
  });

export const recordGift = async (g, staff) => {
  const data = {
    donorName: g.donorName.trim(),
    donorEmail: g.donorEmail.trim().toLowerCase(),
    organization: (g.organization || '').trim() || null,
    amount: Number(g.amount),
    receivedOn: g.receivedOn,
    method: g.method,
    benefits: g.benefits || 'none',
    note: (g.note || '').trim() || null,
    recordedBy: staff?.email || null,
    acknowledgedAt: null,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, 'gifts'), data);
  const res = await sendLetter(data);
  if (res && res.ok === false) throw new Error('The gift was saved, but the letter could not be emailed. Use Resend.');
  await updateDoc(doc(db, 'gifts', ref.id), { acknowledgedAt: new Date().toISOString() });
  return ref.id;
};

export const resendLetter = async (g) => {
  const res = await sendLetter(g);
  if (res && res.ok === false) throw new Error('Could not email the letter.');
  await updateDoc(doc(db, 'gifts', g.id), { acknowledgedAt: new Date().toISOString() });
};

export const listGifts = async () => {
  const s = await getDocs(query(collection(db, 'gifts'), orderBy('createdAt', 'desc'), limit(50)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};
