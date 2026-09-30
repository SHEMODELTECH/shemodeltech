// src/utils/age.js
// Date of birth is saved once on the member's account (users.dateOfBirth as
// YYYY-MM-DD, plus dobAt as a timestamp the database rules can check). Age is
// worked out from it every time, so members who turn 18 are allowed into paid
// projects automatically, with no yearly update needed.
import { Timestamp } from 'firebase/firestore';

export const ageFrom = (dob) => {
  if (!dob) return null;
  const b = new Date(`${dob}T12:00:00`);
  if (Number.isNaN(b.getTime())) return null;
  const t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a -= 1;
  return a;
};

// Fields to save for a date of birth, plus the age group it implies.
export const dobFields = (dob) => ({
  dateOfBirth: dob,
  dobAt: Timestamp.fromDate(new Date(`${dob}T00:00:00Z`)),
});

export const todayISOLocal = () => new Date().toISOString().slice(0, 10);
