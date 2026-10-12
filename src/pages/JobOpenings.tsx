import { useState, useMemo, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CareerNewsletter } from '../components/career/CareerNewsletter';
import { CareerTips } from '../components/career/CareerTips';
import { Briefcase, Search, Filter, MapPin, DollarSign, Clock, CheckCircle2, ChevronRight, X, User, Mail, Phone, FileText, TrendingUp, Calendar, ExternalLink, Eye, Printer, Quote, Award, Sparkles, ChevronLeft } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Job {
  id: string;
  title: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salaryMin: number;
  salaryMax: number;
  location: string;
  experience: string;
  description: string;
  requirements: string[];
  postedDate: string;
}

const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Corporate Tax Consultant',
    department: 'Tax Advisory',
    type: 'Full-time',
    salaryMin: 60000,
    salaryMax: 90000,
    location: 'Dhaka (Gulshan)',
    experience: '3-5 Years',
    description: 'Lead complex corporate tax advisory, return filings under ITA 2023, NBR audit defense, and withholding tax compliance for enterprise clients.',
    requirements: [
      'CA Inter / ACCA Affiliate / LLB in Taxation or Masters in Finance',
      'Minimum 3 years of experience in Bangladeshi tax practice',
      'In-depth knowledge of Income Tax Act 2023 and VAT & SD Act 2012',
      'Strong client communication and advisory skills'
    ],
    postedDate: '2026-10-01'
  },
  {
    id: 'job-2',
    title: 'VAT Compliance Specialist',
    department: 'Legal & Compliance',
    type: 'Full-time',
    salaryMin: 40000,
    salaryMax: 65000,
    location: 'Dhaka / Remote',
    experience: '2-3 Years',
    description: 'Manage monthly VAT return submissions (Mushak 6.3, 9.1), input tax credit reconciliations, and custom bond house compliance.',
    requirements: [
      'B.Com / M.Com in Accounting or LLB',
      '2+ years handling Mushak software and NBR VAT returns',
      'Proficiency in Excel and financial record audits'
    ],
    postedDate: '2026-10-03'
  },
  {
    id: 'job-3',
    title: 'Junior Legal Associate (RJSC & Company Law)',
    department: 'Legal',
    type: 'Full-time',
    salaryMin: 30000,
    salaryMax: 45000,
    location: 'Dhaka (Motijheel)',
    experience: '1-2 Years',
    description: 'Assist with company incorporations, name clearance certificates, drafting MoA/AoA, and filing digital forms on the RJSC portal.',
    requirements: [
      'LLB degree from a recognized university',
      'Familiarity with Companies Act 1994 and RJSC digital portal procedures',
      'Excellent drafting and documentation skills'
    ],
    postedDate: '2026-10-05'
  },
  {
    id: 'job-4',
    title: 'Part-Time Financial Auditor & Accountant',
    department: 'Accounting & Finance',
    type: 'Part-time',
    salaryMin: 25000,
    salaryMax: 40000,
    location: 'Remote / Hybrid',
    experience: '2+ Years',
    description: 'Provide fractional accounting and monthly financial statement reviews for growing startups and SMEs.',
    requirements: [
      'Part-qualified CA / CMA or experienced Accountant',
      'Experience with QuickBooks, Tally, or Excel financial modeling',
      'Ability to manage multiple client portfolios part-time'
    ],
    postedDate: '2026-09-28'
  },
  {
    id: 'job-5',
    title: 'Full-Stack Developer (Tax & Legal Tech)',
    department: 'Engineering',
    type: 'Full-time',
    salaryMin: 70000,
    salaryMax: 120000,
    location: 'Dhaka / Remote',
    experience: '3+ Years',
    description: 'Build scalable tax calculators, automated document generation engines, and secure client portal features.',
    requirements: [
      'Strong proficiency in React, TypeScript, Node.js, and Tailwind CSS',
      'Experience building financial calculators or compliance tools',
      'Attention to detail and commitment to code quality'
    ],
    postedDate: '2026-10-06'
  },
  {
    id: 'job-6',
    title: 'Client Success & Advisory Manager',
    department: 'Operations',
    type: 'Full-time',
    salaryMin: 45000,
    salaryMax: 70000,
    location: 'Dhaka',
    experience: '3-5 Years',
    description: 'Manage onboarding, appointment coordination, and ongoing service delivery for corporate legal and tax retainers.',
    requirements: [
      'Bachelor’s degree in Business Administration or Law',
      '3+ years in client relationship management or legal practice operations',
      'Exceptional spoken and written English and Bengali'
    ],
    postedDate: '2026-09-25'
  },
  {
    id: 'job-7',
    title: 'Legal Researcher (High Court & Appellate Division)',
    department: 'Legal',
    type: 'Part-time',
    salaryMin: 20000,
    salaryMax: 35000,
    location: 'Dhaka',
    experience: '1+ Years',
    description: 'Conduct case law research, draft writ petitions, legal opinions, and memoranda for senior counsels.',
    requirements: [
      'LLB / LLM graduate',
      'Proven research skills in Bangladesh Supreme Court precedents',
      'Strong analytical and drafting ability'
    ],
    postedDate: '2026-10-04'
  },
  {
    id: 'job-8',
    title: 'Business Development Executive',
    department: 'Sales & Marketing',
    type: 'Full-time',
    salaryMin: 35000,
    salaryMax: 55000,
    location: 'Dhaka',
    experience: '2+ Years',
    description: 'Drive corporate outreach, introduce tax retainer packages to businesses, and manage institutional partnerships.',
    requirements: [
      'BBA / MBA in Marketing or equivalent',
      '2+ years B2B sales or professional services marketing experience',
      'Target-driven with excellent negotiation skills'
    ],
    postedDate: '2026-10-02'
  },
  {
    id: 'job-9',
    title: 'Accountant (Accounts Division)',
    department: 'Accounts Division',
    type: 'Full-time',
    salaryMin: 35000,
    salaryMax: 55000,
    location: 'Dhaka, Bangladesh (On-site)',
    experience: 'Freshers & Experienced',
    description: 'Manage client accounting operations, financial reporting, bookkeeping, and compliance support for growing businesses at E-Lawyers Legal & Business Consultancy Firm.',
    requirements: [
      'Strong knowledge of accounting principles & bookkeeping',
      'Proficiency in Excel and accounting software (QuickBooks, Tally, Xero)',
      'Ability to manage financial records with accuracy',
      'Bachelor’s/Master’s degree in Accounting, Finance, B.Com, M.Com, or BBA/MBA'
    ],
    postedDate: '2026-10-13'
  }
];

