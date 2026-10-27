import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck, 
  BookOpen,
  CreditCard,
  Zap,
  Lock
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { buildAppointmentUrl } from '../utils/appointmentRedirect';
import { initiateUddoktaPayCheckout } from '../services/uddoktapayService';
import { getAcademyCourseDashboardPath } from '../utils/lmsPortalStore';

export const EnrollmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const courseTitle = searchParams.get('course') || 'Personal & Corporate Income Tax Masterclass 2026-27';
  const coursePrice = searchParams.get('price') || 'BDT 12,500';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPayingOnline, setIsPayingOnline] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enrollment = {
      id: Date.now().toString(),
      title: courseTitle,
      name,
      email,
      phone,
      date: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('training_enrollments');
      const enrollments = existing ? JSON.parse(existing) : [];
      enrollments.push(enrollment);
      localStorage.setItem('training_enrollments', JSON.stringify(enrollments));
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to save enrollment', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SEO 
        title={`Course Enrollment - ${courseTitle}`} 
        description="Register and reserve your seat for Bangladesh income tax compliance, TDS advisory, and corporate filing masterclasses." 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Training Hub', path: '/training' }, { label: 'Course Enrollment' }]} />

        {/* Top Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Course Enrollment Page</h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Separate dedicated page for tax training seat reservation and legal career workshops.
              </p>
            </div>
          </div>

          <Link
            to="/training"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors border border-slate-700 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Training Hub</span>
          </Link>
        </div>

        {/* Form or Confirmation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Seat Reservation Recorded!</h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Your enrollment for <strong className="text-slate-900">{courseTitle}</strong> has been received and scheduled in our client desk.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-slate-500">Registrant:</span><span className="font-bold text-slate-900">{name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email:</span><span className="font-bold text-slate-900">{email}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-bold text-slate-900">{phone}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Course:</span><span className="font-bold text-emerald-700">{courseTitle}</span></div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <a
                  href={buildAppointmentUrl({
                    name,
                    email,
                    phone,
                    service: `Training & Legal Career: ${courseTitle}`,
                    notes: `Course: ${courseTitle} (${coursePrice}). Registrant: ${name}`,
                    source: 'Enrollment Separate Page'
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 text-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Open Appointment Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Link
                  to={getAcademyCourseDashboardPath(courseTitle)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-xs"
                >
                  Open Course Dashboard
                </Link>
                <Link
                  to="/training"
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-xs"
                >
                  Return to Training Hub
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Selected Course Option
                </span>
                <h3 className="font-extrabold text-lg text-slate-900">{courseTitle}</h3>
                <p className="text-xs text-slate-600">
                  Comprehensive 2026-27 statutory tax training module with hands-on return filing exercises, TDS computation schedules, and court case law insights.
                </p>
                <div className="text-sm font-extrabold text-emerald-800 pt-1">
                  Tuition Fee: {coursePrice}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tanvir@example.com"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment & Reservation Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!name.trim() || !email.trim() || !phone.trim()) {
                      alert('Please provide your name, email, and phone number first.');
                      return;
                    }
                    setIsPayingOnline(true);
                    try {
                      const numericAmount = parseInt(coursePrice.replace(/[^0-9]/g, ''), 10) || 12500;
                      const res = await initiateUddoktaPayCheckout({
                        fullName: name,
                        email: email,
                        amount: numericAmount,
                        metadata: {
                          courseTitle,
                          phone,
                          type: 'Course Enrollment',
                          enrollment_id: `ENR-${Date.now()}`
                        }
                      });
                      if (res.status && res.payment_url) {
                        window.location.href = res.payment_url;
                      } else {
                        alert(res.message || 'Could not initiate UddoktaPay checkout.');
                      }
                    } catch (err: any) {
                      alert(err.message || 'Payment initiation error');
                    } finally {
                      setIsPayingOnline(false);
                    }
                  }}
                  disabled={isPayingOnline}
                  className="w-full py-4 px-6 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>
                    {isPayingOnline 
                      ? 'Redirecting to UddoktaPay...' 
                      : `Pay Online with UddoktaPay (bKash · Nagad · Cards)`}
                  </span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">or pay offline</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Reserve Seat &amp; Pay at Campus / Bank</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
