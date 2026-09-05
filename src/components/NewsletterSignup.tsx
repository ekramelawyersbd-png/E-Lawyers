import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Bell, 
  BookOpen, 
  Check 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NewsletterSignupProps {
  currentCategory?: string;
  sourceArticleTitle?: string;
  sourceArticleId?: string;
  className?: string;
  variant?: 'full-width' | 'card';
}

const TOPIC_OPTIONS = [
  { id: 'tax_vat', label: 'Tax & VAT Reforms (NBR Circulars & SROs)' },
  { id: 'corporate_rjsc', label: 'Corporate Law & RJSC Compliance' },
  { id: 'litigation_adr', label: 'Commercial Litigation & Arbitration' },
  { id: 'labor_employment', label: 'Employment & Labour Regulations' },
];

export function NewsletterSignup({
  currentCategory,
  sourceArticleTitle,
  sourceArticleId,
  className = '',
  variant = 'full-width'
}: NewsletterSignupProps) {
  let authContext: any = null;
  try {
    authContext = useAuth();
  } catch {
    // Graceful fallback if rendered outside AuthProvider
  }
  const user = authContext?.user;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['tax_vat', 'corporate_rjsc']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [alreadySubscribedEmail, setAlreadySubscribedEmail] = useState<string | null>(null);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
    if (user?.displayName && !name) {
      setName(user.displayName);
    }
  }, [user]);

  // Check localStorage for prior subscription
  useEffect(() => {
    try {
      const stored = localStorage.getItem('accounticca_newsletter_subscriber');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setAlreadySubscribedEmail(parsed.email);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Adapt pre-selected topic based on the article's category
  useEffect(() => {
    if (!currentCategory) return;
    const cat = currentCategory.toLowerCase();
    if (cat.includes('tax') || cat.includes('vat')) {
      setSelectedTopics(prev => Array.from(new Set([...prev, 'tax_vat'])));
    } else if (cat.includes('corporate') || cat.includes('business')) {
      setSelectedTopics(prev => Array.from(new Set([...prev, 'corporate_rjsc'])));
    } else if (cat.includes('civil') || cat.includes('criminal') || cat.includes('dispute') || cat.includes('adr')) {
      setSelectedTopics(prev => Array.from(new Set([...prev, 'litigation_adr'])));
    } else if (cat.includes('labour') || cat.includes('labor') || cat.includes('employment')) {
      setSelectedTopics(prev => Array.from(new Set([...prev, 'labor_employment'])));
    }
  }, [currentCategory]);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId)
        ? prev.length > 1 
          ? prev.filter(t => t !== topicId) 
          : prev // Keep at least one selected
        : [...prev, topicId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic email syntax validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid business or personal email address.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    const payload = {
      email: email.trim().toLowerCase(),
      name: name.trim() || undefined,
      topics: selectedTopics,
      sourceCategory: currentCategory || 'General',
      sourceArticleId: sourceArticleId || undefined,
      sourceArticleTitle: sourceArticleTitle || undefined,
      subscribedAt: new Date().toISOString(),
    };

    try {
      // 1. Try sending to backend API if available
      try {
        const res = await fetch('/api/subscribe-newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.warn('API returned non-OK status for newsletter subscription:', errData);
        }
      } catch (fetchErr) {
        // Non-blocking fallback for offline / preview environment
        console.warn('Could not post to /api/subscribe-newsletter, falling back to local persistence:', fetchErr);
      }

      // 2. Persist in localStorage for resilient client-side state
      try {
        localStorage.setItem('accounticca_newsletter_subscriber', JSON.stringify(payload));
        // Also maintain a cumulative list of subscriptions on this client
        const historyRaw = localStorage.getItem('accounticca_newsletter_list');
        const history: any[] = historyRaw ? JSON.parse(historyRaw) : [];
        const existingIdx = history.findIndex((item: any) => item.email === payload.email);
        if (existingIdx >= 0) {
          history[existingIdx] = payload;
        } else {
          history.push(payload);
        }
        localStorage.setItem('accounticca_newsletter_list', JSON.stringify(history));
      } catch (storageErr) {
        console.warn('LocalStorage error:', storageErr);
      }

      setAlreadySubscribedEmail(payload.email);
      setStatus('success');
    } catch (err: any) {
      console.error('Newsletter submission failure:', err);
      setStatus('error');
      setErrorMessage('Something went wrong registering your subscription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
    setEmail('');
    setName('');
  };

  const content = (
    <div className="max-w-4xl mx-auto">
      {/* Header Badge & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Bell className="w-3.5 h-3.5 text-emerald-600" />
          <span>Legal & Tax Intelligence Dispatch</span>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3">
          Stay Informed on Bangladesh Law & Tax Updates
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Receive curated, practitioner-grade summaries of latest <strong className="text-slate-800 font-semibold">NBR circulars</strong>, <strong className="text-slate-800 font-semibold">Finance Act amendments</strong>, <strong className="text-slate-800 font-semibold">RJSC compliance deadlines</strong>, and High Court rulings directly in your inbox.
        </p>
      </div>

      {status === 'success' ? (
        <div 
          id="newsletter-success-state"
          className="bg-emerald-50/90 border border-emerald-200 rounded-3xl p-8 text-center animate-in fade-in zoom-in-95 duration-300 shadow-sm"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            You're Officially Subscribed!
          </h3>
          <p className="text-slate-600 text-sm md:text-base max-w-lg mx-auto mb-6">
            We've registered <span className="font-semibold text-emerald-800">{email || alreadySubscribedEmail}</span> to receive our weekly legal bulletin and urgent statutory alerts.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6">
            {selectedTopics.map(tid => {
              const topic = TOPIC_OPTIONS.find(t => t.id === tid);
              return (
                <span 
                  key={tid}
                  className="px-3 py-1 rounded-lg bg-emerald-200/60 text-emerald-900 text-xs font-semibold"
                >
                  ✓ {topic?.label.split('(')[0].trim()}
                </span>
              );
            })}
          </div>

          <div className="pt-4 border-t border-emerald-200/60 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Delivered weekly on Sunday mornings
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Zero spam · One-click unsubscribe anytime
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <button
              id="newsletter-subscribe-another-btn"
              type="button"
              onClick={handleReset}
              className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
            >
              Subscribe another email
            </button>
          </div>
        </div>
      ) : (
        <form 
          id="newsletter-signup-form"
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md"
        >
          {alreadySubscribedEmail && status === 'idle' && (
            <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You previously subscribed with <strong className="text-slate-800">{alreadySubscribedEmail}</strong>. You can update your topics below:</span>
              </span>
            </div>
          )}

          {status === 'error' && (
            <div 
              id="newsletter-error-message"
              className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm animate-in fade-in"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage || 'Failed to submit. Please check your email and try again.'}</span>
            </div>
          )}

          {/* Topic Preference Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Topics of Interest:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TOPIC_OPTIONS.map(topic => {
                const isChecked = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    id={`newsletter-topic-${topic.id}`}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      isChecked
                        ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div 
                      className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        isChecked 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="leading-snug">{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
            {/* Optional Name */}
            <div className="md:col-span-4">
              <label htmlFor="newsletter-name-input" className="sr-only">Full Name (Optional)</label>
              <input
                id="newsletter-name-input"
                name="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your Name (Optional)"
                autoComplete="name"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Required Email */}
            <div className="md:col-span-5">
              <label htmlFor="newsletter-email-input" className="sr-only">Business or Personal Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="newsletter-email-input"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-3">
              <button
                id="newsletter-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full h-full min-h-[48px] bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold py-3 px-5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Privacy & Cadence Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>We value confidentiality. No marketing spam. Unsubscribe with 1-click anytime.</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>Published weekly</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <aside 
        id="newsletter-signup-card"
        aria-label="Newsletter Signup"
        className={`bg-slate-50 border border-slate-200 rounded-3xl p-6 ${className}`}
      >
        {content}
      </aside>
    );
  }

  return (
    <section 
      id="newsletter-signup-section"
      aria-label="Newsletter Signup"
      className={`bg-slate-100/70 border-t border-slate-200 py-12 md:py-16 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {content}
    </section>
  );
}