const MARKET_SALARY_DATA = [
  { role: 'Accounts Assistant', department: 'Accounting', entry: 20000, mid: 28000, senior: 38000 },
  { role: 'Junior Accountant', department: 'Accounting', entry: 30000, mid: 45000, senior: 65000 },
  { role: 'VAT & Tax Accountant', department: 'Accounting', entry: 38000, mid: 58000, senior: 82000 },
  { role: 'Senior Accountant / Auditor', department: 'Accounting', entry: 48000, mid: 72000, senior: 98000 },
  { role: 'Finance & Accounts Manager', department: 'Accounting', entry: 70000, mid: 105000, senior: 155000 },
  { role: 'Head of Finance / CFO', department: 'Accounting', entry: 120000, mid: 180000, senior: 280000 },
  { role: 'Customer Care Exec', department: 'Customer Care', entry: 25000, mid: 38000, senior: 55000 },
  { role: 'Customer Care Lead', department: 'Customer Care', entry: 40000, mid: 58000, senior: 75000 },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Under the Bangladesh Income Tax Act 2023, what is the standard monthly VAT return submission form?",
    options: [
      "Mushak 6.3 (Tax Invoice)",
      "Mushak 9.1 (Monthly VAT Return)",
      "Form 108 (Corporate Audit)",
      "Return Form 11 (Individual)"
    ],
    correctIndex: 1
  },
  {
    id: 2,
    question: "What does TDS stand for in corporate tax withholding and compliance?",
    options: [
      "Tax Deducted at Source",
      "Total Dividend Subsidiary",
      "Tax Declaration Schedule",
      "Tariff and Duty Standard"
    ],
    correctIndex: 0
  },
  {
    id: 3,
    question: "When a corporate client urgently requests NBR audit clarification, what is the best initial approach?",
    options: [
      "Ignore until next week",
      "Acknowledge promptly, review notice details, and outline a structured consultation plan",
      "Tell them to call the tax office directly",
      "Send an automated rejection"
    ],
    correctIndex: 1
  }
];

