import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  RotateCcw,
} from 'lucide-react';

export interface FormSuccessAnimationProps {
  referenceId: string;
  clientName: string;
  email: string;
  phone: string;
  service: string;
  division: string;
  message: string;
  inquirySheetSynced: boolean;
  emailDraftUrl: string | null;
  onReset: () => void;
}

export const FormSuccessAnimation: React.FC<FormSuccessAnimationProps> = ({
  referenceId,
  clientName,
  email,
  phone,
  service,
  division,
  message,
  inquirySheetSynced,
  emailDraftUrl,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(referenceId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative overflow-hidden rounded-3xl border border-emerald-200/90 bg-gradient-to-b from-white via-emerald-50/40 to-teal-50/30 p-6 shadow-xl shadow-emerald-950/5 sm:p-9"
    >
      <style>{`
        @keyframes strokeCircle {
          0% {
            stroke-dashoffset: 283;
            transform: rotate(-90deg) scale(0.85);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            transform: rotate(-90deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes fillBounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes strokeCheck {
          0% {
            stroke-dashoffset: 50;
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes rippleWave {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.45);
            opacity: 0;
          }
        }

        @keyframes confettiBurst {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx, 0), var(--ty, 0)) scale(1);
            opacity: 0;
          }
        }

        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .anim-circle-bg {
          animation: fillBounce 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform-origin: center;
        }

        .anim-circle-stroke {
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          transform-origin: center;
          animation: strokeCircle 0.75s ease-out forwards;
        }

        .anim-check-mark {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: strokeCheck 0.45s cubic-bezier(0.65, 0, 0.45, 1) 0.42s forwards;
        }

        .anim-ripple {
          animation: rippleWave 1.4s ease-out 0.25s infinite;
        }

        .anim-confetti {
          animation: confettiBurst 0.9s ease-out 0.3s forwards;
        }

        .anim-content-fade {
          animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-circle-bg,
          .anim-circle-stroke,
          .anim-check-mark,
          .anim-ripple,
          .anim-confetti,
          .anim-content-fade {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>

      {/* Decorative ambient background glows */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-teal-200/30 blur-3xl"
        aria-hidden="true"
      />

      {/* Hero Animated Success Icon */}
      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        {/* Expanding pulse ripple */}
        <div
          className="anim-ripple absolute inset-0 rounded-full bg-emerald-400/25"
          aria-hidden="true"
        />
        <div
          className="anim-ripple absolute -inset-2 rounded-full bg-teal-400/15"
          style={{ animationDelay: '0.45s' }}
          aria-hidden="true"
        />

        {/* Confetti particles */}
        <div
          className="anim-confetti pointer-events-none absolute h-2 w-2 rounded-full bg-amber-400"
          style={{ '--tx': '42px', '--ty': '-38px' } as React.CSSProperties}
          aria-hidden="true"
        />
        <div
          className="anim-confetti pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-emerald-500"
          style={{ '--tx': '-48px', '--ty': '-32px' } as React.CSSProperties}
          aria-hidden="true"
        />
        <div
          className="anim-confetti pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-teal-500"
          style={{ '--tx': '46px', '--ty': '28px' } as React.CSSProperties}
          aria-hidden="true"
        />
        <div
          className="anim-confetti pointer-events-none absolute h-2 w-2 rounded-full bg-emerald-400"
          style={{ '--tx': '-40px', '--ty': '36px' } as React.CSSProperties}
          aria-hidden="true"
        />
        <div
          className="anim-confetti pointer-events-none absolute h-2 w-2 rotate-45 bg-amber-300"
          style={{ '--tx': '0px', '--ty': '-52px' } as React.CSSProperties}
          aria-hidden="true"
        />

        {/* Primary SVG Checkmark with stroke animations */}
        <svg
          className="relative h-24 w-24 drop-shadow-md"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle outer track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#a7f3d0"
            strokeWidth="3"
            opacity="0.6"
          />
          {/* Animated outline ring */}
          <circle
            className="anim-circle-stroke"
            cx="50"
            cy="50"
            r="45"
            stroke="#059669"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Solid bouncing background disc */}
          <circle
            className="anim-circle-bg"
            cx="50"
            cy="50"
            r="38"
            fill="url(#emeraldGradient)"
          />
          {/* Animated checkmark path */}
          <path
            className="anim-check-mark"
            d="M32 50.5L44 62.5L68 37.5"
            stroke="#ffffff"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="emeraldGradient" x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0b5e48" />
              <stop offset="1" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Confirmation Headings & Reference ID */}
      <div className="anim-content-fade mt-5 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-2xs backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          <span>Inquiry Successfully Registered</span>
        </div>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Thank you, {clientName.split(' ')[0] || 'Client'}!
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
          Your matter brief has been logged directly into our chamber ledger and queued for partner review.
        </p>

        {/* Reference Number Card */}
        <div className="mx-auto mt-5 max-w-md rounded-2xl border border-emerald-200/90 bg-white p-3.5 shadow-xs sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Official Docket Reference</p>
              <p className="font-mono text-base font-bold tracking-tight text-emerald-950 sm:text-lg">
                {referenceId}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
              aria-label="Copy docket reference ID"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                  <span className="text-emerald-800">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sync Status Badges */}
      <div className="anim-content-fade mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-white px-3 py-1.5 font-medium text-emerald-900 shadow-2xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          <span>Firestore Database Confirmed</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-white px-3 py-1.5 font-medium text-emerald-900 shadow-2xs">
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          <span>{inquirySheetSynced ? 'Synced to Workspace Google Sheet' : 'Logged to Workspace Ledger'}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-white px-3 py-1.5 font-medium text-emerald-900 shadow-2xs">
          <Clock className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          <span>Response SLA: 4 business hours</span>
        </span>
      </div>

      {/* Docket Summary Details */}
      <div className="anim-content-fade mt-6 rounded-2xl border border-slate-200/90 bg-white/95 p-4 text-left shadow-xs sm:p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Summary of Inquiry</p>
        <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
          <div>
            <span className="text-slate-500">Practice Area:</span>
            <p className="mt-0.5 font-semibold text-slate-900">{service}</p>
          </div>
          <div>
            <span className="text-slate-500">Routing Desk:</span>
            <p className="mt-0.5 font-semibold text-slate-900">{division}</p>
          </div>
          <div>
            <span className="text-slate-500">Client Contact:</span>
            <p className="mt-0.5 font-semibold text-slate-900">
              {clientName} · <span className="text-slate-600">{email}</span>
            </p>
          </div>
          <div>
            <span className="text-slate-500">Phone / WhatsApp:</span>
            <p className="mt-0.5 font-semibold text-slate-900">{phone}</p>
          </div>
        </div>

        <div className="mt-3 border-t border-slate-100 pt-3">
          <span className="text-slate-500 text-xs">Matter Brief:</span>
          <p className="mt-1 line-clamp-3 rounded-lg bg-slate-50 p-2.5 text-xs leading-5 text-slate-700">
            {message}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="anim-content-fade mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-emerald-600/15"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <span>Submit Another Inquiry</span>
        </button>

        {emailDraftUrl && (
          <a
            href={emailDraftUrl}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b5e48] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#084b3a] focus:outline-none focus:ring-4 focus:ring-emerald-600/20"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Open Email Draft (Attach Documents)</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
          </a>
        )}
      </div>

      <p className="mt-4 text-center text-[11px] text-slate-500">
        A senior advisor will review your matter and contact you at {email} within our guaranteed response window.
      </p>
    </div>
  );
};
