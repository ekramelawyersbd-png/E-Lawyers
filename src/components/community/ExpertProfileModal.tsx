import { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Star, 
  Calendar, 
  UserPlus, 
  UserCheck, 
  FileText, 
  MessageSquare, 
  ThumbsUp, 
  Award, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Share2,
  ExternalLink,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';
import { Expert } from '../../data/communityData';

interface ExpertProfileModalProps {
  expert: Expert | null;
  isOpen: boolean;
  onClose: () => void;
  isFollowing: boolean;
  onToggleFollow: (expertId: string) => void;
  onBookConsultation: (expert: Expert) => void;
  onAskQuestionToExpert?: (expert: Expert) => void;
}

export function ExpertProfileModal({
  expert,
  isOpen,
  onClose,
  isFollowing,
  onToggleFollow,
  onBookConsultation,
  onAskQuestionToExpert
}: ExpertProfileModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !expert) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Header */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900 shrink-0">
          <img 
            src={expert.coverImage} 
            alt={`${expert.name} cover`} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          
          {/* Action buttons on top right */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
              title="Share profile"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Verification Badge Header Pill */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/90 text-white text-xs font-bold rounded-full backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Legal/Tax Contributor
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 sm:px-8 pt-0 pb-8 flex-1">
          {/* Avatar & Key Header Info */}
          <div className="relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6 pb-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative">
                <img 
                  src={expert.avatar} 
                  alt={expert.name} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                />
                <span className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-600 text-white rounded-xl shadow-md" title="Verified Professional">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="pt-2 sm:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{expert.name}</h2>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {expert.verificationBadge}
                  </span>
                </div>
                <p className="text-emerald-700 font-semibold text-base mt-0.5">{expert.role}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1.5">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    {expert.rating.toFixed(1)} ({expert.reviewsCount} reviews)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    {expert.experience}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <button
                onClick={() => onToggleFollow(expert.id)}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 ${
                  isFollowing
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Follow Expert
                  </>
                )}
              </button>

              <button
                onClick={() => onBookConsultation(expert)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation
              </button>
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 text-center border border-slate-100">
              <div className="flex items-center justify-center text-emerald-600 mb-1">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{expert.answersCount}</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Expert Answers</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 text-center border border-slate-100">
              <div className="flex items-center justify-center text-blue-600 mb-1">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{expert.articlesCount}</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Legal Articles</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 text-center border border-slate-100">
              <div className="flex items-center justify-center text-amber-600 mb-1">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{expert.helpfulVotes}</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Helpful Votes</div>
            </div>
          </div>

          {/* Specialization Pills */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              Areas of Specialization
            </h4>
            <div className="flex flex-wrap gap-2">
              {expert.specialization.map((spec) => (
                <span 
                  key={spec}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/70"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Professional Credentials */}
          <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Credentials & Professional Affiliations
            </h4>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {expert.credentials}
            </p>
          </div>

          {/* Bio Description */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Professional Overview
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {expert.bio}
            </p>
          </div>

          {/* Consultation Banner footer */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Direct Advisory</span>
              </div>
              <p className="text-sm font-bold text-white">Need tailored advice for your business or tax case?</p>
              <p className="text-xs text-emerald-200/80 mt-0.5">Estimated advisory: {expert.hourlyRate || 'BDT 4,000 / hr'}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onAskQuestionToExpert && (
                <button
                  onClick={() => onAskQuestionToExpert(expert)}
                  className="px-4 py-2 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors border border-emerald-700/60"
                >
                  Ask Question
                </button>
              )}
              <button
                onClick={() => onBookConsultation(expert)}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-md"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
