import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Scale, 
  Briefcase, 
  Calculator, 
  Award, 
  Reply, 
  ShieldCheck, 
  CornerDownRight, 
  Filter, 
  Search, 
  FileText, 
  Send, 
  Check, 
  AlertCircle,
  Clock,
  User as UserIcon,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { 
  CommentItem, 
  ProfessionalRole, 
  PROFESSIONAL_ROLES, 
  DISCUSSION_TOPIC_TAGS, 
  subscribeToArticleComments, 
  postProfessionalComment, 
  toggleEndorsement,
  getLocalCachedComments
} from '../services/commentService';

interface CommentsProps {
  articleId?: string;
  articleTitle?: string;
}

export function Comments({ articleId = 'default', articleTitle }: CommentsProps) {
  const { user, signInWithGoogle } = useAuth();

  const [commentsList, setCommentsList] = useState<CommentItem[]>(() => getLocalCachedComments(articleId));
  const [activeFilter, setActiveFilter] = useState<'all' | 'legal' | 'accounting' | 'top'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Comment Form State
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<ProfessionalRole>('advocate_supreme_court');
  const [organization, setOrganization] = useState('');
  const [statutoryRef, setStatutoryRef] = useState('');
  const [topicTag, setTopicTag] = useState<string>('Statutory Interpretation');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  // Reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyRole, setReplyRole] = useState<ProfessionalRole>('chartered_accountant');
  const [replyOrganization, setReplyOrganization] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Track user endorsements locally
  const [endorsedCommentIds, setEndorsedCommentIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(`endorsed_comments_${articleId}`);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Pre-fill user profile info if logged in
  useEffect(() => {
    if (user?.displayName && !authorName) {
      setAuthorName(user.displayName);
    }
    if (user?.email && !authorEmail) {
      setAuthorEmail(user.email);
    }
  }, [user]);

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToArticleComments(
      articleId,
      (updatedList) => {
        setCommentsList(updatedList);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [articleId]);

  // Handle new top-level comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to post a comment.');
      return;
    }
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    const roleInfo = PROFESSIONAL_ROLES.find(r => r.value === selectedRole);

    try {
      const avatarUrl = user?.photoURL 
        ? user.photoURL 
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=047857,0f766e,1e293b`;

      await postProfessionalComment({
        articleId,
        userId: user?.uid,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        role: selectedRole,
        roleLabel: roleInfo?.label || 'Legal & Tax Professional',
        organization: organization.trim() || undefined,
        statutoryRef: statutoryRef.trim() || undefined,
        topicTag,
        avatar: avatarUrl,
        text: commentText.trim(),
        parentId: null
      });

      setCommentText('');
      setStatutoryRef('');
      setShowSuccessBadge(true);
      setTimeout(() => setShowSuccessBadge(false), 4500);
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle nested reply submission
  const handlePostReply = async (parentId: string) => {
    if (!user) {
      alert('Please sign in to reply.');
      return;
    }
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);

    const replierName = user?.displayName || authorName || 'Peer Practitioner';
    const roleInfo = PROFESSIONAL_ROLES.find(r => r.value === replyRole);
    const avatarUrl = user?.photoURL 
      ? user.photoURL 
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(replierName)}&backgroundColor=047857,1e293b`;

    try {
      await postProfessionalComment({
        articleId,
        userId: user?.uid,
        authorName: replierName,
        authorEmail: user?.email || authorEmail || undefined,
        role: replyRole,
        roleLabel: roleInfo?.label || 'Professional Practitioner',
        organization: replyOrganization.trim() || undefined,
        avatar: avatarUrl,
        text: replyText.trim(),
        parentId
      });

      setReplyText('');
      setReplyingToId(null);
    } catch (err) {
      console.error('Failed to post reply', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Handle endorsement toggle
  const handleToggleEndorse = async (commentId: string) => {
    const isVoted = endorsedCommentIds.has(commentId);
    const nextSet = new Set(endorsedCommentIds);
    if (isVoted) {
      nextSet.delete(commentId);
    } else {
      nextSet.add(commentId);
    }
    setEndorsedCommentIds(nextSet);
    try {
      localStorage.setItem(`endorsed_comments_${articleId}`, JSON.stringify(Array.from(nextSet)));
    } catch {
      // Ignore localStorage errors
    }

    await toggleEndorsement(articleId, commentId, isVoted);
  };

  // Group top-level comments and replies
  const { topLevelComments, repliesByParent } = useMemo(() => {
    const topLevel: CommentItem[] = [];
    const replies: Record<string, CommentItem[]> = {};

    commentsList.forEach((comment) => {
      if (!comment.parentId) {
        topLevel.push(comment);
      } else {
        if (!replies[comment.parentId]) {
          replies[comment.parentId] = [];
        }
        replies[comment.parentId].push(comment);
      }
    });

    return { topLevelComments: topLevel, repliesByParent: replies };
  }, [commentsList]);

  // Apply search & role filters
  const filteredComments = useMemo(() => {
    let list = [...topLevelComments];

    // Role filter
    if (activeFilter === 'legal') {
      list = list.filter(c => 
        c.role === 'advocate_supreme_court' || 
        c.role === 'advocate_district_court' || 
        c.role === 'barrister' || 
        c.role === 'corporate_counsel'
      );
    } else if (activeFilter === 'accounting') {
      list = list.filter(c => 
        c.role === 'chartered_accountant' || 
        c.role === 'cost_management_accountant' || 
        c.role === 'tax_practitioner' ||
        c.role === 'finance_director'
      );
    } else if (activeFilter === 'top') {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.text.toLowerCase().includes(q) ||
        c.authorName.toLowerCase().includes(q) ||
        c.roleLabel.toLowerCase().includes(q) ||
        (c.organization && c.organization.toLowerCase().includes(q)) ||
        (c.statutoryRef && c.statutoryRef.toLowerCase().includes(q))
      );
    }

    return list;
  }, [topLevelComments, activeFilter, searchQuery]);

  // Helper to render role badge
  const renderRoleBadge = (role: ProfessionalRole, roleLabel?: string) => {
    const meta = PROFESSIONAL_ROLES.find(r => r.value === role) || PROFESSIONAL_ROLES[PROFESSIONAL_ROLES.length - 1];
    
    let Icon = Briefcase;
    if (meta.iconType === 'scales') Icon = Scale;
    if (meta.iconType === 'calculator') Icon = Calculator;
    if (meta.iconType === 'award') Icon = Award;

    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${meta.badgeBg} ${meta.badgeColor} ${meta.badgeBorder}`}>
        <Icon className="w-3 h-3 shrink-0" />
        <span className="truncate max-w-[200px] sm:max-w-none">{roleLabel || meta.label}</span>
      </span>
    );
  };

  return (
    <section 
      id="professional-comments-section" 
      className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-12 shadow-sm"
      aria-labelledby="discussion-heading"
    >
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200/80">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 id="discussion-heading" className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span>Professional Discussion Forum</span>
                <span className="text-sm font-extrabold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  {commentsList.length}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Peer analysis, statutory interpretations, and procedural exchanges among lawyers and accountants.
              </p>
            </div>
          </div>
        </div>

        {/* Discussion standard badge */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-600 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Verified Practitioner Forum</span>
        </div>
      </div>

      {/* 2. Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-8">
        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Perspectives ({topLevelComments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('legal')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'legal'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Advocates & Counsel</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('accounting')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'accounting'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Chartered & Tax Accountants</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('top')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'top'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top Endorsed</span>
          </button>
        </div>

        {/* In-discussion Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clauses, citations, or advice..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* 3. Reply / Comment Formulation Card */}
      <form 
        id="professional-comment-form"
        onSubmit={handleSubmitComment} 
        className="mb-10 bg-slate-50/80 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
            <h4 className="text-base font-bold text-slate-900">Contribute a Professional Opinion</h4>
          </div>
          {user ? (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Signed in as {user.displayName || user.email}
            </span>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" /> Sign in to Post
            </button>
          )}
        </div>

        {/* Inputs Grid */}
        <div className={user ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4" : "hidden"}>
          {/* Author Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Your Name & Title <span className="text-red-500">*</span>
            </label>
            <input 
              id="comment-author-name"
              type="text" 
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="e.g. Adv. Kazi Mahmud / S. Rahman, FCA"
            />
          </div>

          {/* Professional Role / Designation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Professional Designation <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="comment-professional-role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as ProfessionalRole)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none pr-8 cursor-pointer"
              >
                {PROFESSIONAL_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Firm or Organization */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Firm, Chamber, or Organization
            </label>
            <input 
              id="comment-author-org"
              type="text" 
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="e.g. Dhaka Taxes Bar / Rahman & Co."
            />
          </div>
        </div>

        {/* Row 2: Statutory Reference Citation & Topic Tag */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Statutory Provision / Section Cited (Optional)
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                id="comment-statutory-ref"
                type="text" 
                value={statutoryRef}
                onChange={(e) => setStatutoryRef(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="e.g. Income Tax Act 2023, Section 272(2)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Discussion Theme
            </label>
            <div className="relative">
              <select
                id="comment-topic-tag"
                value={topicTag}
                onChange={(e) => setTopicTag(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none pr-8 cursor-pointer"
              >
                {DISCUSSION_TOPIC_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Legal or Accounting Insight <span className="text-red-500">*</span>
          </label>
          <textarea 
            id="comment-text"
            rows={4}
            required
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y leading-relaxed" 
            placeholder="Provide constructive statutory analysis, audit practicalities, NBR tribunal observations, or corporate compliance procedures..."
          />
        </div>

        {/* Form Footer with Disclaimers & Submit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-200/60">
          <p className="text-[11px] text-slate-400 max-w-lg leading-tight">
            Contributions are shared for peer education & statutory discourse. Discussions do not create an attorney-client or auditor-client engagement.
          </p>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {showSuccessBadge && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-in fade-in">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Published to Discussion
              </span>
            )}
            <button 
              id="submit-comment-btn"
              type="submit" 
              disabled={isSubmitting}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Publishing..." : "Submit Opinion"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* 4. Comments Feed */}
      <div className="space-y-6">
        {filteredComments.length === 0 ? (
          <div id="no-comments-matching" className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No professional comments match the selected filter</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the filter or share the first viewpoint on this legal guide.</p>
            <button
              onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
              className="mt-3 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Show all comments
            </button>
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isEndorsed = endorsedCommentIds.has(comment.id);
            const replies = repliesByParent[comment.id] || [];

            return (
              <div 
                key={comment.id} 
                id={`comment-thread-${comment.id}`}
                className="border border-slate-100 rounded-3xl p-5 sm:p-6 bg-white hover:border-slate-200 transition-colors shadow-xs"
              >
                {/* Comment Author Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <img 
                      src={comment.avatar} 
                      alt={comment.authorName} 
                      className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 shrink-0 object-cover mt-0.5" 
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                          {comment.authorName}
                        </h4>
                        {renderRoleBadge(comment.role, comment.roleLabel)}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                        {comment.organization && (
                          <>
                            <span className="font-medium text-slate-600">{comment.organization}</span>
                            <span>&bull;</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(comment.date), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Topic tag badge */}
                  {comment.topicTag && (
                    <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      {comment.topicTag}
                    </span>
                  )}
                </div>

                {/* Statutory Reference Pill if provided */}
                {comment.statutoryRef && (
                  <div className="mb-3 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-900 text-xs px-2.5 py-1 rounded-lg">
                    <FileText className="w-3 h-3 text-amber-700 shrink-0" />
                    <span className="font-bold text-[11px]">Cited:</span>
                    <span className="font-mono text-[11px]">{comment.statutoryRef}</span>
                  </div>
                )}

                {/* Comment Content */}
                <div className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-line pl-0.5 font-normal">
                  {comment.text}
                </div>

                {/* Comment Action Footer: Endorse / Reply */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs font-bold">
                  <button 
                    id={`endorse-btn-${comment.id}`}
                    type="button"
                    onClick={() => handleToggleEndorse(comment.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isEndorsed 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                    }`}
                    title="Endorse as helpful legal/tax analysis"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isEndorsed ? 'fill-current text-emerald-600' : ''}`} />
                    <span>{isEndorsed ? 'Endorsed' : 'Endorse'} ({comment.helpfulCount})</span>
                  </button>

                  <button 
                    id={`reply-toggle-btn-${comment.id}`}
                    type="button"
                    onClick={() => {
                      setReplyingToId(replyingToId === comment.id ? null : comment.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply</span>
                    {replies.length > 0 && <span className="text-slate-400 font-normal">({replies.length})</span>}
                  </button>
                </div>

                {/* Inline Reply Form */}
                {replyingToId === comment.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl animate-in fade-in">
                    {!user ? (
                      <div className="text-center py-4">
                        <p className="text-sm font-medium text-slate-700 mb-3">You must be signed in to reply.</p>
                        <button
                          type="button"
                          onClick={signInWithGoogle}
                          className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <UserIcon className="w-3.5 h-3.5" /> Sign in with Google
                        </button>
                      </div>
                    ) : (<>
                    <div className="flex items-center gap-2 mb-3">
                      <CornerDownRight className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Reply to {comment.authorName}:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Role</label>
                        <select
                          value={replyRole}
                          onChange={(e) => setReplyRole(e.target.value as ProfessionalRole)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {PROFESSIONAL_ROLES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Affiliation / Firm</label>
                        <input
                          type="text"
                          value={replyOrganization}
                          onChange={(e) => setReplyOrganization(e.target.value)}
                          placeholder="e.g. Supreme Court Bar / ICAB"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Add your counterpoint, clarifying court holding, or accounting treatment..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y mb-3"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSubmittingReply || !replyText.trim()}
                        onClick={() => handlePostReply(comment.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isSubmittingReply ? "Posting..." : "Post Reply"}</span>
                      </button>
                    </div>
                    </>)}
                  </div>
                )}

                {/* Nested Replies Chain */}
                {replies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5 pl-3 sm:pl-6 border-l-2 border-l-emerald-200/60 ml-2">
                    {replies.map((reply) => {
                      const isReplyEndorsed = endorsedCommentIds.has(reply.id);

                      return (
                        <div key={reply.id} id={`reply-item-${reply.id}`} className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img 
                                src={reply.avatar} 
                                alt={reply.authorName} 
                                className="w-8 h-8 rounded-xl bg-white border border-slate-200 shrink-0 object-cover" 
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-xs text-slate-900 truncate">{reply.authorName}</span>
                                  {renderRoleBadge(reply.role, reply.roleLabel)}
                                </div>
                                {reply.organization && (
                                  <span className="text-[10px] text-slate-500 block">{reply.organization}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {format(new Date(reply.date), 'MMM d, h:mm a')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed pl-1 mb-2 font-normal">
                            {reply.text}
                          </p>

                          <div className="pl-1">
                            <button
                              type="button"
                              onClick={() => handleToggleEndorse(reply.id)}
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                                isReplyEndorsed ? 'text-emerald-700 bg-emerald-100/60' : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <ThumbsUp className={`w-3 h-3 ${isReplyEndorsed ? 'fill-current text-emerald-600' : ''}`} />
                              <span>{isReplyEndorsed ? 'Endorsed' : 'Helpful'} ({reply.helpfulCount})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
