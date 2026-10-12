import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  GraduationCap, 
  ShieldCheck, 
  Coins, 
  Users, 
  Award, 
  Upload, 
  FileText, 
  X,
  ArrowLeft,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AccountantApplicationModal } from '../components/career/AccountantApplicationModal';
import { CustomerCareApplicationModal } from '../components/career/CustomerCareApplicationModal';
import { ApplicationTracker } from '../components/career/ApplicationTracker';

interface JobListing {
  id: string;
  title: string;
  department: 'Legal & Litigations' | 'Tax & VAT Advisory' | 'Corporate Secretarial' | 'Accounts Division' | 'Tech & Engineering' | 'Internships' | 'Customer Care';
  location: string;
  type: 'Full-time' | 'Remote / Hybrid' | 'Articled Studentship' | 'Contract';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  isAccountantForm?: boolean;
  isCustomerCareForm?: boolean;
}

const JOB_OPENINGS: JobListing[] = [
  {
    id: 'job-customercare-01',
    title: 'Customer Care Executive (Female)',
    department: 'Customer Care',
    location: 'Dhaka Office (Full-Time)',
    type: 'Full-time',
    experience: 'Fresh Graduates & Experienced (0–2 Years)',
    salary: 'BDT 20,000 – 30,000 / month + Benefits',
    description: `একটি পেশাদার Call Center / Customer Care Team-এ কাজের জন্য ২ জন Female Customer Care Executive নিয়োগ দেওয়া হবে।

📌 Position: Customer Care Executive (Female) | 📌 Vacancies: 2 | 📌 Department: Customer Care Team

Job Responsibilities:
✅ ইনবাউন্ড কল গ্রহণ করে গ্রাহকদের প্রয়োজনীয় তথ্য প্রদান করা।
✅ গ্রাহকদের ভদ্র, আন্তরিক ও পেশাদারভাবে সেবা প্রদান করা।
✅ গ্রাহকের প্রশ্ন, অভিযোগ ও সমস্যার প্রাথমিক সমাধান দেওয়া।
✅ প্রয়োজন অনুযায়ী সংশ্লিষ্ট বিভাগে গ্রাহকের বিষয়টি পৌঁছে দেওয়া।
✅ Customer Information ও Call Details সঠিকভাবে সংরক্ষণ করা।
✅ প্রতিষ্ঠানের সেবা ও কার্যক্রম সম্পর্কে সঠিক তথ্য প্রদান করা।
✅ সর্বোচ্চ Customer Satisfaction নিশ্চিত করতে দায়িত্বশীলভাবে কাজ করা।

Educational Qualification:
🎓 ন্যূনতম HSC / Graduate। বাংলা ও ইংরেজিতে সাবলীল যোগাযোগের দক্ষতা।`,
    requirements: [
      'Minimum HSC or Bachelor’s degree from a recognized institution',
      'Fluent verbal communication skills in Bangla; ability to communicate in English',
      'Good customer handling skills, patience, and positive attitude',
      'Basic computer knowledge and comfortable handling customer inquiries'
    ],
    isCustomerCareForm: true
  },
  {
    id: 'job-accountant-01',
    title: 'Accountant (Accounts Division)',
    department: 'Accounts Division',
    location: 'Dhaka Office (Full-Time)',
    type: 'Full-time',
    experience: 'Fresh Graduates & Experienced (0–2 Years)',
    salary: 'BDT 25,000 – 40,000 / month + Benefits',
    description: `E-Lawyers Legal & Business Consultancy Firm is expanding its Accounts Division and looking for talented, dedicated, and motivated individuals to join our professional team.
📌 Position: Accountant | 📌 Vacancies: 2 | 📌 Department: Accounts Division

About E-Lawyers:
E-Lawyers is a professional legal and business consultancy firm operating through two major divisions: the Legal Division and the Accounts Division. The Accounts Division focuses on delivering complete accounting solutions to business clients through a B2B service model.

Job Responsibilities:
✅ Manage complete accounting operations for business clients under the Accounts Division.
✅ Maintain accurate financial records, bookkeeping, and transaction entries.
✅ Prepare and maintain general ledgers, financial statements, and accounting reports.
✅ Handle accounts payable, accounts receivable, and bank reconciliation processes.
✅ Assist clients with daily accounting requirements and financial documentation.
✅ Ensure accuracy and compliance in all accounting activities.
✅ Prepare monthly, quarterly, and annual financial reports.
✅ Support tax, VAT, and financial compliance-related activities.

🎓 Fresh graduates and candidates who have recently completed their academic studies are highly encouraged to apply.`,
    requirements: [
      'Bachelor’s degree in Accounting, Finance, Business Administration, or related field (B.Com, BBA, M.Com, MBA)',
      'Strong understanding of accounting principles and financial management',
      'Practical knowledge of bookkeeping, general ledgers, and financial statements',
      'Proficiency in Microsoft Excel and accounting software (QuickBooks, Xero, Tally)',
      'Willingness to learn and grow in a professional service environment'
    ],
    isAccountantForm: true
  },
  {
    id: 'job-1',
    title: 'Senior Corporate Tax & VAT Consultant',
    department: 'Tax & VAT Advisory',
    location: 'Dhaka (Gulshan / Motijheel)',
    type: 'Full-time',
    experience: '4–7 Years',
    salary: 'BDT 65,000 – 95,000 / month + Performance Bonus',
    description: 'We are seeking an experienced Tax & VAT Practitioner (ACA, ACCA, or LLB with tax specialization) to handle high-profile corporate compliance, NBR appellate hearings, withholding tax audits, and advisory for multinational clients in Bangladesh.',
    requirements: [
      'Professional qualification (ACA/ACCA qualified or part-qualified, LLB, or Masters in Accounting/Finance)',
      'Extensive hands-on expertise with ITA 2023, VAT & SD Act 2012, and e-return portals',
      'Proven track record in handling NBR assessment disputes and tax planning',
      'Strong communication skills in both English and Bengali'
    ]
  },
  {
    id: 'job-2',
    title: 'High Court & Company Law Associate Advocate',
    department: 'Legal & Litigations',
    location: 'Supreme Court Bar, Dhaka',
    type: 'Full-time',
    experience: '3–5 Years',
    salary: 'BDT 50,000 – 75,000 / month',
    description: 'Looking for a dynamic Advocate enrolled with the Bangladesh Bar Council and High Court Division to draft writ petitions, corporate agreements, trademark filings, RJSC amalgamations, and represent corporate clients in commercial disputes.',
    requirements: [
      'Enrolled with Bangladesh Bar Council and eligible to practice in High Court Division',
      'Deep expertise in Companies Act 1994, Contract Act 1872, and Labour Law 2006',
      'Demonstrated experience in drafting legal opinions, writ petitions, and commercial contracts',
      'High attention to detail and ability to work under tight regulatory timelines'
    ]
  },
  {
    id: 'job-3',
    title: 'RJSC Compliance & Secretarial Executive',
    department: 'Corporate Secretarial',
    location: 'Dhaka (Hybrid)',
    type: 'Full-time',
    experience: '2–4 Years',
    salary: 'BDT 35,000 – 50,000 / month',
    description: 'Manage digital returns filing on the RJSC portal, share transfers, board resolution drafting, incorporation of private/public limited companies, foreign investment registration with BIDA, and annual returns compliance.',
    requirements: [
      'Graduate / Post-graduate in Commerce, Management, or LL.B with Company Secretary background (ICSB part-qualified preferred)',
      'Expertise in digital RJSC portal filings, digital signatures, and annual returns',
      'Thorough understanding of ROC filing procedures and BIDA remittance regulations',
      'Exceptional organizational skills and client management aptitude'
    ]
  },
  {
    id: 'job-4',
    title: 'Legal Tech Full-Stack Engineer (React & TypeScript)',
    department: 'Tech & Engineering',
    location: 'Remote / Dhaka',
    type: 'Full-time',
    experience: '3–5 Years',
    salary: 'BDT 70,000 – 110,000 / month',
    description: 'Build and scale our legal calculators, DVC verification engine, automated contract generation pipelines, and secure cloud integration modules for Bangladesh tax practitioners.',
    requirements: [
      'Strong proficiency in React, TypeScript, Tailwind CSS, and Node.js / Firebase',
      'Experience building SaaS dashboards, document generation workflows, and secure APIs',
      'Passion for legal tech and simplifying complex compliance workflows in South Asia',
      'Bachelor’s degree in Computer Science, Software Engineering, or equivalent practical experience'
    ]
  }
];

