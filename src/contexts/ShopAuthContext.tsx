import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AdminUser {
  email: string;
  role: 'admin';
  name: string;
  title: string;
}

interface ShopAuthContextType {
  adminUser: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const ADMIN_TOKEN_KEY = 'accounticca_admin_session_token';

export function getStoredAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

const ShopAuthContext = createContext<ShopAuthContextType | null>(null);

export function ShopAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredAdminToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  const verifySessionOnServer = useCallback(async (tokenToVerify: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          setIsAuthenticated(true);
          return true;
        }
      }
    } catch (err) {
      console.warn('[Shop Auth] Server verification error:', err);
    }

    // Session is invalid or server responded unauthorized
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // ignore
    }
    setToken(null);
    setAdminUser(null);
    setIsAuthenticated(false);
    return false;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const existingToken = getStoredAdminToken();
      if (existingToken) {
        await verifySessionOnServer(existingToken);
      } else {
        setIsAuthenticated(false);
        setAdminUser(null);
      }
      if (mounted) {
        setIsLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [verifySessionOnServer]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || 'Invalid credentials. Only authorized administrator can access.';
        setLoginError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Store token
      const newToken = data.token;
      try {
        localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }

      setToken(newToken);
      setAdminUser(data.user);
      setIsAuthenticated(true);
      setLoginError(null);

      return { success: true };
    } catch (err: any) {
      const errorMsg = err?.message || 'Server network error during authentication.';
      setLoginError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async (): Promise<void> => {
    const currentToken = token || getStoredAdminToken();
    if (currentToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        });
      } catch (err) {
        console.warn('Logout notice:', err);
      }
    }

    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // ignore
    }

    setToken(null);
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const clearError = () => {
    setLoginError(null);
  };

  return (
    <ShopAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated,
        isLoading,
        loginError,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </ShopAuthContext.Provider>
  );
}

export function useShopAuth() {
  const context = useContext(ShopAuthContext);
  if (!context) {
    throw new Error('useShopAuth must be used within a ShopAuthProvider');
  }
  return context;
}
