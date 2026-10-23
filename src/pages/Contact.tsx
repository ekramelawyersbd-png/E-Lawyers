import React, { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Youtube,
  Facebook,
  Scale,
  FileSpreadsheet,
  type LucideIcon,
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getAccessToken } from '../services/workspaceAuth';
import { getStoredContactSheetId } from '../services/contactSheetsSync';
import { AppointmentBookingForm } from '../components/AppointmentBookingForm';
import { FloatingLiveChat } from '../components/FloatingLiveChat';
import { OfficeLocationMap } from '../components/OfficeLocationMap';

type ContactTab = 'inquiry' | 'appointment';
type FormField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'companyName'
  | 'service'
  | 'message';

type InquiryFormData = Record<FormField, string>;
type FieldErrors = Partial<Record<FormField, string>>;

const PRIMARY_PHONE = '+880 1335-230170';
const RAW_PHONE = '+8801335230170';
const ACCOUNTICCA_EMAIL = 'info@accounticca.com';
const ELAWYERS_EMAIL = 'info@elawyersbd.com';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=BTI+Centara+Grand+144+Green+Road+Panthapath+Dhaka+1205';

const INITIAL_FORM: InquiryFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  service: 'Corporate Law & RJSC Compliance',
  message: '',
};

const SERVICES = [
  'Corporate Law & RJSC Compliance',
  'Corporate Tax, VAT & Statutory Audit',
  'Fractional CFO & Financial Modeling',
  'BIDA Approvals & Foreign Direct Investment',
  'Commercial Contracts & IP Protection',
  'Business Process Optimization & Automation',
  'Integrated Joint Ecosystem Consultation',
];

const LEGAL_SERVICES = new Set([
  'Corporate Law & RJSC Compliance',
  'BIDA Approvals & Foreign Direct Investment',
  'Commercial Contracts & IP Protection',
]);

function getRequestedTab(search: string, hash: string): ContactTab {
  const params = new URLSearchParams(search);
  const requested = params.get('tab');

  if (requested === 'appointment' || requested === 'inquiry') return requested;

  const normalizedHash = hash.toLowerCase();
  if (normalizedHash.includes('appointment') || normalizedHash.includes('book')) {
    return 'appointment';
  }
  if (normalizedHash.includes('inquiry')) return 'inquiry';

  if (params.has('area') || params.has('practice')) return 'appointment';
  return 'inquiry';
}

function validateField(field: FormField, value: string): string | undefined {
  const trimmed = value.trim();

  switch (field) {
    case 'firstName':
    case 'lastName': {
      const label = field === 'firstName' ? 'First name' : 'Last name';
      if (!trimmed) return `${label} is required.`;
      if (trimmed.length < 2) return `${label} must be at least 2 characters.`;
      if (trimmed.length > 80) return `${label} must be 80 characters or fewer.`;
      if (!/\p{L}/u.test(trimmed) || !/^[\p{L}\p{M}\s.'-]+$/u.test(trimmed)) {
        return 'Use letters and common name punctuation only.';
      }
      return undefined;
    }
    case 'email': {
      if (!trimmed) return 'Email address is required.';
      if (trimmed.length > 254 || /\s/.test(trimmed)) return 'Enter a valid email address.';
      const parts = trimmed.split('@');
      if (parts.length !== 2) return 'Enter an email address in the format name@company.com.';
      const [local, domain] = parts;
      if (
        !local ||
        local.length > 64 ||
        local.startsWith('.') ||
        local.endsWith('.') ||
        local.includes('..')
      ) {
        return 'Check the username portion of your email address.';
      }
      const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailPattern.test(trimmed)) return 'Enter a valid email address, such as name@company.com.';
      const domainLabels = domain.split('.');
      if (domainLabels.some((label) => !label)) return 'Check the domain in your email address.';
      if ((domainLabels.at(-1) ?? '').length < 2) return 'Email domain extension must contain at least 2 characters.';
      return undefined;
    }
    case 'phone': {
      if (!trimmed) return 'Phone or WhatsApp number is required.';
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15) {
        return 'Enter a phone number containing 8–15 digits.';
      }
      if (!/^\+?[\d\s().-]+$/.test(trimmed)) {
        return 'Use digits, spaces, parentheses, dots, or hyphens only.';
      }
      return undefined;
    }
    case 'companyName':
      if (trimmed && trimmed.length < 2) return 'Company name must be at least 2 characters.';
      if (trimmed.length > 120) return 'Company name must be 120 characters or fewer.';
      return undefined;
    case 'message':
      if (!trimmed) return 'Please describe your matter.';
      if (trimmed.length < 15) return `Please provide at least 15 characters (${trimmed.length}/15).`;
      if (trimmed.length > 3000) return 'Please keep your description under 3,000 characters.';
      return undefined;
    case 'service':
      return SERVICES.includes(value) ? undefined : 'Select a service area.';
    default:
      return undefined;
  }
}

