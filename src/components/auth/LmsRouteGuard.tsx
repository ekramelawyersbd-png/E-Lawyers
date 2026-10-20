import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Database
} from 'lucide-react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useLms, StudentProfileRecord } from '../../contexts/LmsContext';

interface LmsRouteGuardProps {
  children: React.ReactNode;
}

export const LmsRouteGuard: React.FC<LmsRouteGuardProps> = ({ children }) => {
  const { user, authUser, loading: authLoading, signInWithGoogle, signInWithFacebook } = useAuth();
  const {
    courses,
    activeCourse,
    isFirestoreSyncing,
    isEnrolledInCourse,
    verifyFirestoreEnrollment,
    enrollInCourse
  } = useLms();

  const { courseId: paramCourseId } = useParams<{ courseId?: string }>();
  const location = useLocation();

  const targetCourseId = paramCourseId || activeCourse.courseId;
  const targetCourse =
    courses.find((c) => c.courseId === targetCourseId) || activeCourse;

  const activeUid = user?.uid || authUser?.uid || null;

  const [isCheckingFirestore, setIsCheckingFirestore] = useState<boolean>(true);
  const [firestoreEnrolled, setFirestoreEnrolled] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<'google' | 'facebook' | null>(null);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);

  const verifyFnRef = React.useRef(verifyFirestoreEnrollment);
  verifyFnRef.current = verifyFirestoreEnrollment;
  const isEnrolledFnRef = React.useRef(isEnrolledInCourse);
  isEnrolledFnRef.current = isEnrolledInCourse;

  // Verify user authentication status and check Firestore (`lms_enrollments/{uid}`) for active course enrollment
  useEffect(() => {
    let mounted = true;
    let unsubscribeSnapshot: (() => void) | null = null;

    const verifyAuthAndFirestoreEnrollment = async () => {
      if (authLoading || isFirestoreSyncing) {
        return;
      }

      if (!activeUid) {
        if (mounted) {
          setFirestoreEnrolled((prev) => (prev ? false : prev));
          setIsCheckingFirestore((prev) => (prev ? false : prev));
        }
        return;
      }

      setIsCheckingFirestore(true);

      try {
        const enrollmentRef = doc(db, 'lms_enrollments', activeUid);
        const snap = await getDoc(enrollmentRef);

        if (snap.exists()) {
          const data = snap.data() as StudentProfileRecord & { status?: string };
          const enrolledIds = Array.isArray(data.enrolledCourseIds) ? data.enrolledCourseIds : [];
          const isActiveStatus = data.status !== 'inactive' && data.status !== 'revoked';
          const isCourseEnrolled = isActiveStatus && enrolledIds.includes(targetCourseId);

          if (mounted) {
            setFirestoreEnrolled((prev) => (prev === isCourseEnrolled ? prev : isCourseEnrolled));
            setIsCheckingFirestore(false);
          }
        } else {
          // Delegate fallback check & sync to LmsContext
          const verifiedViaContext = await verifyFnRef.current(targetCourseId);
          if (mounted) {
            setFirestoreEnrolled((prev) =>
              prev === verifiedViaContext ? prev : verifiedViaContext
            );
            setIsCheckingFirestore(false);
          }
        }

        // Subscribe to real-time updates on the user's Firestore enrollment record
        unsubscribeSnapshot = onSnapshot(
          enrollmentRef,
          (docSnap) => {
            if (!mounted) return;
            if (docSnap.exists()) {
              const data = docSnap.data() as StudentProfileRecord & { status?: string };
              const enrolledIds = Array.isArray(data.enrolledCourseIds) ? data.enrolledCourseIds : [];
              const isActiveStatus = data.status !== 'inactive' && data.status !== 'revoked';
              const nextVal = isActiveStatus && enrolledIds.includes(targetCourseId);
              setFirestoreEnrolled((prev) => (prev === nextVal ? prev : nextVal));
            }
          },
          () => {
            // Fallback to context state if real-time listener encounters an error
          }
        );
      } catch {
        const verifiedFallback = await verifyFnRef.current(targetCourseId);
        if (mounted) {
          const fallbackVal = verifiedFallback || isEnrolledFnRef.current(targetCourseId);
          setFirestoreEnrolled((prev) => (prev === fallbackVal ? prev : fallbackVal));
          setIsCheckingFirestore(false);
        }
      }
    };

    verifyAuthAndFirestoreEnrollment();

    return () => {
      mounted = false;
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [activeUid, authLoading, isFirestoreSyncing, targetCourseId]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSigningIn('google');
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Google authentication failed. Please try again.'
      );
    } finally {
      setIsSigningIn(null);
    }
  };

  const handleFacebookSignIn = async () => {
    setAuthError(null);
    setIsSigningIn('facebook');
    try {
      await signInWithFacebook();
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Facebook authentication failed. Please try again.'
      );
    } finally {
      setIsSigningIn(null);
    }
  };

  const handleConfirmFirestoreEnrollment = async () => {
    setIsEnrolling(true);
    try {
      await enrollInCourse(targetCourseId);
      setFirestoreEnrolled(true);
    } finally {
      setIsEnrolling(false);
    }
  };

  // 1. Loading State: Checking Firebase Auth & Firestore Enrollment
  if (authLoading || isFirestoreSyncing || isCheckingFirestore) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto relative">
            <ShieldCheck className="w-7 h-7 text-emerald-600 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900">
              Verifying Student Access & Firestore Enrollment...
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Checking Firebase Authentication status and validating active course enrollment record in Firestore (`lms_enrollments`).
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State: Require Firebase Auth Sign-In
  if (!user && !authUser) {
    return (
      <div className="min-h-[80vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-700">
                  Protected Student Learning Portal
                </div>
                <h1 className="text-lg font-bold text-slate-900">
                  Authentication Required
                </h1>
              </div>
            </div>
            <GraduationCap className="w-6 h-6 text-slate-400" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-600 leading-relaxed">
              Access to the <strong>Student Learning Dashboard</strong>, 10-Class Curriculum, Quizzes, Final Examination, and Official Certificate requires a verified Firebase account and active course enrollment in Firestore.
            </p>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Requested Course Resource:</span>
              </div>
              <div className="font-medium text-slate-900">{targetCourse.title}</div>
              <div className="font-mono text-[11px] text-slate-400">
                Destination: {location.pathname}
              </div>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              disabled={isSigningIn !== null}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 20.4 7.4 23 12 23z"
                />
              </svg>
              <span>
                {isSigningIn === 'google'
                  ? 'Signing in with Google...'
                  : 'Sign In with Google to Access LMS'}
              </span>
            </button>

            <button
              type="button"
              disabled={isSigningIn !== null}
              onClick={handleFacebookSignIn}
              className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>
                {isSigningIn === 'facebook'
                  ? 'Signing in with Facebook...'
                  : 'Sign In with Facebook to Access LMS'}
              </span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/training" className="font-semibold text-slate-700 hover:underline">
              ← Back to Training Hub
            </Link>
            <Link
              to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}
              className="font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Full Login Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated in Firebase Auth, but not yet enrolled in target course in Firestore
  if (!firestoreEnrolled && !isEnrolledInCourse(targetCourseId)) {
    return (
      <div className="min-h-[80vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-700">
                  Firestore Enrollment Guard
                </div>
                <h1 className="text-lg font-bold text-slate-900">
                  Course Enrollment Required
                </h1>
              </div>
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <p className="leading-relaxed">
              You are signed in as{' '}
              <strong className="text-slate-900">
                {user?.displayName || authUser?.displayName || user?.email}
              </strong>
              , but your Firestore enrollment record (`lms_enrollments/{activeUid}`) does not yet include an active enrollment for this course:
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-emerald-700">
                {targetCourse.programTag}
              </div>
              <div className="text-base font-bold text-slate-900">
                {targetCourse.title}
              </div>
              <div className="text-xs text-slate-500">
                10 Sequential Classes · Video Lectures · Class Notes · PPT · Quizzes · Final Exam
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              disabled={isEnrolling}
              onClick={handleConfirmFirestoreEnrollment}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isEnrolling
                  ? 'Registering Enrollment in Firestore...'
                  : 'Activate & Verify Course Enrollment in Firestore'}
              </span>
            </button>

            <Link
              to={`/checkout?product=${encodeURIComponent(targetCourse.productSlug)}`}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              <span>Purchase Course via Checkout</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LmsRouteGuard;
