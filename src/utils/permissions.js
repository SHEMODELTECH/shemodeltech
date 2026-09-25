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
import { MEMBERSHIP_ENFORCED } from '../config/membership';

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
export const isReviewerRole = (role) => role === ROLES.ADMIN || role === ROLES.EDITOR;

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
// Module-level cache, keyed by uid.
//
// One page can render many permission-aware components (the Partner page has
// ten). Without this, each issues its own Firestore read on mount: ten round
// trips to answer one question. The cache makes repeat calls free.
const _cache = new Map();
const _inflight = new Map(); // concurrent mounts share a single read

/** Call on sign-out so the next user never inherits a cached role. */
export const clearPermissionCache = (uid) => {
  if (uid) {
    _cache.delete(uid);
    _inflight.delete(uid);
  } else {
    _cache.clear();
    _inflight.clear();
  }
};

export const fetchPermissions = async (uid) => {
  if (!uid) return { role: null, isAdmin: false, isReviewer: false };
  if (_cache.has(uid)) return _cache.get(uid);
  if (_inflight.has(uid)) return _inflight.get(uid);

  const p = (async () => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      const role = snap.exists() ? snap.data().role || ROLES.MEMBER : ROLES.MEMBER;
      const result = { role, isAdmin: isAdminRole(role), isReviewer: isReviewerRole(role) };
      _cache.set(uid, result);
      return result;
    } catch (e) {
      console.error('permission check failed:', e);
      // Fail CLOSED, and do NOT cache the failure: a transient network error
      // must not lock someone out of admin for the rest of the session.
      return { role: null, isAdmin: false, isReviewer: false };
    } finally {
      _inflight.delete(uid);
    }
  })();

  _inflight.set(uid, p);
  return p;
};

/**
 * React hook: usePermissions(currentUser?.uid)
 * -> { role, isAdmin, isReviewer, loading }
 */
/**
 * Should paid features be shown as LIVE (rather than "coming soon")?
 *
 * True when membership is enforced, OR when the viewer is an admin/editor.
 * Reviewers need to exercise checkout, sponsorship and hosting flows before
 * launch - a paywall they cannot get past means those paths ship untested.
 */
export const usePaidFeaturesVisible = (uid) => {
  const { isReviewer, loading } = usePermissions(uid);
  return { visible: MEMBERSHIP_ENFORCED || isReviewer, isReviewer, loading };
};

export const usePermissions = (uid) => {
  const [perms, setPerms] = useState({
    role: null,
    isAdmin: false,
    isReviewer: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    if (!uid) {
      setPerms({ role: null, isAdmin: false, isReviewer: false, loading: false });
      return undefined;
    }
    fetchPermissions(uid).then((p) => {
      if (!cancelled) setPerms({ ...p, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  return perms;
};
