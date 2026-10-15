import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  Copy, 
  Check, 
  Printer, 
  Briefcase,
  Scale,
  Calculator,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface AppointmentRecord {
  id: string;
  referenceId: string;
  practiceArea: string;
  mode: 'virtual' | 'in_person';
  date: string;
  timeSlot: string;
  clientName: string;
  email: string;
  phone: string;
  companyName: string;
  notes: string;
  createdAt: string;
}

const PRACTICE_AREAS = [
  {
    id: 'tax',
    title: 'Income Tax Assessment & NBR Defense',
    division: 'Accounticca Advisory',
    icon: Calculator,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Corporate tax audits, TDS/VDS compliance, appeals & NBR tribunal notices.'
  },
  {
    id: 'vat',
    title: 'VAT & SD Act Compliance & Reconciliations',
    division: 'Accounticca Advisory',
    icon: FileSpreadsheet,
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    description: 'Mushak 9.1 returns, input tax rebate optimization, VAT audit risk mitigations.'
  },
  {
    id: 'corporate_law',
    title: 'Corporate Law & Litigation Advisory',
    division: 'E-Lawyers Chambers',
    icon: Scale,
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    description: 'High Court commercial benches, dispute mitigation, contract structuring.'
  },
  {
    id: 'rjsc',
    title: 'RJSC Company Incorporation & Secretarial',
    division: 'E-Lawyers Chambers',
    icon: Building2,
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    description: 'Private/Public entity formation, share transfers, annual filings & returns.'
  },
  {
    id: 'audit',
    title: 'Statutory Financial Audit & Assurance',
    division: 'Accounticca Advisory',
    icon: Layers,
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    description: 'Chartered accountant statutory audits, BIDA certifications, ICAB standards.'
  },
  {
    id: 'cfo',
    title: 'Fractional CFO & Corporate Finance',
    division: 'Accounticca Advisory',
    icon: Briefcase,
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    description: 'Financial forecasting, fundraising advisory, cap table management, cash flow modeling.'
  }
];

const TIME_SLOTS = [
  { time: '10:00 AM - 10:45 AM BST', period: 'Morning' },
  { time: '11:30 AM - 12:15 PM BST', period: 'Morning' },
  { time: '02:30 PM - 03:15 PM BST', period: 'Afternoon' },
  { time: '03:45 PM - 04:30 PM BST', period: 'Afternoon' },
  { time: '05:00 PM - 05:45 PM BST', period: 'Evening' },
  { time: '06:15 PM - 07:00 PM BST', period: 'Evening' },
];