export function CareerPage() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [jobActiveTab, setJobActiveTab] = useState<'overview' | 'requirements' | 'compliance'>('overview');

  // General Application Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [coverNote, setCoverNote] = useState('');

  // Accountant Application Specific State
  const [accPresentAddress, setAccPresentAddress] = useState('');
  const [accLinkedIn, setAccLinkedIn] = useState('');
  const [accCvLink, setAccCvLink] = useState('');
  const [accHighestDegree, setAccHighestDegree] = useState('B.Com');
  const [accUniversity, setAccUniversity] = useState('');
  const [accMajor, setAccMajor] = useState('');
  const [accGradYear, setAccGradYear] = useState('');
  const [accCgpa, setAccCgpa] = useState('');
  
  const [accBookkeeping, setAccBookkeeping] = useState('Yes');
  const [accGeneralLedger, setAccGeneralLedger] = useState('Yes');
  const [accApAr, setAccApAr] = useState('Yes');
  const [accBankRecon, setAccBankRecon] = useState('Yes');
  const [accTaxVat, setAccTaxVat] = useState('Yes');
  const [accSoftware, setAccSoftware] = useState<string[]>(['QuickBooks']);
  const [accExcel, setAccExcel] = useState('Intermediate');

  const [accHasExp, setAccHasExp] = useState('Yes');
  const [accTotalExp, setAccTotalExp] = useState('1–2 Years');
  const [accExpDesc, setAccExpDesc] = useState('');
  const [accFullTime, setAccFullTime] = useState('Yes');
  const [accSalaryExp, setAccSalaryExp] = useState('');
  const [accJoinAvailability, setAccJoinAvailability] = useState('Immediately');
  const [accSuitability, setAccSuitability] = useState('');
  const [accDeclaration, setAccDeclaration] = useState(false);

  const filteredJobs = selectedDept === 'All' 
    ? JOB_OPENINGS 
    : JOB_OPENINGS.filter(j => j.department === selectedDept);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setIsApplyModalOpen(false);
      setSelectedJob(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
      setCoverNote('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-slate-100 text-slate-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/50 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Join E-Lawyers Career Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Build the Future of Legal &amp; Tax Tech in Bangladesh
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Shape the nation’s professional compliance ecosystem. Work alongside top-tier Supreme Court advocates, chartered accountants, and engineers transforming legal services.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs text-emerald-900 font-semibold">
            <span className="inline-flex items-center gap-1 bg-white px-3.5 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Competitive Remuneration
            </span>
            <span className="inline-flex items-center gap-1 bg-white px-3.5 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hybrid &amp; Flexible Work
            </span>
            <span className="inline-flex items-center gap-1 bg-white px-3.5 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Senior Mentorship
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        
        {/* Dual Form Page Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              Direct Application Portal
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight pt-1">
              Accountant &amp; Customer Care Executive Dual Forms
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Access both application forms side-by-side with an easy toggle to apply for your desired role instantly.
            </p>
          </div>
          <a
            href="/community/career/forms"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md transition-all whitespace-nowrap cursor-pointer inline-flex items-center gap-2"
          >
            <span>Open Dual Forms Page</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Department Filter Tabs */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
          {['All', 'Accounts Division', 'Customer Care', 'Tax & VAT Advisory', 'Legal & Litigations', 'Corporate Secretarial', 'Tech & Engineering', 'Internships', 'My Applications'].map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {dept === 'My Applications' ? '📋 My Applications & Status' : dept}
            </button>
          ))}
        </div>

        {selectedDept === 'My Applications' ? (
          <ApplicationTracker />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                      {job.department}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {job.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.experience}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="pt-2 text-xs font-bold text-emerald-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                    💰 {job.salary}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Details &amp; Requirements</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsApplyModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Culture & Perks Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Why Build Your Career With E-Lawyers?</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              We empower legal minds and software engineers to create tools that simplify commerce and compliance across Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                ⚖️
              </div>
              <h3 className="text-sm font-bold text-slate-900">High-Impact Legal Practice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Work directly with leading corporate houses, foreign investors, and complex tax litigations that accelerate professional expertise.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                🚀
              </div>
              <h3 className="text-sm font-bold text-slate-900">Cutting-Edge Legal Tech</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pioneering automated VAT calculations, DVC audit authentications, and AI-assisted compliance pipelines in Bangladesh.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                🌱
              </div>
              <h3 className="text-sm font-bold text-slate-900">Continuous Growth &amp; Mentorship</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured internal training sessions, Supreme Court exposure, and professional certification sponsorship.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Job Detail / Apply Modal */}
      {selectedJob && (
        selectedJob.isAccountantForm && isApplyModalOpen ? (
          <AccountantApplicationModal
            isOpen={true}
            onClose={() => {
              setIsApplyModalOpen(false);
            }}
          />
        ) : selectedJob.isCustomerCareForm && isApplyModalOpen ? (
          <CustomerCareApplicationModal
            isOpen={true}
            onClose={() => {
              setIsApplyModalOpen(false);
            }}
          />
        ) : (
        <div className="max-w-6xl mx-auto my-8 space-y-8">
          {/* Top Breadcrumb & Back Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/community/career" className="hover:text-emerald-700 transition-colors">Career Hub</Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">{selectedJob.department}</span>
              <span>/</span>
              <span className="text-emerald-700 font-bold truncate max-w-xs">{selectedJob.title}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedJob(null);
                setIsApplyModalOpen(false);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Career Hub</span>
            </button>
          </div>

          {!isApplyModalOpen ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (Col 4 / 12) - Technical & Legal Specs */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                  <div className="space-y-2 pb-4 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                      {selectedJob.department}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 pt-1">Technical &amp; Legal Specifications</h3>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Job Type</span>
                      <span className="font-bold text-slate-900">{selectedJob.type}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Experience</span>
                      <span className="font-bold text-slate-900">{selectedJob.experience}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Location</span>
                      <span className="font-bold text-slate-900">{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Verified Authority</span>
                      <span className="font-bold text-emerald-800">E-Lawyers Chambers</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 font-medium">Fiscal Year</span>
                      <span className="font-bold text-slate-900">FY 2026–2027</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Apply For This Position</span>
                    </button>
                  </div>
                </div>

                {/* Institutional Assurance Card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 space-y-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                      🛡️
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Institutional Assurance</span>
                      <h4 className="text-sm font-extrabold">Chamber-Certified Recruitment</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All recruitment processes, skills assessments, and candidate interviews adhere strictly to Bangladesh statutory labor regulations and professional consultancy standards.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-emerald-300">
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg">✓ Transparent Evaluation</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg">✓ Supreme Court Vetted</span>
                  </div>
                </div>
              </div>

              {/* Right Column (Col 8 / 12) - Main Content & Tabbed Details */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Main Header & Salary Box */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                        {selectedJob.department}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                        {selectedJob.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.98 (Vetted Role)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {selectedJob.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Salary & CTA Box (Matching ProductDetail price card) */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Compensation &amp; Benefits</span>
                      <div className="text-lg sm:text-xl font-extrabold text-emerald-950">
                        {selectedJob.salary}
                      </div>
                      <p className="text-[11px] text-emerald-800 font-medium">Includes medical allowance, performance bonus &amp; festival bonuses.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Apply Now (Instant Form)</span>
                    </button>
                  </div>

                  {/* Trust Badges Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs font-semibold text-slate-700">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Immediate Review</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Chamber Verified</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Structured CBT</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-1">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Mentorship</span>
                    </div>
                  </div>
                </div>

                {/* Tabbed Navigation & Details */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex border-b border-slate-200 gap-6">
                    <button
                      type="button"
                      onClick={() => setJobActiveTab('overview')}
                      className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                        jobActiveTab === 'overview'
                          ? 'border-emerald-600 text-emerald-700'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Overview &amp; Role Context
                    </button>
                    <button
                      type="button"
                      onClick={() => setJobActiveTab('requirements')}
                      className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                        jobActiveTab === 'requirements'
                          ? 'border-emerald-600 text-emerald-700'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Key Requirements ({selectedJob.requirements.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setJobActiveTab('compliance')}
                      className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                        jobActiveTab === 'compliance'
                          ? 'border-emerald-600 text-emerald-700'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Recruitment Process
                    </button>
                  </div>

                  {jobActiveTab === 'overview' && (
                    <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <h4 className="font-bold text-slate-900 text-sm">About the Role</h4>
                      <p>{selectedJob.description}</p>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">Workplace Environment</span>
                        <p className="text-xs text-slate-600">
                          Located in our prime Dhaka corporate offices with options for hybrid flexibility. You will work alongside leading tax advocates, chartered accountants, and legal tech engineers.
                        </p>
                      </div>
                    </div>
                  )}

                  {jobActiveTab === 'requirements' && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 text-sm">Required Qualifications &amp; Skills</h4>
                      <ul className="space-y-3">
                        {selectedJob.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {jobActiveTab === 'compliance' && (
                    <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                      <h4 className="font-bold text-slate-900 text-sm">Four-Stage Recruitment &amp; Selection Workflow</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                          <h5 className="font-bold text-slate-900">Online Application</h5>
                          <p className="text-xs text-slate-600">Submit your complete details and CV through our secure portal.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                          <h5 className="font-bold text-slate-900">Profile Screening</h5>
                          <p className="text-xs text-slate-600">HR &amp; Division committee evaluates credentials within 2–3 days.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                          <h5 className="font-bold text-slate-900">Computer-Based Test</h5>
                          <p className="text-xs text-slate-600">Shortlisted candidates take our practical online technical assessment.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                          <h5 className="font-bold text-slate-900">Partner Interview</h5>
                          <p className="text-xs text-slate-600">Final interview with managing partners and department heads.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Author & Review Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold shrink-0">
                    👨‍⚖️
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Author &amp; Review Panel</span>
                    <h4 className="text-sm font-bold text-slate-900">E-Lawyers Human Resources &amp; Senior Chambers Division</h4>
                    <p className="text-xs text-slate-500">Authored and verified in collaboration with E-Lawyers Chambers &amp; Corporate Advisory Desk.</p>
                  </div>
                </div>

                {/* Custom Assistance Banner (Matching ProductDetail bottom box) */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Custom Career Guidance</span>
                    <h3 className="text-base sm:text-lg font-extrabold">Need custom interview tips or career advice?</h3>
                    <p className="text-xs text-slate-300">Our HR advisory desk is available to assist qualified candidates with application queries.</p>
                  </div>
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md transition-all whitespace-nowrap cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Consult Career Desk</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>
          ) : (
              <form onSubmit={handleApplySubmit} className="space-y-6">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Apply for: {selectedJob.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Please complete all required fields carefully. Shortlisted or eligible candidates will proceed to the Computer-Based Test (CBT).
                  </p>
                </div>

                {appliedSuccess ? (
                  <div className="py-8 px-6 text-center space-y-6 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 rounded-3xl border border-emerald-200/80 shadow-xs">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl shadow-md">
                      🎉
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Application Successfully Submitted!</h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                        Thank you for applying to <strong className="text-slate-900">E-Lawyers Legal &amp; Business Consultancy Firm</strong>. Your application for <span className="text-emerald-700 font-bold">{selectedJob.title}</span> has been securely recorded.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-emerald-100 text-left space-y-3 shadow-2xs">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <span>🚀 Next Steps &amp; Computer-Based Test (CBT) Details</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                          <span><strong>Profile Screening:</strong> Our HR &amp; Accounts Division review committee will evaluate your academic credentials and accounting skills within 2–3 business days.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                          <span><strong>CBT Invitation Email:</strong> Shortlisted candidates will receive a secure email invitation with login credentials for the <strong className="text-slate-900">Computer-Based Test (CBT)</strong>.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                          <span><strong>CBT Assessment Scope:</strong> The test will cover practical bookkeeping scenarios, financial statement analysis, Bank Reconciliation, VAT calculation, and MS Excel problem-solving.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedSuccess(false);
                          setIsApplyModalOpen(false);
                          setSelectedJob(null);
                        }}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                      >
                        Return to Career Hub
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {selectedJob.isAccountantForm ? (
                      <div className="space-y-8">
                        {/* Section 1: Personal Information */}
                        <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                            <span>📌 Section 1: Personal Information</span>
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                              <input
                                type="text"
                                required
                                value={applicantName}
                                onChange={(e) => setApplicantName(e.target.value)}
                                placeholder="e.g. Md. Tanvir Hossain"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                                <input
                                  type="email"
                                  required
                                  value={applicantEmail}
                                  onChange={(e) => setApplicantEmail(e.target.value)}
                                  placeholder="tanvir@example.com"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number *</label>
                                <input
                                  type="text"
                                  required
                                  value={applicantPhone}
                                  onChange={(e) => setApplicantPhone(e.target.value)}
                                  placeholder="+880 1700 000000"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Present Address *</label>
                              <input
                                type="text"
                                required
                                value={accPresentAddress}
                                onChange={(e) => setAccPresentAddress(e.target.value)}
                                placeholder="House / Road / Area, Dhaka"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile (Optional)</label>
                                <input
                                  type="text"
                                  value={accLinkedIn}
                                  onChange={(e) => setAccLinkedIn(e.target.value)}
                                  placeholder="https://linkedin.com/in/username"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">CV/Resume Link (Optional)</label>
                                <input
                                  type="text"
                                  value={accCvLink}
                                  onChange={(e) => setAccCvLink(e.target.value)}
                                  placeholder="Google Drive / Dropbox link"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Educational Qualification */}
                        <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                            <span>🎓 Section 2: Educational Qualification</span>
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Highest Educational Qualification *</label>
                              <select
                                value={accHighestDegree}
                                onChange={(e) => setAccHighestDegree(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="B.Com">B.Com</option>
                                <option value="BBA (Accounting/Finance)">BBA (Accounting/Finance)</option>
                                <option value="M.Com">M.Com</option>
                                <option value="MBA (Accounting/Finance)">MBA (Accounting/Finance)</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Name of University/Institution *</label>
                                <input
                                  type="text"
                                  required
                                  value={accUniversity}
                                  onChange={(e) => setAccUniversity(e.target.value)}
                                  placeholder="e.g. University of Dhaka"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Major/Department *</label>
                                <input
                                  type="text"
                                  required
                                  value={accMajor}
                                  onChange={(e) => setAccMajor(e.target.value)}
                                  placeholder="Accounting / Finance"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Year of Graduation / Expected Year *</label>
                                <input
                                  type="text"
                                  required
                                  value={accGradYear}
                                  onChange={(e) => setAccGradYear(e.target.value)}
                                  placeholder="2025 / 2026"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">CGPA/Result *</label>
                                <input
                                  type="text"
                                  required
                                  value={accCgpa}
                                  onChange={(e) => setAccCgpa(e.target.value)}
                                  placeholder="e.g. 3.45 / 4.00"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Accounting Skills */}
                        <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                            <span>📊 Section 3: Accounting Skills</span>
                          </h3>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Practical knowledge of bookkeeping? *</label>
                                <select value={accBookkeeping} onChange={(e) => setAccBookkeeping(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Familiar with General Ledger & Statements? *</label>
                                <select value={accGeneralLedger} onChange={(e) => setAccGeneralLedger(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Understand AP and AR? *</label>
                                <select value={accApAr} onChange={(e) => setAccApAr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Knowledge of Bank Reconciliation? *</label>
                                <select value={accBankRecon} onChange={(e) => setAccBankRecon(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Knowledge of Tax and VAT? *</label>
                                <select value={accTaxVat} onChange={(e) => setAccTaxVat(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Rate your Microsoft Excel skills. *</label>
                                <select value={accExcel} onChange={(e) => setAccExcel(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">Which accounting software can you use?</label>
                              <div className="flex flex-wrap gap-3">
                                {['QuickBooks', 'Xero', 'Tally', 'Other', 'None'].map((soft) => (
                                  <label key={soft} className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                    <input
                                      type="checkbox"
                                      checked={accSoftware.includes(soft)}
                                      onChange={(e) => {
                                        if (e.target.checked) setAccSoftware([...accSoftware, soft]);
                                        else setAccSoftware(accSoftware.filter(s => s !== soft));
                                      }}
                                      className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span>{soft}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: Work Experience */}
                        <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                            <span>💼 Section 4: Work Experience</span>
                          </h3>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Previous accounting experience? *</label>
                                <select value={accHasExp} onChange={(e) => setAccHasExp(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                                  <option value="Yes">Yes</option>
                                  <option value="No — Fresh Graduate">No — Fresh Graduate</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Total Relevant Work Experience *</label>
                                <select value={accTotalExp} onChange={(e) => setAccTotalExp(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                                  <option value="No Experience">No Experience</option>
                                  <option value="Less than 1 Year">Less than 1 Year</option>
                                  <option value="1–2 Years">1–2 Years</option>
                                  <option value="3+ Years">3+ Years</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Briefly describe your accounting experience (if applicable).</label>
                              <textarea
                                rows={2}
                                value={accExpDesc}
                                onChange={(e) => setAccExpDesc(e.target.value)}
                                placeholder="Mention past firms, responsibilities, or software used..."
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs resize-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 5: Availability & Declaration */}
                        <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                            <span>⏱️ Section 5: Availability &amp; Declaration</span>
                          </h3>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Full-time employment? *</label>
                                <select value={accFullTime} onChange={(e) => setAccFullTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Expected monthly salary? *</label>
                                <input
                                  type="text"
                                  required
                                  value={accSalaryExp}
                                  onChange={(e) => setAccSalaryExp(e.target.value)}
                                  placeholder="e.g. BDT 30,000"
                                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">When can you join? *</label>
                                <input
                                  type="text"
                                  required
                                  value={accJoinAvailability}
                                  onChange={(e) => setAccJoinAvailability(e.target.value)}
                                  placeholder="Immediately / 1 Week"
                                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Why do you think you are suitable for this Accountant position? *</label>
                              <textarea
                                rows={3}
                                required
                                value={accSuitability}
                                onChange={(e) => setAccSuitability(e.target.value)}
                                placeholder="Explain your motivation and qualifications..."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs resize-none"
                              />
                            </div>

                            <div className="pt-2">
                              <label className="flex items-start gap-2.5 cursor-pointer bg-white p-3.5 rounded-xl border border-slate-200">
                                <input
                                  type="checkbox"
                                  required
                                  checked={accDeclaration}
                                  onChange={(e) => setAccDeclaration(e.target.checked)}
                                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-xs text-slate-700 font-medium">
                                  I confirm that the information provided is true and accurate. *
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            placeholder="Adv. Md. Rahim / Saima Hossain"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                            <input
                              type="email"
                              required
                              value={applicantEmail}
                              onChange={(e) => setApplicantEmail(e.target.value)}
                              placeholder="rahim@example.com"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                            <input
                              type="text"
                              required
                              value={applicantPhone}
                              onChange={(e) => setApplicantPhone(e.target.value)}
                              placeholder="+880 1700 000000"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Upload CV / Resume (PDF / Doc) *</label>
                          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <span className="text-xs font-bold text-slate-700 block">Click to upload CV file or drag and drop</span>
                            <span className="text-[10px] text-slate-500 mt-0.5 block">PDF, DOCX up to 10MB</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Cover Note / Professional Summary</label>
                          <textarea
                            rows={3}
                            value={coverNote}
                            onChange={(e) => setCoverNote(e.target.value)}
                            placeholder="Briefly highlight your relevant experience or certifications..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsApplyModalOpen(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <span>Submit Application</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
        </div>
      )
      )}
    </div>
  );
}
