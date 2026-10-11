import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const currentEmail = (currentUser.email || currentUser.providerData?.[0]?.email || '').trim().toLowerCase();
        const isAdmin = [
          "admin@erpforu.com",
          "superadmin@erpforu.com",
          "info@erpforu.com",
          "ekram@elawyersbd.com",
          "hmekram@gmail.com"
        ].includes(currentEmail);

        const role: 'admin' | 'client' = isAdmin ? 'admin' : 'client';
        const roleId: 'role-admin' | 'role-client' = isAdmin ? 'role-admin' : 'role-client';
        const displayName = currentUser.displayName || (currentEmail ? currentEmail.split('@')[0] : 'User');

        try {
          const token = await currentUser.getIdToken();
          const sessionUser: ERPAuthUser = {
            uid: currentUser.uid,
            email: currentEmail,
            displayName,
            photoURL: currentUser.photoURL || null,
            role,
            roleId,
            provider: (currentUser.providerData?.[0]?.providerId === 'facebook.com' ? 'facebook' : 'google') as 'google' | 'facebook',
            token
          };
          setAuthUser(sessionUser);
          localStorage.setItem('erp_auth_user', JSON.stringify(sessionUser));
        } catch (e) {
          console.error("Error setting session token", e);
        }

        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            await setDoc(userRef, {
              email: currentEmail,
              displayName: currentUser.displayName,
              createdAt: serverTimestamp(),
              role
            });
          }
        } catch (e) {
          console.error("Error creating user profile", e);
        }
      } else {
        setUser(null);
        setAuthUser(null);
        localStorage.removeItem('erp_auth_user');
      }
      setLoading(false);
    });

    return unsubscribe;
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