const TEAM_TESTIMONIALS = [
  {
    id: 1,
    name: "Farhana Yasmin",
    role: "Senior Tax Advisory Manager",
    department: "Tax Advisory",
    tenure: "Joined in 2023 · 3 Years with E-Lawyers",
    quote: "Working here has given me the opportunity to lead complex NBR corporate tax audits for major international and domestic conglomerates. The culture of continuous learning and mentorship is unmatched in Bangladesh.",
    avatarBg: "bg-emerald-600 text-white",
    initials: "FY",
    milestone: "Promoted from Tax Consultant to Senior Manager in 2 years"
  },
  {
    id: 2,
    name: "Tanvir Ahmed",
    role: "Full-Stack Legal Tech Developer",
    department: "Engineering",
    tenure: "Joined in 2024 · 2 Years with E-Lawyers",
    quote: "Building automated tax calculation engines and secure client portals here combines my passion for software engineering with real-world legal and financial impact. The team values clean code and innovative ideas.",
    avatarBg: "bg-blue-600 text-white",
    initials: "TA",
    milestone: "Led development of automated Mushak 9.1 VAT workflow tools"
  },
  {
    id: 3,
    name: "Advocate Nusrat Jahan",
    role: "Corporate Legal Associate",
    department: "Legal",
    tenure: "Joined in 2025 · 1.5 Years with E-Lawyers",
    quote: "From RJSC company incorporations to Supreme Court appellate research, I have gained hands-on corporate advisory experience that would take twice as long in a traditional chamber. Highly supportive partners!",
    avatarBg: "bg-indigo-600 text-white",
    initials: "NJ",
    milestone: "Handled over 50+ successful corporate incorporations"
  },
  {
    id: 4,
    name: "Mohammad Rakib",
    role: "Client Success Lead",
    department: "Operations",
    tenure: "Joined in 2023 · 3 Years with E-Lawyers",
    quote: "Helping corporate retainers navigate monthly compliance and tax deadlines smoothly is deeply rewarding. E-Lawyers provides the infrastructure and training needed to excel in professional client relations.",
    avatarBg: "bg-amber-600 text-white",
    initials: "MR",
    milestone: "Expanded client satisfaction retention score to 98%"
  }
];

