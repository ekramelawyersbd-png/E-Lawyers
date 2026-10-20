import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  CheckCircle2,
  Lock,
  FileText,
  Presentation,
  HelpCircle,
  Video,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Award,
  Clock,
  ArrowLeft,
  BookOpen,
  ArrowRight,
  FileCheck2,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Globe
} from 'lucide-react';
import { useLms } from '../contexts/LmsContext';
import {
  requestR2SignedReadUrl,
  R2PresignReadResponse,
  formatBytesTabular
} from '../utils/r2StorageClient';
import { R2VideoPlayer } from '../components/lms/R2VideoPlayer';
import { VideoPlayerErrorBoundary } from '../components/lms/VideoPlayerErrorBoundary';
import { ServiceSEO } from '../components/SEO';

export type LearningMaterialMode = 'video' | 'notes' | 'ppt' | 'quiz';

interface ClassLearningPageProps {
  initialModeOverride?: LearningMaterialMode;
}

export const ClassLearningPage: React.FC<ClassLearningPageProps> = ({
  initialModeOverride
}) => {
  const {
    courseId: paramCourseId,
    lessonId: paramLessonId,
    mode: paramMode,
    quizId: paramQuizId
  } = useParams<{
    courseId?: string;
    lessonId?: string;
    mode?: string;
    quizId?: string;
  }>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    courses,
    activeCourseId,
    setActiveCourseId,
    activeCourse,
    studentProfile,
    getComputedLessonsForCourse,
    getCourseOverallProgress,
    canAccessLessonContent,
    recordVideoCheckpoint,
    markVideoLessonComplete,
    recordNotesSectionRead,
    markNotesLessonComplete,
    recordPptSlideView,
    submitClassQuiz,
    getLessonQuizAttempts
  } = useLms();

  // Resolve active course from URL param
  const resolvedCourse = useMemo(() => {
    if (paramCourseId) {
      const found = courses.find((c) => c.courseId === paramCourseId);
      if (found) return found;
    }
    return activeCourse;
  }, [paramCourseId, courses, activeCourse]);

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
    () => getComputedLessonsForCourse(resolvedCourse.courseId),
    [resolvedCourse.courseId, getComputedLessonsForCourse]
  );

  const overallProgress = useMemo(
    () => getCourseOverallProgress(resolvedCourse.courseId),
    [resolvedCourse.courseId, getCourseOverallProgress]
  );

  // Resolve current lesson index from lessonId or quizId
  const currentLessonIndex = useMemo(() => {
    if (paramLessonId) {
      const idx = computedLessons.findIndex(
        (item) =>
          item.lesson.lessonId.toLowerCase() === paramLessonId.toLowerCase() ||
          item.lesson.classNumber === paramLessonId ||
          `cls_${item.lesson.classNumber}` === paramLessonId.toLowerCase()
      );
      if (idx !== -1) return idx;
    }
    if (paramQuizId) {
      const idx = computedLessons.findIndex(
        (item) =>
          item.lesson.quizConfig.quizId.toLowerCase() === paramQuizId.toLowerCase() ||
          item.lesson.lessonId.toLowerCase() === paramQuizId.toLowerCase()
      );
      if (idx !== -1) return idx;
    }
    return 0;
  }, [paramLessonId, paramQuizId, computedLessons]);

  const lessonState = computedLessons[currentLessonIndex] || computedLessons[0];
  const { lesson, progress, completionCriteria } = lessonState;

  // Resolve mode ('video' | 'notes' | 'ppt' | 'quiz') from route
  const resolvedModeFromUrl = useMemo<LearningMaterialMode>(() => {
    if (initialModeOverride) return initialModeOverride;
    const pathEnd = location.pathname.split('/').filter(Boolean).pop()?.toLowerCase();
    if (pathEnd === 'video' || pathEnd === 'notes' || pathEnd === 'ppt' || pathEnd === 'quiz') {
      return pathEnd;
    }
    const raw = (paramMode || searchParams.get('mode') || 'video').toLowerCase();
    if (raw === 'notes' || raw === 'ppt' || raw === 'quiz' || raw === 'video') {
      return raw;
    }
    return 'video';
  }, [initialModeOverride, location.pathname, paramMode, searchParams]);

  const [mode, setMode] = useState<LearningMaterialMode>(resolvedModeFromUrl);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  // Notes viewer state
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  // PPT viewer state
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [pptZoom, setPptZoom] = useState<number>(100);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(() =>
    new Array(lesson.quizConfig.questions.length).fill(-1)
  );
  const [latestQuizSubmission, setLatestQuizSubmission] = useState<{
    scorePercent: number;
    passed: boolean;
  } | null>(null);

  // Sync mode when URL route changes
  useEffect(() => {
    setMode(resolvedModeFromUrl);
    setFeedbackBanner(null);
  }, [resolvedModeFromUrl, lesson.lessonId]);

  // Reset per-lesson sub-views when lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setActiveChapterIdx(0);
    setActiveSectionIdx(0);
    setActiveSlideIdx(0);
    setSelectedAnswers(new Array(lesson.quizConfig.questions.length).fill(-1));
    setLatestQuizSubmission(null);
  }, [lesson.lessonId, lesson.quizConfig.questions.length]);

  const contentAccess = canAccessLessonContent(resolvedCourse.courseId, lesson.lessonId, mode);
  const isRestricted =
    lessonState.status === 'locked' ||
    lessonState.isContentRestricted ||
    !contentAccess.allowed;

  // R2 Signed Temporary Read URL state for the active material ('video' | 'notes' | 'ppt')
  const activeR2Metadata = useMemo(() => {
    if (mode === 'video') return lesson.videoAsset;
    if (mode === 'notes') return lesson.notesAsset;
    if (mode === 'ppt') return lesson.pptAsset;
    return undefined;
  }, [mode, lesson.videoAsset, lesson.notesAsset, lesson.pptAsset]);

  const [signedReadData, setSignedReadData] = useState<R2PresignReadResponse | null>(null);
  const [isLoadingSignedUrl, setIsLoadingSignedUrl] = useState<boolean>(false);
  const [signedUrlError, setSignedUrlError] = useState<string | null>(null);

  const fetchSignedMaterialUrl = async () => {
    if (
      isRestricted ||
      mode === 'quiz' ||
      !activeR2Metadata?.r2ObjectKey
    ) {
      console.log(`[ClassLearningPage] Skipping signed URL fetch for Class ${lesson.classNumber}:`, {
        isRestricted,
        mode,
        hasR2ObjectKey: Boolean(activeR2Metadata?.r2ObjectKey)
      });
      setSignedReadData(null);
      setSignedUrlError(null);
      return;
    }

    setIsLoadingSignedUrl(true);
    setSignedUrlError(null);

    const startTime = performance.now();
    console.group(`[ClassLearningPage:SignedURL] 🚀 Step 1/4: Preparing signed read request for Class ${lesson.classNumber} (${mode})`);
    console.log('Target Object Key:', activeR2Metadata.r2ObjectKey);
    console.log('Course ID:', resolvedCourse.courseId);
    console.log('Lesson ID:', lesson.lessonId);
    console.log('Material Type:', mode);
    console.log('Student Profile ID:', studentProfile.studentId);
    console.log('Request Timestamp:', new Date().toISOString());

    try {
      console.log('[ClassLearningPage:SignedURL] ⏳ Step 2/4: Calling R2 utility module requestR2SignedReadUrl()...');
      const signed = await requestR2SignedReadUrl({
        objectKey: activeR2Metadata.r2ObjectKey,
        courseId: resolvedCourse.courseId,
        lessonId: lesson.lessonId,
        materialType: mode,
        studentId: studentProfile.studentId
      });

      const elapsedMs = Math.round(performance.now() - startTime);
      console.log(`[ClassLearningPage:SignedURL] 📦 Step 3/4: R2 signed response received in ${elapsedMs}ms:`, {
        objectKey: signed?.objectKey,
        storageMode: signed?.storageMode,
        hasUrl: Boolean(signed?.signedReadUrl),
        urlSnippet: signed?.signedReadUrl ? `${signed.signedReadUrl.substring(0, 100)}...` : '(empty)',
        expiresAt: signed?.expiresAt,
        expiresInSeconds: signed?.expiresInSeconds,
        authorizedFor: signed?.authorizedFor
      });

      if (!signed || !signed.signedReadUrl) {
        throw new Error('R2 storage module returned an empty or invalid signed read URL.');
      }

      console.log('[ClassLearningPage:SignedURL] ✅ Step 4/4: Signed URL verified successfully. Mounting video stream player.');
      setSignedReadData(signed);
      console.groupEnd();
    } catch (err: any) {
      const elapsedMs = Math.round(performance.now() - startTime);
      console.error(`[ClassLearningPage:SignedURL] ❌ Step 4/4 Retrieval Failed after ${elapsedMs}ms:`, {
        errorMessage: err?.message || String(err),
        stack: err?.stack,
        objectKey: activeR2Metadata.r2ObjectKey
      });
      console.groupEnd();
      setSignedReadData(null);
      setSignedUrlError(
        err?.message || 'Unable to generate temporary signed R2 read URL. Ensure student is enrolled and R2 storage is active.'
      );
    } finally {
      setIsLoadingSignedUrl(false);
    }
  };

  useEffect(() => {
    fetchSignedMaterialUrl();
  }, [
    isRestricted,
    mode,
    resolvedCourse.courseId,
    lesson.lessonId,
    activeR2Metadata?.r2ObjectKey,
    studentProfile.studentId
  ]);

  // Simulate progressive playback when video is playing (when no R2 video file is actively streaming or alongside chapter simulation)
  useEffect(() => {
    if (isRestricted || mode !== 'video' || !isPlaying) return;
    const timer = setInterval(() => {
      const nextVal = Math.min(100, progress.videoWatchPercent + 5);
      const chapter = lesson.videoAsset.chapters.find(
        (ch) => nextVal >= ch.progressMarker - 10
      );
      recordVideoCheckpoint(resolvedCourse.courseId, lesson.lessonId, nextVal, chapter?.id);
      if (nextVal >= 100) {
        setIsPlaying(false);
      }
    }, 1200);
    return () => clearInterval(timer);
  }, [
    resolvedCourse.courseId,
    isPlaying,
    isRestricted,
    lesson.lessonId,
    lesson.videoAsset.chapters,
    mode,
    progress.videoWatchPercent,
    recordVideoCheckpoint
  ]);

  // Record first slide view when entering PPT mode
  useEffect(() => {
    if (!isRestricted && mode === 'ppt') {
      const slideNum = lesson.pptAsset.slides[activeSlideIdx]?.slideNumber || 1;
      if (!progress.pptViewed || !progress.pptSlidesViewed.includes(slideNum)) {
        recordPptSlideView(resolvedCourse.courseId, lesson.lessonId, slideNum);
      }
    }
  }, [
    activeSlideIdx,
    resolvedCourse.courseId,
    isRestricted,
    lesson.lessonId,
    lesson.pptAsset.slides,
    mode,
    progress.pptSlidesViewed,
    progress.pptViewed,
    recordPptSlideView
  ]);

  // Record note section read when viewing a section
  useEffect(() => {
    if (!isRestricted && mode === 'notes') {
      const currentSec = lesson.notesAsset.sections[activeSectionIdx];
      if (currentSec && !progress.notesSectionsRead.includes(currentSec.id)) {
        recordNotesSectionRead(resolvedCourse.courseId, lesson.lessonId, currentSec.id);
      }
    }
  }, [
    activeSectionIdx,
    resolvedCourse.courseId,
    isRestricted,
    lesson.lessonId,
    lesson.notesAsset.sections,
    mode,
    progress.notesSectionsRead,
    recordNotesSectionRead
  ]);

  const getMaterialRouteUrl = (
    targetLessonId: string,
    targetMode: LearningMaterialMode
  ): string => {
    return `/student/course/${resolvedCourse.courseId}/lesson/${targetLessonId}/${targetMode}`;
  };

  // Navigate to dedicated page route for 'Watch Video', 'Read Notes', 'View PPT', or 'Take Quiz'
  const handleNavigateMaterialRoute = (
    targetLessonId: string,
    targetMode: LearningMaterialMode
  ) => {
    setMode(targetMode);
    setFeedbackBanner(null);
    navigate(getMaterialRouteUrl(targetLessonId, targetMode));
  };

  const handleSelectLesson = (targetIdx: number, targetMode: LearningMaterialMode = mode) => {
    const targetLessonState = computedLessons[targetIdx];
    if (!targetLessonState) return;
    if (targetLessonState.status === 'locked') {
      setFeedbackBanner({
        type: 'error',
        text:
          targetLessonState.lockReason ||
          `Class ${targetLessonState.lesson.classNumber} is locked until the previous class is completed in Firestore.`
      });
      return;
    }
    handleNavigateMaterialRoute(targetLessonState.lesson.lessonId, targetMode);
  };

  const maskedEmail = studentProfile.email.replace(
    /(.{2})(.*)(?=@)/,
    (_, a, b) => a + '*'.repeat(Math.min(6, b.length))
  );
  const watermarkText = `${studentProfile.studentId} · ${maskedEmail} · Authorized Stream`;

  const handleMarkCurrentSectionComplete = () => {
    if (mode === 'video') {
      const res = markVideoLessonComplete(resolvedCourse.courseId, lesson.lessonId);
      setFeedbackBanner({
        type: res.success ? 'success' : 'error',
        text: res.message
      });
    } else if (mode === 'notes') {
      const res = markNotesLessonComplete(resolvedCourse.courseId, lesson.lessonId);
      setFeedbackBanner({
        type: res.success ? 'success' : 'error',
        text: res.message
      });
    } else if (mode === 'ppt') {
      recordPptSlideView(
        resolvedCourse.courseId,
        lesson.lessonId,
        lesson.pptAsset.slides.length
      );
      setFeedbackBanner({
        type: 'info',
        text: 'PPT Slides reviewed. Note: PPT slides are for reference and do not block class completion.'
      });
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswers.some((ans) => ans === -1)) {
      setFeedbackBanner({
        type: 'error',
        text: 'Please select an answer for all questions before submitting.'
      });
      return;
    }
    const result = submitClassQuiz(
      resolvedCourse.courseId,
      lesson.lessonId,
      selectedAnswers
    );
    setLatestQuizSubmission({
      scorePercent: result.scorePercent,
      passed: result.passed
    });
    setFeedbackBanner({
      type: result.passed ? 'success' : 'error',
      text: result.passed
        ? `Congratulations! You scored ${result.scorePercent}% (Passing mark: ${lesson.quizConfig.passingScore}%) and passed the Class ${lesson.classNumber} Quiz.`
        : `You scored ${result.scorePercent}%. At least ${lesson.quizConfig.passingScore}% is required to pass. Review the explanations below and try again.`
    });
  };

  const attempts = getLessonQuizAttempts(resolvedCourse.courseId, lesson.lessonId);

  const modeTitleMap: Record<LearningMaterialMode, string> = {
    video: 'Video Lesson',
    notes: 'Class Notes',
    ppt: 'PPT Slides',
    quiz: 'Class Quiz'
  };

  const hasPrevLesson = currentLessonIndex > 0;
  const hasNextLesson = currentLessonIndex < computedLessons.length - 1;
  const canOpenNextLesson =
    hasNextLesson && computedLessons[currentLessonIndex + 1].status !== 'locked';

  return (
    <div
      className="min-h-screen bg-slate-50 py-6 sm:py-10 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <ServiceSEO
        title={`Class ${lesson.classNumber}: ${lesson.heading} — ${modeTitleMap[mode]} | ${resolvedCourse.title}`}
        description={`Full-page LMS course viewer for ${lesson.heading} (${modeTitleMap[mode]}) in ${resolvedCourse.title}.`}
        serviceType="EducationalCourse"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top LMS Breadcrumb & Course Flow Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 px-5 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/student/course/${resolvedCourse.courseId}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course Curriculum</span>
            </Link>

            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <Link
                to="/student/dashboard"
                className="font-semibold text-slate-600 hover:text-slate-900 hover:underline"
              >
                Student Portal
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                to={`/student/course/${resolvedCourse.courseId}`}
                className="font-semibold text-slate-800 hover:underline"
              >
                {resolvedCourse.title}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-bold text-emerald-700">
                Class {lesson.classNumber} ({modeTitleMap[mode]})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono tabular-nums text-emerald-700 font-bold">
              Progress: {overallProgress.percent}% ({overallProgress.completedCount}/
              {overallProgress.totalCount} Classes)
            </span>

            {/* Course Switcher across all courses */}
            {courses.length > 1 && (
              <select
                value={resolvedCourse.courseId}
                onChange={(e) => {
                  const nextCourseId = e.target.value;
                  setActiveCourseId(nextCourseId);
                  navigate(`/student/course/${nextCourseId}/lesson/cls_01/${mode}`);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>
                    {c.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Main Two-Column LMS Layout: Left Curriculum & Material Route Sidebar (3 cols) + Right Full-Page Viewer (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: All 10 Classes & Direct Page Route Navigation */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold tracking-wide">
                    10-Class Curriculum
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {overallProgress.completedCount}/10 Done
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
                {computedLessons.map((item, idx) => {
                  const isCurrent = idx === currentLessonIndex;
                  const isItemLocked = item.status === 'locked';
                  return (
                    <div
                      key={item.lesson.lessonId}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                          : isItemLocked
                          ? 'bg-slate-50/60 opacity-65'
                          : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectLesson(idx, mode)}
                        className="w-full px-4 py-3 text-left flex items-start justify-between gap-2.5 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500">
                            <span>CLASS {item.lesson.classNumber}</span>
                            {isCurrent && (
                              <span className="text-emerald-700 font-sans font-bold">
                                · Active Page
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-xs font-bold truncate mt-0.5 ${
                              isCurrent ? 'text-slate-950' : 'text-slate-800'
                            }`}
                          >
                            {item.lesson.heading}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                            <span>
                              V: {item.completionCriteria.videoMet ? '✓' : `${item.progress.videoWatchPercent}%`}
                            </span>
                            <span>·</span>
                            <span>
                              N: {item.completionCriteria.notesMet ? '✓' : `${item.progress.notesSectionsRead.length}/${item.lesson.notesAsset.sections.length}`}
                            </span>
                            <span>·</span>
                            <span>Q: {item.completionCriteria.quizMet ? '✓' : 'Req'}</span>
                          </div>
                        </div>

                        <div className="shrink-0 mt-0.5">
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : item.status === 'locked' ? (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                      </button>

                      {/* Direct Route Links for Active Class Materials */}
                      {isCurrent && !isItemLocked && (
                        <div className="px-4 pb-3 pt-1 grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleNavigateMaterialRoute(item.lesson.lessonId, 'video')
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              mode === 'video'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Video className="w-3 h-3 shrink-0" />
                            <span>Watch Video</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleNavigateMaterialRoute(item.lesson.lessonId, 'notes')
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              mode === 'notes'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <FileText className="w-3 h-3 shrink-0" />
                            <span>Read Notes</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleNavigateMaterialRoute(item.lesson.lessonId, 'ppt')
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              mode === 'ppt'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Presentation className="w-3 h-3 shrink-0" />
                            <span>View PPT</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleNavigateMaterialRoute(item.lesson.lessonId, 'quiz')
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              mode === 'quiz'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <HelpCircle className="w-3 h-3 shrink-0" />
                            <span>Take Quiz</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Final Exam & Certificate Flow Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Final Examination</span>
                <span
                  className={`font-semibold ${
                    overallProgress.allMandatoryLessonsDone
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {overallProgress.allMandatoryLessonsDone ? 'Unlocked' : 'Locked'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Complete all 10 classes ({overallProgress.completedCount}/10 done) to unlock the Final Exam and Official Certificate.
              </p>
              <Link
                to={
                  overallProgress.allMandatoryLessonsDone
                    ? `/student/course/${resolvedCourse.courseId}/exam`
                    : `/student/course/${resolvedCourse.courseId}`
                }
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  overallProgress.allMandatoryLessonsDone
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>
                  {overallProgress.allMandatoryLessonsDone
                    ? 'Go to Final Examination'
                    : 'View Exam & Certificate Status'}
                </span>
              </Link>
            </div>
          </aside>

          {/* Right Column: Full-Page Course Material Viewer */}
          <div className="lg:col-span-9">
            {isRestricted ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-6 shadow-xs text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7 text-amber-600" />
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Firestore Sequential Content Guard
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Class {lesson.classNumber}: {lesson.heading} is Locked
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {contentAccess.reason ||
                      lessonState.lockReason ||
                      'Access to Video, Notes, PPT, and Quiz for this class is restricted until the previous class has been marked as fully completed in Firestore.'}
                  </p>
                </div>

                {feedbackBanner && (
                  <div className="max-w-md mx-auto p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    {feedbackBanner.text}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {hasPrevLesson && (
                    <button
                      type="button"
                      onClick={() => handleSelectLesson(currentLessonIndex - 1, 'video')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>
                        Go to Class {computedLessons[currentLessonIndex - 1].lesson.classNumber}
                      </span>
                    </button>
                  )}
                  <Link
                    to={`/student/course/${resolvedCourse.courseId}`}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Return to Course Curriculum
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                {/* Top Full-Page Viewer Header */}
                <div className="bg-slate-900 text-white px-5 sm:px-7 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
                      <span>
                        Class {lesson.classNumber} — {modeTitleMap[mode]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Authorized streaming only</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {lesson.heading}
                    </h1>
                  </div>

                  {/* Page Route Switcher Buttons ('Watch Video' | 'Read Notes' | 'View PPT' | 'Take Quiz') */}
                  <div className="flex flex-wrap items-center bg-slate-800 p-1.5 rounded-xl border border-slate-700 self-start xl:self-auto gap-1">
                    <button
                      type="button"
                      onClick={() => handleNavigateMaterialRoute(lesson.lessonId, 'video')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        mode === 'video'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Watch Video</span>
                      {progress.videoCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigateMaterialRoute(lesson.lessonId, 'notes')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        mode === 'notes'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read Notes</span>
                      {progress.notesCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigateMaterialRoute(lesson.lessonId, 'ppt')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        mode === 'ppt'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Presentation className="w-3.5 h-3.5" />
                      <span>View PPT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavigateMaterialRoute(lesson.lessonId, 'quiz')}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        mode === 'quiz'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Take Quiz</span>
                      {progress.quizPassed && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Protected Content Security Sub-bar */}
                <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex flex-wrap items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">
                      Protected learning content
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Access restricted to authorized enrolled students.</span>
                    {activeR2Metadata?.r2ObjectKey && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 font-bold">
                          <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            R2 Signed Stream ({formatBytesTabular(activeR2Metadata.r2FileSizeBytes)})
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums text-[11px] text-slate-500">
                    {signedReadData && (
                      <button
                        type="button"
                        onClick={fetchSignedMaterialUrl}
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                        title="Refresh temporary signed R2 read URL"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingSignedUrl ? 'animate-spin' : ''}`} />
                        <span>Refresh Signed R2 URL</span>
                      </button>
                    )}
                    <span>
                      Session ID: {studentProfile.studentId} · Asset:{' '}
                      {mode === 'video'
                        ? lesson.videoAsset.assetId
                        : mode === 'notes'
                        ? lesson.notesAsset.assetId
                        : mode === 'ppt'
                        ? lesson.pptAsset.assetId
                        : lesson.quizConfig.quizId}
                    </span>
                  </div>
                </div>

                {/* Class Completion Progress Strip */}
                <div className="bg-white border-b border-slate-100 px-5 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-slate-700">
                      Class {lesson.classNumber} Status:
                    </span>
                    <span className={completionCriteria.videoMet ? 'text-emerald-700 font-semibold' : ''}>
                      Video {completionCriteria.videoMet ? '✓' : `${progress.videoWatchPercent}%`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={completionCriteria.notesMet ? 'text-emerald-700 font-semibold' : ''}>
                      Notes {completionCriteria.notesMet ? '✓' : `${progress.notesSectionsRead.length}/${lesson.notesAsset.sections.length}`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={progress.pptViewed ? 'text-slate-800 font-medium' : ''}>
                      PPT {progress.pptViewed ? 'Viewed' : 'Reference'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={completionCriteria.quizMet ? 'text-emerald-700 font-semibold' : ''}>
                      Quiz {completionCriteria.quizMet ? `Passed (${progress.quizBestScore}%) ✓` : 'Required'}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700">
                    {completionCriteria.allCriteriaMet
                      ? 'Class Completed in Firestore ✓'
                      : `Remaining: ${completionCriteria.missingCriteriaLabels.join(', ')}`}
                  </div>
                </div>

                {/* Feedback Banner */}
                {feedbackBanner && (
                  <div
                    className={`px-5 sm:px-7 py-3.5 text-xs font-semibold flex items-center justify-between gap-3 border-b ${
                      feedbackBanner.type === 'success'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : feedbackBanner.type === 'error'
                        ? 'bg-rose-50 text-rose-900 border-rose-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {feedbackBanner.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{feedbackBanner.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFeedbackBanner(null)}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Main Page Content Body */}
                <div className="p-5 sm:p-8 space-y-6">
                  {/* 1. VIDEO LESSON PAGE VIEW */}
                  {mode === 'video' && (
                    <div className="space-y-6">
                      {/* Video Stage with Dynamic Security Watermark */}
                      <div className="relative rounded-2xl bg-slate-950 text-white overflow-hidden border border-slate-800">
                        <div className="absolute top-3 right-4 z-20 pointer-events-none bg-slate-900/80 border border-slate-700/80 px-3 py-1 rounded text-[11px] font-mono text-slate-300">
                          {watermarkText}
                        </div>

                        <div className="p-6 sm:p-10 min-h-[320px] flex flex-col justify-between relative z-10">
                          <div className="space-y-2 max-w-2xl">
                            <div className="text-xs font-medium text-emerald-400">
                              Secure Video Player · Authorized streaming only
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                              {lesson.videoAsset.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              Instructor: {lesson.videoAsset.instructor} · Duration:{' '}
                              {lesson.videoAsset.durationLabel}
                            </p>
                          </div>

                          {/* Real Cloudflare R2 Signed Video Stream Player with Error Boundary */}
                          <div className="mt-5">
                            <VideoPlayerErrorBoundary onReset={fetchSignedMaterialUrl}>
                              {isLoadingSignedUrl ? (
                                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-8 text-center text-xs font-mono text-slate-400 flex flex-col items-center justify-center gap-2">
                                  <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                                  <span className="font-semibold text-slate-200">Authorizing signed R2 video stream...</span>
                                  <span className="text-[11px] text-slate-500">Checking course enrollment and retrieving temporary read access</span>
                                </div>
                              ) : signedUrlError && !lesson.videoAsset.streamUrl && !lesson.videoAsset.externalUrl ? (
                                <div className="rounded-xl border border-rose-800/80 bg-rose-950/60 p-4 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                    <span>{signedUrlError}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={fetchSignedMaterialUrl}
                                    className="px-3.5 py-1.5 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-bold cursor-pointer transition-colors self-start sm:self-auto shrink-0 flex items-center gap-1.5"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Retry Signed Stream</span>
                                  </button>
                                </div>
                              ) : signedReadData?.signedReadUrl || lesson.videoAsset.streamUrl || lesson.videoAsset.externalUrl ? (
                                <div className="space-y-3">
                                  {signedUrlError && (
                                    <div className="rounded-lg border border-amber-800/80 bg-amber-950/60 p-3 text-xs text-amber-200 flex items-center justify-between gap-2 shadow">
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                        <span>R2 signed stream notice: {signedUrlError}. Playing backup stream.</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={fetchSignedMaterialUrl}
                                        className="text-amber-300 hover:text-white underline font-semibold cursor-pointer shrink-0"
                                      >
                                        Retry R2
                                      </button>
                                    </div>
                                  )}
                                  <R2VideoPlayer
                                    src={signedReadData?.signedReadUrl || lesson.videoAsset.streamUrl || lesson.videoAsset.externalUrl || ''}
                                  title={lesson.videoAsset.title}
                                  instructor={lesson.videoAsset.instructor}
                                  durationLabel={lesson.videoAsset.durationLabel}
                                  watermarkText={watermarkText}
                                  r2ObjectKey={lesson.videoAsset.r2ObjectKey}
                                  storageMode={signedReadData?.storageMode}
                                  expiresAt={signedReadData?.expiresAt}
                                  initialWatchPercent={progress.videoWatchPercent}
                                  onTimeUpdatePercent={(pct) => {
                                    if (
                                      pct >= progress.videoWatchPercent + 5 ||
                                      (pct >= 80 && !progress.videoCompleted)
                                    ) {
                                      const ch = lesson.videoAsset.chapters.find(
                                        (c) => pct >= c.progressMarker - 10
                                      );
                                      recordVideoCheckpoint(
                                        resolvedCourse.courseId,
                                        lesson.lessonId,
                                        pct,
                                        ch?.id
                                      );
                                    }
                                  }}
                                  onPlaybackCompleted={() => {
                                    recordVideoCheckpoint(
                                      resolvedCourse.courseId,
                                      lesson.lessonId,
                                      100,
                                      lesson.videoAsset.chapters[
                                        lesson.videoAsset.chapters.length - 1
                                      ]?.id
                                    );
                                  }}
                                  onRetrySignedUrl={fetchSignedMaterialUrl}
                                />
                              </div>
                            ) : (
                                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-2">
                                  <Video className="w-8 h-8 text-emerald-500/70 mx-auto" />
                                  <h4 className="text-sm font-bold text-slate-200">
                                    Interactive Course Video Stage
                                  </h4>
                                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                                    No custom R2 video file has been uploaded for this lesson yet.
                                    Course instructors can upload video materials via{' '}
                                    <Link to="/admin/dashboard" className="text-emerald-400 hover:underline font-semibold">
                                      Admin LMS Dashboard
                                    </Link>.
                                    You can simulate playback and review statutory chapter milestones below.
                                  </p>
                                </div>
                              )}
                            </VideoPlayerErrorBoundary>
                          </div>

                          {/* Active Chapter Highlight Box */}
                          <div className="my-6 bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                              <span>
                                Current Segment:{' '}
                                <strong className="text-emerald-400">
                                  {lesson.videoAsset.chapters[activeChapterIdx]?.title}
                                </strong>
                              </span>
                              <span className="font-mono tabular-nums">
                                Timestamp:{' '}
                                {lesson.videoAsset.chapters[activeChapterIdx]?.timestampLabel}
                              </span>
                            </div>
                            <p className="text-sm text-slate-200 leading-relaxed">
                              {lesson.videoAsset.chapters[activeChapterIdx]?.summary}
                            </p>
                          </div>

                          {/* Player Controls & Progress Scrubber */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-300 font-medium">
                                Lesson progress
                              </span>
                              <span className="font-mono tabular-nums font-bold text-emerald-400 text-sm">
                                {progress.videoWatchPercent}%
                              </span>
                            </div>

                            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-300"
                                style={{ width: `${progress.videoWatchPercent}%` }}
                              />
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsPlaying((p) => !p)}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  {isPlaying ? (
                                    <>
                                      <Pause className="w-4 h-4" />
                                      <span>Pause Stream</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4" />
                                      <span>
                                        {progress.videoWatchPercent > 0 &&
                                        progress.videoWatchPercent < 100
                                          ? 'Resume Playback'
                                          : 'Start Video Stream'}
                                      </span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextPct = Math.min(
                                      100,
                                      progress.videoWatchPercent + 25
                                    );
                                    const ch = lesson.videoAsset.chapters.find(
                                      (c) => nextPct >= c.progressMarker
                                    );
                                    recordVideoCheckpoint(
                                      resolvedCourse.courseId,
                                      lesson.lessonId,
                                      nextPct,
                                      ch?.id
                                    );
                                  }}
                                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                                >
                                  Advance +25% Checkpoint
                                </button>
                              </div>

                              <div className="text-xs text-slate-400">
                                {progress.videoCompleted ? (
                                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Playback Verified (Completed)
                                  </span>
                                ) : (
                                  <span>
                                    Requires 90%+ playback checkpoint to complete
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chapter Checkpoints Grid */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-500 mb-3">
                          Video Chapters & Playback Checkpoints (Click to jump & verify segment)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {lesson.videoAsset.chapters.map((ch, idx) => {
                            const reached =
                              progress.videoCheckpointsReached.includes(ch.id) ||
                              progress.videoWatchPercent >= ch.progressMarker;
                            return (
                              <button
                                key={ch.id}
                                type="button"
                                onClick={() => {
                                  setActiveChapterIdx(idx);
                                  recordVideoCheckpoint(
                                    resolvedCourse.courseId,
                                    lesson.lessonId,
                                    Math.max(
                                      progress.videoWatchPercent,
                                      ch.progressMarker
                                    ),
                                    ch.id
                                  );
                                }}
                                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                                  activeChapterIdx === idx
                                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                <div className="space-y-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    {ch.title}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                                    Timestamp: {ch.timestampLabel} · Checkpoint:{' '}
                                    {ch.progressMarker}%
                                  </div>
                                </div>
                                {reached ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. CLASS NOTES PAGE VIEW */}
                  {mode === 'notes' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                        <div>
                          <div className="text-xs text-slate-500 font-medium">
                            Read-Only Protected Viewer · Direct file download disabled
                          </div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {lesson.notesAsset.title}
                          </h2>
                        </div>
                        <div className="text-xs font-mono tabular-nums text-slate-600">
                          Reading Checkpoints: {progress.notesSectionsRead.length} of{' '}
                          {lesson.notesAsset.sections.length} sections read
                        </div>
                      </div>

                      {/* Signed R2 PDF Reading Notes Viewer (when uploaded in R2) */}
                      {lesson.notesAsset.r2ObjectKey && signedReadData ? (
                        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <HardDrive className="w-4 h-4 text-emerald-400" />
                              <span className="font-bold">
                                R2 Protected Notes PDF: {lesson.notesAsset.r2FileName}
                              </span>
                              <span className="font-mono text-slate-400">
                                ({formatBytesTabular(lesson.notesAsset.r2FileSizeBytes)})
                              </span>
                            </div>
                            <a
                              href={signedReadData.signedReadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Signed PDF in Full Tab</span>
                            </a>
                          </div>
                          <iframe
                            src={signedReadData.signedReadUrl}
                            title={lesson.notesAsset.title}
                            className="w-full h-[460px] rounded-xl bg-white border border-slate-700"
                          />
                        </div>
                      ) : lesson.notesAsset.externalUrl ? (
                        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-blue-400" />
                              <span className="font-bold">
                                External Notes Document: {lesson.notesAsset.title}
                              </span>
                            </div>
                            <a
                              href={lesson.notesAsset.externalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Notes Document</span>
                            </a>
                          </div>
                          <iframe
                            src={lesson.notesAsset.externalUrl}
                            title={lesson.notesAsset.title}
                            className="w-full h-[460px] rounded-xl bg-white border border-slate-700"
                          />
                        </div>
                      ) : null}

                      {/* Section Selector Bar */}
                      <div className="flex flex-wrap items-center gap-2">
                        {lesson.notesAsset.sections.map((sec, idx) => {
                          const isRead = progress.notesSectionsRead.includes(sec.id);
                          const isCurrent = activeSectionIdx === idx;
                          return (
                            <button
                              key={sec.id}
                              type="button"
                              onClick={() => {
                                setActiveSectionIdx(idx);
                                recordNotesSectionRead(
                                  resolvedCourse.courseId,
                                  lesson.lessonId,
                                  sec.id
                                );
                              }}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-2 cursor-pointer ${
                                isCurrent
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : isRead
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span>Section {idx + 1}</span>
                              {isRead && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Note Section Document Surface */}
                      {lesson.notesAsset.sections[activeSectionIdx] && (
                        <div className="relative bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-200 pb-3">
                            <span>{watermarkText}</span>
                            <span>
                              {lesson.notesAsset.sections[activeSectionIdx].statutoryRef}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-slate-900">
                            {lesson.notesAsset.sections[activeSectionIdx].heading}
                          </h3>

                          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                            {lesson.notesAsset.sections[activeSectionIdx].content}
                          </p>

                          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
                            <div className="text-xs font-bold text-slate-900">
                              Key Practitioner Checklist & Verification Points:
                            </div>
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                              {lesson.notesAsset.sections[
                                activeSectionIdx
                              ].keyChecklist.map((item, i) => (
                                <li key={`chk-${activeSectionIdx}-${i}`} className="flex items-start gap-2.5">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <button
                              type="button"
                              disabled={activeSectionIdx === 0}
                              onClick={() =>
                                setActiveSectionIdx((i) => Math.max(0, i - 1))
                              }
                              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-semibold text-slate-700 cursor-pointer"
                            >
                              Previous Section
                            </button>

                            {activeSectionIdx <
                            lesson.notesAsset.sections.length - 1 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextIdx = activeSectionIdx + 1;
                                  setActiveSectionIdx(nextIdx);
                                  recordNotesSectionRead(
                                    resolvedCourse.courseId,
                                    lesson.lessonId,
                                    lesson.notesAsset.sections[nextIdx].id
                                  );
                                }}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                              >
                                Read Next Section ({activeSectionIdx + 2}/
                                {lesson.notesAsset.sections.length})
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleMarkCurrentSectionComplete}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Verify & Complete Notes</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. PPT SLIDES PAGE VIEW */}
                  {mode === 'ppt' && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                        <div>
                          <div className="text-xs text-slate-500 font-medium">
                            Interactive Presentation Deck · Reference material (Not a completion blocker)
                          </div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {lesson.pptAsset.title}
                          </h2>
                        </div>

                        {/* Zoom Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPptZoom((z) => Math.max(85, z - 15))}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                            title="Zoom out"
                          >
                            <ZoomOut className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-mono tabular-nums font-semibold text-slate-700 min-w-[44px] text-center">
                            {pptZoom}%
                          </span>
                          <button
                            type="button"
                            onClick={() => setPptZoom((z) => Math.min(130, z + 15))}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                            title="Zoom in"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Signed R2 PPT Presentation Viewer (when uploaded in R2) or External Deck */}
                      {lesson.pptAsset.r2ObjectKey && signedReadData ? (
                        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <HardDrive className="w-4 h-4 text-emerald-400" />
                              <span className="font-bold">
                                R2 Presentation Deck: {lesson.pptAsset.r2FileName}
                              </span>
                              <span className="font-mono text-slate-400">
                                ({formatBytesTabular(lesson.pptAsset.r2FileSizeBytes)})
                              </span>
                            </div>
                            <a
                              href={signedReadData.signedReadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Signed Deck</span>
                            </a>
                          </div>
                          {lesson.pptAsset.r2MimeType === 'application/pdf' ||
                          lesson.pptAsset.r2FileName?.toLowerCase().endsWith('.pdf') ? (
                            <iframe
                              src={signedReadData.signedReadUrl}
                              title={lesson.pptAsset.title}
                              className="w-full h-[460px] rounded-xl bg-white border border-slate-700"
                            />
                          ) : null}
                        </div>
                      ) : lesson.pptAsset.externalUrl ? (
                        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-blue-400" />
                              <span className="font-bold">
                                External Presentation Deck: {lesson.pptAsset.title}
                              </span>
                            </div>
                            <a
                              href={lesson.pptAsset.externalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Slide Deck</span>
                            </a>
                          </div>
                          <iframe
                            src={lesson.pptAsset.externalUrl}
                            title={lesson.pptAsset.title}
                            className="w-full h-[460px] rounded-xl bg-white border border-slate-700"
                          />
                        </div>
                      ) : null}

                      {/* Slide Canvas */}
                      {lesson.pptAsset.slides[activeSlideIdx] && (
                        <div
                          className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-10 transition-transform origin-top"
                          style={{ fontSize: `${pptZoom}%` }}
                        >
                          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-6 pb-3 border-b border-slate-800">
                            <span>
                              {lesson.pptAsset.deckCode} · SLIDE {activeSlideIdx + 1}{' '}
                              OF {lesson.pptAsset.slides.length}
                            </span>
                            <span>{watermarkText}</span>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <div className="text-xs font-semibold text-emerald-400 mb-1">
                                {lesson.pptAsset.slides[activeSlideIdx].subtitle}
                              </div>
                              <h3 className="text-2xl font-bold text-white">
                                {lesson.pptAsset.slides[activeSlideIdx].title}
                              </h3>
                            </div>

                            <ul className="space-y-3 text-sm sm:text-base text-slate-200">
                              {lesson.pptAsset.slides[
                                activeSlideIdx
                              ].bulletPoints.map((pt, idx) => (
                                <li key={`pt-${activeSlideIdx}-${idx}`} className="flex items-start gap-3">
                                  <span className="font-mono text-emerald-400 font-bold">
                                    0{idx + 1}.
                                  </span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
                              <span>
                                <strong>Key Takeaway:</strong>{' '}
                                {lesson.pptAsset.slides[activeSlideIdx].keyTakeaway}
                              </span>
                              <span className="font-mono text-slate-400">
                                Ref:{' '}
                                {
                                  lesson.pptAsset.slides[activeSlideIdx]
                                    .statutoryCitation
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Slide Navigation Bar */}
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          disabled={activeSlideIdx === 0}
                          onClick={() =>
                            setActiveSlideIdx((i) => Math.max(0, i - 1))
                          }
                          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous Slide</span>
                        </button>

                        <div className="text-xs font-mono tabular-nums text-slate-600">
                          Slide {activeSlideIdx + 1} of{' '}
                          {lesson.pptAsset.slides.length}
                        </div>

                        <button
                          type="button"
                          disabled={
                            activeSlideIdx === lesson.pptAsset.slides.length - 1
                          }
                          onClick={() =>
                            setActiveSlideIdx((i) =>
                              Math.min(
                                lesson.pptAsset.slides.length - 1,
                                i + 1
                              )
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Next Slide</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. CLASS QUIZ PAGE VIEW */}
                  {mode === 'quiz' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                        <div>
                          <div className="text-xs text-slate-500 font-medium">
                            Class Assessment · Passing Score:{' '}
                            {lesson.quizConfig.passingScore}% ·{' '}
                            {lesson.quizRequired
                              ? 'Required for Class Completion'
                              : 'Optional Practice'}
                          </div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {lesson.quizConfig.title}
                          </h2>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                          <span className="text-slate-600">
                            Best Score: <strong>{progress.quizBestScore}%</strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-600">
                            Attempts: <strong>{progress.quizAttemptsCount}</strong>/
                            {lesson.quizConfig.maxAttempts}
                          </span>
                        </div>
                      </div>

                      <form onSubmit={handleQuizSubmit} className="space-y-5">
                        {lesson.quizConfig.questions.map((q, qIdx) => (
                          <div
                            key={q.id}
                            className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3"
                          >
                            <div className="text-sm font-bold text-slate-900">
                              {qIdx + 1}. {q.question}
                            </div>

                            <div className="space-y-2">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedAnswers[qIdx] === optIdx;
                                const showAnswerFeedback =
                                  latestQuizSubmission !== null;
                                const isCorrect =
                                  optIdx === q.correctOptionIndex;

                                return (
                                  <label
                                    key={`q-${q.id}-opt-${optIdx}`}
                                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors ${
                                      showAnswerFeedback && isCorrect
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                        : showAnswerFeedback &&
                                          isSelected &&
                                          !isCorrect
                                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                                        : isSelected
                                        ? 'bg-slate-900 text-white border-slate-900 font-medium'
                                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question_${q.id}`}
                                      checked={isSelected}
                                      onChange={() => {
                                        const next = [...selectedAnswers];
                                        next[qIdx] = optIdx;
                                        setSelectedAnswers(next);
                                      }}
                                      className="mt-0.5"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>

                            {latestQuizSubmission && (
                              <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                                <strong className="text-slate-900">
                                  Statutory Explanation:
                                </strong>{' '}
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          {latestQuizSubmission ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAnswers(
                                  new Array(
                                    lesson.quizConfig.questions.length
                                  ).fill(-1)
                                );
                                setLatestQuizSubmission(null);
                                setFeedbackBanner(null);
                              }}
                              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Retake Class Quiz</span>
                            </button>
                          ) : (
                            <div />
                          )}

                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <Award className="w-4 h-4" />
                            <span>Submit Class Quiz</span>
                          </button>
                        </div>
                      </form>

                      {/* Attempt History */}
                      {attempts.length > 0 && (
                        <div className="pt-4 border-t border-slate-200">
                          <h3 className="text-xs font-bold text-slate-500 mb-2.5">
                            Previous Quiz Attempt History
                          </h3>
                          <div className="space-y-1.5">
                            {attempts.slice(0, 4).map((att, i) => (
                              <div
                                key={att.attemptId}
                                className="flex items-center justify-between text-xs bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 font-mono tabular-nums"
                              >
                                <span>
                                  Attempt #{attempts.length - i} ·{' '}
                                  {new Date(att.submittedAt).toLocaleString()}
                                </span>
                                <span
                                  className={`font-bold ${
                                    att.passed
                                      ? 'text-emerald-700'
                                      : 'text-rose-600'
                                  }`}
                                >
                                  Score: {att.scorePercent}% (
                                  {att.passed ? 'PASSED' : 'FAILED'})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Footer Controls: Previous Class | Mark Complete & Next Material Route | Next Class */}
                <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-7 py-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={!hasPrevLesson}
                    onClick={() =>
                      hasPrevLesson &&
                      handleSelectLesson(currentLessonIndex - 1, mode)
                    }
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Class</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {mode !== 'quiz' && (
                      <button
                        type="button"
                        onClick={handleMarkCurrentSectionComplete}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </button>
                    )}

                    {/* Next Material Step within the Same Class */}
                    {mode === 'video' && (
                      <button
                        type="button"
                        onClick={() => handleNavigateMaterialRoute(lesson.lessonId, 'notes')}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Read Notes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {mode === 'notes' && (
                      <button
                        type="button"
                        onClick={() => handleNavigateMaterialRoute(lesson.lessonId, 'ppt')}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Presentation className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View PPT</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {mode === 'ppt' && (
                      <button
                        type="button"
                        onClick={() => handleNavigateMaterialRoute(lesson.lessonId, 'quiz')}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Take Quiz</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!hasNextLesson || !canOpenNextLesson}
                    onClick={() =>
                      hasNextLesson &&
                      canOpenNextLesson &&
                      handleSelectLesson(currentLessonIndex + 1, 'video')
                    }
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                    title={
                      !canOpenNextLesson
                        ? 'Complete current class Video, Notes & Quiz to unlock the next class'
                        : 'Go to next class'
                    }
                  >
                    <span>Next Class</span>
                    {!canOpenNextLesson && hasNextLesson ? (
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassLearningPage;
