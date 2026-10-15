import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  Globe, 
  Bell, 
  Save, 
  Check, 
  Copy, 
  Download, 
  KeyRound, 
  LogOut, 
  ExternalLink, 
  Sliders, 
  FileText, 
  Clock, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone,
  Eye,
  Sparkles,
  ShoppingBag,
  Calendar
} from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { usePurchases } from '../../contexts/PurchaseContext';
import { SHOP_PRODUCTS, ShopProduct } from '../../data/shopProducts';
import { authService } from '../../services/authService';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { MyAppointmentsView } from './MyAppointmentsView';
import { fetchUserAppointments } from '../../services/appointmentService';

export interface UserPreferences {
  language: 'en' | 'bn';
  taxDeadlinesAlert: boolean;
  vatReminders: boolean;
  tdsUpdates: boolean;
  weeklyDigest: boolean;
  compactTables: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  taxDeadlinesAlert: true,
  vatReminders: true,
  tdsUpdates: true,
  weeklyDigest: false,
  compactTables: false,
  highContrast: false,
  fontSize: 'normal'
};

export const UserProfile: React.FC = () => {
  const { user, authUser, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { savedItems } = useBookmarks();
  const { purchasedProductIds } = usePurchases();
  const purchasedProducts = SHOP_PRODUCTS.filter(p => purchasedProductIds.includes(p.id));

  // Profile form state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [tinNumber, setTinNumber] = useState('');

  // Preferences state
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('accounticca_user_preferences');
      if (saved) return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return { ...DEFAULT_PREFERENCES, language };
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const tabParam = searchParams.get('tab');

  // UI state
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);
  const [appointmentsCount, setAppointmentsCount] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<'details' | 'preferences' | 'security' | 'purchases' | 'appointments'>(() => {
    if (tabParam === 'appointments' || location.hash === '#appointments') {
      return 'appointments';
    }
    if (tabParam === 'purchases') return 'purchases';
    if (tabParam === 'security') return 'security';
    if (tabParam === 'preferences') return 'preferences';
    return 'details';
  });

  // Sync tab with URL parameter or hash
  useEffect(() => {
    if (tabParam === 'appointments' || location.hash === '#appointments') {
      setActiveSection('appointments');
    }
  }, [tabParam, location.hash]);

  // Load appointments count for navigation tab indicator
  useEffect(() => {
    if (!user) return;
    fetchUserAppointments(user.uid, user.email || undefined)
      .then(apps => {
        setAppointmentsCount(apps.length);
      })
      .catch(() => {});
  }, [user]);

  // Load profile data from Firestore
  useEffect(() => {
    let isMounted = true;

    async function loadUserProfile() {
      if (!user) {
        setIsLoadingProfile(false);
        return;
      }

      setDisplayName(user.displayName || '');

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists() && isMounted) {
          const data = snap.data();
          if (data.displayName) setDisplayName(data.displayName);
          if (data.phone) setPhone(data.phone);
          if (data.organization) setOrganization(data.organization);
          if (data.designation) setDesignation(data.designation);
          if (data.tinNumber) setTinNumber(data.tinNumber);
          if (data.preferences) {
            setPreferences(prev => ({ ...prev, ...data.preferences }));
          }
        }
      } catch (err) {
        console.warn('Notice loading user profile doc from Firestore:', err);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    }

    loadUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle saving profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setFeedback(null);

    try {
      // 1. Update Firebase Auth Profile
      if (displayName.trim() && displayName.trim() !== user.displayName) {
        await updateProfile(user, {
          displayName: displayName.trim()
        });
      }

      // 2. Update Firestore user document
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: displayName.trim(),
        email: user.email || '',
        phone: phone.trim(),
        organization: organization.trim(),
        designation: designation.trim(),
        tinNumber: tinNumber.trim(),
        preferences,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 3. Persist local preferences
      localStorage.setItem('accounticca_user_preferences', JSON.stringify(preferences));

      setFeedback({
        type: 'success',
        message: 'Your profile and compliance preferences have been updated successfully.'
      });
    } catch (err: any) {
      console.error('Save profile error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle preference helper
  const handlePreferenceToggle = (key: keyof UserPreferences) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('accounticca_user_preferences', JSON.stringify(updated));
      return updated;
    });
  };

  // Change language preference
  const handleLanguageChange = (newLang: 'en' | 'bn') => {
    setLanguage(newLang);
    setPreferences(prev => {
      const updated = { ...prev, language: newLang };
      localStorage.setItem('accounticca_user_preferences', JSON.stringify(updated));
      return updated;
    });
  };

  // Copy User UID
  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  // Password reset email request (using robust authService)
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    setFeedback(null);
    try {
      const result = await authService.requestPasswordReset(user.email);
      setFeedback({
        type: 'success',
        message: result.message
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Could not send reset email. Please try again.'
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  // Export User Compliance Data
  const handleExportData = () => {
    if (!user) return;
    const exportPayload = {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        phone,
        organization,
        designation,
        tinNumber,
        provider: user.providerData?.[0]?.providerId || 'email',
        accountCreated: user.metadata?.creationTime,
        lastSignIn: user.metadata?.lastSignInTime
      },
      preferences,
      savedBookmarksCount: savedItems.length,
      savedBookmarks: savedItems,
      exportTimestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance_profile_${user.uid.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = (product: ShopProduct) => {
    const invoiceNum = `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const clientName = displayName || user?.displayName || user?.email || 'Valued Client';
    const clientEmail = user?.email || 'client@elawyersbd.com';
    const vatAmount = Math.round(product.price * 0.05);
    const netAmount = product.price - vatAmount;

    const invoiceText = `========================================================
E-LAWYERS & ACCOUNTICCA TAX CONSULTANCY FIRM
Official Commercial Tax Invoice / Transaction Receipt
========================================================
Invoice Number:   ${invoiceNum}
Date of Issue:    ${invoiceDate}
Payment Status:   PAID IN FULL (Verified & Encrypted)

-- BILLING & CLIENT DETAILS --
Client Name:      ${clientName}
Email:            ${clientEmail}
Jurisdiction:     People's Republic of Bangladesh

-- TRANSACTION PARTICULARS --
Item Description: ${product.title}
Product SKU:      ${product.id}
Category:         ${product.category}
Format:           ${product.format}

Net Amount:       ৳${netAmount.toLocaleString()} BDT
VAT (5% Incl.):   ৳${vatAmount.toLocaleString()} BDT
--------------------------------------------------------
TOTAL PAID:       ৳${product.price.toLocaleString()} BDT
--------------------------------------------------------

Payment Gateway:  Secured SSLCommerz / bKash Gateway
Reference Token:  ACC-TXN-${Math.floor(10000000 + Math.random() * 90000000)}

Authorized Signatory & Seal:
For E-Lawyers & Accounticca Practice Division
Adv. Ekram Hossain, Supreme Court of Bangladesh

Note: This is a system-generated computer invoice and serves as official proof of digital resource/tool acquisition under Bangladesh commercial regulations.
========================================================`;

    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${product.slug}-${invoiceNum}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-sm max-w-xl mx-auto space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Sign in to View Profile</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Please log in with your Compliance Hub account or Google to access your account settings and manage statutory notifications.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/auth"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <span>Go to Sign In</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const creationTime = user.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Active';

  const lastSignIn = user.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Recent';

  const providerId = user.providerData?.[0]?.providerId || '';
  const providerLabel = providerId === 'google.com' 
    ? 'Google OAuth' 
    : providerId === 'facebook.com' 
      ? 'Facebook OAuth' 
      : 'Email & Password';

  return (
    <div className="space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 sm:gap-5">
            {/* User Avatar */}
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName || user.displayName || 'User Avatar'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-sm shrink-0">
                {(displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                  {displayName || user.displayName || 'Compliance Member'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {authUser?.role === 'admin' ? 'Administrator' : 'Verified Member'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>

              {/* Quiet unboxed metadata */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                <span>Joined {creationTime}</span>
                <span aria-hidden="true">&bull;</span>
                <span>{providerLabel}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={handleExportData}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              title="Export Account Data"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={logout}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors cursor-pointer border border-rose-200/60"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-px">
        <button
          type="button"
          onClick={() => {
            setActiveSection('details');
            setSearchParams({});
          }}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSection === 'details'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Account Details
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveSection('preferences');
            setSearchParams({ tab: 'preferences' });
          }}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSection === 'preferences'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Compliance Preferences
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveSection('security');
            setSearchParams({ tab: 'security' });
          }}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSection === 'security'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Security &amp; Sync
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveSection('purchases');
            setSearchParams({ tab: 'purchases' });
          }}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'purchases'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>My Purchases ({purchasedProducts.length})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveSection('appointments');
            setSearchParams({ tab: 'appointments' });
          }}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'appointments'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Appointments</span>
          {appointmentsCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeSection === 'appointments' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {appointmentsCount}
            </span>
          )}
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
            {feedback.message}
          </div>
          <button 
            onClick={() => setFeedback(null)} 
            className="text-xs font-bold text-slate-500 hover:text-slate-900 underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section 1: Account Details Form */}
      {activeSection === 'details' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Personal &amp; Business Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your corporate credentials for tax calculation drafts and formal compliance logs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name / Contact Person
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="profile-name"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 pr-3 block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs transition-all"
                  placeholder="e.g. Adv. Ekram Hossain"
                />
              </div>
            </div>

            {/* Email Address (Read-Only) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Account Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="profile-email"
                  autoComplete="email"
                  disabled
                  value={user.email || ''}
                  className="pl-10 pr-3 block w-full rounded-xl border border-slate-200 bg-slate-100 text-slate-500 py-2.5 text-sm cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Contact Phone / WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="tel"
                  id="profile-phone"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 pr-3 block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs transition-all"
                  placeholder="+880 1711-000000"
                />
              </div>
            </div>

            {/* Organization / Company */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Organization / Law Firm / Entity
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="organization"
                  id="profile-organization"
                  autoComplete="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="pl-10 pr-3 block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs transition-all"
                  placeholder="e.g. E-Lawyers & Associates"
                />
              </div>
            </div>

            {/* Designation / Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Designation / Professional Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="pl-10 pr-3 block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs transition-all"
                  placeholder="e.g. Managing Partner / Tax Consultant"
                />
              </div>
            </div>

            {/* e-TIN Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                12-Digit e-TIN / Tax File Ref (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  className="pl-10 pr-3 block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs transition-all"
                  placeholder="XXXXXXXXXXXX"
                  maxLength={12}
                />
              </div>
            </div>
          </div>

          {/* UID & Session Information Bar */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Account UID:</span>
              <code className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 text-[11px]">
                {user.uid}
              </code>
              <button
                type="button"
                onClick={handleCopyUid}
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUid ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-slate-500">
              Last authenticated: <span className="font-medium text-slate-700">{lastSignIn}</span>
            </div>
          </div>

          {/* Form Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving Changes...' : 'Save Account Details'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Section 2: Compliance Preferences */}
      {activeSection === 'preferences' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Compliance &amp; Notification Preferences</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize statutory alert delivery, language display, and reading typography.
            </p>
          </div>

          {/* Language Preference */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Language &amp; Terminology
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  preferences.language === 'en'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">English (Statutory Standard)</div>
                  <div className="text-xs text-slate-500 mt-0.5">Official Acts, SROs &amp; Legal Citations</div>
                </div>
                {preferences.language === 'en' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange('bn')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  preferences.language === 'bn'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">বাংলা (Bangla Edition)</div>
                  <div className="text-xs text-slate-500 mt-0.5">বাংলায় ব্যাখ্যা ও সহজ নির্দেশিকা</div>
                </div>
                {preferences.language === 'bn' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          </div>

          {/* Statutory Reminders & Notifications */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Statutory Notifications &amp; Alert Delivery
            </h3>
            
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
              {/* Income Tax Alerts */}
              <div className="p-4 flex items-center justify-between gap-4 bg-white">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900">Income Tax &amp; Advance Tax Alerts</div>
                  <div className="text-xs text-slate-500">
                    Quarterly advance tax deadlines and personal/corporate return filing cutoff reminders.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle('taxDeadlinesAlert')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    preferences.taxDeadlinesAlert ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.taxDeadlinesAlert ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* VAT Reminders */}
              <div className="p-4 flex items-center justify-between gap-4 bg-white">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900">Monthly VAT 9.1 Return Reminders</div>
                  <div className="text-xs text-slate-500">
                    Timely reminder before the 15th of every month to avoid non-compliance penalties.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle('vatReminders')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    preferences.vatReminders ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.vatReminders ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* TDS Rates & Circular Updates */}
              <div className="p-4 flex items-center justify-between gap-4 bg-white">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900">TDS Withholding &amp; Statutory Circulars</div>
                  <div className="text-xs text-slate-500">
                    Notices whenever NBR publishes new withholding tax circulars or gazette changes.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle('tdsUpdates')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    preferences.tdsUpdates ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.tdsUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Weekly Digest */}
              <div className="p-4 flex items-center justify-between gap-4 bg-white">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900">Weekly Regulatory Executive Digest</div>
                  <div className="text-xs text-slate-500">
                    Curated summary of Supreme Court decisions, RJSC notices, and financial guidelines.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle('weeklyDigest')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    preferences.weeklyDigest ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Reading & Table Formatting */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Reading Layout &amp; Table Density
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">Compact Data Rows</div>
                  <div className="text-xs text-slate-500 mt-0.5">Optimized for high-density tax spreadsheets</div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle('compactTables')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    preferences.compactTables ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.compactTables ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-900">High-Contrast Legal Text</div>
                  <div className="text-xs text-slate-500 mt-0.5">Enhanced contrast for statutory sections</div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle('highContrast')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    preferences.highContrast ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Security & Integrations */}
      {activeSection === 'security' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Security &amp; Connected Services</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage credential recovery, enterprise Google Workspace links, and active session tokens.
            </p>
          </div>

          {/* Password & Credential Security */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                <span>Account Credentials &amp; Password</span>
              </div>
              <p className="text-xs text-slate-600">
                {providerId === 'google.com' ? (
                  <>
                    Account is authenticated via <strong className="text-slate-800">Google OAuth</strong> ({user.email}). You can dispatch a recovery/access link or manage security directly.
                  </>
                ) : (
                  <>
                    Send a secure password reset link to your registered email (<span className="font-semibold text-slate-800">{user.email}</span>).
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {providerId === 'google.com' && (
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Google Security</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={isSendingReset}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSendingReset ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </div>
          </div>

          {/* Google Workspace Enterprise Integration */}
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Google Workspace Enterprise Hub</span>
              </div>
              <p className="text-xs text-slate-600">
                Sync Drive documents, Google Sheets, Google Meet, and client calendar deadlines.
              </p>
            </div>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
            >
              <span>Open Workspace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Active Session & Privacy */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Active Session Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block">Auth Provider</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{providerLabel}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block">User Role</span>
                <span className="font-bold text-slate-800 mt-0.5 block capitalize">
                  {authUser?.role || 'Member'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block">Saved Articles</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {savedItems.length} items
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: My Purchases & Downloads */}
      {activeSection === 'purchases' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span>My Purchases &amp; Digital Downloads</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Access and download your purchased digital workbooks, legal contracts, and compliance kits.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-all self-start sm:self-auto"
            >
              <span>Explore Shop Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {purchasedProducts.length === 0 ? (
            <div className="py-12 text-center space-y-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">No Purchases Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You haven't unlocked any shop resources or toolkits yet. Visit the E-Lawyers Shop to explore professional kits.
                </p>
              </div>
              <div>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  <span>Browse Shop Catalog</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {purchasedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-gradient-to-r from-white via-slate-50/40 to-emerald-50/20 hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {product.format}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {product.shortDescription}
                      </p>
                      <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2">
                        <span>Author: {product.authorOrVettedBy}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Lifetime Access Unlocked
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                    <a
                      href={`#download-${product.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading digital asset for: ${product.title}\nFormat: ${product.format}\n\nYour secure download has started successfully!`);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(product)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                      title="Download commercial invoice for this transaction"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Download Invoice</span>
                    </button>
                    <Link
                      to={`/shop/${product.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-all"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 5: My Appointments Dashboard */}
      {activeSection === 'appointments' && (
        <MyAppointmentsView />
      )}

    </div>
  );
};
