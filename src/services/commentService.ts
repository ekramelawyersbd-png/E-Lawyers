import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  increment,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

export type ProfessionalRole = 
  | 'advocate_supreme_court'
  | 'advocate_district_court'
  | 'barrister'
  | 'chartered_accountant'
  | 'cost_management_accountant'
  | 'tax_practitioner'
  | 'corporate_counsel'
  | 'legal_academic'
  | 'finance_director'
  | 'general_practitioner';

export interface ProfessionalRoleInfo {
  value: ProfessionalRole;
  label: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  iconType: 'scales' | 'calculator' | 'briefcase' | 'award';
}

export const PROFESSIONAL_ROLES: ProfessionalRoleInfo[] = [
  {
    value: 'advocate_supreme_court',
    label: 'Advocate, Supreme Court of Bangladesh',
    badgeColor: 'text-indigo-800',
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    iconType: 'scales'
  },
  {
    value: 'barrister',
    label: 'Barrister-at-Law',
    badgeColor: 'text-purple-800',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    iconType: 'scales'
  },
  {
    value: 'advocate_district_court',
    label: 'Advocate, District & Sessions Court',
    badgeColor: 'text-sky-800',
    badgeBg: 'bg-sky-50',
    badgeBorder: 'border-sky-200',
    iconType: 'scales'
  },
  {
    value: 'chartered_accountant',
    label: 'Chartered Accountant (FCA / ACA - ICAB)',
    badgeColor: 'text-emerald-800',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    iconType: 'calculator'
  },
  {
    value: 'cost_management_accountant',
    label: 'Cost & Management Accountant (FCMA / ACMA)',
    badgeColor: 'text-teal-800',
    badgeBg: 'bg-teal-50',
    badgeBorder: 'border-teal-200',
    iconType: 'calculator'
  },
  {
    value: 'tax_practitioner',
    label: 'Income Tax Practitioner (ITP) / VAT Consultant',
    badgeColor: 'text-amber-900',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    iconType: 'calculator'
  },
  {
    value: 'corporate_counsel',
    label: 'In-House Legal Counsel / Company Secretary',
    badgeColor: 'text-blue-800',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    iconType: 'briefcase'
  },
  {
    value: 'finance_director',
    label: 'CFO / Corporate Finance Director',
    badgeColor: 'text-cyan-900',
    badgeBg: 'bg-cyan-50',
    badgeBorder: 'border-cyan-200',
    iconType: 'calculator'
  },
  {
    value: 'legal_academic',
    label: 'Law Professor / Legal Researcher',
    badgeColor: 'text-rose-800',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    iconType: 'award'
  },
  {
    value: 'general_practitioner',
    label: 'Corporate & Legal Professional',
    badgeColor: 'text-slate-700',
    badgeBg: 'bg-slate-100',
    badgeBorder: 'border-slate-200',
    iconType: 'briefcase'
  }
];

export const DISCUSSION_TOPIC_TAGS = [
  'Statutory Interpretation',
  'Practical Audit & Filing',
  'High Court Precedent',
  'NBR SRO Clarification',
  'Penalty & Dispute Defense',
  'General Discussion'
];

export interface CommentItem {
  id: string;
  articleId: string;
  userId?: string;
  authorName: string;
  authorEmail?: string;
  role: ProfessionalRole;
  roleLabel: string;
  organization?: string;
  statutoryRef?: string;
  topicTag?: string;
  avatar: string;
  text: string;
  date: string;
  helpfulCount: number;
  parentId?: string | null;
  isVerifiedProfessional?: boolean;
}

