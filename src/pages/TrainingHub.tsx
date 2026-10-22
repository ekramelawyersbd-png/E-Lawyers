import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  FileText,
  Gavel,
  FileCheck,
  MonitorPlay,
  Award,
  ArrowRight,
  Clock,
  ShieldCheck,
  Video,
  Calendar,
  Users
} from 'lucide-react';
import { mockArticles } from '../data/mockData';
import { EnrollmentModal } from '../components/training/EnrollmentModal';
import { CertificateModal } from '../components/training/CertificateModal';
import { TrainingFAQ } from '../components/training/TrainingFAQ';
import { CareerPathways } from '../components/training/CareerPathways';
import { SEO } from '../components/SEO';

interface LiveClassProgram {
  id: string;
  title: string;
  bengaliTag: string;
  scheduleLabel: string;
  nextSessionDate: string;
  timeSlot: string;
  instructor: string;
  seatsLabel: string;
  price: string;
  excerpt: string;
  detailPath: string;
  colorClass: string;
  icon: React.ReactNode;
}

export function TrainingHub() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    title: string;
    description: string;
    price: string;
  } | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certCourse] = useState<{ title: string; id: string } | null>(null);

  const trainingIds = ['400', '401', '402', '403', '404', '405', '406'];
  const trainingArticles = mockArticles.filter((a) => trainingIds.includes(a.id));

  const icons: Record<string, React.ReactNode> = {
    '400': <FileCheck className="w-6 h-6" />, // VAT
    '401': <FileText className="w-6 h-6" />, // Income Tax
    '402': <Briefcase className="w-6 h-6" />, // RJSC
    '403': <Gavel className="w-6 h-6" />, // Bar Council
    '404': <BookOpen className="w-6 h-6" />, // High Court
    '405': <GraduationCap className="w-6 h-6" />, // Practical Accounting
    '406': <MonitorPlay className="w-6 h-6" /> // MS Office
  };

  const colors: Record<string, string> = {
    '400': 'bg-blue-50 text-blue-700 border-blue-200/80',
    '401': 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    '402': 'bg-purple-50 text-purple-700 border-purple-200/80',
    '403': 'bg-amber-50 text-amber-700 border-amber-200/80',
    '404': 'bg-rose-50 text-rose-700 border-rose-200/80',
    '405': 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
    '406': 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
  };

  const prices: Record<string, string> = {
    '400': 'BDT 50,000 – 150,000',
    '401': 'BDT 10,000 – 20,000',
    '402': 'BDT 500 – 3,000',
    '403': 'BDT 10,000 – 20,000',
    '404': 'BDT 5,000 – 10,000',
    '405': 'BDT 500 – 5,000',
    '406': 'Free – BDT 5,000'
  };

  const durations: Record<string, string> = {
    '400': '360 Hours · Advanced',
    '401': '30 Hours · 10 Classes',
    '402': '6 Hours · Workshop',
    '403': '60 Hours · Bar Prep',
    '404': '40 Hours · High Court',
    '405': '20 Hours · Practical',
    '406': '48 Hours · Foundation'
  };

  const liveClassPrograms: LiveClassProgram[] = [
    {
      id: 'live-income-tax-2026',
      title: 'Live Class: Personal Income Tax & Online e-Return Filing Masterclass',
      bengaliTag: 'LIVE COHORT 01 · INCOME TAX & E-RETURN',
      scheduleLabel: '10 Live Classes · Zoom / Meet',
      nextSessionDate: 'Nov 24, 2026',
      timeSlot: '8:30 PM – 10:30 PM BST',
      instructor: 'Adv. Ekram Hossain',
      seatsLabel: 'Live Interactive Q&A',
      price: 'BDT 3,500',
      excerpt:
        'Master the Income Tax Act 2023, multi-head tax calculations, investment rebates, wealth statements, and step-by-step live online e-Return filing on the NBR portal.',
      detailPath: '/course/personal-income-tax',
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      icon: <Video className="w-6 h-6" />
    },
    {
      id: 'live-vat-vds-2026',
      title: 'Live Class: Practical VAT Management, VDS & Mushak 9.1 Return Cohort',
      bengaliTag: 'LIVE COHORT 02 · PRACTICAL VAT & VDS',
      scheduleLabel: '12 Live Classes · Interactive',
      nextSessionDate: 'Nov 28, 2026',
      timeSlot: '9:00 PM – 11:00 PM BST',
      instructor: 'Muhammad Abdul Kader ACCA',
      seatsLabel: 'Live Case Solving',
      price: 'BDT 4,500',
      excerpt:
        'Hands-on live training under the VAT and Supplementary Duty Act 2012 covering Mushak 4.3 price declarations, Mushak 6.3 challans, VDS deductions, and monthly Mushak 9.1 online returns.',
      detailPath: '/article/400',
      colorClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
      icon: <FileCheck className="w-6 h-6" />
    },
    {
      id: 'live-rjsc-compliance-2026',
      title: 'Live Class: RJSC Company Incorporation & Annual Statutory Filing',
      bengaliTag: 'LIVE COHORT 03 · RJSC & COMPANY LAW',
      scheduleLabel: '08 Live Classes · Weekend Batch',
      nextSessionDate: 'Dec 01, 2026',
      timeSlot: '8:00 PM – 10:00 PM BST',
      instructor: 'Adv. Anamul Haque',
      seatsLabel: 'Live Portal Demo',
      price: 'BDT 3,000',
      excerpt:
        'Practical live workshop on RJSC name clearance, MOA/AOA drafting, private limited company incorporation, Form XII, Schedule X annual returns, and share transfer compliance.',
      detailPath: '/student/course/rjsc-corporate-compliance',
      colorClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
      icon: <Briefcase className="w-6 h-6" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SEO
        title="Academy | Live Classes & Professional Legal, Tax, VAT & RJSC Training Programs"
        description="Join interactive Live Classes and practical legal, income tax, VAT, accounting, and RJSC corporate compliance training programs with verifiable certification."
        canonicalUrl="/training"
      />

      {/* Page Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>E-Lawyers &amp; Accounticca Academy • Learn Today, Lead Tomorrow</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Professional Training &amp; Live Class Academy
          </h1>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Practical legal, income tax, VAT, accounting, and RJSC compliance live classes and courses designed to build real-world statutory expertise for practitioners, students, and corporate leaders.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#live-classes-section"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs whitespace-nowrap shrink-0"
            >
              <Video className="w-4 h-4 text-emerald-100" />
              <span>Live Classes</span>
            </a>
            <Link
              to="/student/dashboard?tab=live"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs whitespace-nowrap shrink-0"
            >
              <MonitorPlay className="w-4 h-4 text-emerald-400" />
              <span>Open Student Learning Portal (LMS)</span>
            </Link>
            <Link
              to="/verify-certificate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Public Certificate Verification</span>
            </Link>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Live Class — Placed directly above Academy Courses & Certification Tracks */}
      <section id="live-classes-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-emerald-700 tracking-wider mb-1">
              LIVE CLASS · INTERACTIVE ONLINE COHORTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Live Classes &amp; Interactive Practical Training
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Join live instructor-led sessions with real-time Q&amp;A, hands-on statutory return preparation, practical case studies, and lifetime recorded access.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums text-slate-500">
            Showing {liveClassPrograms.length + 1} Active Live Batches
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {liveClassPrograms.map((liveItem) => (
            <div
              key={liveItem.id}
              className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${liveItem.colorClass}`}
                  >
                    {liveItem.icon}
                  </div>
                  <span className="text-[11px] font-mono tabular-nums text-emerald-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{liveItem.scheduleLabel}</span>
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-700 mb-1">
                    {liveItem.bengaliTag}
                  </div>
                  <Link to={liveItem.detailPath} className="block">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {liveItem.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 mt-2 leading-relaxed">
                    {liveItem.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Next Live:</span>
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-800">
                      {liveItem.nextSessionDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Time:</span>
                    </span>
                    <span className="font-mono tabular-nums text-slate-700">
                      {liveItem.timeSlot}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Live Batch Fee</span>
                  <span className="font-mono tabular-nums font-bold text-slate-900">
                    {liveItem.price}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={liveItem.detailPath}
                    className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-semibold transition-colors text-xs flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <span>Live Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourse({
                        id: liveItem.id,
                        title: liveItem.title,
                        description: liveItem.excerpt,
                        price: liveItem.price
                      });
                      setIsModalOpen(true);
                    }}
                    className="py-2.5 px-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold transition-colors text-xs cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Join Live Batch
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* 4th Card: Direct Student Live Class Room & LMS Stream Portal */}
          <div className="group bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <MonitorPlay className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono tabular-nums text-emerald-400">
                  Live Stream · Q&amp;A Room
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-emerald-400 mb-1">
                  DIRECT LIVE CLASSROOM PORTAL
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  Student Live Class Room &amp; Recorded Archive
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Direct portal access for enrolled students to join active live streams, participate in real-time instructor Q&amp;A, verify live attendance, and watch full class recordings.
                </p>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Live Classroom</span>
                <span className="font-mono tabular-nums font-bold text-emerald-400">
                  Active for Enrolled
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/course/personal-income-tax"
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold transition-colors text-xs flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span>Schedule</span>
                </Link>
                <Link
                  to="/student/dashboard?tab=live"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors text-xs flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span>Enter Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs Grid (Balanced Cards with Uniform Action Footers) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Academy Courses &amp; Certification Tracks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select a specialized program below to inspect the curriculum or register for the upcoming cohort.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums text-slate-500">
            Showing {trainingArticles.length + 1} Active Programs
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {trainingArticles.map((article) => {
            const colorClass =
              colors[article.id] || 'bg-slate-100 text-slate-700 border-slate-200';
            const icon = icons[article.id] || <BookOpen className="w-6 h-6" />;
            const price = prices[article.id] || 'Price upon request';
            const duration = durations[article.id] || 'Self-Paced · Certified';
            const detailPath =
              article.id === '401'
                ? '/course/personal-income-tax'
                : `/article/${article.id}`;

            return (
              <div
                key={article.id}
                className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${colorClass}`}
                    >
                      {icon}
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{duration}</span>
                    </span>
                  </div>

                  <div>
                    <Link to={detailPath} className="block">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 mt-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Program Fee</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {price}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={detailPath}
                      className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-semibold transition-colors text-xs flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCourse({
                          id: article.id,
                          title: article.title,
                          description: article.excerpt,
                          price
                        });
                        setIsModalOpen(true);
                      }}
                      className="py-2.5 px-3 bg-slate-900 text-white hover:bg-emerald-700 rounded-xl font-bold transition-colors text-xs cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 8th Card: Interactive Student LMS Portal & Corporate Compliance Track */}
          <div className="group bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono tabular-nums text-emerald-400">
                  10 Classes · Online LMS
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  Interactive LMS Portal: Tax &amp; RJSC Masterclasses
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Access sequential video lectures, protected statutory study notes, module quizzes, final examination, and instant PDF certification.
                </p>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Portal Access</span>
                <span className="font-mono tabular-nums font-bold text-emerald-400">
                  Included for Students
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/course/personal-income-tax"
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold transition-colors text-xs flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span>Syllabus</span>
                </Link>
                <Link
                  to="/student/dashboard"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors text-xs flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span>Open LMS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CareerPathways />

      <TrainingFAQ />

      {selectedCourse && (
        <EnrollmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedCourse.title}
          description={selectedCourse.description}
          price={selectedCourse.price}
        />
      )}

      {certCourse && (
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          moduleTitle={certCourse.title}
          courseId={certCourse.id}
        />
      )}
    </div>
  );
}