function validateForm(form: InquiryFormData): FieldErrors {
  const fields: FormField[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'companyName',
    'service',
    'message',
  ];
  return fields.reduce<FieldErrors>((errors, field) => {
    const error = validateField(field, form[field]);
    if (error) errors[field] = error;
    return errors;
  }, {});
}

type TextFieldProps = {
  id: string;
  label: string;
  name: string;
  value: string;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  showError: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onBlur: () => void;
};

function TextField({
  id,
  label,
  name,
  value,
  type = 'text',
  autoComplete,
  placeholder,
  helper,
  error,
  showError,
  maxLength,
  onChange,
  onBlur,
}: TextFieldProps) {
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">
        {label} <span className="text-emerald-700">*</span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : helper ? helpId : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          showError
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
            : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-emerald-600/10'
        }`}
      />
      {showError ? (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-rose-700" role="alert">
          <span aria-hidden="true">•</span><span>{error}</span>
        </p>
      ) : helper ? (
        <p id={helpId} className="mt-1.5 text-xs text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

type MessageFieldProps = {
  value: string;
  error?: string;
  showError: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
};

function MessageField({ value, error, showError, onChange, onBlur }: MessageFieldProps) {
  const errorId = 'contact-message-error';
  const helpId = 'contact-message-help';

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor="contact-message" className="text-sm font-semibold text-slate-800">
          Matter description <span className="text-emerald-700">*</span>
        </label>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          value.trim().length >= 15
            ? 'bg-emerald-50 text-emerald-800'
            : 'bg-slate-100 text-slate-500'
        }`}>
          {value.trim().length}/15 minimum
        </span>
      </div>
      <textarea
        id="contact-message"
        name="message"
        rows={5}
        maxLength={3000}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder="Tell us briefly about your business, legal, tax, or compliance needs..."
        aria-invalid={showError}
        aria-describedby={showError ? errorId : helpId}
        className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          showError
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
            : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-emerald-600/10'
        }`}
      />
      {showError ? (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-rose-700" role="alert">
          <span aria-hidden="true">•</span><span>{error}</span>
        </p>
      ) : (
        <p id={helpId} className="mt-1.5 text-xs text-slate-500">
          Please avoid including passwords or other sensitive account credentials.
        </p>
      )}
    </div>
  );
}

type SocialLink = { label: string; href: string; Icon: LucideIcon };

type SocialGroup = { brand: string; description: string; color: 'emerald' | 'teal'; links: SocialLink[] };

const SOCIAL_GROUPS: SocialGroup[] = [
  {
    brand: 'ACCOUNTICCA',
    description: 'Tax, finance and business advisory',
    color: 'emerald',
    links: [
      { label: 'LinkedIn', href: 'https://linkedin.com/company/accounticca', Icon: Linkedin },
      { label: 'Facebook', href: 'https://facebook.com/accounticca', Icon: Facebook },
      { label: 'YouTube', href: 'https://youtube.com/@accounticca', Icon: Youtube },
    ],
  },
  {
    brand: 'E-LAWYERS',
    description: 'Corporate law and compliance',
    color: 'teal',
    links: [
      { label: 'LinkedIn', href: 'https://linkedin.com/company/elawyersbd', Icon: Linkedin },
      { label: 'Facebook', href: 'https://facebook.com/elawyersbd', Icon: Facebook },
      { label: 'Instagram', href: 'https://instagram.com/elawyerssbd', Icon: Instagram },
      { label: 'YouTube', href: 'https://youtube.com/@elawyerssbd', Icon: Youtube },
    ],
  },
];

export function Contact() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContactTab>(() =>
    getRequestedTab(location.search, location.hash),
  );
  const [form, setForm] = useState<InquiryFormData>(INITIAL_FORM);
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});
  const [formAttempted, setFormAttempted] = useState(false);
  const [emailDraftUrl, setEmailDraftUrl] = useState<string | null>(null);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [submittedInquiryRef, setSubmittedInquiryRef] = useState<string | null>(null);
  const [inquirySheetSynced, setInquirySheetSynced] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(getRequestedTab(location.search, location.hash));
  }, [location.search, location.hash]);

  const errors = useMemo(() => validateForm(form), [form]);
  const requiredFields: FormField[] = ['firstName', 'lastName', 'email', 'phone', 'message'];
  const completedRequiredFields = requiredFields.filter(
    (field) => form[field].trim().length > 0 && !validateField(field, form[field]),
  ).length;
  const completionPercentage = Math.round((completedRequiredFields / requiredFields.length) * 100);
  const hasErrors = Object.keys(errors).length > 0;

  const updateField = (field: FormField, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setEmailDraftUrl(null);
    setSubmittedInquiryRef(null);
  };

  const selectTab = (tab: ContactTab) => {
    const params = new URLSearchParams(location.search);
    params.set('tab', tab);
    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : '',
        hash: `#${tab}`,
      },
      { replace: true },
    );
    setActiveTab(tab);
  };

  const scrollToForm = (tab: ContactTab) => {
    selectTab(tab);
    window.setTimeout(() => {
      document.getElementById('contact-form-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  };

  const markTouched = (field: FormField) => {
    setTouched((previous) => ({ ...prevOrEmpty(previous), [field]: true }));
  };

  function prevOrEmpty(prev: Partial<Record<FormField, boolean>>) {
    return prev || {};
  }

  const handleCopy = async (value: string, label: string) => {
    setCopyError(null);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      setCopyStatus(label);
      window.setTimeout(() => setCopyStatus(null), 2200);
    } catch {
      setCopyError('Copy is unavailable in this browser. Please select the contact detail and copy it manually.');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormAttempted(true);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      companyName: true,
      service: true,
      message: true,
    });
    setEmailDraftUrl(null);
    setSubmittedInquiryRef(null);

    if (hasErrors) {
      const orderedFields: FormField[] = [
        'firstName', 'lastName', 'email', 'phone', 'companyName', 'service', 'message',
      ];
      const firstInvalid = orderedFields.find((field) => errors[field]);
      const ids: Record<FormField, string> = {
        firstName: 'contact-first-name',
        lastName: 'contact-last-name',
        email: 'contact-email',
        phone: 'contact-phone',
        companyName: 'contact-company-name',
        service: 'contact-service',
        message: 'contact-message',
      };
      if (firstInvalid) {
        window.setTimeout(() => {
          const element = document.getElementById(ids[firstInvalid]);
          element?.focus();
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
      }
      return;
    }

    setIsSubmittingInquiry(true);
    const refNumber = Math.floor(10000 + Math.random() * 90000);
    const referenceId = `INQ-2026-${refNumber}`;

    const isJointInquiry = form.service === 'Integrated Joint Ecosystem Consultation';
    const recipient = isJointInquiry
      ? ACCOUNTICCA_EMAIL
      : LEGAL_SERVICES.has(form.service)
        ? ELAWYERS_EMAIL
        : ACCOUNTICCA_EMAIL;
    const division = isJointInquiry
      ? 'Accounticca × E-Lawyers'
      : LEGAL_SERVICES.has(form.service)
        ? 'E-Lawyers Chambers'
        : 'Accounticca Advisory';

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

    // 1. Best-effort Firestore save
    try {
      await addDoc(collection(db, 'contact_messages'), {
        referenceId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        fullName,
        email: form.email.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim() || 'Direct Client / Individual',
        service: form.service,
        division,
        message: form.message.trim(),
        status: 'new',
        createdAt: serverTimestamp(),
      });
    } catch (fsErr) {
      console.warn('Firestore inquiry backup notice:', fsErr);
    }

    // 2. Save to Backend Ledger & Real-Time Workspace Google Sheet Sync
    let synced = false;
    try {
      const workspaceAccessToken = getAccessToken();
      const spreadsheetId = getStoredContactSheetId();
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId,
          requestType: 'Service Inquiry',
          division,
          clientName: fullName,
          email: form.email.trim(),
          phone: form.phone.trim(),
          companyName: form.companyName.trim() || 'Direct Client / Individual',
          serviceArea: form.service,
          expertiseTopic: 'General Service Inquiry',
          consultationMode: 'N/A (Written Inquiry)',
          preferredDate: 'Immediate / Written',
          preferredTimeSlot: 'N/A',
          assignedPartner: `${division} (${recipient})`,
          messageOrNotes: form.message.trim(),
          status: 'New Inquiry',
          workspaceAccessToken: workspaceAccessToken || undefined,
          spreadsheetId: spreadsheetId || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        synced = Boolean(data.sheetSynced);
      }
    } catch (apiErr) {
      console.warn('Backend contact ledger notice:', apiErr);
    }

    const cc = isJointInquiry ? `&cc=${encodeURIComponent(ELAWYERS_EMAIL)}` : '';
    const subject = `[${referenceId}] Consultation Inquiry — ${form.service}`;
    const body = [
      `Reference ID: ${referenceId}`,
      'New consultation inquiry',
      '',
      `Name: ${fullName}`,
      `Email: ${form.email.trim()}`,
      `Phone / WhatsApp: ${form.phone.trim()}`,
      `Company: ${form.companyName.trim() || 'Not provided'}`,
      `Service area: ${form.service}`,
      '',
      'Matter description:',
      form.message.trim(),
    ].join('\n');

    setSubmittedInquiryRef(referenceId);
    setInquirySheetSynced(synced);
    setEmailDraftUrl(
      `mailto:${recipient}?subject=${encodeURIComponent(subject)}${cc}&body=${encodeURIComponent(body)}`,
    );
    setIsSubmittingInquiry(false);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setTouched({});
    setFormAttempted(false);
    setEmailDraftUrl(null);
    setSubmittedInquiryRef(null);
    setInquirySheetSynced(false);
  };

  const inputError = (field: FormField) => Boolean((touched[field] || formAttempted) && errors[field]);

  return (
    <main className="min-h-screen bg-[#f5f7f4] pb-16 text-slate-900">
      {/* Hero */}
      <section className="px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 text-slate-900 shadow-xl shadow-emerald-950/5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(16,185,129,0.12),transparent_42%),radial-gradient(ellipse_at_0%_100%,rgba(20,184,166,0.10),transparent_38%)]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-emerald-900/10" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-emerald-900/10" />

          <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-sm text-slate-600">
              <Link to="/" className="transition hover:text-emerald-800">Home</Link>
              <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="font-semibold text-slate-900">Contact</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold tracking-wide text-emerald-900">
                  <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  ACCOUNTICCA <span className="text-emerald-600">×</span> E-LAWYERS
                </div>
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  One point of contact.
                  <span className="mt-1 block text-emerald-700">Complete business support.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Corporate law, tax, VAT, audit, and business advisory—connected through one coordinated team.
                  Tell us what you need, and we’ll help you identify the right next step.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => scrollToForm('appointment')}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" /> Book a consultation
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToForm('inquiry')}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-xs transition hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-950 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-700" aria-hidden="true" /> Send an inquiry
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Speak with our team</p>
                <a href={`tel:${RAW_PHONE}`} className="mt-3 flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-950 transition hover:text-emerald-700 sm:text-3xl">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {PRIMARY_PHONE}
                </a>
                <p className="mt-3 text-sm leading-6 text-slate-600">Sunday–Thursday · Corporate consultations and business inquiries</p>
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                    Suite G-5, BTI Centara Grand, 144–144/1 Green Road, Panthapath, Dhaka–1205
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-3 border-t border-emerald-200/70 pt-6 sm:grid-cols-3">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-800"><ShieldCheck className="h-4 w-4" aria-hidden="true" /></span>
                Coordinated advisory support
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-800"><Scale className="h-4 w-4" aria-hidden="true" /></span>
                Legal and financial expertise
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-800"><Clock3 className="h-4 w-4" aria-hidden="true" /></span>
                Clear next steps, without the runaround
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct contact cards */}
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Direct contact</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Reach the right team</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose the contact channel that works best for you.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><MapPin className="h-5 w-5" aria-hidden="true" /></span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Head office</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">ACCOUNTICCA × E-LAWYERS</h3>
            <address className="mt-3 not-italic text-sm leading-6 text-slate-600">
              Suite G-5, BTI Centara Grand<br />
              144–144/1 Green Road, Panthapath<br />
              Dhaka–1205, Bangladesh
            </address>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950">
              Get directions <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>

          <article className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><Phone className="h-5 w-5" aria-hidden="true" /></span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Telephone desk</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">Call or WhatsApp</h3>
            <a href={`tel:${RAW_PHONE}`} className="mt-3 block text-xl font-semibold tracking-tight text-slate-900 hover:text-emerald-800">{PRIMARY_PHONE}</a>
            <button type="button" onClick={() => void handleCopy(RAW_PHONE, 'phone')} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50" aria-label="Copy phone number">
              {copyStatus === 'phone' ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />}
              {copyStatus === 'phone' ? 'Copied' : 'Copy number'}
            </button>
            <p className="mt-5 text-sm leading-6 text-slate-500">Sunday to Thursday for corporate consultations and inquiries.</p>
          </article>

          <article className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><Mail className="h-5 w-5" aria-hidden="true" /></span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Email desks</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">Contact by email</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Finance, tax, VAT and audit</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <a href={`mailto:${ACCOUNTICCA_EMAIL}`} className="break-all text-sm font-semibold text-emerald-800 hover:underline">{ACCOUNTICCA_EMAIL}</a>
                  <button type="button" onClick={() => void handleCopy(ACCOUNTICCA_EMAIL, ACCOUNTICCA_EMAIL)} aria-label="Copy Accounticca email" className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-800">
                    {copyStatus === ACCOUNTICCA_EMAIL ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Corporate law and compliance</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <a href={`mailto:${ELAWYERS_EMAIL}`} className="break-all text-sm font-semibold text-teal-800 hover:underline">{ELAWYERS_EMAIL}</a>
                  <button type="button" onClick={() => void handleCopy(ELAWYERS_EMAIL, ELAWYERS_EMAIL)} aria-label="Copy E-Lawyers email" className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-teal-50 hover:text-teal-800">
                    {copyStatus === ELAWYERS_EMAIL ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
        {copyError && <p role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{copyError}</p>}
      </section>

      {/* Inquiry and appointment */}
      <section id="contact-form-section" className="mx-auto max-w-7xl scroll-mt-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Let’s get started</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">Tell us what you’re working on.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Book a consultation or send a written brief. Share enough context for our team to understand your needs and identify the appropriate practice area.
            </p>

            <div className="mt-7 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></span>
                <div><h3 className="text-sm font-semibold text-slate-900">Thoughtful, coordinated support</h3><p className="mt-1 text-sm leading-6 text-slate-600">Your selected service helps route the inquiry to the relevant team.</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><BriefcaseBusiness className="h-5 w-5" aria-hidden="true" /></span>
                <div><h3 className="text-sm font-semibold text-slate-900">Business-first context</h3><p className="mt-1 text-sm leading-6 text-slate-600">Tell us what decision, deadline, or challenge you need help with.</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><Clock3 className="h-5 w-5" aria-hidden="true" /></span>
                <div><h3 className="text-sm font-semibold text-slate-900">Clear next steps</h3><p className="mt-1 text-sm leading-6 text-slate-600">We’ll use your details to understand the best way to follow up.</p></div>
              </div>
            </div>

            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950">
              Visit our Dhaka office <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="border-b border-slate-100 p-3 sm:p-4">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="Contact options">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'inquiry'}
                  onClick={() => selectTab('inquiry')}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-600/10 ${activeTab === 'inquiry' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
                >
                  <FileText className="h-4 w-4" aria-hidden="true" /> Send an inquiry
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'appointment'}
                  onClick={() => selectTab('appointment')}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-600/10 ${activeTab === 'appointment' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'}`}
                >
                  <CalendarDays className="h-4 w-4" aria-hidden="true" /> Book appointment
                </button>
              </div>
            </div>

            {activeTab === 'appointment' ? (
              <div className="p-5 sm:p-8" role="tabpanel">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-950">Book a consultation</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Choose an available option in the appointment form below.</p>
                </div>
                <AppointmentBookingForm />
              </div>
            ) : (
              <div className="p-5 sm:p-8" role="tabpanel">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">Send your matter brief</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">Fields marked with an asterisk are required.</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Private inquiry
                  </span>
                </div>

                <div className="mb-6 rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-slate-700">Required fields completed</span>
                    <span className="font-bold tabular-nums text-slate-800">{completedRequiredFields} of {requiredFields.length} · {completionPercentage}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="Required fields completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completionPercentage}>
                    <div className="h-full rounded-full bg-emerald-600 transition-all duration-300" style={{ width: `${completionPercentage}%` }} />
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      id="contact-first-name" label="First name" name="firstName" value={form.firstName}
                      autoComplete="given-name" placeholder="Your first name" maxLength={80}
                      error={errors.firstName} showError={inputError('firstName')}
                      onChange={(value) => updateField('firstName', value)} onBlur={() => markTouched('firstName')}
                    />
                    <TextField
                      id="contact-last-name" label="Last name" name="lastName" value={form.lastName}
                      autoComplete="family-name" placeholder="Your last name" maxLength={80}
                      error={errors.lastName} showError={inputError('lastName')}
                      onChange={(value) => updateField('lastName', value)} onBlur={() => markTouched('lastName')}
                    />
                    <TextField
                      id="contact-email" label="Work or personal email" name="email" type="email" value={form.email}
                      autoComplete="email" placeholder="you@company.com" maxLength={254}
                      error={errors.email} showError={inputError('email')}
                      onChange={(value) => updateField('email', value)} onBlur={() => markTouched('email')}
                    />
                    <TextField
                      id="contact-phone" label="Phone or WhatsApp" name="phone" type="tel" value={form.phone}
                      autoComplete="tel" placeholder="+880 1XXX-XXXXXX" maxLength={24}
                      error={errors.phone} showError={inputError('phone')}
                      onChange={(value) => updateField('phone', value)} onBlur={() => markTouched('phone')}
                    />
                    <TextField
                      id="contact-company-name" label="Company name (optional)" name="companyName" value={form.companyName}
                      autoComplete="organization" placeholder="Company or organization" maxLength={120}
                      helper="Leave blank if you are contacting us as an individual."
                      error={errors.companyName} showError={inputError('companyName')}
                      onChange={(value) => updateField('companyName', value)} onBlur={() => markTouched('companyName')}
                    />
                    <div>
                      <label htmlFor="contact-service" className="mb-2 block text-sm font-semibold text-slate-800">Service area <span className="text-emerald-700">*</span></label>
                      <select
                        id="contact-service"
                        name="service"
                        value={form.service}
                        onChange={(event) => updateField('service', event.target.value)}
                        onBlur={() => markTouched('service')}
                        aria-invalid={inputError('service')}
                        aria-describedby={inputError('service') ? 'contact-service-error' : undefined}
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${inputError('service') ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-emerald-600/10'}`}
                      >
                        {SERVICES.map((service) => <option key={service} value={service}>{service}</option>)}
                      </select>
                      {inputError('service') && <p id="contact-service-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-700">{errors.service}</p>}
                    </div>
                  </div>

                  <MessageField
                    value={form.message}
                    error={errors.message}
                    showError={inputError('message')}
                    onChange={(value) => updateField('message', value)}
                    onBlur={() => markTouched('message')}
                  />

                  {formAttempted && hasErrors && (
                    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Please review the highlighted fields before preparing your email.</span>
                    </div>
                  )}

                  {emailDraftUrl && (
                    <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><CheckCircle2 className="h-5 w-5" aria-hidden="true" /></span>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-emerald-950">Inquiry Submitted &amp; Recorded</h4>
                            {submittedInquiryRef && (
                              <span className="rounded-md bg-white px-2 py-0.5 font-mono text-xs font-bold text-emerald-900 border border-emerald-200">
                                {submittedInquiryRef}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                              <FileSpreadsheet className="h-3 w-3" aria-hidden="true" />
                              {inquirySheetSynced ? 'Synced to Workspace Google Sheet' : 'Saved to Workspace Ledger'}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-emerald-900/80">
                            Your inquiry has been logged to our advisory desk ledger{inquirySheetSynced ? ' and automatically appended to our Google Sheet' : ''}. You may also open a direct email draft below if you wish to attach files.
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <a href={emailDraftUrl} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-700/20">
                              Open email draft <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                            <button type="button" onClick={resetForm} className="inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold text-emerald-900 underline underline-offset-4 hover:text-emerald-950">
                              Start a new inquiry
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#0b5e48] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition hover:bg-[#084b3a] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:opacity-60"
                  >
                    {isSubmittingInquiry ? 'Submitting inquiry & syncing...' : 'Submit inquiry & prepare email'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                  <p className="text-center text-xs leading-5 text-slate-500">
                    Submitting saves your inquiry directly to our Workspace Contact Ledger &amp; Google Sheet and prepares an optional direct email draft.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Portals */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Our ecosystem</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Explore our portals</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">Find the right specialist practice for your business and compliance needs.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <a href="https://accounticca.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 transition hover:border-emerald-300 hover:bg-emerald-50">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-lg font-bold text-white">A</span>
                <div><h3 className="font-semibold text-slate-950">ACCOUNTICCA</h3><p className="mt-1 text-sm text-slate-600">Accounting, tax, VAT, audit and finance</p><span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800">accounticca.com <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></span></div>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-emerald-800 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a href="https://elawyersbd.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-2xl border border-teal-100 bg-teal-50/50 p-5 transition hover:border-teal-300 hover:bg-teal-50">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-800 text-lg font-bold text-white">E</span>
                <div><h3 className="font-semibold text-slate-950">E-LAWYERS</h3><p className="mt-1 text-sm text-slate-600">Corporate law, litigation and compliance</p><span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800">elawyersbd.com <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></span></div>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-teal-800 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a href="https://blog.accounticca.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-slate-50">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><FileText className="h-5 w-5" aria-hidden="true" /></span>
              <div><h3 className="text-sm font-semibold text-slate-900">Accounticca Advisory Blog</h3><p className="mt-1 text-xs text-slate-500">Guides, updates and business insights</p></div>
              <ExternalLink className="ml-auto h-4 w-4 text-slate-400" aria-hidden="true" />
            </a>
            <a href="https://elawyersbd.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-teal-200 hover:bg-slate-50">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Globe2 className="h-5 w-5" aria-hidden="true" /></span>
              <div><h3 className="text-sm font-semibold text-slate-900">E-Lawyers Legal Portal</h3><p className="mt-1 text-xs text-slate-500">Legal services and compliance support</p></div>
              <ExternalLink className="ml-auto h-4 w-4 text-slate-400" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Social links */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Stay connected</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Follow our channels</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {SOCIAL_GROUPS.map((group) => {
            const accent = group.color === 'emerald' ? 'text-emerald-800 bg-emerald-50' : 'text-teal-800 bg-teal-50';
            return (
              <article key={group.brand} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black ${accent}`}>{group.brand === 'ACCOUNTICCA' ? 'A' : 'E'}</span>
                  <div><h3 className="font-semibold text-slate-950">{group.brand}</h3><p className="mt-0.5 text-xs text-slate-500">{group.description}</p></div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.links.map(({ label, href, Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900">
                      <Icon className="h-4 w-4" aria-hidden="true" /> {label} <ArrowUpRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* One map instance */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Find us</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Visit our Dhaka office</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <OfficeLocationMap primaryPhone={PRIMARY_PHONE} rawTelNumber={RAW_PHONE} />
        </div>
      </section>

      <FloatingLiveChat />
    </main>
  );
}
