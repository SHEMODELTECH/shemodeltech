// src/utils/permissions.js
// Single source of truth for who can do what.
//
// ROLES
//   member  - default. Builds projects, earns badges.
//   editor  - REVIEWER. Runs cohorts, reviews lead applications, approves or
//             rejects project submissions, reassigns unresponsive leads.
//             Deliberately has NO delete/moderation powers.
//   admin   - everything an editor can do, PLUS delete, moderation, role
//             management, and badge corrections.
//
// This mirrors firestore.rules exactly: isReviewer() there === isReviewer()
// here. If you change one, change the other, or the UI and the database will
// disagree - the UI will offer a button that the database then refuses.

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const ROLES = {
  MEMBER: 'member',
  EDITOR: 'editor',
  ADMIN: 'admin',
};

/** Full moderation + delete powers. */
export const isAdminRole = (role) => role === ROLES.ADMIN;

/**
 * Can review: approve/reject/request-changes on project submissions, decide
 * lead applications, run cohorts, reassign leads. Admins are always reviewers.
 */
export const isReviewerRole = (role) =>
  role === ROLES.ADMIN || role === ROLES.EDITOR;

/** Human label for a role. */
export const roleLabel = (role) => {
  if (role === ROLES.ADMIN) return 'Admin';
  if (role === ROLES.EDITOR) return 'Editor';
  return 'Member';
};

/**
 * Fetch the signed-in user's role and derived permissions in one go.
 * Returns { role, isAdmin, isReviewer, loading:false }.
 */
export const fetchPermissions = async (uid) => {
  if (!uid) return { role: null, isAdmin: false, isReviewer: false };
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    const role = snap.exists() ? (snap.data().role || ROLES.MEMBER) : ROLES.MEMBER;
    return {
      role,
      isAdmin: isAdminRole(role),
      isReviewer: isReviewerRole(role),
    };
  } catch (e) {
    console.error('permission check failed:', e);
    // Fail CLOSED - never grant powers because a read errored.
    return { role: null, isAdmin: false, isReviewer: false };
  }
};

/**
 * React hook: usePermissions(currentUser?.uid)
 * -> { role, isAdmin, isReviewer, loading }
 */
export const usePermissions = (uid) => {
  const [perms, setPerms] = useState({
    role: null, isAdmin: false, isReviewer: false, loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    if (!uid) {
      setPerms({ role: null, isAdmin: false, isReviewer: false, loading: false });
      return undefined;
    }
    fetchPermissions(uid).then(p => {
      if (!cancelled) setPerms({ ...p, loading: false });
    });
    return () => { cancelled = true; };
  }, [uid]);

  return perms;
};