// Initial realistic peer discussions seeded for Bangladesh law & accounting professionals
const DEFAULT_SEED_DISCUSSIONS: Record<string, CommentItem[]> = {
  default: [
    {
      id: 'seed-comment-1',
      articleId: 'default',
      authorName: 'Adv. Barrister Tanjim Al-Islam',
      role: 'barrister',
      roleLabel: 'Barrister-at-Law & Advocate, Supreme Court of Bangladesh',
      organization: 'Tanjim & Associates Chambers, Supreme Court Bar',
      statutoryRef: 'Section 272(2), Income Tax Act 2023',
      topicTag: 'Statutory Interpretation',
      avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=faces',
      text: 'From a litigation standpoint before the High Court Division, the procedural hurdle under Section 272 is that the Deputy Commissioner of Taxes (DCT) must establish willful failure before applying punitive compounding penalties. Practicing counsel should always ensure the formal notice issued under Section 272 cites clear grounds rather than standard template assertions.',
      date: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      helpfulCount: 14,
      parentId: null,
      isVerifiedProfessional: true
    },
    {
      id: 'seed-comment-2',
      articleId: 'default',
      authorName: 'Mohammad Farhad Hossain, FCA',
      role: 'chartered_accountant',
      roleLabel: 'Chartered Accountant (FCA - ICAB)',
      organization: 'Farhad & Co., Chartered Accountants',
      statutoryRef: 'VAT & SD Act 2012, Third Schedule',
      topicTag: 'Practical Audit & Filing',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      text: 'When preparing the tax reconciliation statement (Mushak 9.1 vs audited financial statements), auditors often observe variance due to timing differences in export LC realizations. Ensuring documented proof of bill of lading (BL) and PRC (Proceeds Realization Certificate) eliminates 90% of DCT scrutiny during assessment proceedings.',
      date: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      helpfulCount: 11,
      parentId: null,
      isVerifiedProfessional: true
    },
    {
      id: 'seed-comment-3',
      articleId: 'default',
      authorName: 'Nasrin Sultana, ITP',
      role: 'tax_practitioner',
      roleLabel: 'Income Tax Practitioner (ITP) & VAT Consultant',
      organization: 'Dhaka Taxes Bar Association',
      statutoryRef: 'NBR SRO No. 182-Ain/2023',
      topicTag: 'NBR SRO Clarification',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces',
      text: 'Note that the revised SRO provides an extension window for submission of withholding tax returns under Section 177. If clients faced e-TIN verification portal timeouts during month-end, keep the server timestamp log saved as evidence.',
      date: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      helpfulCount: 8,
      parentId: 'seed-comment-1',
      isVerifiedProfessional: true
    }
  ]
};

const getLocalCacheKey = (articleId: string) => `accounticca_comments_${articleId}`;

/**
 * Read comments from localStorage cache
 */
export function getLocalCachedComments(articleId: string): CommentItem[] {
  try {
    const raw = localStorage.getItem(getLocalCacheKey(articleId));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to read local comments cache', err);
  }

  // Fallback to default seed discussions tailored for Bangladesh law
  const seeds = DEFAULT_SEED_DISCUSSIONS[articleId] || DEFAULT_SEED_DISCUSSIONS.default;
  return seeds.map(s => ({ ...s, articleId }));
}

/**
 * Save comments to localStorage cache
 */
