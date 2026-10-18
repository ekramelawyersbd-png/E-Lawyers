import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Flame, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Trophy, 
  Crown, 
  Zap, 
  BookMarked, 
  Calculator, 
  Building2, 
  FileText, 
  Share2, 
  Check, 
  X, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { usePurchases } from '../../contexts/PurchaseContext';
import { AchievementCelebrationModal } from './AchievementCelebrationModal';

export interface AchievementBadge {
  id: string;
  title: string;
  bengaliTitle: string;
  description: string;
  iconName: 'Flame' | 'Calculator' | 'Building2' | 'ShieldCheck' | 'BookMarked' | 'Trophy' | 'Crown' | 'Zap';
  category: 'Streak & Habits' | 'Tax Expertise' | 'Corporate Governance' | 'Library & Tools';
  currentValue: number;
  targetValue: number;
  unlocked: boolean;
  unlockedAt?: string;
  rewardNote: string;
}

const STORAGE_KEY_STREAK = 'accounticca_daily_streak_v1';

export const UserBadgesSection: React.FC = () => {
  const { savedItems } = useBookmarks();
  const { purchasedProductIds } = usePurchases();
  const [copiedBadgeId, setCopiedBadgeId] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Load active streak days from localStorage
  const streakDays = useMemo(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STREAK);
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 5;
  }, []);

  // Compute live achievement badges based on user activity state
  const badges: AchievementBadge[] = useMemo(() => {
    return [
      {
        id: 'consistency-king',
        title: 'Consistency King',
        bengaliTitle: 'ধারাবাহিকতার প্রফেশনাল',
        description: 'Maintain a 5-day consecutive active streak in reading tax dispatches and completing daily goals.',
        iconName: 'Crown',
        category: 'Streak & Habits',
        currentValue: streakDays,
        targetValue: 5,
        unlocked: streakDays >= 5,
        unlockedAt: 'Oct 15, 2026',
        rewardNote: '+100 XP Compliance Master Status'
      },
      {
        id: 'tax-master',
        title: 'Tax Assessment Master',
        bengaliTitle: 'আয়কর হিসাব বিশেষজ্ঞ',
        description: 'Practice and complete 3+ individual or corporate tax assessment calculation simulations.',
        iconName: 'Calculator',
        category: 'Tax Expertise',
        currentValue: 3,
        targetValue: 3,
        unlocked: true,
        unlockedAt: 'Oct 12, 2026',
        rewardNote: 'Unlocked Income Tax Slices Certification Badge'
      },
      {
        id: 'rjsc-scholar',
        title: 'RJSC Corporate Scholar',
        bengaliTitle: 'যৌথমূলধন আইন গবেষক',
        description: 'Master company incorporation rules, MoA/AoA clauses, and statutory returns (Schedule X, Form XII).',
        iconName: 'Building2',
        category: 'Corporate Governance',
        currentValue: 2,
        targetValue: 3,
        unlocked: false,
        rewardNote: 'Complete 1 more corporate dispatch to unlock'
      },
      {
        id: 'master-collector',
        title: 'Master Library Collector',
        bengaliTitle: 'নথি ও আইন সংগ্রাহক',
        description: 'Save 5+ statutory guides, NBR SROs, and tax policy analysis articles in your personal dashboard.',
        iconName: 'BookMarked',
        category: 'Library & Tools',
        currentValue: savedItems.length,
        targetValue: 5,
        unlocked: savedItems.length >= 5,
        unlockedAt: savedItems.length >= 5 ? 'Oct 14, 2026' : undefined,
        rewardNote: 'Permanent Cloud Synchronization Access'
      },
      {
        id: 'vat-shield',
        title: 'VAT & VDS Shield',
        bengaliTitle: 'উৎস কর ও মূসক রক্ষক',
        description: 'Review Mushak 9.1 return preparation rules, VDS withholding tables, and SRO exemptions.',
        iconName: 'ShieldCheck',
        category: 'Tax Expertise',
        currentValue: 4,
        targetValue: 4,
        unlocked: true,
        unlockedAt: 'Oct 10, 2026',
        rewardNote: 'Verified VDS Compliance Practitioner Badge'
      },
      {
        id: 'tool-pro',
        title: 'Pro Tool Owner',
        bengaliTitle: 'প্রফেশনাল টুল ব্যবহারকারী',
        description: 'Unlock 1+ professional shop tools or interactive compliance calculators.',
        iconName: 'Zap',
        category: 'Library & Tools',
        currentValue: purchasedProductIds.length,
        targetValue: 1,
        unlocked: purchasedProductIds.length >= 1,
        unlockedAt: purchasedProductIds.length >= 1 ? 'Oct 08, 2026' : undefined,
        rewardNote: 'Unlocked Permanent Tool License'
      }
    ];
  }, [streakDays, savedItems.length, purchasedProductIds.length]);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalBadges = badges.length;

  const filteredBadges = useMemo(() => {
    if (filterTab === 'unlocked') return badges.filter(b => b.unlocked);
    if (filterTab === 'locked') return badges.filter(b => !b.unlocked);
    return badges;
  }, [badges, filterTab]);

  const handleShareBadge = (badge: AchievementBadge, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `🏆 I earned the '${badge.title}' (${badge.bengaliTitle}) Virtual Achievement on Accounticca & E-Lawyers Compliance Hub!`;
    navigator.clipboard.writeText(text);
    setCopiedBadgeId(badge.id);
    setTimeout(() => setCopiedBadgeId(null), 2500);
  };

  const getBadgeIcon = (iconName: AchievementBadge['iconName']) => {
    switch (iconName) {
      case 'Crown':
        return Crown;
      case 'Calculator':
        return Calculator;
      case 'Building2':
        return Building2;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'BookMarked':
        return BookMarked;
      case 'Zap':
        return Zap;
      case 'Flame':
        return Flame;
      default:
        return Award;
    }
  };

  return (
    <div id="user-badges-section-card" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Trophy className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">Virtual Achievements & Compliance Badges</h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span>{unlockedCount}/{totalBadges} Badges Unlocked!</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Earn gamified virtual achievements by maintaining your daily learning streak, reading dispatches, and using tax tools
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setShowCelebrationModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-colors cursor-pointer"
            title="Open Streak Milestone Celebration Modal"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Celebrate Milestones</span>
          </button>

          {/* Filter Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
            {(['all', 'unlocked', 'locked'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer capitalize ${
                  filterTab === tab 
                    ? 'bg-white text-slate-900 font-bold shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'all' ? `All (${totalBadges})` : tab === 'unlocked' ? `Unlocked (${unlockedCount})` : `Locked (${totalBadges - unlockedCount})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          const Icon = getBadgeIcon(badge.iconName);
          const percent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 group overflow-hidden ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-50/60 via-white to-emerald-50/40 border-amber-200/90 hover:border-amber-400 shadow-xs hover:shadow-md'
                  : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300 text-slate-400'
              }`}
            >
              {/* Unlocked Confetti Glow Accent */}
              {badge.unlocked && (
                <div className="absolute -right-10 -top-10 w-28 h-28 bg-amber-400/15 rounded-full blur-xl pointer-events-none" />
              )}

              <div className="space-y-3 relative z-10">
                {/* Top Badge Icon & Status Pill */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                    badge.unlocked 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' 
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {badge.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-900 bg-amber-100/90 border border-amber-300 px-2.5 py-1 rounded-full shadow-2xs">
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      <span>Unlocked 🏆</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>In Progress</span>
                    </span>
                  )}
                </div>

                {/* Badge Titles */}
                <div>
                  <h4 className={`text-base font-extrabold leading-snug ${
                    badge.unlocked ? 'text-slate-900 group-hover:text-amber-900' : 'text-slate-600'
                  }`}>
                    {badge.title}
                  </h4>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    {badge.bengaliTitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {/* Progress & Reward Footer */}
              <div className="space-y-2 pt-3 border-t border-slate-100 relative z-10">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-500 uppercase tracking-wider">Progress</span>
                  <span className={badge.unlocked ? 'text-emerald-700' : 'text-slate-600'}>
                    {badge.currentValue}/{badge.targetValue} ({percent}%)
                  </span>
                </div>

                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      badge.unlocked ? 'bg-gradient-to-r from-amber-500 to-emerald-500' : 'bg-slate-400'
                    }`} 
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="truncate pr-2 font-medium">{badge.rewardNote}</span>
                  {badge.unlocked && (
                    <button
                      onClick={(e) => handleShareBadge(badge, e)}
                      className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer shrink-0"
                      title="Share achievement"
                    >
                      {copiedBadgeId === badge.id ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Copied
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <Share2 className="w-3 h-3" /> Share
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* BADGE DETAIL MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg">
              {React.createElement(getBadgeIcon(selectedBadge.iconName), { className: 'w-10 h-10' })}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                {selectedBadge.category}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">{selectedBadge.title}</h3>
              <p className="text-sm font-bold text-emerald-700">{selectedBadge.bengaliTitle}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              {selectedBadge.description}
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Status:</span>
                <span className={selectedBadge.unlocked ? 'text-amber-800 font-extrabold' : 'text-slate-600 font-bold'}>
                  {selectedBadge.unlocked ? `Unlocked on ${selectedBadge.unlockedAt || 'Recently'}` : 'Locked (In Progress)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Criteria Progress:</span>
                <span className="font-extrabold text-slate-900">{selectedBadge.currentValue} / {selectedBadge.targetValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Achievement Perk:</span>
                <span className="font-bold text-emerald-700">{selectedBadge.rewardNote}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={(e) => handleShareBadge(selectedBadge, e)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Achievement on Social Media</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Celebration Modal */}
      <AchievementCelebrationModal
        isOpen={showCelebrationModal}
        onClose={() => setShowCelebrationModal(false)}
        currentStreak={streakDays}
      />

    </div>
  );
};

export default UserBadgesSection;