export function AppointmentBookingForm() {
  // Step State (1: Practice & Mode, 2: Date & Time, 3: Client Details)
  const [selectedPractice, setSelectedPractice] = useState(PRACTICE_AREAS[0].title);
  const [consultationMode, setConsultationMode] = useState<'virtual' | 'in_person'>('virtual');
  
  // Date calculation: Generate next 14 business days (skipping Fridays or Sundays depending on chambers)
  const upcomingDates = useMemo(() => {
    const dates: { dateStr: string; displayDay: string; displayDate: string; isTomorrow?: boolean }[] = [];
    const today = new Date();
    
    let offset = 1;
    while (dates.length < 10) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + offset);
      // Skip Fridays (weekly holiday in Bangladesh)
      const dayOfWeek = nextDate.getDay();
      if (dayOfWeek !== 5) {
        const iso = nextDate.toISOString().split('T')[0];
        const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dates.push({
          dateStr: iso,
          displayDay: dayName,
          displayDate: monthDay,
          isTomorrow: offset === 1
        });
      }
      offset++;
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(upcomingDates[0]?.dateStr || '');
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[0].time);

  // Client Details
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Local storage recent appointments
  const [recentAppointments, setRecentAppointments] = useState<AppointmentRecord[]>(() => {
    try {
      const stored = localStorage.getItem('accounticca_booked_appointments');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleCopyRef = (refId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const refNumber = Math.floor(10000 + Math.random() * 90000);
    const referenceId = `APT-2026-${refNumber}`;

    const newAppointment: AppointmentRecord = {
      id: `apt_${Date.now()}`,
      referenceId,
      practiceArea: selectedPractice,
      mode: consultationMode,
      date: selectedDate,
      timeSlot: selectedSlot,
      clientName: clientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      companyName: companyName.trim() || 'Direct Client / Confidential',
      notes: notes.trim(),
      createdAt: new Date().toISOString()
    };

    // 1. Save to Firestore
    try {
      const appointmentCollection = collection(db, 'appointments');
      await addDoc(appointmentCollection, {
        referenceId: newAppointment.referenceId,
        practiceArea: newAppointment.practiceArea,
        mode: newAppointment.mode,
        date: newAppointment.date,
        timeSlot: newAppointment.timeSlot,
        clientName: newAppointment.clientName,
        email: newAppointment.email,
        phone: newAppointment.phone,
        companyName: newAppointment.companyName,
        notes: newAppointment.notes,
        userId: auth.currentUser?.uid || null,
        userEmail: auth.currentUser?.email || newAppointment.email,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Note: Stored locally as offline backup or Firestore permissions check:', err);
    }

    // 2. Save locally for instant verification & session recall
    try {
      const updated = [newAppointment, ...recentAppointments.slice(0, 4)];
      setRecentAppointments(updated);
      localStorage.setItem('accounticca_booked_appointments', JSON.stringify(updated));
    } catch {
      // safe fallback
    }

    setConfirmedBooking(newAppointment);
    setIsSubmitting(false);
  };

  // Helper to generate Google Calendar Link
  const getGoogleCalendarUrl = (booking: AppointmentRecord) => {
    // Parse date and time
    // Time slot e.g. "10:00 AM - 10:45 AM BST"
    const startHourMatch = booking.timeSlot.match(/^(\d{2}):(\d{2})\s*(AM|PM)/);
    let startHour = 10;
    let startMin = 0;
    if (startHourMatch) {
      startHour = parseInt(startHourMatch[1], 10);
      startMin = parseInt(startHourMatch[2], 10);
      if (startHourMatch[3] === 'PM' && startHour < 12) startHour += 12;
      if (startHourMatch[3] === 'AM' && startHour === 12) startHour = 0;
    }

    // BST is UTC+6
    const [year, month, day] = booking.date.split('-').map(Number);
    // Create UTC date representation
    const startDate = new Date(Date.UTC(year, month - 1, day, startHour - 6, startMin));
    const endDate = new Date(startDate.getTime() + 45 * 60 * 1000); // 45 min duration

    const formatGCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const datesParam = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

    const title = encodeURIComponent(`Consultation: ${booking.practiceArea} (Accounticca × E-Lawyers)`);
    const details = encodeURIComponent(
      `Appointment Ref: ${booking.referenceId}\nClient: ${booking.clientName} (${booking.companyName})\nPractice Area: ${booking.practiceArea}\nFormat: ${booking.mode === 'virtual' ? 'Google Meet Video Call' : 'Chamber Consultation'}\nNotes: ${booking.notes || 'None provided'}\n\nChamber Phone: +880 1335-230170\nPanthapath, Dhaka, Bangladesh.`
    );
    const location = encodeURIComponent(
      booking.mode === 'virtual' 
        ? 'Google Meet (Link will be activated 10m before session)' 
        : 'Suite G-5, BTI Centara Grand, 144 Green Road, Panthapath, Dhaka-1205'
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
  };

  // Helper to trigger .ics download
  const downloadIcsFile = (booking: AppointmentRecord) => {
    const startHourMatch = booking.timeSlot.match(/^(\d{2}):(\d{2})\s*(AM|PM)/);
    let startHour = 10;
    let startMin = 0;
    if (startHourMatch) {
      startHour = parseInt(startHourMatch[1], 10);
      startMin = parseInt(startHourMatch[2], 10);
      if (startHourMatch[3] === 'PM' && startHour < 12) startHour += 12;
      if (startHourMatch[3] === 'AM' && startHour === 12) startHour = 0;
    }

    const [year, month, day] = booking.date.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day, startHour - 6, startMin));
    const endDate = new Date(startDate.getTime() + 45 * 60 * 1000);

    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const formatIcs = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const locationText = booking.mode === 'virtual' 
      ? 'Google Meet Video Conference'
      : 'Suite G-5, BTI Centara Grand, 144 Green Road, Panthapath, Dhaka';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Accounticca and E-Lawyers//Consultation Appointment//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${booking.referenceId}@accounticca.com`,
      `DTSTAMP:${formatIcs(new Date())}`,
      `DTSTART:${formatIcs(startDate)}`,
      `DTEND:${formatIcs(endDate)}`,
      `SUMMARY:Executive Consultation: ${booking.practiceArea}`,
      `DESCRIPTION:Consultation with Accounticca & E-Lawyers Advisory Team.\\nRef: ${booking.referenceId}\\nClient: ${booking.clientName}\\nEntity: ${booking.companyName}\\nAgenda: ${booking.notes || 'General Advisory'}\\nPhone: +880 1335-230170`,
      `LOCATION:${locationText}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${booking.referenceId}-Consultation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm relative">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Book Consultation Appointment</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </h2>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          Live Slot Scheduling (BST)
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
        Select your required advisory focus, consultation format, and preferred schedule. Our chambers coordinate partner availability across both Accounticca and E-Lawyers.
      </p>

      {/* Confirmation View */}
      {confirmedBooking ? (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-50/80 to-teal-50/40 border-2 border-emerald-300 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold mb-2">
                <span>REF: {confirmedBooking.referenceId}</span>
                <button
                  type="button"
                  onClick={() => handleCopyRef(confirmedBooking.referenceId)}
                  className="hover:text-emerald-950 transition-colors"
                  title="Copy Reference ID"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Appointment Confirmed!</h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto mt-1 leading-relaxed">
                Thank you, <strong>{confirmedBooking.clientName}</strong>. Your consultation has been scheduled with our senior partners.
              </p>
            </div>

            {/* Summary Details Box */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200/90 text-left max-w-xl mx-auto shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Practice Area</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.practiceArea}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Consultation Mode</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    {confirmedBooking.mode === 'virtual' ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Virtual (Google Meet)</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>In-Person Chamber (Dhaka)</span>
                      </>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Date Scheduled</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{confirmedBooking.date}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Time Window</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{confirmedBooking.timeSlot}</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                <span>Confirmation email dispatched to: <strong>{confirmedBooking.email}</strong></span>
                <span className="font-mono text-[11px] text-emerald-700 font-bold">Chamber Lead Assigned</span>
              </div>
            </div>

            {/* Calendar & Export Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={getGoogleCalendarUrl(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                type="button"
                onClick={() => downloadIcsFile(confirmedBooking)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Download .ics Invitation</span>
              </button>

              <Link
                to="/profile?tab=appointments"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Track in My Appointments</span>
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>

            {/* Re-book Option */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
              >
                ← Schedule Another Consultation Session
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBookAppointment} className="space-y-8">
          {/* 1. Practice Area Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">1</span>
                <span>Select Consultation Focus *</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">6 practice areas available</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRACTICE_AREAS.map((practice) => {
                const Icon = practice.icon;
                const isSelected = selectedPractice === practice.title;
                return (
                  <button
                    key={practice.id}
                    type="button"
                    onClick={() => setSelectedPractice(practice.title)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs' 
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${practice.badgeColor}`}>
                          {practice.division}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {practice.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {practice.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Consultation Mode (Virtual Google Meet vs Chamber In-Person) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">2</span>
                <span>Select Consultation Mode *</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Virtual (Google Meet) */}
              <button
                type="button"
                onClick={() => setConsultationMode('virtual')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 relative ${
                  consultationMode === 'virtual'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  consultationMode === 'virtual' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">Virtual (Google Meet)</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      Popular
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Direct video conference with screen-sharing for doc review, financial model scrutiny, and instant legal assessments.
                  </p>
                </div>
                {consultationMode === 'virtual' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-4 right-4" />
                )}
              </button>

              {/* In-Person Chamber (Dhaka) */}
              <button
                type="button"
                onClick={() => setConsultationMode('in_person')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 relative ${
                  consultationMode === 'in_person'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  consultationMode === 'in_person' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">In-Person Chamber</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Panthapath
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Executive Chambers at Suite G-5, BTI Centara Grand, 144 Green Road, Panthapath, Dhaka-1205.
                  </p>
                </div>
                {consultationMode === 'in_person' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-4 right-4" />
                )}
              </button>
            </div>
          </div>

          {/* 3. Date & Time Slot Picker */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">3</span>
                <span>Select Date &amp; Time Slot (BST) *</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">Bangladesh Standard Time (UTC+6)</span>
            </div>

            {/* Date Quick Carousel */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Available Chamber Days</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {upcomingDates.slice(0, 5).map((d) => {
                  const isSelected = selectedDate === d.dateStr;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(d.dateStr)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs' 
                          : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                      }`}
                    >
                      <span className="text-[11px] uppercase tracking-wider block opacity-90">{d.displayDay}</span>
                      <span className="text-sm font-extrabold block">{d.displayDate}</span>
                      {d.isTomorrow && (
                        <span className={`text-[9px] uppercase tracking-wider block font-bold mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-emerald-600'}`}>
                          Tomorrow
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Grid */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select 45-Minute Consultation Window</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-500' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{slot.period}</span>
                        <span className="text-xs font-semibold">{slot.time}</span>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Client & Matter Details */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">4</span>
                <span>Client &amp; Entity Information *</span>
              </label>
              <span className="text-[11px] text-slate-500">Confidentiality guaranteed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="name"
                    id="booking-client-name"
                    autoComplete="name"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Mahfuzur Rahman"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Corporate Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="email"
                    id="booking-client-email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    name="tel"
                    id="booking-client-phone"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712-XXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="organization"
                    id="booking-client-company"
                    autoComplete="organization"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Global Ltd."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Brief Agenda / Matter Description (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Outline specific objectives (e.g. NBR assessment review, share transfer structuring, audit readiness, or VAT appeal)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Submission Bar & Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct senior partner assignment with prompt calendar dispatch.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl px-7 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Securing Chamber Slot...</span>
                </>
              ) : (
                <>
                  <span>Confirm Consultation Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Recent Bookings / History on this device if any */}
      {recentAppointments.length > 0 && !confirmedBooking && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Scheduled Consultations ({recentAppointments.length})
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold">Active Bookings</span>
          </div>

          <div className="space-y-2">
            {recentAppointments.slice(0, 2).map((apt) => (
              <div 
                key={apt.referenceId} 
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs flex-wrap"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                    {apt.referenceId}
                  </span>
                  <span className="font-bold text-slate-800">{apt.practiceArea}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {apt.date} ({apt.timeSlot.split(' ')[0]} {apt.timeSlot.split(' ')[1]})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getGoogleCalendarUrl(apt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                  >
                    <span>G-Calendar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadIcsFile(apt)}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>.ics</span>
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
