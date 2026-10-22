import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Video,
  FileText,
  Presentation,
  HelpCircle,
  Lock,
  CheckCircle2,
  Clock,
  Award,
  ShieldCheck,
  User,
  BookOpen,
  ExternalLink,
  Edit3,
  Check,
  PlayCircle,
  FileCheck2,
  SlidersHorizontal,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Download,
  Plus,
  Trash2,
  LayoutDashboard,
  BookmarkCheck,
  MonitorPlay,
  Calendar,
  Users,
  MessageSquare,
  X
} from 'lucide-react';
import {
  useLms,
  ComputedLessonState,
  LmsCertificateRecord
} from '../contexts/LmsContext';
import { LearningMaterialMode } from './ClassLearningPage';
import { FinalExamModal } from '../components/lms/FinalExamModal';
import { LmsCertificateViewerModal } from '../components/lms/LmsCertificateViewerModal';
import { CourseCompletionCertificateCard } from '../components/lms/CourseCompletionCertificateCard';
import { StudentQuizLeaderboard } from '../components/lms/StudentQuizLeaderboard';
import { LearningMilestonesBadges } from '../components/lms/LearningMilestonesBadges';
import { ServiceSEO } from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { useShopAuth } from '../contexts/ShopAuthContext';

type PortalViewTab =
  | 'all'
  | 'live'
  | 'curriculum'
  | 'assessment'
  | 'milestones'
  | 'leaderboard'
  | 'notes';

type CurriculumFilterStatus = 'all' | 'active' | 'completed' | 'locked';

