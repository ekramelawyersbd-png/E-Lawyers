import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { safeSetDoc } from '../contexts/LmsContext';
import { mockArticles } from '../data/mockData';

export type LmsContentTabType = 'live' | 'recorded' | 'note' | 'ppt' | 'mcq';

export interface LmsClassContentLinks {
  hasLiveClass?: boolean;
  live: string;
  recorded: string;
  note: string;
  ppt: string;
  mcq: string;
}

export type LmsPortalDataMap = Record<string, LmsClassContentLinks>;

export interface AcademyPortalCourseOption {
  id: string;
  title: string;
  categoryLabel: string;
}

const TRAINING_ARTICLE_IDS = ['400', '401', '402', '403', '404', '405', '406'];

/**
 * Builds the complete list of Academy courses from the /training page
 */
export function getAcademyPortalCourses(): AcademyPortalCourseOption[] {
  const fromTrainingArticles: AcademyPortalCourseOption[] = TRAINING_ARTICLE_IDS.map((id) => {
    const found = mockArticles.find((a) => a.id === id);
    return {
      id: `academy-course-${id}`,
      title: found ? found.title : `Academy Course #${id}`,
      categoryLabel: found?.category || 'Academy Program'
    };
  });

  const additionalAcademyPrograms: AcademyPortalCourseOption[] = [
    {
      id: 'interactive-lms-masterclass',
      title: 'Interactive LMS Portal: Tax & RJSC Masterclasses',
      categoryLabel: 'Online LMS Track'
    },
    {
      id: 'personal-income-tax',
      title: 'Personal Income Tax & Online e-Return Filing Masterclass (AY 2026–27)',
      categoryLabel: 'Live Masterclass'
    },
    {
      id: 'rjsc-corporate-compliance',
      title: 'Corporate Law, RJSC Company Registration & Annual Compliance Program',
      categoryLabel: 'Corporate Compliance'
    }
  ];

  // Deduplicate by title while keeping all /training Academy courses first
  const seenTitles = new Set<string>();
  const combined: AcademyPortalCourseOption[] = [];

  for (const item of [...fromTrainingArticles, ...additionalAcademyPrograms]) {
    const key = item.title.trim().toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      combined.push(item);
    }
  }

  return combined;
}

export const LMS_PORTAL_STORAGE_KEY = 'lmsData';

function getCourseStorageKey(courseId?: string): string {
  if (!courseId) return LMS_PORTAL_STORAGE_KEY;
  return `${LMS_PORTAL_STORAGE_KEY}_${courseId}`;
}

function getCourseFirestoreDocId(courseId?: string): string {
  if (!courseId) return 'default';
  return courseId.replace(/[^a-zA-Z0-9_-]/g, '_');
}

export const DEFAULT_LMS_PORTAL_DATA: LmsPortalDataMap = {
  'Class 01': {
    hasLiveClass: true,
    live: 'https://meet.google.com/',
    recorded: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    note: 'https://docs.google.com/document/d/e/2PACX-1vT.../pub?embedded=true',
    ppt: 'https://docs.google.com/presentation/d/e/2PACX-1vR.../embed?start=false&loop=false&delayms=3000',
    mcq: 'https://docs.google.com/forms/d/e/1FAIpQLSf.../viewform?embedded=true'
  },
  'Class 02': {
    hasLiveClass: true,
    live: 'https://zoom.us/j/123456789',
    recorded: '',
    note: '',
    ppt: '',
    mcq: ''
  },
  'Class 03': {
    hasLiveClass: false,
    live: '',
    recorded: '',
    note: '',
    ppt: '',
    mcq: ''
  }
};

export function cloneDefaultLmsData(): LmsPortalDataMap {
  return JSON.parse(JSON.stringify(DEFAULT_LMS_PORTAL_DATA));
}

export function loadLmsPortalData(courseId?: string): LmsPortalDataMap {
  const storageKey = getCourseStorageKey(courseId);
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed as LmsPortalDataMap;
      }
    }
    // Fallback to legacy default key if loading primary tax course
    if (
      courseId === 'academy-course-401' ||
      courseId === 'personal-income-tax'
    ) {
      const legacyRaw = localStorage.getItem(LMS_PORTAL_STORAGE_KEY);
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        if (
          legacyParsed &&
          typeof legacyParsed === 'object' &&
          Object.keys(legacyParsed).length > 0
        ) {
          return legacyParsed as LmsPortalDataMap;
        }
      }
    }
  } catch {
    // Fallback to defaults
  }
  const initial = cloneDefaultLmsData();
  try {
    localStorage.setItem(storageKey, JSON.stringify(initial));
  } catch {
    // Ignore storage error
  }
  return initial;
}

export async function saveLmsPortalData(
  data: LmsPortalDataMap,
  courseId?: string
): Promise<void> {
  const storageKey = getCourseStorageKey(courseId);
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    localStorage.setItem(LMS_PORTAL_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent('lmsDataUpdated', { detail: { courseId, data } })
    );
  } catch {
    // Ignore storage error
  }

  try {
    const docId = getCourseFirestoreDocId(courseId);
    await safeSetDoc(doc(db, 'lms_portal_config', docId), {
      courseId: courseId || 'default',
      classes: data,
      updatedAt: new Date().toISOString()
    });
  } catch {
    // Offline fallback is already handled by localStorage
  }
}

export async function syncLmsPortalDataFromFirestore(
  courseId?: string
): Promise<LmsPortalDataMap | null> {
  try {
    const docId = getCourseFirestoreDocId(courseId);
    const snap = await getDoc(doc(db, 'lms_portal_config', docId));
    if (snap.exists()) {
      const docData = snap.data();
      if (
        docData?.classes &&
        typeof docData.classes === 'object' &&
        Object.keys(docData.classes).length > 0
      ) {
        const remote = docData.classes as LmsPortalDataMap;
        localStorage.setItem(getCourseStorageKey(courseId), JSON.stringify(remote));
        return remote;
      }
    }
  } catch {
    // Ignore offline errors
  }
  return null;
}

/**
 * Normalizes common YouTube / Google Drive links so they can be embedded cleanly,
 * while preserving exact matching for youtube.com/embed, docs.google.com, drive.google.com, and meet.google.com.
 */
export function resolveEmbedBehavior(rawUrl: string): {
  isEmpty: boolean;
  canEmbed: boolean;
  embedUrl: string;
  originalUrl: string;
} {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return {
      isEmpty: true,
      canEmbed: false,
      embedUrl: '',
      originalUrl: ''
    };
  }

  let normalized = trimmed;

  // Convert standard youtube.com/watch?v=ID or youtu.be/ID into youtube.com/embed/ID
  try {
    if (trimmed.includes('youtube.com/watch')) {
      const u = new URL(trimmed);
      const v = u.searchParams.get('v');
      if (v) {
        normalized = `https://www.youtube.com/embed/${v}`;
      }
    } else if (trimmed.includes('youtu.be/')) {
      const parts = trimmed.split('youtu.be/')[1]?.split(/[?&]/)[0];
      if (parts) {
        normalized = `https://www.youtube.com/embed/${parts}`;
      }
    } else if (trimmed.includes('drive.google.com/file/d/') && trimmed.includes('/view')) {
      normalized = trimmed.replace('/view', '/preview');
    }
  } catch {
    // Keep original trimmed string
  }

  const canEmbed =
    normalized.includes('youtube.com/embed') ||
    normalized.includes('docs.google.com') ||
    normalized.includes('drive.google.com') ||
    normalized.includes('meet.google.com');

  return {
    isEmpty: false,
    canEmbed,
    embedUrl: normalized,
    originalUrl: trimmed
  };
}
