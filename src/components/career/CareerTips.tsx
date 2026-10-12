import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight, BookOpen, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface CareerTip {
  id: number;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  points: string[];
  icon: string;
}

const CAREER_TIPS: CareerTip[] = [
  {
    id: 1,
    title: 'How to Prepare for a Computer-Based Test (CBT)',
    category: 'Assessment Prep',
    readTime: '3 min read',
    summary: 'Master our technical evaluation tests with structured preparation and time management.',
    points: [
      'Review core competencies in accounting principles, taxation rules, or legal advisory.',
      'Practice timed multiple-choice questions to improve pacing under pressure.',
      'Ensure a quiet environment and stable internet connection before starting.'
    ],
    icon: '💻'
  },
  {
    id: 2,
    title: 'Tips for a Successful Professional Interview',
    category: 'Interview Success',
    readTime: '4 min read',
    summary: 'Stand out during your panel interview by showcasing domain expertise and practical insights.',
    points: [
      'Understand E-Lawyers dual division structure (Legal & Accounts advisory).',
      'Prepare concrete examples of past bookkeeping, audit defense, or contract drafting experience.',
      'Demonstrate clear problem-solving methodology and client communication skills.'
    ],
    icon: '🎯'
  },
  {
    id: 3,
    title: 'Crafting a Winning CV & Cover Letter',
    category: 'Application Guide',
    readTime: '3 min read',
    summary: 'Highlight your academic background, professional certifications, and technical proficiencies.',
    points: [
      'Keep your resume concise (1-2 pages) with clear chronological milestones.',
      'Feature relevant qualifications (e.g., LLB, LLM, ACA, ACCA, BBA in Accounting).',
      'Tailor your cover letter to explain why you are passionate about corporate legal & financial consulting.'
    ],
    icon: '📄'
  },
  {
    id: 4,
    title: 'Professional Etiquette & Interview Day Readiness',
    category: 'Best Practices',
    readTime: '2 min read',
    summary: 'Make a stellar first impression with punctuality, professional attire, and preparation.',
    points: [
      'Arrive 10 minutes early for on-site interviews or test your camera/mic beforehand.',
      'Dress in formal business attire reflecting corporate standards.',
      'Bring printed copies of your CV, certificates, and valid identification.'
    ],
    icon: '👔'
  }
];

export function CareerTips() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAREER_TIPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentTip = CAREER_TIPS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CAREER_TIPS.length) % CAREER_TIPS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAREER_TIPS.length);
  };

  return (
    <section 
      className="my-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Expert Career Guidance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Career Tips & Interview Advice
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-500 mr-2">
            Tip {currentIndex + 1} of {CAREER_TIPS.length}
          </span>
          <button
            onClick={handlePrev}
            aria-label="Previous tip"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next tip"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl p-3 bg-white rounded-2xl shadow-sm border border-slate-200 inline-block">
                {currentTip.icon}
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  {currentTip.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentTip.readTime}</span>
                </div>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {currentTip.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentTip.summary}
            </p>
          </div>

          <div className="lg:col-span-8 bg-white/90 backdrop-blur-xs rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key Takeaways & Actionable Steps</span>
            </div>

            <ul className="space-y-3">
              {currentTip.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Hover over card to pause auto-rotation</span>
              <div className="flex items-center gap-1.5">
                {CAREER_TIPS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to tip ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === idx ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
