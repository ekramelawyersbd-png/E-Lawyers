import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  MapPin, 
  DollarSign, 
  ChevronRight, 
  User, 
  LogIn, 
  RefreshCw, 
  X, 
  Eye, 
  Printer, 
  Trash2, 
  Sparkles,
  HelpCircle,
  Tag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  JobApplication, 
  ApplicationStatus, 
  fetchUserApplications, 
  updateJobApplication, 
  createSeedApplications 
} from '../../services/jobApplicationService';

interface MyApplicationsDashboardProps {
  onBrowseJobs?: () => void;
  onOpenJobDetail?: (jobId: string) => void;
  refreshTrigger?: number;
}

export function MyApplicationsDashboard({
  onBrowseJobs,
  onOpenJobDetail,
  refreshTrigger = 0
}: MyApplicationsDashboardProps) {
  const { user, authUser, signInWithGoogle, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [withdrawModalApp, setWithdrawModalApp] = useState<JobApplication | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Load user applications
  const loadApplications = async () => {
    if (!user) {
      setApplications([]);
      return;
    }
    setIsLoading(true);
    try {
      let apps = await fetchUserApplications(user.uid, user.email || undefined);
      // If user has no applications in their account, auto-populate initial seed so they can experience the tracker immediately
      if (apps.length === 0) {
        const seed = createSeedApplications({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || authUser?.displayName
        });
        apps = seed;
        try {
          localStorage.setItem(`accounticca_job_apps_${user.uid}`, JSON.stringify(seed));
        } catch (e) {
          // ignore
        }
      }
      setApplications(apps);
    } catch (err) {
      console.warn('Error loading applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadApplications();
    } else {
      setApplications([]);
    }
  }, [user, refreshTrigger]);

  const handleWithdraw = async (appId: string) => {
    if (!user) return;
    try {
      await updateJobApplication(appId, user.uid, {
        status: 'Withdrawn',
        statusNotes: 'Application withdrawn by applicant.'
      });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'Withdrawn' } : a));
      setWithdrawModalApp(null);
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: 'Withdrawn' } : null);
      }
      setFeedbackMessage('Application has been withdrawn successfully.');
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error('Withdraw error:', err);
    }
  };

  const handleAddSampleApp = () => {
    if (!user) return;
    const seed = createSeedApplications({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || authUser?.displayName
    });
    setApplications(seed);
    try {
      localStorage.setItem(`accounticca_job_apps_${user.uid}`, JSON.stringify(seed));
    } catch (e) {
      // ignore
    }
    setFeedbackMessage('Sample application loaded for tracker preview.');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Application Received'
        };
      case 'Under Review':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Under Review'
        };
      case 'Shortlisted':
      case 'Interview Scheduled':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: status === 'Interview Scheduled' ? 'Interview Scheduled' : 'Shortlisted'
        };
      case 'Technical Assessment':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
          label: 'Technical Evaluation'
        };
      case 'Offer Extended':
        return {
          bg: 'bg-purple-50 text-purple-900 border-purple-200',
          dot: 'bg-purple-500',
          label: 'Offer Extended'
        };
      case 'Withdrawn':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: 'Withdrawn'
        };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Taxation':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Audit':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Accounting':
        return 'bg-blue-50 text-blue-900 border-blue-300';
      case 'Business Tech':
        return 'bg-purple-50 text-purple-900 border-purple-300';
      case 'Legal & Compliance':
        return 'bg-rose-50 text-rose-900 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  // Filter applications
  const filteredApps = applications.filter(app => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Under Review') return app.status === 'Under Review' || app.status === 'Submitted';
    if (statusFilter === 'Interview') return app.status === 'Interview Scheduled' || app.status === 'Shortlisted';
    if (statusFilter === 'Active') return app.status !== 'Withdrawn' && app.status !== 'Archived';
    return app.status === statusFilter;
  });

  // Not Logged In State
  if (!user) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-12 border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Applicant Portal</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            Track Your Job Applications in Real Time
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            Sign in to access your personal recruitment dashboard. View stage updates, interview invitations, review feedback, and interview schedules for positions you have applied to at E-Lawyers & Accounticca.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              disabled={authLoading}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google to View Applications</span>
            </button>

            {onBrowseJobs && (
              <button
                type="button"
                onClick={onBrowseJobs}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Current Openings</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Logged In Dashboard
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-12 space-y-8">
      {/* Dashboard Top Header & Candidate Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {authUser?.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Candidate Account</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              My Applications Dashboard
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as <strong className="text-slate-700">{user.email}</strong> • Real-time hiring pipeline tracker
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            type="button"
            onClick={loadApplications}
            disabled={isLoading}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh application records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live Status</span>
          </button>

          {onBrowseJobs && (
            <button
              type="button"
              onClick={onBrowseJobs}
              className="px-4 py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Explore More Openings</span>
            </button>
          )}
        </div>
      </div>

      {feedbackMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="cursor-pointer">
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Applied</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{applications.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Submitted roles</div>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Under Review</div>
          <div className="text-2xl font-black text-amber-950 mt-1">
            {applications.filter(a => a.status === 'Under Review' || a.status === 'Submitted').length}
          </div>
          <div className="text-[11px] text-amber-700/80 mt-0.5">In committee screening</div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/70">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Interviews & Shortlists</div>
          <div className="text-2xl font-black text-emerald-950 mt-1">
            {applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Shortlisted').length}
          </div>
          <div className="text-[11px] text-emerald-700/80 mt-0.5">Shortlisted / Confirmed</div>
        </div>

        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/70">
          <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Active Pipeline</div>
          <div className="text-2xl font-black text-blue-950 mt-1">
            {applications.filter(a => a.status !== 'Withdrawn').length}
          </div>
          <div className="text-[11px] text-blue-700/80 mt-0.5">Active candidates</div>
        </div>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500 mr-1">Filter View:</span>
        {[
          { id: 'All', label: 'All Applications' },
          { id: 'Under Review', label: 'Under Review' },
          { id: 'Interview', label: 'Interviews & Shortlisted' },
          { id: 'Active', label: 'Active Only' }
        ].map(tab => {
          const isSelected = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Applications Cards List */}
      {filteredApps.length === 0 ? (
        <div className="p-10 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
          <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No applications match this filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't submitted any job applications under this filter yet.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddSampleApp}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Load Sample Application
            </button>
            {onBrowseJobs && (
              <button
                type="button"
                onClick={onBrowseJobs}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Browse Open Positions
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApps.map(app => {
            const badge = getStatusBadge(app.status);
            return (
              <div 
                key={app.id}
                className="bg-slate-50/70 hover:bg-slate-50 rounded-3xl border border-slate-200/90 p-6 transition-all hover:border-slate-300 space-y-5"
              >
                {/* Header: Title, Category, Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryColor(app.category)}`}>
                        {app.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                        {app.department}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                        {app.jobType}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {app.jobTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        Ref: <strong className="text-slate-800">{app.referenceId}</strong>
                      </span>
                      <span>•</span>
                      <span>Applied on <strong className="text-slate-700">{app.appliedDate}</strong></span>
                      <span>•</span>
                      <span>{app.location}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                      <span>{badge.label}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>

                {/* Visual Pipeline Stepper */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Application Review Progress:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                    {[
                      { step: 1, title: 'Submitted', done: true },
                      { 
                        step: 2, 
                        title: 'Under Review', 
                        done: app.status !== 'Submitted' && app.status !== 'Withdrawn'
                      },
                      { 
                        step: 3, 
                        title: 'Interview', 
                        done: app.status === 'Shortlisted' || app.status === 'Interview Scheduled' || app.status === 'Offer Extended' 
                      },
                      { 
                        step: 4, 
                        title: 'Offer / Decision', 
                        done: app.status === 'Offer Extended' 
                      }
                    ].map(st => (
                      <div key={st.step} className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                          st.done
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          {st.done ? <CheckCircle2 className="w-4 h-4" /> : st.step}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${st.done ? 'text-slate-900' : 'text-slate-400'}`}>
                            {st.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {st.done ? 'Completed' : 'Pending'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interview Highlight (if scheduled) */}
                {app.interviewDate && (
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-950 flex items-center gap-2">
                          <span>Interview Session Confirmed</span>
                          <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold">
                            {app.interviewMode === 'online' ? 'Google Meet' : 'In-Person'}
                          </span>
                        </div>
                        <div className="text-emerald-800 mt-0.5">
                          Date: <strong>{app.interviewDate}</strong> at <strong>{app.interviewTime || '11:00 AM BST'}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {app.interviewMode === 'online' && (
                        <a
                          href={app.interviewLink || 'https://meet.google.com'}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                        >
                          <span>Join Google Meet</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Controls & Next Step Hint */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700">Latest Update:</span>
                    <span>{app.statusNotes || 'Your application package is currently active in our hiring portal.'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {app.status !== 'Withdrawn' && (
                      <button
                        type="button"
                        onClick={() => setWithdrawModalApp(app)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
                      >
                        Withdraw Application
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="text-xs font-bold text-slate-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Timeline</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Full Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${getCategoryColor(selectedApp.category)}`}>
                  {selectedApp.category}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                  {selectedApp.department}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {selectedApp.jobTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Application Ref: <strong className="font-mono text-slate-800">{selectedApp.referenceId}</strong> • Submitted on {selectedApp.appliedDate}
              </p>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <strong className="text-slate-500 block">Status:</strong>
                <span className="font-bold text-slate-900">{selectedApp.status}</span>
              </div>
              <div>
                <strong className="text-slate-500 block">Job Type:</strong>
                <span className="font-bold text-slate-900">{selectedApp.jobType}</span>
              </div>
              <div>
                <strong className="text-slate-500 block">Location:</strong>
                <span className="font-bold text-slate-900">{selectedApp.location}</span>
              </div>
              <div>
                <strong className="text-slate-500 block">Salary:</strong>
                <span className="font-bold text-slate-900">{selectedApp.salaryRange}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Milestones & Recruitment Pipeline
              </h4>
              <div className="space-y-3">
                {selectedApp.timeline?.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      ev.completed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {ev.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{ev.title}</span>
                        <span className="text-[11px] text-slate-400 font-semibold">{ev.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{ev.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover Letter Submitted */}
            {selectedApp.coverLetter && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Submitted Cover Letter & Profile Summary
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            {/* Interview Details */}
            {selectedApp.interviewDate && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Interview Session Details</span>
                </div>
                <div className="text-slate-700 space-y-1">
                  <div><strong>Date & Time:</strong> {selectedApp.interviewDate} at {selectedApp.interviewTime || '11:00 AM BST'}</div>
                  <div><strong>Mode:</strong> {selectedApp.interviewMode === 'online' ? 'Google Meet (Virtual)' : 'E-Lawyers Corporate Chamber, Gulshan-2, Dhaka'}</div>
                  {selectedApp.interviewLink && (
                    <div>
                      <strong>Video Link:</strong>{' '}
                      <a href={selectedApp.interviewLink} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">
                        {selectedApp.interviewLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Application Record</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      {withdrawModalApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Withdraw Application?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to withdraw your application for <strong>{withdrawModalApp.jobTitle}</strong> (Ref: {withdrawModalApp.referenceId})?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWithdrawModalApp(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Keep Application
              </button>
              <button
                type="button"
                onClick={() => handleWithdraw(withdrawModalApp.id)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