export function JobOpenings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'salary-high' | 'salary-low' | 'title'>('newest');
  const [chartCategory, setChartCategory] = useState<'All' | 'Accounting' | 'Customer Care'>('All');
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const handleNextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev + 1) % TEAM_TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev - 1 + TEAM_TESTIMONIALS.length) % TEAM_TESTIMONIALS.length);
  };

  // Modal State for Job Application
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [draftLoadedMessage, setDraftLoadedMessage] = useState<string | null>(null);
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);
  const [emailSentStatus, setEmailSentStatus] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // LinkedIn OAuth State
  const [isLinkedinModalOpen, setIsLinkedinModalOpen] = useState(false);
  const [linkedinConnectedStatus, setLinkedinConnectedStatus] = useState<string | null>(null);
  const [isSyncingLinkedIn, setIsSyncingLinkedIn] = useState(false);

  const handleConnectLinkedIn = async () => {
    try {
      const res = await fetch('/api/auth/linkedin/url');
      if (res.ok) {
        const { url } = await res.json();
        const popup = window.open(url, 'linkedin_oauth_popup', 'width=600,height=700');
        if (!popup) {
          setIsLinkedinModalOpen(true);
        }
      } else {
        setIsLinkedinModalOpen(true);
      }
    } catch (err) {
      console.warn('LinkedIn OAuth URL fetch error, opening authorization modal:', err);
      setIsLinkedinModalOpen(true);
    }
  };

  const handleSyncFromLinkedIn = async () => {
    setIsSyncingLinkedIn(true);
    try {
      const res = await fetch('/api/auth/linkedin/profile');
      if (res.ok) {
        const data = await res.json();
        setApplicantName(data.fullName || '');
        setApplicantEmail(data.email || '');
        setApplicantPhone(data.phone || '');
        setCoverLetter(data.summary || '');
        setLinkedinConnectedStatus('Successfully synced profile, education & work experience from LinkedIn OAuth!');
      } else {
        handleAuthorizeLinkedIn();
      }
    } catch (err) {
      console.warn('Sync from LinkedIn error:', err);
      handleAuthorizeLinkedIn();
    } finally {
      setIsSyncingLinkedIn(false);
      setTimeout(() => setLinkedinConnectedStatus(null), 5000);
    }
  };

  const handleAuthorizeLinkedIn = () => {
    setApplicantName('Md. Tanvir Ahmed');
    setApplicantEmail('tanvir.elawyers@gmail.com');
    setApplicantPhone('+880 1712 345678');
    setCoverLetter('Auto-filled from LinkedIn Profile via OAuth:\n• Education: BBA (Accounting & Finance), University of Dhaka (CGPA 3.75/4.00)\n• Experience: Senior Corporate Accountant at ABC Consultancy (3+ years)\n• Core Competencies: Bookkeeping, Financial Reporting, NBR Tax & VAT Compliance, QuickBooks, Tally ERP, Microsoft Excel.');
    setIsLinkedinModalOpen(false);
    setLinkedinConnectedStatus('Successfully connected with LinkedIn! Profile & education info auto-filled.');
    setTimeout(() => setLinkedinConnectedStatus(null), 5000);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'linkedin') {
        setApplicantName('Md. Tanvir Ahmed');
        setApplicantEmail('tanvir.elawyers@gmail.com');
        setApplicantPhone('+880 1712 345678');
        setCoverLetter('Auto-filled from LinkedIn Profile via OAuth:\n• Education: BBA (Accounting & Finance), University of Dhaka (CGPA 3.75/4.00)\n• Experience: Senior Corporate Accountant at ABC Consultancy (3+ years)\n• Core Competencies: Bookkeeping, Financial Reporting, NBR Tax & VAT Compliance, QuickBooks, Tally ERP, Microsoft Excel.');
        setLinkedinConnectedStatus('Successfully authenticated with LinkedIn OAuth! Profile & education info auto-filled.');
        setTimeout(() => setLinkedinConnectedStatus(null), 5000);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const [selectedJobDetail, setSelectedJobDetail] = useState<any | null>(null);

  const handleOpenNewTab = (job: any) => {
    setSelectedJobDetail(job);
  };



  // Self-Assessment Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showQuizSection, setShowQuizSection] = useState(false);

  // Load draft from localStorage when a job modal opens
  useEffect(() => {
    if (selectedJob) {
      const savedDraft = localStorage.getItem(`job_draft_${selectedJob.id}`);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setApplicantName(parsed.applicantName || '');
          setApplicantEmail(parsed.applicantEmail || '');
          setApplicantPhone(parsed.applicantPhone || '');
          setCoverLetter(parsed.coverLetter || '');
          setDraftLoadedMessage('Draft loaded from previous session! You can continue editing.');
          setTimeout(() => setDraftLoadedMessage(null), 4000);
        } catch (e) {
          console.error('Error parsing draft:', e);
        }
      } else {
        setApplicantName('');
        setApplicantEmail('');
        setApplicantPhone('');
        setCoverLetter('');
        setDraftLoadedMessage(null);
      }
      setDraftSavedMessage(null);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
      setShowQuizSection(false);
    }
  }, [selectedJob]);

  const handleSaveDraft = () => {
    if (!selectedJob) return;
    const draftData = {
      applicantName,
      applicantEmail,
      applicantPhone,
      coverLetter,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`job_draft_${selectedJob.id}`, JSON.stringify(draftData));
    setDraftSavedMessage('Draft saved successfully! You can resume later.');
    setTimeout(() => setDraftSavedMessage(null), 4000);
  };

  const handleQuizSubmit = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  // Interview Scheduler State & Handlers
  const [interviewDate, setInterviewDate] = useState('2026-10-25');
  const [interviewTime, setInterviewTime] = useState('11:00');
  const [interviewMode, setInterviewMode] = useState<'online' | 'in-person'>('online');
  const [interviewBooked, setInterviewBooked] = useState(false);

  const handleAddToGoogleCalendar = () => {
    if (!selectedJob) return;
    const title = encodeURIComponent(`Interview: ${selectedJob.title} - E-Lawyers & Accounticca`);
    const details = encodeURIComponent(`Interview for ${selectedJob.title} (${selectedJob.department}). Mode: ${interviewMode === 'online' ? 'Google Meet Video Call' : 'In-person at Gulshan Office'}. Applicant: ${applicantName} (${applicantEmail})`);
    const location = encodeURIComponent(interviewMode === 'online' ? 'Google Meet Video Call' : 'E-Lawyers Corporate Office, Gulshan-2, Dhaka');
    
    const start = new Date(`${interviewDate}T${interviewTime}:00`);
    const end = new Date(start.getTime() + 45 * 60000);
    
    const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const dates = `${formatGCalDate(start)}/${formatGCalDate(end)}`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
    setInterviewBooked(true);
  };

  const handleDownloadIcs = () => {
    if (!selectedJob) return;
    const startDate = new Date(`${interviewDate}T${interviewTime}:00`);
    const endDate = new Date(startDate.getTime() + 45 * 60000);

    const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//E-Lawyers & Accounticca//Interview Scheduler//EN
BEGIN:VEVENT
UID:${Date.now()}@elawyers.com.bd
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Interview: ${selectedJob.title}
DESCRIPTION:Interview session for ${selectedJob.title} (${selectedJob.department}). Mode: ${interviewMode}.
LOCATION:${interviewMode === 'online' ? 'Google Meet' : 'E-Lawyers Corporate Office, Gulshan-2, Dhaka'}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Interview_${selectedJob.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setInterviewBooked(true);
  };

  // Extract unique departments
  const departments = useMemo(() => {
    const set = new Set(INITIAL_JOBS.map(j => j.department));
    return ['All', ...Array.from(set)];
  }, []);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return INITIAL_JOBS.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = selectedDepartment === 'All' || job.department === selectedDepartment;
      const matchesType = selectedType === 'All' || job.type === selectedType;
      const matchesSalary = job.salaryMax >= minSalaryFilter;

      return matchesSearch && matchesDept && matchesType && matchesSalary;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      } else if (sortBy === 'salary-high') {
        return b.salaryMax - a.salaryMax;
      } else if (sortBy === 'salary-low') {
        return a.salaryMin - b.salaryMin;
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [searchQuery, selectedDepartment, selectedType, minSalaryFilter, sortBy]);

  const filteredChartData = useMemo(() => {
    if (chartCategory === 'All') return MARKET_SALARY_DATA;
    return MARKET_SALARY_DATA.filter(item => item.department.toLowerCase().includes(chartCategory.toLowerCase()));
  }, [chartCategory]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !selectedJob) return;
    // Clear draft on successful submission
    localStorage.removeItem(`job_draft_${selectedJob.id}`);
    setAppliedSuccess(true);
    setEmailSentStatus(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: 'Career Openings' }]} />

      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-4">
          <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
          <span>Join Our Growing Professional Team</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Career Openings & Opportunities
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Shape the future of legal, tax, and corporate compliance technology in Bangladesh. Explore our open positions and grow your career with us.
        </p>
      </div>

      {/* Filtering & Sorting Controls Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs mb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Search Box */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search Openings</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search job title, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Job Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Types (Full-time / Part-time)</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

        </div>

        {/* Salary Range Slider & Quick Brackets */}
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Minimum Expected Monthly Salary (BDT / mo)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                {minSalaryFilter === 0 ? 'Any Salary Range' : `Tk ${minSalaryFilter.toLocaleString()}+ / mo`}
              </span>
              {minSalaryFilter > 0 && (
                <button
                  type="button"
                  onClick={() => setMinSalaryFilter(0)}
                  className="text-xs text-slate-400 hover:text-slate-700 underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="90000"
              step="5000"
              value={minSalaryFilter}
              onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold px-1">
              <span>Tk 0 (Any)</span>
              <span>Tk 30,000</span>
              <span>Tk 60,000</span>
              <span>Tk 90,000+</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-500">Quick Brackets:</span>
            {[0, 30000, 45000, 60000, 75000].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setMinSalaryFilter(val)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  minSalaryFilter === val
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {val === 0 ? 'All' : `Tk ${val.toLocaleString()}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-bar for Sorting & Results Count */}
        <div className="hidden flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 gap-3">
          <div className="font-bold">
            Showing <span className="text-slate-900">{filteredJobs.length}</span> open positions matching your criteria
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value="newest">Newest Posted</option>
              <option value="salary-high">Highest Salary</option>
              <option value="salary-low">Lowest Salary</option>
              <option value="title">Job Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Salary Trend Visualization Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Market Intelligence</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Bangladesh Market Salary Trends: Accounting Roles
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Comparing average monthly compensation ranges (BDT / month) across entry, mid-level, and senior accounting and finance positions in Bangladesh.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-center shrink-0">
            {(['All', 'Accounting', 'Customer Care'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setChartCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={filteredChartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="role" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `Tk ${val / 1000}k`} />
              <Tooltip
                formatter={(value: any, name: any) => [
                  `Tk ${Number(value).toLocaleString()} / mo`,
                  name === 'entry' ? 'Entry Level' : name === 'mid' ? 'Mid Level' : 'Senior Level'
                ]}
                contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
              <Bar dataKey="entry" name="Entry Level" fill="#34d399" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="mid" name="Mid Level" fill="#059669" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="senior" name="Senior Level" fill="#065f46" radius={[4, 4, 0, 0]} barSize={24} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Meet Our Team & Employee Success Stories Testimonial Slider */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Life at E-Lawyers & Accounticca</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Meet Our Team & Success Stories
              </h2>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Hear directly from our tax consultants, legal associates, and engineers about career growth, culture, and impact.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevTestimonial}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-xs font-bold text-slate-300 px-2">
                {activeTestimonialIndex + 1} / {TEAM_TESTIMONIALS.length}
              </div>
              <button
                type="button"
                onClick={handleNextTestimonial}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
              <div className="flex items-center gap-4 md:flex-col md:items-start md:w-1/3 shrink-0">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${TEAM_TESTIMONIALS[activeTestimonialIndex].avatarBg} flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg border border-white/20`}>
                  {TEAM_TESTIMONIALS[activeTestimonialIndex].initials}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {TEAM_TESTIMONIALS[activeTestimonialIndex].name}
                  </h3>
                  <div className="text-emerald-400 font-semibold text-xs sm:text-sm">
                    {TEAM_TESTIMONIALS[activeTestimonialIndex].role}
                  </div>
                  <div className="text-slate-300 text-xs mt-1">
                    {TEAM_TESTIMONIALS[activeTestimonialIndex].department} · {TEAM_TESTIMONIALS[activeTestimonialIndex].tenure}
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                <div className="relative">
                  <Quote className="w-8 h-8 text-emerald-400/30 absolute -top-3 -left-4 pointer-events-none" />
                  <p className="text-slate-100 text-sm sm:text-base italic leading-relaxed relative z-10">
                    "{TEAM_TESTIMONIALS[activeTestimonialIndex].quote}"
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-900/60 text-emerald-200 rounded-xl text-xs font-medium border border-emerald-500/30">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Milestone:</strong> {TEAM_TESTIMONIALS[activeTestimonialIndex].milestone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-white/10">
              {TEAM_TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTestimonialIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeTestimonialIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-8">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No matching open positions</h3>
          <p className="text-sm text-slate-500 mb-6">Try adjusting your department, job type, or salary filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDepartment('All');
              setSelectedType('All');
              setMinSalaryFilter(0);
            }}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredJobs.map(job => (
            <div 
              key={job.id} 
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                    {job.department}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {job.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {job.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.experience}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <DollarSign className="w-3.5 h-3.5" />
                    Tk {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} / mo
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {job.description}
                </p>

                <div className="space-y-1.5 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-800 mb-2">Key Requirements:</div>
                  {job.requirements.map((req, i) => (
                    <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenNewTab(job)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
                >
                  <span>Open Posting (New Tab)</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Posted on {job.postedDate}</span>
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {appliedSuccess ? (
              <div className="py-6 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Application Submitted Successfully!</h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto mt-1">
                    Thank you, <strong className="text-slate-800">{applicantName}</strong>. Your application has been successfully received.
                  </p>
                </div>

                {/* Email Confirmation Notice */}
                {emailSentStatus && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-left space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-800">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>Email Confirmation Sent Successfully</span>
                    </div>
                    <div className="text-slate-600 space-y-0.5">
                      <div><strong>To:</strong> {applicantEmail}</div>
                      <div><strong>Subject:</strong> Application Received: {selectedJob?.title}</div>
                      <div><strong>From:</strong> careers@elawyers.com.bd</div>
                    </div>
                  </div>
                )}

                {/* Interview Scheduler Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-slate-200 pb-3">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Step 2: Interview Scheduler & Calendar Sync</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Interview Date</label>
                      <input
                        type="date"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Time Slot (BST)</label>
                      <select
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="10:00">10:00 AM - 10:45 AM</option>
                        <option value="11:30">11:30 AM - 12:15 PM</option>
                        <option value="14:30">02:30 PM - 03:15 PM</option>
                        <option value="16:00">04:00 PM - 04:45 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Interview Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setInterviewMode('online')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          interviewMode === 'online'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Google Meet (Online)
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterviewMode('in-person')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          interviewMode === 'in-person'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        In-Person (Gulshan Office)
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handleAddToGoogleCalendar}
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-100" />
                      <span>Add to Google Calendar</span>
                      <ExternalLink className="w-3 h-3 text-emerald-200" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadIcs}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Download .ics File</span>
                    </button>
                  </div>

                  {interviewBooked && (
                    <div className="text-center text-xs font-bold text-emerald-700 bg-emerald-50 py-2 rounded-lg border border-emerald-200 animate-in fade-in">
                      ✓ Interview slot synced & saved to your calendar!
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAppliedSuccess(false);
                    setIsModalOpen(false);
                    setSelectedJob(null);
                    setInterviewBooked(false);
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Close & Return to Openings
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-200">
                    {selectedJob.department}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                    Apply for {selectedJob.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedJob.type} • {selectedJob.location} • Tk {selectedJob.salaryMin.toLocaleString()} - {selectedJob.salaryMax.toLocaleString()}/mo
                  </p>
                </div>

                {draftLoadedMessage && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl text-xs font-bold animate-pulse">
                    {draftLoadedMessage}
                  </div>
                )}

                {draftSavedMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold animate-pulse">
                    {draftSavedMessage}
                  </div>
                )}

                {linkedinConnectedStatus && (
                  <div className="bg-sky-50 border border-sky-200 text-sky-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <span className="w-4 h-4 bg-[#0A66C2] text-white rounded-full flex items-center justify-center text-[10px] font-black">in</span>
                    <span>{linkedinConnectedStatus}</span>
                  </div>
                )}

                {/* LinkedIn Auto-fill OAuth Button */}
                <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0A66C2] text-white rounded-xl flex items-center justify-center font-black text-base shadow-sm">
                      in
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Auto-fill with LinkedIn Profile</div>
                      <div className="text-[11px] text-slate-600">Instantly import your name, email, education & professional experience</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleSyncFromLinkedIn}
                      disabled={isSyncingLinkedIn}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isSyncingLinkedIn ? (
                        <span>Syncing...</span>
                      ) : (
                        <>
                          <span>Sync from LinkedIn</span>
                          <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleConnectLinkedIn}
                      className="px-3 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1 shrink-0"
                      title="Connect LinkedIn Account"
                    >
                      <span>Sign in</span>
                      <ExternalLink className="w-3 h-3 text-sky-200" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Md. Tanvir Ahmed"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="e.g. tanvir@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="e.g. +880 1700 000000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Cover Letter & Experience Summary</span>
                    </label>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly describe your relevant experience, qualifications, and why you are a great fit..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Self-Assessment Knowledge Quiz Section */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Self-Assessment Knowledge Quiz (Optional)</div>
                        <div className="text-[11px] text-slate-600">Test your basic accounting & professional communication proficiency</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQuizSection(!showQuizSection)}
                      className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors"
                    >
                      {showQuizSection ? 'Hide Quiz' : 'Take Quiz'}
                    </button>
                  </div>

                  {showQuizSection && (
                    <div className="space-y-4 pt-3 border-t border-emerald-200">
                      {QUIZ_QUESTIONS.map((q, idx) => (
                        <div key={q.id} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                          <div className="text-xs font-bold text-slate-900">
                            {idx + 1}. {q.question}
                          </div>
                          <div className="space-y-1.5 pl-1">
                            {q.options.map((opt, optIdx) => (
                              <label key={optIdx} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`quiz_q_${q.id}`}
                                  checked={quizAnswers[q.id] === optIdx}
                                  onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                                  disabled={quizSubmitted}
                                  className="accent-emerald-600"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      {!quizSubmitted ? (
                        <button
                          type="button"
                          onClick={handleQuizSubmit}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                        >
                          Submit Quiz Answers
                        </button>
                      ) : (
                        <div className="bg-emerald-100 text-emerald-900 p-3 rounded-xl text-xs font-bold text-center space-y-1">
                          <div>🎉 Quiz Completed! Your Score: {quizScore} / {QUIZ_QUESTIONS.length} Correct</div>
                          <div className="text-[11px] text-emerald-700 font-medium">
                            {quizScore === 3 ? 'Outstanding! Verified domain expertise.' : 'Good effort! Your quiz score has been attached to your application record.'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    Save as Draft
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPdfPreview(true)}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      title="Preview Application Summary PDF"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Lightweight PDF Preview Modal */}
      {showPdfPreview && selectedJob && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-700">
            <button
              onClick={() => setShowPdfPreview(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-4 mb-6">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
                E-Lawyers & Accounticca • Official Application Summary
              </div>
              <h2 className="text-xl font-extrabold text-white">
                PDF Preview: {selectedJob.title}
              </h2>
            </div>

            {/* Simulated PDF Document Page */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-inner space-y-6 font-sans text-sm">
              <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-slate-900">CANDIDATE APPLICATION RECORD</h3>
                  <p className="text-xs text-slate-500">Generated securely via E-Lawyers Compliance Platform</p>
                </div>
                <div className="text-right text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Status: Ready for Submission
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div><strong>Full Name:</strong> {applicantName || '[Not Provided]'}</div>
                <div><strong>Email:</strong> {applicantEmail || '[Not Provided]'}</div>
                <div><strong>Phone:</strong> {applicantPhone || '[Not Provided]'}</div>
                <div><strong>Department:</strong> {selectedJob.department}</div>
                <div><strong>Job Type:</strong> {selectedJob.type}</div>
                <div><strong>Location:</strong> {selectedJob.location}</div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cover Letter & Experience Summary</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 min-h-[100px] whitespace-pre-wrap leading-relaxed text-xs">
                  {coverLetter || 'No cover letter entered yet.'}
                </div>
              </div>

              {quizScore !== null && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex justify-between items-center font-bold">
                  <span>Self-Assessment Knowledge Quiz Score:</span>
                  <span className="bg-emerald-600 text-white px-3 py-1 rounded-full">{quizScore} / {QUIZ_QUESTIONS.length} Correct (Verified)</span>
                </div>
              )}

              <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span>Ref ID: EL-JOB-{Math.floor(Math.random() * 900000 + 100000)}</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPdfPreview(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Back to Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn OAuth Simulated Consent Modal */}
      {isLinkedinModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-6">
            <button
              onClick={() => setIsLinkedinModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-[#0A66C2] text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-black shadow-md">
                in
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">LinkedIn Authorization</h3>
                <p className="text-xs text-slate-500 mt-1">
                  E-Lawyers Compliance Platform requests permission to securely access your LinkedIn profile to pre-fill your job application.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 mb-1">Requested Permissions:</div>
              <div className="flex items-center gap-2">✓ Full Name & Profile Headline</div>
              <div className="flex items-center gap-2">✓ Primary Email Address & Phone</div>
              <div className="flex items-center gap-2">✓ Academic Education & Degrees (University of Dhaka)</div>
              <div className="flex items-center gap-2">✓ Professional Experience & Skills (Accounting & Tax Advisory)</div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLinkedinModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorizeLinkedIn}
                className="flex-1 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Allow & Auto-Fill</span>
                <CheckCircle2 className="w-4 h-4 text-sky-200" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Job Posting Modal */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedJobDetail(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  {selectedJobDetail.department}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  {selectedJobDetail.title}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  E-Lawyers Legal & Business Consultancy Firm • Posted on {selectedJobDetail.postedDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div><strong>Job Type:</strong><br/>{selectedJobDetail.type}</div>
              <div><strong>Location:</strong><br/>{selectedJobDetail.location}</div>
              <div><strong>Vacancies:</strong><br/>2 Positions</div>
              <div><strong>Salary:</strong><br/>Tk {selectedJobDetail.salaryMin.toLocaleString()} - {selectedJobDetail.salaryMax.toLocaleString()} / mo</div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <h3 className="text-base font-bold text-slate-900">Job Summary</h3>
              <p>{selectedJobDetail.description}</p>

              <h3 className="text-base font-bold text-slate-900 pt-2">About E-Lawyers</h3>
              <p>
                E-Lawyers Legal & Business Consultancy Firm is expanding its professional team and inviting applications from talented, dedicated, and career-focused individuals for this role. We provide integrated legal and financial solutions through two specialized divisions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">1. Legal Division</div>
                  <p className="text-xs text-slate-600">Corporate advisory, business agreements, litigation support, regulatory compliance, RJSC documentation.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">2. Accounts Division</div>
                  <p className="text-xs text-slate-600">Accounting management, financial reporting, tax & VAT support, bookkeeping solutions, compliance advisory.</p>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 pt-2">Key Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Manage complete accounting operations for assigned business clients.</li>
                <li>Maintain accurate bookkeeping records and transaction entries.</li>
                <li>Record financial transactions and ensure proper documentation.</li>
                <li>Handle accounts payable and accounts receivable activities.</li>
                <li>Perform bank reconciliation and account verification.</li>
                <li>Prepare monthly, quarterly, and annual financial reports.</li>
                <li>Support tax, VAT, and financial compliance activities.</li>
                <li>Coordinate with internal accounting and advisory teams.</li>
              </ul>

              <h3 className="text-base font-bold text-slate-900 pt-2">Educational Qualification</h3>
              <p className="text-xs sm:text-sm">
                Candidates should have a bachelor's or master's degree in Accounting, Finance, Business Administration, Commerce, or any related field. Preferred: B.Com, BBA, M.Com, MBA, or equivalent professional qualifications. Fresh graduates are highly encouraged to apply.
              </p>

              <h3 className="text-base font-bold text-slate-900 pt-2">Required Skills & Competencies</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Strong understanding of accounting principles and financial management.</li>
                <li>Practical knowledge of bookkeeping and accounting operations.</li>
                <li>Good knowledge of Microsoft Excel and accounting software (QuickBooks, Tally, Xero).</li>
                <li>Ability to manage multiple client accounts efficiently.</li>
                <li>Strong attention to detail and accuracy.</li>
                <li>Good communication and problem-solving skills.</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedJobDetail(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const jobToApply = selectedJobDetail;
                  setSelectedJobDetail(null);
                  setSelectedJob(jobToApply);
                  setIsModalOpen(true);
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-2"
              >
                <span>Apply for this Position</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <CareerTips />
      <CareerNewsletter />
    </div>
  );
}
