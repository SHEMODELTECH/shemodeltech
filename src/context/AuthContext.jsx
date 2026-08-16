// src/context/AuthContext.jsx - UPDATED with Auto-Subscribe to Both Digests
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Enhanced sign in with Google - includes auto email preferences setup
  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      // Use popup method (works across all browsers and privacy modes)
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 🎯 CHECK IF USER IS NEW AND AUTO-SETUP EMAIL PREFERENCES
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        // If user document doesn't exist, create it with email preferences
        if (!userDoc.exists()) {
          console.log('🆕 New user detected - setting up email preferences');
          
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            
            // ✅ AUTO-SETUP EMAIL PREFERENCES FOR NEW USERS (BOTH DIGESTS ON)
            emailPreferences: {
              dailyDigest: true,       // 🔥 AUTO-SUBSCRIBE TO DAILY DIGEST
              weeklyDigest: true,      // 🔥 AUTO-SUBSCRIBE TO WEEKLY DIGEST  
              notifications: true,     // Platform notifications
              projectUpdates: true,    // Project-related updates
              communityUpdates: true,  // Community post updates
              marketing: false,        // Promotional emails OFF (respect privacy)
              announcements: true,     // Important updates ON
              lastUpdated: new Date()
            },
            
            // Additional user setup
            profileComplete: false,
            onboardingComplete: false,
            role: 'user',
            preferences: {
              theme: 'dark',
              language: 'en'
            }
          });
          
          console.log('✅ New user created with automatic email preferences (BOTH digests enabled)');
          console.log('📧 Auto-subscribed to: Daily Digest ✅ | Weekly Digest ✅');
        } else {
          // Existing user - update last login and check email preferences
          const userData = userDoc.data();
          
          await updateDoc(userDocRef, {
            lastLogin: serverTimestamp(),
            photoURL: user.photoURL || userData.photoURL // Update photo if changed
          });

          // 🔧 MIGRATION: Add or update email preferences for existing users
          if (!userData.emailPreferences) {
            console.log('🔄 Adding email preferences to existing user (BOTH digests enabled)');
            await updateDoc(userDocRef, {
              emailPreferences: {
                dailyDigest: true,       // 🔥 AUTO-SUBSCRIBE EXISTING USERS TO DAILY
                weeklyDigest: true,      // 🔥 AUTO-SUBSCRIBE EXISTING USERS TO WEEKLY
                notifications: true,
                projectUpdates: true,
                communityUpdates: true,
                marketing: false,
                announcements: true,
                lastUpdated: new Date()
              }
            });
            console.log('✅ Existing user auto-subscribed to both digests');
          } else {
            // 🔥 OPTIONAL: Auto-subscribe existing users who have dailyDigest = false
            const currentPrefs = userData.emailPreferences;
            if (currentPrefs.dailyDigest === false) {
              console.log('🔄 Enabling daily digest for existing user');
              await updateDoc(userDocRef, {
                'emailPreferences.dailyDigest': true,
                'emailPreferences.lastUpdated': new Date()
              });
              console.log('✅ Existing user auto-subscribed to daily digest');
            }
            
            // Ensure weekly digest is also enabled
            if (currentPrefs.weeklyDigest === false) {
              console.log('🔄 Enabling weekly digest for existing user');
              await updateDoc(userDocRef, {
                'emailPreferences.weeklyDigest': true,
                'emailPreferences.lastUpdated': new Date()
              });
              console.log('✅ Existing user auto-subscribed to weekly digest');
            }
          }
        }
      }

      return result;
    } catch (error) {
      console.error("Google sign-in failed:", error);
      throw error;
    }
  };

  // Shared: create the Firestore user doc for a brand-new account (same shape as
  // Google sign-up) so email/password users get identical setup.
  const createUserDocIfNew = async (user, displayNameOverride) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayNameOverride || user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        emailPreferences: {
          dailyDigest: true, weeklyDigest: true, notifications: true,
          projectUpdates: true, communityUpdates: true, marketing: false,
          announcements: true, lastUpdated: new Date()
        },
        profileComplete: false,
        onboardingComplete: false,
        role: 'user',
        preferences: { theme: 'dark', language: 'en' }
      });
    } else {
      await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
    }
  };

  // Sign up with email + password. Creates the account, sets display name, sends a
  // verification email, and creates the user doc.
  const signUpWithEmail = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    if (displayName) {
      try { await updateProfile(user, { displayName }); } catch (_) {}
    }
    await createUserDocIfNew(user, displayName);
    // Send OUR branded verification email (links to /auth/action on shemodeltech.com,
    // which shows a "Sign in now" button) instead of the default sender whose
    // link dead-ends on the plain firebaseapp.com page.
    try {
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: displayName || '' }),
      });
    } catch (_) {
      // Fallback: default sender is better than no email at all.
      try { await sendEmailVerification(user); } catch (_) {}
    }
    return result;
  };

  // Log in with email + password.
  const signInWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Make sure a doc exists (covers accounts created before this flow).
    await createUserDocIfNew(result.user);
    return result;
  };

  // Send a password reset email.
  const resetPassword = async (email) => {
    // Send our own branded reset email (links to /reset-password on shemodeltech.com)
    // instead of Firebase's default firebaseapp.com page.
    const res = await fetch('/api/auth/send-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Could not send the reset email. Please try again.');
    }
    return true;
  };

  // Verify a reset code (from the email link) and return the associated email.
  const verifyResetCode = async (oobCode) => {
    return verifyPasswordResetCode(auth, oobCode);
  };

  // Complete the reset with a new password.
  const confirmReset = async (oobCode, newPassword) => {
    return confirmPasswordReset(auth, oobCode, newPassword);
  };

  // Re-send the verification email to the signed-in user (branded flow).
  const resendVerification = async () => {
    if (!auth.currentUser) return;
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: auth.currentUser.email,
          name: auth.currentUser.displayName || '',
        }),
      });
      if (!res.ok) throw new Error('send failed');
    } catch (_) {
      // Fallback to the default sender rather than failing silently.
      return sendEmailVerification(auth.currentUser);
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  // Helper function to get user data from Firestore
  const getUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Helper function to update user email preferences
  const updateEmailPreferences = async (uid, newPreferences) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        emailPreferences: {
          ...newPreferences,
          lastUpdated: new Date()
        }
      });
      console.log('✅ Email preferences updated successfully');
      return true;
    } catch (error) {
      console.error("Error updating email preferences:", error);
      throw error;
    }
  };

  // 🔥 NEW: Helper function to auto-subscribe a user to both digests
  const autoSubscribeToDigests = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        'emailPreferences.dailyDigest': true,
        'emailPreferences.weeklyDigest': true,
        'emailPreferences.lastUpdated': new Date()
      });
      console.log('✅ User auto-subscribed to both daily and weekly digests');
      return true;
    } catch (error) {
      console.error("Error auto-subscribing user:", error);
      throw error;
    }
  };

  // Observer for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      // Push: if the user already granted notification permission, silently
      // (re)register this device's token and start listening for foreground pushes.
      if (user && typeof window !== 'undefined' && 'Notification' in window) {
        import('../utils/pushNotifications').then(({ enablePushForCurrentUser, listenForForegroundPush }) => {
          listenForForegroundPush();
          if (Notification.permission === 'granted') {
            enablePushForCurrentUser({ interactive: false });
          }
        }).catch(() => {});
      }
    });

    return unsubscribe;
  }, []);

  // Context value with all auth functions
  const value = {
    currentUser,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    resetPassword,
    verifyResetCode,
    confirmReset,
    resendVerification,
    logout,
    getUserData,
    updateEmailPreferences,
    autoSubscribeToDigests
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
