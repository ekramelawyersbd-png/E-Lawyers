import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, fallbackAuth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { authService, ERPAuthUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  authUser: ERPAuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<ERPAuthUser>;
  signInWithFacebook: () => Promise<ERPAuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<ERPAuthUser | null>(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthState = async (currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);
        const currentEmail = (currentUser.email || currentUser.providerData?.[0]?.email || '').trim().toLowerCase();
        const isAdmin = [
          "admin@erpforu.com",
          "superadmin@erpforu.com",
          "info@erpforu.com",
          "ekram@elawyersbd.com",
          "ekram.elawyersbd@gmail.com",
          "hmekram@gmail.com",
          "hmekram@mail.com",
          "admin@admin.com"
        ].includes(currentEmail);

        const role: 'admin' | 'client' = isAdmin ? 'admin' : 'client';
        const roleId: 'role-admin' | 'role-client' = isAdmin ? 'role-admin' : 'role-client';
        const displayName = currentUser.displayName || (currentEmail ? currentEmail.split('@')[0] : 'User');

        try {
          const token = await currentUser.getIdToken();
          const rawProviderId = currentUser.providerData?.[0]?.providerId || '';
          const provider: 'google' | 'facebook' | 'email' = 
            rawProviderId === 'facebook.com' ? 'facebook' :
            rawProviderId === 'google.com' ? 'google' : 'email';

          const sessionUser: ERPAuthUser = {
            uid: currentUser.uid,
            email: currentEmail,
            displayName,
            photoURL: currentUser.photoURL || null,
            role,
            roleId,
            provider,
            token
          };
          setAuthUser(sessionUser);
          localStorage.setItem('erp_auth_user', JSON.stringify(sessionUser));
        } catch {
          // Fallback session user if token refresh fails while offline
          const fallbackSession: ERPAuthUser = {
            uid: currentUser.uid,
            email: currentEmail,
            displayName,
            photoURL: currentUser.photoURL || null,
            role,
            roleId,
            provider: 'google',
            token: ''
          };
          setAuthUser(fallbackSession);
          localStorage.setItem('erp_auth_user', JSON.stringify(fallbackSession));
        }

        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await setDoc(
            userRef,
            {
              email: currentEmail,
              displayName: currentUser.displayName || displayName,
              updatedAt: serverTimestamp(),
              role
            },
            { merge: true }
          );
        } catch {
          // Client may be operating in offline mode; local cache will sync when online
        }
      } else {
        if (!auth.currentUser && !fallbackAuth.currentUser) {
          setUser(null);
          setAuthUser(null);
          localStorage.removeItem('erp_auth_user');
        }
      }
      setLoading(false);
    };

    const unsub1 = onAuthStateChanged(auth, handleAuthState);
    const unsub2 = onAuthStateChanged(fallbackAuth, handleAuthState);

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const signInWithGoogle = async (): Promise<ERPAuthUser> => {
    const session = await authService.loginWithGoogle();
    setAuthUser(session);
    return session;
  };

  const signInWithFacebook = async (): Promise<ERPAuthUser> => {
    const session = await authService.loginWithFacebook();
    setAuthUser(session);
    return session;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authUser, loading, signInWithGoogle, signInWithFacebook, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

