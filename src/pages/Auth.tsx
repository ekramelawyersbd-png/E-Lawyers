import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound,
  LogOut,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ServiceSEO } from '../components/SEO';

const formatAuthError = (err: any): string => {
  const code = err?.code || '';
  const message = err?.message || '';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'Sign-in popup was closed before completion. Please try again.';
  }
  if (code === 'auth/popup-blocked') {
    return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
  }
  if (code === 'auth/account-exists-with-different-credential') {
    return 'An account already exists with the same email. Please sign in with Google or Email to link your account.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'This sign-in provider is pending configuration in Firebase Console. Please try Google or Email in the meantime.';
  }
  if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Invalid email or password. Please verify your credentials.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'This email address is already registered. Please sign in instead.';
  }
  if (code === 'auth/weak-password') {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/invalid-continue-uri' || code === 'auth/unauthorized-continue-uri') {
    return 'Password reset link sent to your email. Please check your inbox.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection issue. Please check your internet connection.';
  }
  return message || 'Authentication failed. Please try again.';
};

export function Auth() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const { user, authUser, signInWithGoogle, signInWithFacebook, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectQuery = searchParams.get('redirect');
  const from = redirectQuery || (location.state as any)?.from?.pathname || (location.state as any)?.from || '/';

  const resetFormFeedback = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormFeedback();

    if (mode === 'forgot') {
      if (!email.trim()) {
        setError('Please enter your email address to reset password.');
        return;
      }
      setIsLoading(true);
      try {
        const result = await authService.requestPasswordReset(email.trim());
        setSuccessMessage(result.message);
        setError(null);
      } catch (err: any) {
        setError(formatAuthError(err));
        setSuccessMessage(null);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify both fields.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        navigate(from, { replace: true });
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const newUser = userCred.user;
        
        // Update user profile display name
        if (fullName.trim()) {
          try {
            await updateProfile(newUser, { displayName: fullName.trim() });
          } catch (profileErr) {
            console.warn('Profile name update skipped:', profileErr);
          }
        }

        // Create initial profile in Firestore
        try {
          const userRef = doc(db, 'users', newUser.uid);
          await setDoc(userRef, {
            email: newUser.email,
            displayName: fullName.trim() || newUser.displayName || 'Member',
            createdAt: serverTimestamp(),
            role: 'client'
          }, { merge: true });
        } catch (dbErr) {
          console.warn('User profile doc creation warning:', dbErr);
        }

        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    resetFormFeedback();
    setIsGoogleLoading(true);
    try {
      const session = await signInWithGoogle();
      if (session.role === 'admin') {
        const dest = from && from !== '/' && from !== '/auth' ? from : '/workspace';
        navigate(dest, { replace: true });
      } else {
        navigate(from === '/auth' ? '/dashboard' : from, { replace: true });
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        console.error('Google Sign-In error:', err);
      }
      setError(formatAuthError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    resetFormFeedback();
    setIsFacebookLoading(true);
    try {
      await signInWithFacebook();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setIsFacebookLoading(false);
    }
  };

  const handleSignOutCurrent = async () => {
    resetFormFeedback();
    try {
      await logout();
      setSuccessMessage('You have successfully signed out.');
    } catch (err: any) {
      setError('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 sm:bg-gradient-to-b sm:from-slate-50 sm:via-emerald-50/20 sm:to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ServiceSEO
        title={mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Reset Password' : 'Sign In | Compliance Hub'}
        description="Access your saved tax calculations, TDS guides, bookmarked statutory provisions, and compliance tools."
        serviceType="User Authentication"
        canonicalUrl="/auth"
      />

      {/* Decorative ambient background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Active Session Card (If User is Already Signed In) */}
        {user && (
          <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Active Session
              </span>
              <span className="text-xs text-emerald-300 uppercase tracking-wider font-semibold">
                {authUser?.role === 'admin' ? 'Administrator' : 'Member'}
              </span>
            </div>

            <div className="flex items-center gap-3.5 pt-1">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Profile'}
                  className="w-12 h-12 rounded-full border-2 border-emerald-400 object-cover shrink-0 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center font-bold text-white text-lg shrink-0">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <h3 className="font-bold text-white text-base truncate">
                  {user.displayName || 'Logged-in User'}
                </h3>
                <p className="text-xs text-emerald-200/90 truncate">
                  {user.email || 'Authenticated User'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                to={from === '/auth' ? '/dashboard' : from}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                <span>Continue Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleSignOutCurrent}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 bg-emerald-950/80 hover:bg-emerald-950 text-emerald-200 font-semibold text-xs rounded-xl border border-emerald-700/60 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-emerald-300" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Authentication Card */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-xl border border-slate-100">
          
          {/* Header & Logo */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center p-1.5 bg-slate-950 border border-slate-800 shadow-md mb-5 overflow-hidden">
              <img src="/logo.png" alt="E-Lawyers Logo" className="w-full h-full object-contain" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'signup' 
                ? 'Create an account' 
                : mode === 'forgot' 
                  ? 'Reset your password' 
                  : 'Welcome back'}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
              {mode === 'signup'
                ? 'Join Compliance Hub to save tax plans & bookmarks'
                : mode === 'forgot'
                  ? 'Enter your registered email to receive a password reset link'
                  : 'Sign in to access your tax plans and compliance data'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign In vs Sign Up) */}
          {mode !== 'forgot' && (
            <div className="mt-6 p-1 bg-slate-100 rounded-2xl flex items-center gap-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => { setMode('login'); resetFormFeedback(); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); resetFormFeedback(); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <div className="mt-5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="mt-5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
              <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* Prominent 1-Click Google Sign-In (Top of Form) */}
          {mode !== 'forgot' && (
            <div className="mt-6 space-y-3">
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                type="button"
                disabled={isLoading || isGoogleLoading || isFacebookLoading}
                aria-label="Sign in with Google"
                className="w-full relative flex items-center justify-center gap-3 min-h-[50px] py-2.5 px-4 rounded-xl border border-slate-300 hover:border-emerald-500/70 hover:bg-slate-50/90 active:bg-slate-100 active:scale-[0.99] text-xs sm:text-sm font-bold text-slate-800 shadow-xs hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer bg-white group focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600 shrink-0" />
                ) : (
                  <svg className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                )}
                <span>
                  {isGoogleLoading
                    ? 'Connecting to Google...'
                    : mode === 'signup'
                      ? 'Sign up with Google'
                      : 'Sign in with Google'}
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-auto shadow-2xs">
                  ⚡ 1-Click
                </span>
              </button>

              {/* Facebook Sign In Button */}
              <button
                onClick={handleFacebookSignIn}
                type="button"
                disabled={isLoading || isGoogleLoading || isFacebookLoading}
                className="w-full relative flex justify-center items-center gap-2.5 min-h-[44px] py-2 px-4 border border-[#1877F2]/30 hover:border-[#1877F2] rounded-xl shadow-2xs hover:shadow-xs bg-[#1877F2]/5 hover:bg-[#1877F2]/10 active:bg-[#1877F2]/20 active:scale-[0.99] text-xs sm:text-sm font-semibold text-[#1877F2] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1877F2]/40"
              >
                {isFacebookLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#1877F2] shrink-0" />
                ) : (
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                <span>{isFacebookLoading ? 'Connecting to Facebook...' : 'Continue with Facebook'}</span>
              </button>

              {/* Divider between Social & Email */}
              <div className="relative pt-3 pb-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                  <span className="px-3 bg-white text-slate-400">
                    {mode === 'signup' ? 'Or register with email' : 'Or continue with email'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Email / Password Form */}
          <form className="mt-4 space-y-4" onSubmit={handleEmailAuthSubmit}>
            {/* Active Submission Progress Bar */}
            {isLoading && (
              <div className="w-full bg-emerald-100 rounded-full h-1 overflow-hidden relative animate-pulse">
                <div className="bg-emerald-600 h-1 rounded-full w-full animate-indeterminate" />
              </div>
            )}
            
            {/* Full Name Field (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                    isLoading ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    ) : (
                      <UserIcon className="h-4 w-4" />
                    )}
                  </div>
                  <input
                    type="text"
                    id="auth-fullname"
                    name="name"
                    autoComplete="name"
                    required
                    disabled={isLoading}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`pl-10 pr-3 block w-full rounded-xl border py-2.5 text-sm text-slate-900 transition-all ${
                      isLoading 
                        ? 'border-emerald-300 bg-emerald-50/30 ring-2 ring-emerald-500/20 cursor-wait' 
                        : 'border-slate-200 bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs'
                    }`}
                    placeholder="e.g. Ekramul Haque"
                  />
                  {isLoading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Address Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700">Email Address</label>
                {isLoading && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing...
                  </span>
                )}
              </div>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                  isLoading ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </div>
                <input
                  type="email"
                  id="auth-email"
                  name="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 pr-10 block w-full rounded-xl border py-2.5 text-sm text-slate-900 transition-all ${
                    isLoading 
                      ? 'border-emerald-300 bg-emerald-50/30 ring-2 ring-emerald-500/20 cursor-wait' 
                      : 'border-slate-200 bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs'
                  }`}
                  placeholder="name@example.com"
                />
                {isLoading ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Password Field (Login & Sign Up) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => { setMode('forgot'); resetFormFeedback(); }}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                    isLoading ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="auth-password"
                    name="password"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 block w-full rounded-xl border py-2.5 text-sm text-slate-900 transition-all ${
                      isLoading 
                        ? 'border-emerald-300 bg-emerald-50/30 ring-2 ring-emerald-500/20 cursor-wait' 
                        : 'border-slate-200 bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs'
                    }`}
                    placeholder="••••••••"
                  />
                  {!isLoading && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Confirm Password Field (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="auth-confirm-password" className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                    isLoading ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    ) : (
                      <KeyRound className="h-4 w-4" />
                    )}
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="auth-confirm-password"
                    name="confirm-password"
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 block w-full rounded-xl border py-2.5 text-sm text-slate-900 transition-all ${
                      isLoading 
                        ? 'border-emerald-300 bg-emerald-50/30 ring-2 ring-emerald-500/20 cursor-wait' 
                        : 'border-slate-200 bg-slate-50/80 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs'
                    }`}
                    placeholder="••••••••"
                  />
                  {!isLoading && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || isFacebookLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-150 disabled:opacity-75 disabled:cursor-wait cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-white shrink-0" />
                  <span>
                    {mode === 'signup' 
                      ? 'Creating Your Account...' 
                      : mode === 'forgot'
                        ? 'Sending Reset Link...'
                        : 'Verifying & Signing In...'}
                  </span>
                </>
              ) : (
                <span>
                  {mode === 'signup' 
                    ? 'Create My Account' 
                    : mode === 'forgot'
                      ? 'Send Password Reset Email'
                      : 'Sign In'}
                </span>
              )}
            </button>
          </form>

          {/* Back to Sign In (Forgot Password Mode) */}
          {mode === 'forgot' && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => { setMode('login'); resetFormFeedback(); }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Toggle between Sign In / Sign Up at Bottom */}
          <div className="text-center mt-6 pt-5 border-t border-slate-100">
            {mode === 'login' ? (
              <p className="text-xs text-slate-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); resetFormFeedback(); }}
                  className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Create an account
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p className="text-xs text-slate-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); resetFormFeedback(); }}
                  className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Sign in to your account
                </button>
              </p>
            ) : null}
          </div>
        </div>

        {/* Internal Admin / Workspace Portal Link Card */}
        <div className="bg-white/80 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-600 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Need Shop Admin or Workspace Desk Access?</span>
          </div>
          <Link
            to="/admin/login"
            className="font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span>Admin Portal</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
export default Auth;
