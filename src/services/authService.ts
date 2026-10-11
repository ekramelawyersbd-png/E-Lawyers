import { signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, fallbackAuth, googleProvider, facebookProvider } from '../lib/firebase';

export interface ERPAuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: 'admin' | 'client';
  roleId: 'role-admin' | 'role-client';
  provider: 'google' | 'facebook' | 'email';
  token: string;
}

export const authService = {
  // ──────────────────────────────────────────
  // 🌐 Google Sign-In
  // ──────────────────────────────────────────
  loginWithGoogle: async (): Promise<ERPAuthUser> => {
    // 1. Trigger Google Popup with accounticca.com custom authDomain
    let userCred;
    try {
      userCred = await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      // If the custom domain throws an unauthorized domain or configuration error,
      // fallback to the project domain so sign-in never fails
      if (
        err?.code === 'auth/unauthorized-domain' ||
        err?.code === 'auth/internal-error' ||
        err?.code === 'auth/network-request-failed'
      ) {
        console.warn('Falling back to project domain authentication:', err?.code);
        userCred = await signInWithPopup(fallbackAuth, googleProvider);
      } else {
        throw err;
      }
    }
    const user: User = userCred.user;
    const userEmail = (user.email || user.providerData?.[0]?.email || '').trim().toLowerCase();

    // 2. Identify role (Admin, Employee, or Client)
    const isAdmin = [
      "admin@erpforu.com",
      "superadmin@erpforu.com",
      "info@erpforu.com",
      "ekram@elawyersbd.com",
      "ekram.elawyersbd@gmail.com",
      "hmekram@gmail.com",
      "hmekram@mail.com",
      "admin@admin.com"
    ].includes(userEmail);

    const role: 'admin' | 'client' = isAdmin ? 'admin' : 'client';
    const roleId: 'role-admin' | 'role-client' = isAdmin ? 'role-admin' : 'role-client';
    const displayName = user.displayName || (userEmail ? userEmail.split('@')[0] : 'User');

    const sessionUser: ERPAuthUser = {
      uid: user.uid,
      email: userEmail,
      displayName,
      photoURL: user.photoURL || null,
      role,
      roleId,
      provider: 'google',
      token: await user.getIdToken()
    };

    // 3. Persist session
    localStorage.setItem('erp_auth_user', JSON.stringify(sessionUser));

    // 4. If admin, sync with backend admin session for /workspace and /admin
    if (isAdmin) {
      try {
        const res = await fetch('/api/admin/oauth-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, displayName })
        });
        if (res.ok) {
          const syncData = await res.json();
          if (syncData.token) {
            localStorage.setItem('accounticca_admin_session_token', syncData.token);
          }
        }
      } catch (syncErr) {
        console.warn('Admin session bridge sync notice:', syncErr);
      }
    }

    return sessionUser;
  },

  // ──────────────────────────────────────────
  // 📘 Facebook Sign-In
  // ──────────────────────────────────────────
  loginWithFacebook: async (): Promise<ERPAuthUser> => {
    // 1. Trigger Firebase Facebook Popup
    const userCred = await signInWithPopup(auth, facebookProvider);
    const user: User = userCred.user;
    const userEmail = (user.email || user.providerData?.[0]?.email || '').trim().toLowerCase();

    const isAdmin = [
      "admin@erpforu.com",
      "superadmin@erpforu.com",
      "ekram@elawyersbd.com",
      "hmekram@gmail.com"
    ].includes(userEmail);

    const role: 'admin' | 'client' = isAdmin ? 'admin' : 'client';
    const roleId: 'role-admin' | 'role-client' = isAdmin ? 'role-admin' : 'role-client';
    const displayName = user.displayName || user.providerData?.[0]?.displayName || (userEmail ? userEmail.split('@')[0] : 'Client');

    const sessionUser: ERPAuthUser = {
      uid: user.uid,
      email: userEmail,
      displayName,
      photoURL: user.photoURL || user.providerData?.[0]?.photoURL || null,
      role,
      roleId,
      provider: 'facebook',
      token: await user.getIdToken()
    };

    // 2. Persist session
    localStorage.setItem('erp_auth_user', JSON.stringify(sessionUser));
    return sessionUser;
  },

  // ──────────────────────────────────────────
  // 🚪 Sign-Out
  // ──────────────────────────────────────────
  logout: async (): Promise<void> => {
    localStorage.removeItem('erp_auth_user');
    localStorage.removeItem('accounticca_admin_session_token');
    await Promise.allSettled([
      signOut(auth),
      signOut(fallbackAuth)
    ]);
  },

  // ──────────────────────────────────────────
  // 🔍 Get current saved session user
  // ──────────────────────────────────────────
  getCurrentUser: (): ERPAuthUser | null => {
    try {
      const stored = localStorage.getItem('erp_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
};