interface PersonalStudyNote {
  id: string;
  courseId: string;
  classTag: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface LiveSessionQuestion {
  id: string;
  studentName: string;
  classNumber: string;
  question: string;
  submittedAt: string;
  mentorReply: string;
}

const STUDY_NOTES_STORAGE_KEY = 'elaw_lms_personal_study_notes_v1';
const LIVE_ATTENDANCE_STORAGE_KEY = 'elaw_lms_live_attendance_v1';
const LIVE_QA_STORAGE_KEY = 'elaw_lms_live_qa_v2';

const LIVE_CLASS_DATES: string[] = [
  'Nov 24, 2026 · 8:30 PM BST',
  'Nov 27, 2026 · 8:30 PM BST',
  'Nov 30, 2026 · 8:30 PM BST',
  'Dec 01, 2026 · 8:30 PM BST',
  'Dec 03, 2026 · 8:30 PM BST',
  'Dec 06, 2026 · 8:30 PM BST',
  'Dec 07, 2026 · 8:30 PM BST',
  'Dec 10, 2026 · 8:30 PM BST',
  'Dec 13, 2026 · 8:30 PM BST',
  'Dec 14, 2026 · 8:30 PM BST'
];

const DEFAULT_STUDY_NOTES: PersonalStudyNote[] = [
  {
    id: 'note_seed_1',
    courseId: 'personal-income-tax',
    classTag: 'Class 01',
    title: 'ITA 2023 Assessment Year & Tax-Free Thresholds',
    content:
      'General individual tax-free threshold is BDT 3,50,000. Female taxpayers and senior citizens (65+) enjoy BDT 4,00,000. Minimum tax depends on city corporation location (BDT 5,000 / 4,000 / 3,000).',
    updatedAt: '2026-10-19'
  },
  {
    id: 'note_seed_2',
    courseId: 'personal-income-tax',
    classTag: 'Class 04',
    title: 'Investment Tax Rebate Formula (Section 78)',
    content:
      'Allowable rebate is the lowest of: (a) 3% of total taxable income (excluding exempt/reduced rate income), (b) 15% of eligible investment in DPS/Sanchaypatra/Listed Shares, or (c) BDT 10,00,000.',
    updatedAt: '2026-10-20'
  },
  {
    id: 'note_seed_3',
    courseId: 'rjsc-corporate-compliance',
    classTag: 'Class 02',
    title: 'RJSC Name Clearance & MOA Clauses',
    content:
      'Ensure proposed company name does not conflict with existing registered entities. Authorized vs Paid-up capital fee slabs must be verified before Form XII & MOA filing.',
    updatedAt: '2026-10-19'
  }
];

const DEFAULT_LIVE_QA: LiveSessionQuestion[] = [
  {
    id: 'qa_1',
    studentName: 'Barrister Nusrat Jahan',
    classNumber: '01',
    question: 'Does minimum tax apply when filing a Zero Return if total income is below the tax-free threshold?',
    submittedAt: 'Live Session Q&A',
    mentorReply:
      'If your taxable income is below the tax-free threshold (e.g., BDT 3,50,000), minimum tax does not apply; however, obtaining the Proof of Submission of Return (PSR) remains mandatory for specified services.'
  },
  {
    id: 'qa_2',
    studentName: 'Mahmudul Hasan, ACA',
    classNumber: '04',
    question: 'Will the salary exemption rule (one-third of gross salary or BDT 4,50,000) be demonstrated with practical examples during the live class?',
    submittedAt: 'Live Session Q&A',
    mentorReply:
      'Yes, in Live Class 04 we will walk through the complete salary and allowance calculation Excel worksheet via live screen-sharing.'
  }
];

export const StudentLearningPortalPage: React.FC<{
  autoOpenExam?: boolean;
}> = ({ autoOpenExam = false }) => {
  const {
    courseId: paramCourseId,
    certificateId: paramCertificateId
  } = useParams<{
    courseId?: string;
    certificateId?: string;
  }>();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { user, authUser } = useAuth();
  const { isAuthenticated: isShopAdminAuthenticated, adminUser } = useShopAuth();

  const isAuthorizedAdmin = useMemo(() => {
    const activeEmail = (
      adminUser?.email ||
      user?.email ||
      authUser?.email ||
      ''
    )
      .trim()
      .toLowerCase();
    if (isShopAdminAuthenticated && adminUser) {
      return true;
    }
    return activeEmail === 'hmekram@gmail.com';
  }, [isShopAdminAuthenticated, adminUser, user?.email, authUser?.email]);

  const {
    courses,
    activeCourseId,
    setActiveCourseId,
    activeCourse,
    studentProfile,
    updateStudentProfile,
    enrollInCourse,
    isEnrolledInCourse,
    getComputedLessonsForCourse,
    getCourseOverallProgress,
    getCertificateEligibility,
    ensureCertificateForEligibleStudent,
    allCertificates,
    loadDemoProgressPreset
  } = useLms();

  // Sync URL courseId parameter if provided
  useEffect(() => {
    if (
      paramCourseId &&
      paramCourseId !== activeCourseId &&
      courses.some((c) => c.courseId === paramCourseId)
    ) {
      setActiveCourseId(paramCourseId);
    }
  }, [paramCourseId, activeCourseId, courses, setActiveCourseId]);

  const computedLessons = useMemo(
    () => getComputedLessonsForCourse(activeCourse.courseId),
    [activeCourse.courseId, getComputedLessonsForCourse]
  );

  const overallProgress = useMemo(
    () => getCourseOverallProgress(activeCourse.courseId),
    [activeCourse.courseId, getCourseOverallProgress]
  );

  const eligibility = useMemo(
    () => getCertificateEligibility(activeCourse.courseId),
    [activeCourse.courseId, getCertificateEligibility]
  );

  // Portal workspace section filter (supports ?tab=live)
  const [activePortalTab, setActivePortalTab] = useState<PortalViewTab>(() => {
    const tab = searchParams.get('tab');
    if (
      tab === 'live' ||
      tab === 'curriculum' ||
      tab === 'assessment' ||
      tab === 'milestones' ||
      tab === 'leaderboard' ||
      tab === 'notes'
    ) {
      return tab;
    }
    return 'all';
  });

  // Live Class interactive states
  const [liveClassShowAll, setLiveClassShowAll] = useState(false);
  const [activeLiveClassroomIndex, setActiveLiveClassroomIndex] = useState<number | null>(null);
  const [liveAttendanceIds, setLiveAttendanceIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(LIVE_ATTENDANCE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { cls_01: true };
  });
  const [liveQuestions, setLiveQuestions] = useState<LiveSessionQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(LIVE_QA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_LIVE_QA;
  });
  const [newLiveQuestionText, setNewLiveQuestionText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(LIVE_ATTENDANCE_STORAGE_KEY, JSON.stringify(liveAttendanceIds));
    } catch {
      // ignore
    }
  }, [liveAttendanceIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LIVE_QA_STORAGE_KEY, JSON.stringify(liveQuestions));
    } catch {
      // ignore
    }
  }, [liveQuestions]);

  // Curriculum search & filter state
  const [curriculumStatusFilter, setCurriculumStatusFilter] =
    useState<CurriculumFilterStatus>('all');
  const [curriculumSearch, setCurriculumSearch] = useState('');
  const [expandedLessonIds, setExpandedLessonIds] = useState<Record<string, boolean>>({});

  // Student info inline edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(studentProfile.fullName);
  const [editEmail, setEditEmail] = useState(studentProfile.email);
  const [editPhone, setEditPhone] = useState(studentProfile.phone);

  useEffect(() => {
    setEditName(studentProfile.fullName);
    setEditEmail(studentProfile.email);
    setEditPhone(studentProfile.phone);
  }, [studentProfile.fullName, studentProfile.email, studentProfile.phone]);

  // Personal Study Notes state
  const [studyNotes, setStudyNotes] = useState<PersonalStudyNote[]>(() => {
    try {
      const saved = localStorage.getItem(STUDY_NOTES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_STUDY_NOTES;
  });
  const [newNoteClassTag, setNewNoteClassTag] = useState('Class 01');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STUDY_NOTES_STORAGE_KEY, JSON.stringify(studyNotes));
    } catch {
      // ignore storage errors
    }
  }, [studyNotes]);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [activeCertificateModal, setActiveCertificateModal] =
    useState<LmsCertificateRecord | null>(null);
  const [lockedAccessWarning, setLockedAccessWarning] = useState<string | null>(null);

  useEffect(() => {
    if (autoOpenExam && overallProgress.allMandatoryLessonsDone) {
      setIsExamModalOpen(true);
    }
  }, [autoOpenExam, overallProgress.allMandatoryLessonsDone]);

  useEffect(() => {
    if (paramCertificateId) {
      const found = allCertificates.find(
        (c) => c.certificateId.toUpperCase() === paramCertificateId.toUpperCase()
      );
      if (found) {
        setActiveCertificateModal(found);
      }
    }
  }, [paramCertificateId, allCertificates]);

  // Compute live academic KPIs for the 4-column summary strip
  const academicKpis = useMemo(() => {
    const totalClasses = computedLessons.length || 10;
    const videosCompleted = computedLessons.filter((l) => l.completionCriteria.videoMet).length;
    const notesCompleted = computedLessons.filter((l) => l.completionCriteria.notesMet).length;
    const pptViewedCount = computedLessons.filter((l) => l.progress.pptViewed).length;
    const passedQuizzes = computedLessons.filter((l) => l.progress.quizPassed);
    const quizzesPassedCount = passedQuizzes.length;

    const scoredQuizzes = computedLessons.filter(
      (l) => l.progress.quizPassed || l.progress.quizBestScore > 0
    );
    const avgQuizScore =
      scoredQuizzes.length > 0
        ? Math.round(
            scoredQuizzes.reduce((sum, l) => sum + l.progress.quizBestScore, 0) /
              scoredQuizzes.length
          )
        : 0;

    const perfectQuizzesCount = computedLessons.filter(
      (l) => l.progress.quizPassed && l.progress.quizBestScore === 100
    ).length;

    // Next active/available class for "Continue Learning" spotlight
    const activeLessonIndex = computedLessons.findIndex(
      (l) => l.status === 'in_progress' || l.status === 'available'
    );
    const nextActiveLesson =
      activeLessonIndex >= 0 ? computedLessons[activeLessonIndex] : null;

    // Count unlocked badges using the same thresholds as LearningMilestonesBadges
    const highMasteryCount = computedLessons.filter(
      (l) => l.progress.quizPassed && l.progress.quizBestScore >= 80
    ).length;
    const vatSlice = computedLessons.slice(3, 6);
    const vatPassed = vatSlice.filter((l) => l.progress.quizPassed).length;
    const vatAvg =
      vatSlice.some((l) => l.progress.quizBestScore > 0)
        ? Math.round(
            vatSlice.reduce((acc, l) => acc + l.progress.quizBestScore, 0) /
              (vatSlice.length || 1)
          )
        : 0;

    let unlockedBadgesCount = 0;
    if (quizzesPassedCount >= 1) unlockedBadgesCount++;
    if (quizzesPassedCount >= 3 && avgQuizScore >= 75) unlockedBadgesCount++;
    if (
      (vatPassed >= (vatSlice.length || 3) && vatAvg >= 80) ||
      (quizzesPassedCount >= 5 && avgQuizScore >= 80)
    )
      unlockedBadgesCount++;
    if (perfectQuizzesCount >= 1) unlockedBadgesCount++;
    if (quizzesPassedCount >= 7 && highMasteryCount >= 5) unlockedBadgesCount++;
    if (quizzesPassedCount >= totalClasses && avgQuizScore >= 80) unlockedBadgesCount++;
    if (
      quizzesPassedCount >= totalClasses &&
      eligibility.finalExamPassed &&
      eligibility.finalExamBestScore >= 85
    )
      unlockedBadgesCount++;
    if (eligibility.isFullyEligible) unlockedBadgesCount++;

    return {
      totalClasses,
      videosCompleted,
      notesCompleted,
      pptViewedCount,
      quizzesPassedCount,
      avgQuizScore,
      perfectQuizzesCount,
      activeLessonIndex: activeLessonIndex >= 0 ? activeLessonIndex : 0,
      nextActiveLesson,
      unlockedBadgesCount
    };
  }, [computedLessons, eligibility]);

  // Filtered curriculum list
  const filteredLessons = useMemo(() => {
    return computedLessons
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => {
        if (curriculumStatusFilter === 'active') {
          return item.status === 'available' || item.status === 'in_progress';
        }
        if (curriculumStatusFilter === 'completed') {
          return item.status === 'completed';
        }
        if (curriculumStatusFilter === 'locked') {
          return item.status === 'locked';
        }
        return true;
      })
      .filter(({ item }) => {
        if (!curriculumSearch.trim()) return true;
        const q = curriculumSearch.toLowerCase();
        const inHeading = item.lesson.heading.toLowerCase().includes(q);
        const inDesc = item.lesson.description.toLowerCase().includes(q);
        const inClassNum = item.lesson.classNumber.toLowerCase().includes(q);
        const inTopics = item.lesson.videoAsset.keyTopics.some((t) =>
          t.toLowerCase().includes(q)
        );
        return inHeading || inDesc || inClassNum || inTopics;
      });
  }, [computedLessons, curriculumStatusFilter, curriculumSearch]);

  const courseStudyNotes = useMemo(
    () => studyNotes.filter((n) => n.courseId === activeCourse.courseId),
    [studyNotes, activeCourse.courseId]
  );

  const displayedLiveClasses = useMemo(() => {
    const mapped = computedLessons.map((item, index) => ({
      item,
      index,
      liveDateLabel: LIVE_CLASS_DATES[index] || 'Upcoming Schedule · 8:30 PM BST'
    }));
    return liveClassShowAll ? mapped : mapped.slice(0, 4);
  }, [computedLessons, liveClassShowAll]);

  const toggleLessonOutline = (lessonId: string) => {
    setExpandedLessonIds((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const handleOpenLessonMaterial = (index: number, mode: LearningMaterialMode) => {
    const target = computedLessons[index];
    if (!target) return;
    if (target.status === 'locked') {
      setLockedAccessWarning(
        target.lockReason ||
          `Class ${target.lesson.classNumber} is locked. Complete the previous class and validate in Firestore first.`
      );
      return;
    }
    setLockedAccessWarning(null);
    navigate(
      `/student/course/${activeCourse.courseId}/lesson/${target.lesson.lessonId}/${mode}`
    );
  };

  const handleMarkLiveAttendance = (lessonId: string) => {
    setLiveAttendanceIds((prev) => ({
      ...prev,
      [lessonId]: true
    }));
  };

  const handleSubmitLiveQuestion = (e: React.FormEvent, classNumber: string) => {
    e.preventDefault();
    if (!newLiveQuestionText.trim()) return;
    const created: LiveSessionQuestion = {
      id: `qa_${Date.now()}`,
      studentName: studentProfile.fullName,
      classNumber,
      question: newLiveQuestionText.trim(),
      submittedAt: 'Just now · Live Classroom',
      mentorReply:
        'Your question has been logged at the Mentor Desk. Advocate Ekram Hossain will address it directly during the live Q&A segment.'
    };
    setLiveQuestions((prev) => [created, ...prev]);
    setNewLiveQuestionText('');
  };

  const handleSaveStudentInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateStudentProfile({
      fullName: editName.trim(),
      email: editEmail.trim() || studentProfile.email,
      phone: editPhone.trim() || studentProfile.phone
    });
    setIsEditingProfile(false);
  };

  const handleDownloadOrOpenCertificate = () => {
    const cert = ensureCertificateForEligibleStudent(activeCourse.courseId);
    if (cert) {
      setActiveCertificateModal(cert);
    }
  };

  const handleAddStudyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    const created: PersonalStudyNote = {
      id: `note_${Date.now()}`,
      courseId: activeCourse.courseId,
      classTag: newNoteClassTag,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setStudyNotes((prev) => [created, ...prev]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleDeleteStudyNote = (id: string) => {
    setStudyNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleExportStudyNotes = () => {
    const lines = [
      `STUDY NOTES & STATUTORY REVISION SUMMARY`,
      `Student: ${studentProfile.fullName} (${studentProfile.studentId})`,
      `Course: ${activeCourse.title}`,
      `Exported: ${new Date().toISOString().slice(0, 10)}`,
      `====================================================================`,
      ''
    ];
    courseStudyNotes.forEach((n, idx) => {
      lines.push(`${idx + 1}. [${n.classTag}] ${n.title} (${n.updatedAt})`);
      lines.push(`   ${n.content}`);
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCourse.courseId}-study-notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStatusText = (state: ComputedLessonState) => {
    switch (state.status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>In Progress</span>
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <PlayCircle className="w-4 h-4 text-emerald-600" />
            <span>Available</span>
          </span>
        );
      case 'locked':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Locked</span>
          </span>
        );
    }
  };

  const enrolled = isEnrolledInCourse(activeCourse.courseId);
  const activeLiveLessonItem =
    activeLiveClassroomIndex !== null ? computedLessons[activeLiveClassroomIndex] : null;

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <ServiceSEO
        title={`${activeCourse.title} | Student Learning Portal`}
        description="Interactive Student Learning Portal for live classes, video lectures, class notes, presentation slides, module quizzes, final examination, and verifiable course certification."
        serviceType="Online Learning Management System"
        canonicalUrl="/student/dashboard"
      />

      {/* Top Portal Navigation & Course Selector Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Enrolled Learner</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{studentProfile.studentId}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">
              {activeCourse.programTag}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Welcome back, {studentProfile.fullName}
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Join interactive Live Classes, track sequential class mastery, complete statutory quizzes, and earn your verifiable credential.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Course Switcher */}
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl">
            {courses.map((c) => {
              const isSelected = c.courseId === activeCourse.courseId;
              return (
                <button
                  key={c.courseId}
                  type="button"
                  onClick={() => {
                    setActiveCourseId(c.courseId);
                    navigate(`/student/course/${c.courseId}`);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c.courseId === 'personal-income-tax'
                    ? 'Income Tax Masterclass'
                    : 'RJSC Corporate Compliance'}
                </button>
              );
            })}
          </div>

          <Link
            to="/dashboard"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
            <span>Client Dashboard</span>
          </Link>

          <Link
            to="/verify-certificate"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verify Certificate</span>
          </Link>

          {isAuthorizedAdmin && (
            <Link
              to="/admin/dashboard"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin LMS Panel</span>
            </Link>
          )}
        </div>
      </div>

      {/* Section 1: Student Information & Your Purchased Course (2-Column Balanced Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Student Information Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Student Information</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile((v) => !v)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveStudentInfo} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Full Name (Appears on Certificate)
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Student Details</span>
                </button>
              </form>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Full Name</dt>
                  <dd className="font-bold text-slate-900 mt-0.5">{studentProfile.fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Student ID</dt>
                  <dd className="font-mono tabular-nums font-bold text-emerald-700 mt-0.5">
                    {studentProfile.studentId}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Email Address</dt>
                  <dd className="font-medium text-slate-800 mt-0.5 break-all">
                    {studentProfile.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Mobile Number</dt>
                  <dd className="font-mono tabular-nums font-medium text-slate-800 mt-0.5">
                    {studentProfile.phone}
                  </dd>
                </div>
              </dl>
            )}
          </div>

          <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Account Status · Verified Learner</span>
            <Link to="/shop" className="font-semibold text-emerald-700 hover:underline">
              Browse Course Store
            </Link>
          </div>
        </div>

        {/* Your Purchased Course Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-emerald-700 tracking-wider">
                {activeCourse.programTag}
              </div>
              <div className="text-xs text-slate-500">
                <span>Live Classes</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>10 Modules</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>Quizzes &amp; Final Exam</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {activeCourse.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {activeCourse.description}
              </p>
            </div>

            {/* Overall Progress Meter */}
            <div className="pt-2 space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Overall Progress</span>
                  <span className="text-slate-300" aria-hidden="true">·</span>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {overallProgress.completedCount} of {overallProgress.totalCount} classes completed
                  </span>
                  {overallProgress.percent === 100 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>100% Completed · Certificate Ready</span>
                    </span>
                  )}
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-700">
                  {overallProgress.percent}%
                </div>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${overallProgress.percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Progress Testing & Resume Controls */}
          <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            {!enrolled ? (
              <button
                type="button"
                onClick={() => enrollInCourse(activeCourse.courseId)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                Activate Course Enrollment
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  Quick Progress Presets:
                </span>
                <button
                  type="button"
                  onClick={() => loadDemoProgressPreset(activeCourse.courseId, '60_percent')}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer whitespace-nowrap shrink-0"
                >
                  6 of 10 Classes (65%)
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoProgressPreset(activeCourse.courseId, 'ready_for_exam')}
                  className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 cursor-pointer whitespace-nowrap shrink-0"
                >
                  100% Course Completion (Unlock Certificate)
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoProgressPreset(activeCourse.courseId, 'reset')}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-500 cursor-pointer whitespace-nowrap shrink-0"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4-Column Academic KPI Strip (Full-Width Row Below Hero Split) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Classes Completed</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {overallProgress.completedCount} / {overallProgress.totalCount}
            </span>
            <span className="text-xs font-mono tabular-nums font-bold text-emerald-700">
              {overallProgress.percent}%
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono tabular-nums">
            <span>{academicKpis.videosCompleted}/10 Videos</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>{academicKpis.notesCompleted}/10 Notes</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Quiz Mastery Score</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {academicKpis.avgQuizScore}%
            </span>
            <span className="text-xs font-mono tabular-nums font-semibold text-slate-600">
              {academicKpis.quizzesPassedCount}/10 Passed
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono tabular-nums">
            <span>{academicKpis.perfectQuizzesCount} Perfect (100%)</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>Pass mark: 70%+</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Earned Mastery Badges</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {academicKpis.unlockedBadgesCount} / 8
            </span>
            <button
              type="button"
              onClick={() => setActivePortalTab('milestones')}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              View Badges
            </button>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Includes Tax Expert &amp; VAT Pro tiers</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Final Exam &amp; Credential</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {eligibility.finalExamPassed
                ? `${eligibility.finalExamBestScore}%`
                : overallProgress.allMandatoryLessonsDone
                ? 'Ready'
                : 'Locked'}
            </span>
            <span
              className={`text-xs font-bold ${
                eligibility.isFullyEligible ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {eligibility.isFullyEligible ? 'Certified' : 'In Progress'}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono tabular-nums">
            <span>
              {eligibility.certificate
                ? eligibility.certificate.certificateId
                : `Exam Pass Target: ${activeCourse.finalExam.passingScore}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Workspace View Selector Bar — Includes the new Live Class Option */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
          {(
            [
              { id: 'all', label: 'All Portal Sections' },
              { id: 'live', label: 'Live Class' },
              { id: 'curriculum', label: 'Curriculum (10 Classes)' },
              { id: 'assessment', label: 'Final Exam & Certificate' },
              { id: 'milestones', label: `Mastery Badges (${academicKpis.unlockedBadgesCount}/8)` },
              { id: 'leaderboard', label: 'Cohort Leaderboard' },
              { id: 'notes', label: `Study Notes (${courseStudyNotes.length})` }
            ] as { id: PortalViewTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePortalTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activePortalTab === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          <span>Course ID: {activeCourse.courseId}</span>
        </div>
      </div>

      {/* Certificate Generation & 100% Course Completion Banner */}
      {(activePortalTab === 'all' || activePortalTab === 'assessment') && (
        <CourseCompletionCertificateCard
          course={activeCourse}
          studentProfile={studentProfile}
          completionPercent={overallProgress.percent}
          completedClassesCount={overallProgress.completedCount}
          totalClassesCount={overallProgress.totalCount}
          certificate={eligibility.certificate}
          onEnsureCertificate={() => ensureCertificateForEligibleStudent(activeCourse.courseId)}
          onOpenPreviewModal={(cert) => setActiveCertificateModal(cert)}
          onTriggerDemoCompleteAll={() =>
            loadDemoProgressPreset(activeCourse.courseId, 'ready_for_exam')
          }
        />
      )}

      {/* NEW SECTION: Live Class — Placed directly above Course Curriculum */}
      {(activePortalTab === 'all' || activePortalTab === 'live') && (
        <section id="student-live-classes" className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-700 tracking-wider mb-1">
                LIVE CLASS · INTERACTIVE LIVE CLASSROOM
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Live Class — Interactive Online Sessions &amp; Mentor Q&amp;A
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Join scheduled live classes, participate in real-time Q&amp;A sessions with your instructor, and complete class recordings, statutory notes, and quizzes after each session.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveLiveClassroomIndex(academicKpis.activeLessonIndex)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <MonitorPlay className="w-4 h-4" />
                <span>Join Active Live Class Room</span>
              </button>
              <button
                type="button"
                onClick={() => setLiveClassShowAll((v) => !v)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer whitespace-nowrap shrink-0"
              >
                {liveClassShowAll ? 'Show Top 4 Live Classes' : 'View All 10 Live Schedules'}
              </button>
            </div>
          </div>

          {/* Featured Next Live Session Banner */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-semibold">
                <MonitorPlay className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live Class Stream Room (Interactive Session)</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-slate-300">
                  {LIVE_CLASS_DATES[academicKpis.activeLessonIndex] || '8:30 PM – 10:30 PM BST'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">
                  Instructor: {computedLessons[academicKpis.activeLessonIndex]?.lesson.videoAsset.instructor || 'Adv. Ekram Hossain'}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white">
                Live Class {computedLessons[academicKpis.activeLessonIndex]?.lesson.classNumber || '01'}:{' '}
                {computedLessons[academicKpis.activeLessonIndex]?.lesson.heading}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Each live session features practical case studies, statutory section breakdowns, and hands-on training via live screen-sharing, with direct mentor Q&amp;A throughout the class.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveLiveClassroomIndex(academicKpis.activeLessonIndex)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Video className="w-4 h-4" />
                <span>Join Live Class Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleMarkLiveAttendance(
                    computedLessons[academicKpis.activeLessonIndex]?.lesson.lessonId || 'cls_01'
                  )
                }
                className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {liveAttendanceIds[
                    computedLessons[academicKpis.activeLessonIndex]?.lesson.lessonId || 'cls_01'
                  ]
                    ? 'Attendance Verified ✓'
                    : 'Mark Live Attendance'}
                </span>
              </button>
            </div>
          </div>

          {/* Live Classes Card Grid (Matching Course Curriculum Visual Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayedLiveClasses.map(({ item, index, liveDateLabel }) => {
              const { lesson, progress, status } = item;
              const isLocked = status === 'locked';
              const isAttended = Boolean(liveAttendanceIds[lesson.lessonId]);

              return (
                <div
                  key={`live_${lesson.lessonId}`}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between transition-colors hover:border-emerald-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-700">
                          {lesson.classNumber}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-emerald-700 tracking-wider">
                            <span>LIVE {lesson.label}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums text-slate-500">
                              {liveDateLabel}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                            {lesson.heading}
                          </h3>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isAttended || status === 'completed' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Live Joined</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span>Live Scheduled</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {lesson.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="text-slate-700 font-semibold">
                        Mentor: {lesson.videoAsset.instructor}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Duration: {lesson.videoAsset.durationLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={isAttended ? 'text-emerald-700 font-semibold' : ''}>
                        Attendance: {isAttended ? 'Present ✓' : 'Open'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons for Live Class Card */}
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveLiveClassroomIndex(index)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <MonitorPlay className="w-3.5 h-3.5 shrink-0" />
                        <span>Join Live</span>
                      </button>

                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleOpenLessonMaterial(index, 'video')}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 ${
                          isLocked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 cursor-pointer'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5 shrink-0" />
                        <span>Recording</span>
                      </button>

                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleOpenLessonMaterial(index, 'notes')}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 ${
                          isLocked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 cursor-pointer'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span>Live Notes</span>
                      </button>

                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => handleOpenLessonMaterial(index, 'quiz')}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 ${
                          isLocked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : progress.quizPassed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 cursor-pointer'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Live Quiz</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 2: Course Curriculum (Classes 01 to 10) */}
      {(activePortalTab === 'all' || activePortalTab === 'curriculum') && (
        <section className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Course Curriculum
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Strict sequential progression: Each class unlocks only after the previous class’s Video Lesson, Class Notes checkpoints, and Class Quiz are completed and validated in Firestore.
              </p>
            </div>

            {/* Curriculum Filter & Search Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={curriculumSearch}
                  onChange={(e) => setCurriculumSearch(e.target.value)}
                  placeholder="Search classes or topics..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-emerald-600 w-48 sm:w-56"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
                {(
                  [
                    { id: 'all', label: 'All (10)' },
                    { id: 'active', label: 'Active' },
                    { id: 'completed', label: `Done (${overallProgress.completedCount})` },
                    { id: 'locked', label: 'Locked' }
                  ] as { id: CurriculumFilterStatus; label: string }[]
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCurriculumStatusFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      curriculumStatusFilter === f.id
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {lockedAccessWarning && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{lockedAccessWarning}</span>
              </div>
              <button
                type="button"
                onClick={() => setLockedAccessWarning(null)}
                className="text-xs font-bold text-amber-800 hover:underline shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {filteredLessons.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-800">
                No classes match your current filter or search query.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurriculumStatusFilter('all');
                  setCurriculumSearch('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Reset Curriculum Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredLessons.map(({ item, originalIndex }) => {
                const {
                  lesson,
                  progress,
                  status,
                  lockReason,
                  lessonCompletionPercent,
                  completionCriteria
                } = item;
                const isLocked = status === 'locked';
                const isExpanded = Boolean(expandedLessonIds[lesson.lessonId]);

                return (
                  <div
                    key={lesson.lessonId}
                    className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-colors ${
                      status === 'completed'
                        ? 'border-emerald-300'
                        : status === 'in_progress'
                        ? 'border-amber-300'
                        : status === 'available'
                        ? 'border-slate-300'
                        : 'border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Row: Number, Class Label & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
                            {lesson.classNumber}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wider">
                              <span>{lesson.label}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums text-slate-600">
                                {lesson.videoAsset.durationLabel}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                              {lesson.heading}
                            </h3>
                          </div>
                        </div>

                        <div className="shrink-0">{renderStatusText(item)}</div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {lesson.description}
                      </p>

                      {/* Individual Lesson Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Class Completion</span>
                          <span className="font-mono tabular-nums font-bold text-slate-800">
                            {lessonCompletionPercent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              status === 'completed'
                                ? 'bg-emerald-600'
                                : status === 'in_progress'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${lessonCompletionPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Individual Material Completion Status Row (Unboxed Typography with · separators) */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span
                          className={
                            completionCriteria.videoMet ? 'text-emerald-700 font-semibold' : ''
                          }
                        >
                          Video:{' '}
                          {completionCriteria.videoMet
                            ? 'Completed ✓'
                            : `${progress.videoWatchPercent}%`}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            completionCriteria.notesMet ? 'text-emerald-700 font-semibold' : ''
                          }
                        >
                          Notes:{' '}
                          {completionCriteria.notesMet
                            ? 'Completed ✓'
                            : `${progress.notesSectionsRead.length}/${lesson.notesAsset.sections.length}`}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={progress.pptViewed ? 'text-slate-800 font-medium' : ''}
                        >
                          PPT: {progress.pptViewed ? 'Viewed' : `${lesson.pptAsset.slides.length} Slides`}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            completionCriteria.quizMet ? 'text-emerald-700 font-semibold' : ''
                          }
                        >
                          Quiz:{' '}
                          {completionCriteria.quizMet
                            ? `Passed (${progress.quizBestScore}%) ✓`
                            : `Pass ${lesson.quizConfig.passingScore}%`}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            completionCriteria.firestoreValidated
                              ? 'text-emerald-700 font-semibold'
                              : 'text-slate-400'
                          }
                        >
                          Firestore: {completionCriteria.firestoreValidated ? 'Verified' : 'Pending'}
                        </span>
                      </div>

                      {/* Expandable Syllabus Outline Toggle */}
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleLessonOutline(lesson.lessonId)}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" />
                              <span>Hide Class Syllabus &amp; Statutory Topics</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" />
                              <span>
                                Inspect Class Syllabus ({lesson.videoAsset.chapters.length} Chapters ·{' '}
                                {lesson.notesAsset.sections.length} Statutory Notes ·{' '}
                                {lesson.quizConfig.questions.length} Quiz Qs)
                              </span>
                            </>
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                            <div>
                              <div className="font-bold text-slate-800 mb-1">
                                Video Lecture Chapters ({lesson.videoAsset.instructor})
                              </div>
                              <ul className="space-y-1">
                                {lesson.videoAsset.chapters.map((ch) => (
                                  <li key={ch.id} className="flex items-baseline justify-between gap-2">
                                    <span className="text-slate-700">{ch.title}</span>
                                    <span className="font-mono tabular-nums text-slate-400 shrink-0">
                                      {ch.timestampLabel}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                              <div className="font-bold text-slate-800 mb-1">
                                Class Notes Statutory References ({lesson.notesAsset.readingTimeMinutes} min read)
                              </div>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-600">
                                {lesson.notesAsset.sections.map((sec, sIdx) => (
                                  <React.Fragment key={sec.id}>
                                    {sIdx > 0 && <span aria-hidden="true">·</span>}
                                    <span>
                                      {sec.heading} ({sec.statutoryRef})
                                    </span>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {isLocked && lockReason && (
                        <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lockReason}</span>
                        </div>
                      )}
                    </div>

                    {/* Four Action Buttons: Watch Video | Read Notes | View PPT | Take Quiz */}
                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          disabled={isLocked}
                          onClick={() => handleOpenLessonMaterial(originalIndex, 'video')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 ${
                            isLocked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : progress.videoCompleted
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                              : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 cursor-pointer'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span>Watch Video</span>
                        </button>

                        <button
                          type="button"
                          disabled={isLocked}
                          onClick={() => handleOpenLessonMaterial(originalIndex, 'notes')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 ${
                            isLocked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : progress.notesCompleted
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span>Read Notes</span>
                        </button>

                        <button
                          type="button"
                          disabled={isLocked}
                          onClick={() => handleOpenLessonMaterial(originalIndex, 'ppt')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 ${
                            isLocked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          <Presentation className="w-3.5 h-3.5 shrink-0" />
                          <span>View PPT</span>
                        </button>

                        <button
                          type="button"
                          disabled={isLocked}
                          onClick={() => handleOpenLessonMaterial(originalIndex, 'quiz')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 ${
                            isLocked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : progress.quizPassed
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Take Quiz</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Each option opens its corresponding learning material on a dedicated class learning page.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Section 3: Final Assessment & Certificate Eligibility Checklist */}
      {(activePortalTab === 'all' || activePortalTab === 'assessment') && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Final Assessment Cards (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Final Examination Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Final Assessment</span>
                  {overallProgress.allMandatoryLessonsDone ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900">Final Examination</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Available after all required classes and quizzes are completed. Passing criterion:{' '}
                  <span className="font-mono tabular-nums font-semibold">
                    {activeCourse.finalExam.passingScore}%
                  </span>{' '}
                  ({activeCourse.finalExam.timeLimitMinutes} minutes).
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!overallProgress.allMandatoryLessonsDone}
                  onClick={() => setIsExamModalOpen(true)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    overallProgress.allMandatoryLessonsDone
                      ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  {overallProgress.allMandatoryLessonsDone ? (
                    <>
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      <span>
                        {eligibility.finalExamPassed
                          ? `Passed (${eligibility.finalExamBestScore}%) — Retake or Review Exam`
                          : 'Start Final Examination'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Complete All 10 Classes to Unlock ({overallProgress.completedCount}/10)
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Course Certificate Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Official Credential</span>
                  {eligibility.isFullyEligible ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900">Course Certificate</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Complete all course requirements and pass the final examination to unlock your certificate.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!eligibility.isFullyEligible}
                  onClick={handleDownloadOrOpenCertificate}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    eligibility.isFullyEligible
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>
                    {eligibility.isFullyEligible && eligibility.certificate
                      ? `Download Certificate (${eligibility.certificate.certificateId})`
                      : 'Locked until eligible'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Certificate Eligibility Checklist (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3.5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Certificate Eligibility Checklist
                  </h2>
                  <p className="text-xs text-slate-500">
                    All five verification checkpoints must be satisfied before certificate download is enabled.
                  </p>
                </div>
                <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  {
                    title: 'All 10 classes completed',
                    subtitle: `Mandatory video lectures and class notes completed for every class (${eligibility.completedClassesCount}/${eligibility.totalClassesCount})`,
                    passed: eligibility.allClassesCompleted
                  },
                  {
                    title: 'All required quizzes completed',
                    subtitle: `Mandatory quiz requirements met across all 10 classes (${eligibility.completedQuizzesCount}/${eligibility.requiredQuizzesCount})`,
                    passed: eligibility.allQuizzesCompleted
                  },
                  {
                    title: 'Final examination passed',
                    subtitle: `Achieved the required passing score (${activeCourse.finalExam.passingScore}%)${
                      eligibility.finalExamBestScore > 0
                        ? ` · Best Score: ${eligibility.finalExamBestScore}%`
                        : ''
                    }`,
                    passed: eligibility.finalExamPassed
                  },
                  {
                    title: 'Enrollment and purchase validated',
                    subtitle: 'Active course enrollment verified',
                    passed: eligibility.enrollmentValidated
                  },
                  {
                    title: 'Certificate issued',
                    subtitle: eligibility.certificate
                      ? `Official certificate record generated (${eligibility.certificate.certificateId})`
                      : 'Official certificate record generated in backend',
                    passed: eligibility.certificateIssued
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500">{item.subtitle}</div>
                    </div>

                    <div className="shrink-0">
                      {item.passed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <Lock className="w-4 h-4 text-slate-400" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                The download button unlocks automatically once all five checkpoints are verified.
              </div>

              <button
                type="button"
                disabled={!eligibility.isFullyEligible}
                onClick={handleDownloadOrOpenCertificate}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  eligibility.isFullyEligible
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>
                  {eligibility.isFullyEligible ? 'Download Certificate' : 'Locked until eligible'}
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Learning Milestones & Virtual Mastery Badges */}
      {(activePortalTab === 'all' || activePortalTab === 'milestones') && (
        <LearningMilestonesBadges
          course={activeCourse}
          studentProfile={studentProfile}
          computedLessons={computedLessons}
          eligibility={eligibility}
          onStartLessonQuiz={(lessonIndex) => handleOpenLessonMaterial(lessonIndex, 'quiz')}
          onOpenFinalExam={() => setIsExamModalOpen(true)}
        />
      )}

      {/* Section 5: Student Quiz Completion Leaderboard */}
      {(activePortalTab === 'all' || activePortalTab === 'leaderboard') && (
        <StudentQuizLeaderboard
          course={activeCourse}
          studentProfile={studentProfile}
          computedLessons={computedLessons}
          eligibility={eligibility}
        />
      )}

      {/* Section 6: Personal Study Scratchpad & Statutory Revision Notes */}
      {(activePortalTab === 'all' || activePortalTab === 'notes') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <span>Personal Study Planner &amp; Revision Scratchpad</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Statutory Key Takeaways &amp; Exam Prep Notes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Save important section numbers, tax slab calculations, or compliance checklists while watching classes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportStudyNotes}
              disabled={courseStudyNotes.length === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Notes (.txt)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Add Note Form (5 Cols) */}
            <form
              onSubmit={handleAddStudyNote}
              className="lg:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3.5"
            >
              <div className="text-sm font-bold text-slate-900">Add New Study Note</div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Class Reference
                </label>
                <select
                  value={newNoteClassTag}
                  onChange={(e) => setNewNoteClassTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  {computedLessons.map((l) => (
                    <option key={l.lesson.lessonId} value={`Class ${l.lesson.classNumber}`}>
                      Class {l.lesson.classNumber}: {l.lesson.heading}
                    </option>
                  ))}
                  <option value="Final Exam Prep">Final Exam Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Topic / Statutory Section Title
                </label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g., Section 78 Investment Rebate Limit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Revision Note &amp; Key Formula
                </label>
                <textarea
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write key statutory rules, calculation steps, or exam reminders..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Save Study Note</span>
              </button>
            </form>

            {/* Saved Notes List (7 Cols) */}
            <div className="lg:col-span-7 divide-y divide-slate-100">
              {courseStudyNotes.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-700">
                    No study notes recorded for this course yet.
                  </p>
                  <p className="text-xs text-slate-500">
                    Use the form on the left to bookmark statutory citations and exam formulas.
                  </p>
                </div>
              ) : (
                courseStudyNotes.map((note) => (
                  <div
                    key={note.id}
                    className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-emerald-700">{note.classTag}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{note.updatedAt}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{note.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {note.content}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteStudyNote(note.id)}
                      aria-label="Delete study note"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Interactive Live Classroom & Mentor Q&A Modal */}
      {activeLiveLessonItem && activeLiveClassroomIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <MonitorPlay className="w-4 h-4 text-emerald-600" />
                  <span>LIVE CLASSROOM · CLASS {activeLiveLessonItem.lesson.classNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-slate-500">
                    {LIVE_CLASS_DATES[activeLiveClassroomIndex] || '8:30 PM BST'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {activeLiveLessonItem.lesson.heading}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instructor: {activeLiveLessonItem.lesson.videoAsset.instructor} · Duration:{' '}
                  {activeLiveLessonItem.lesson.videoAsset.durationLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveLiveClassroomIndex(null)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Stream Stage & Attendance Control */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-400">
                    Interactive Live Classroom Session
                  </div>
                  <div className="text-sm sm:text-base font-bold">
                    {activeCourse.title} — Live Batch Session
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleMarkLiveAttendance(activeLiveLessonItem.lesson.lessonId)
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {liveAttendanceIds[activeLiveLessonItem.lesson.lessonId]
                      ? 'Live Attendance Confirmed ✓'
                      : 'Confirm Live Attendance'}
                  </span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeLiveLessonItem.lesson.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const idx = activeLiveClassroomIndex;
                    setActiveLiveClassroomIndex(null);
                    handleOpenLessonMaterial(idx, 'video');
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open Class Video Stream</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const idx = activeLiveClassroomIndex;
                    setActiveLiveClassroomIndex(null);
                    handleOpenLessonMaterial(idx, 'notes');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Live Class Notes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const idx = activeLiveClassroomIndex;
                    setActiveLiveClassroomIndex(null);
                    handleOpenLessonMaterial(idx, 'ppt');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Presentation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Presentation Deck</span>
                </button>
              </div>
            </div>

            {/* Live Mentor Q&A Desk */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Live Class Mentor Q&amp;A Desk</span>
                </h4>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  {liveQuestions.length} Questions
                </span>
              </div>

              <form
                onSubmit={(e) =>
                  handleSubmitLiveQuestion(e, activeLiveLessonItem.lesson.classNumber)
                }
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={newLiveQuestionText}
                  onChange={(e) => setNewLiveQuestionText(e.target.value)}
                  placeholder="Ask a question about this live class topic..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
                >
                  Submit Live Question
                </button>
              </form>

              <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto pr-1">
                {liveQuestions.map((q) => (
                  <div key={q.id} className="py-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold text-slate-800">
                        {q.studentName} · Class {q.classNumber}
                      </span>
                      <span>{q.submittedAt}</span>
                    </div>
                    <p className="text-slate-900 font-medium">{q.question}</p>
                    <p className="text-emerald-800 bg-emerald-50/70 px-3 py-1.5 rounded-lg border border-emerald-100">
                      <strong>Mentor Reply:</strong> {q.mentorReply}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Examination Modal */}
      <FinalExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        course={activeCourse}
        onOpenCertificate={(cert) => setActiveCertificateModal(cert)}
      />

      {/* Official Certificate Viewer & PDF Generator Modal */}
      <LmsCertificateViewerModal
        isOpen={activeCertificateModal !== null}
        onClose={() => setActiveCertificateModal(null)}
        certificate={activeCertificateModal}
      />
    </div>
  );
};