export function setLocalCachedComments(articleId: string, items: CommentItem[]) {
  try {
    localStorage.setItem(getLocalCacheKey(articleId), JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to update local comments cache', err);
  }
}

/**
 * Subscribe to real-time comments from Firestore for a given article
 */
export function subscribeToArticleComments(
  articleId: string,
  onUpdate: (comments: CommentItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const commentsCol = 'comments';
  const q = query(
    collection(db, commentsCol),
    where('articleId', '==', articleId)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // Return local or seed comments
        const local = getLocalCachedComments(articleId);
        onUpdate(local);
        return;
      }

      const cloudComments: CommentItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudComments.push({
          id: docSnap.id,
          articleId: data.articleId || articleId,
          userId: data.userId,
          authorName: data.authorName || 'Anonymous Professional',
          authorEmail: data.authorEmail,
          role: data.role || 'general_practitioner',
          roleLabel: data.roleLabel || 'Legal & Tax Professional',
          organization: data.organization || '',
          statutoryRef: data.statutoryRef || '',
          topicTag: data.topicTag || 'Statutory Interpretation',
          avatar: data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.authorName || 'Counsel')}`,
          text: data.text || '',
          date: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.date || new Date().toISOString(),
          helpfulCount: data.helpfulCount || 0,
          parentId: data.parentId || null,
          isVerifiedProfessional: data.isVerifiedProfessional ?? true
        });
      });

      // Merge with seed comments if needed
      const seeds = DEFAULT_SEED_DISCUSSIONS[articleId] || DEFAULT_SEED_DISCUSSIONS.default;
      const combinedMap = new Map<string, CommentItem>();
      seeds.forEach(s => combinedMap.set(s.id, { ...s, articleId }));
      cloudComments.forEach(c => combinedMap.set(c.id, c));

      const merged = Array.from(combinedMap.values());
      setLocalCachedComments(articleId, merged);
      onUpdate(merged);
    },
    (error) => {
      console.warn('Firestore comments subscription fallback to local cache:', error);
      try {
        handleFirestoreError(error, OperationType.LIST, commentsCol);
      } catch {
        // Fallback gracefully
      }
      onUpdate(getLocalCachedComments(articleId));
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Post a new professional comment or reply
 */
export async function postProfessionalComment(
  newCommentData: Omit<CommentItem, 'id' | 'date' | 'helpfulCount'>
): Promise<CommentItem> {
  const commentId = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const dateIso = new Date().toISOString();

  const commentItem: CommentItem = {
    ...newCommentData,
    id: commentId,
    date: dateIso,
    helpfulCount: 0,
    isVerifiedProfessional: true
  };

  // 1. Immediately update local storage for responsive UI
  const existing = getLocalCachedComments(newCommentData.articleId);
  const updatedList = [commentItem, ...existing];
  setLocalCachedComments(newCommentData.articleId, updatedList);

  // 2. Persist to Firestore
  const commentsCol = 'comments';
  try {
    const docRef = doc(db, commentsCol, commentId);
    await setDoc(docRef, {
      articleId: newCommentData.articleId,
      userId: newCommentData.userId || null,
      authorName: newCommentData.authorName,
      authorEmail: newCommentData.authorEmail || null,
      role: newCommentData.role,
      roleLabel: newCommentData.roleLabel,
      organization: newCommentData.organization || '',
      statutoryRef: newCommentData.statutoryRef || '',
      topicTag: newCommentData.topicTag || 'Statutory Interpretation',
      avatar: newCommentData.avatar,
      text: newCommentData.text,
      parentId: newCommentData.parentId || null,
      helpfulCount: 0,
      isVerifiedProfessional: true,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn('Could not save comment to Firestore (offline fallback used):', error);
    try {
      handleFirestoreError(error, OperationType.CREATE, commentsCol);
    } catch {
      // Local cache already holds the comment
    }
  }

  window.dispatchEvent(new CustomEvent('articleCommentsUpdated', { detail: { articleId: newCommentData.articleId } }));
  return commentItem;
}

/**
 * Endorse / Mark a professional comment as helpful
 */
export async function toggleEndorsement(
  articleId: string,
  commentId: string,
  userVoted: boolean
): Promise<number> {
  const local = getLocalCachedComments(articleId);
  const target = local.find(c => c.id === commentId);
  let newCount = target?.helpfulCount || 0;

  if (target) {
    newCount = userVoted ? Math.max(0, target.helpfulCount - 1) : target.helpfulCount + 1;
    target.helpfulCount = newCount;
    setLocalCachedComments(articleId, local);
  }

  // Update in Firestore
  const commentsCol = 'comments';
  try {
    const docRef = doc(db, commentsCol, commentId);
    await updateDoc(docRef, {
      helpfulCount: increment(userVoted ? -1 : 1)
    });
  } catch (error) {
    // Suppress for client UI speed
    console.warn('Could not sync endorsement to Firestore:', error);
  }

  window.dispatchEvent(new CustomEvent('articleCommentsUpdated', { detail: { articleId } }));
  return newCount;
}
