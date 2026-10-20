import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  SlidersHorizontal
} from 'lucide-react';
import {
  useLms,
  ComputedLessonState,
  LmsCertificateRecord
} from '../contexts/LmsContext';
import { LearningMaterialMode } from './ClassLearningPage';
import { FinalExamModal } from '../components/lms/FinalExamModal';
import { LmsCertificateViewerModal } from '../components/lms/LmsCertificateViewerModal';
import { ServiceSEO } from '../components/SEO';

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

  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <ServiceSEO
        title={`${activeCourse.title} | Student Learning Portal`}
        description="Interactive Student Learning Portal for video lectures, class notes, presentation slides, module quizzes, final examination, and verifiable course certification."
        serviceType="Online Learning Management System"
        canonicalUrl="/student/dashboard"
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Portal Navigation & Course Selector Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Enrolled</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{studentProfile.studentId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Welcome back, {studentProfile.fullName}!
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Your learning journey continues here.
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
              to="/verify-certificate"
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Certificate</span>
            </Link>

            <Link
              to="/admin/dashboard"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin LMS Panel</span>
            </Link>
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
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
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
              <span>Account Status: Verified Learner</span>
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
                  <span>10 Classes</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>Quizzes</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>Final Examination</span>
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
                  <div>
                    <span className="text-xs font-bold text-slate-700">Overall Progress</span>
                    <span className="mx-2 text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-mono tabular-nums">
                      {overallProgress.completedCount} of {overallProgress.totalCount} classes completed
                    </span>
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
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
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
                  >
                    6 of 10 Classes (65%)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadDemoProgressPreset(activeCourse.courseId, 'ready_for_exam')}
                    className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 cursor-pointer"
                  >
                    Complete All 10 Classes (Unlock Final Exam)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadDemoProgressPreset(activeCourse.courseId, 'reset')}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-500 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Course Curriculum (Classes 01 to 10) */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Course Curriculum
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Strict sequential progression: Each class unlocks only after the previous class’s Video Lesson, Class Notes checkpoints, and Class Quiz are completed and validated in Firestore.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono tabular-nums">
              Showing Classes 01 – 10
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {computedLessons.map((item, index) => {
              const { lesson, progress, status, lockReason, completionCriteria } = item;
              const isLocked = status === 'locked';

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
                          <div className="text-xs font-bold text-slate-500 tracking-wider">
                            {lesson.label}
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

                    {/* Individual Material Completion Status Row (Unboxed Typography with · separators) */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <span className={completionCriteria.videoMet ? 'text-emerald-700 font-semibold' : ''}>
                        Video: {completionCriteria.videoMet ? 'Completed ✓' : `${progress.videoWatchPercent}%`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={completionCriteria.notesMet ? 'text-emerald-700 font-semibold' : ''}>
                        Notes: {completionCriteria.notesMet ? 'Completed ✓' : `${progress.notesSectionsRead.length}/${lesson.notesAsset.sections.length}`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={progress.pptViewed ? 'text-slate-800 font-medium' : ''}>
                        PPT: {progress.pptViewed ? 'Viewed' : 'Reference'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={completionCriteria.quizMet ? 'text-emerald-700 font-semibold' : ''}>
                        Quiz: {completionCriteria.quizMet ? `Passed (${progress.quizBestScore}%) ✓` : 'Required'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={completionCriteria.firestoreValidated ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                        Firestore: {completionCriteria.firestoreValidated ? 'Verified' : 'Pending'}
                      </span>
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
                        onClick={() => handleOpenLessonMaterial(index, 'video')}
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
                        onClick={() => handleOpenLessonMaterial(index, 'notes')}
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
                        onClick={() => handleOpenLessonMaterial(index, 'ppt')}
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
        </section>

        {/* Section 3: Final Assessment & Certificate Eligibility Checklist */}
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
                  Available after all required classes and quizzes are completed. Passing criterion: {activeCourse.finalExam.passingScore}% ({activeCourse.finalExam.timeLimitMinutes} minutes).
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
                      <span>Complete All 10 Classes to Unlock ({overallProgress.completedCount}/10)</span>
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
                    subtitle: `প্রতিটি ক্লাসের বাধ্যতামূলক ভিডিও ও নোটস সম্পন্ন (${eligibility.completedClassesCount}/${eligibility.totalClassesCount})`,
                    passed: eligibility.allClassesCompleted
                  },
                  {
                    title: 'All required quizzes completed',
                    subtitle: `দশটি ক্লাসের সব বাধ্যতামূলক কুইজের শর্ত পূরণ (${eligibility.completedQuizzesCount}/${eligibility.requiredQuizzesCount})`,
                    passed: eligibility.allQuizzesCompleted
                  },
                  {
                    title: 'Final examination passed',
                    subtitle: `Admin নির্ধারিত passing mark (${activeCourse.finalExam.passingScore}%) অর্জন ${
                      eligibility.finalExamBestScore > 0
                        ? `· Best Score: ${eligibility.finalExamBestScore}%`
                        : ''
                    }`,
                    passed: eligibility.finalExamPassed
                  },
                  {
                    title: 'Enrollment and purchase validated',
                    subtitle: 'কোর্সের বৈধ enrollment যাচাই',
                    passed: eligibility.enrollmentValidated
                  },
                  {
                    title: 'Certificate issued',
                    subtitle: eligibility.certificate
                      ? `Backend-এ certificate record তৈরি (${eligibility.certificate.certificateId})`
                      : 'Backend-এ certificate record তৈরি',
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
                সব শর্ত পূরণ হলে তবেই বাটনটি সক্রিয় হবে।
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
      </div>

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
