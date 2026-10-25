import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { safeSetDoc } from '../contexts/LmsContext';

export type LmsContentTabType = 'live' | 'recorded' | 'note' | 'ppt' | 'mcq';

export interface LmsClassContentLinks {
  live: string;
  recorded: string;
  note: string;
  ppt: string;
  mcq: string;
}

export type LmsPortalDataMap = Record<string, LmsClassContentLinks>;

export const LMS_PORTAL_STORAGE_KEY = 'lmsData';

export const DEFAULT_LMS_PORTAL_DATA: LmsPortalDataMap = {
  'Class 01': {
    live: 'https://meet.google.com/',
    recorded: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    note: 'https://docs.google.com/document/d/e/2PACX-1vT.../pub?embedded=true',
    ppt: 'https://docs.google.com/presentation/d/e/2PACX-1vR.../embed?start=false&loop=false&delayms=3000',
    mcq: 'https://docs.google.com/forms/d/e/1FAIpQLSf.../viewform?embedded=true'
  },
  'Class 02': {
    live: 'https://zoom.us/j/123456789',
    recorded: '',
    note: '',
    ppt: '',
    mcq: ''
  },
  'Class 03': {
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

export function loadLmsPortalData(): LmsPortalDataMap {
  try {
    const raw = localStorage.getItem(LMS_PORTAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed as LmsPortalDataMap;
      }
    }
  } catch {
    // Fallback to defaults
  }
  const initial = cloneDefaultLmsData();
  try {
    localStorage.setItem(LMS_PORTAL_STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // Ignore storage error
  }
  return initial;
}

export async function saveLmsPortalData(data: LmsPortalDataMap): Promise<void> {
  try {
    localStorage.setItem(LMS_PORTAL_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('lmsDataUpdated', { detail: data }));
  } catch {
    // Ignore storage error
  }

  try {
    await safeSetDoc(
      doc(db, 'lms_portal_config', 'default'),
      {
        classes: data,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch {
    // Offline fallback is already handled by localStorage
  }
}

export async function syncLmsPortalDataFromFirestore(): Promise<LmsPortalDataMap | null> {
  try {
    const snap = await getDoc(doc(db, 'lms_portal_config', 'default'));
    if (snap.exists()) {
      const docData = snap.data();
      if (docData?.classes && typeof docData.classes === 'object' && Object.keys(docData.classes).length > 0) {
        const remote = docData.classes as LmsPortalDataMap;
        localStorage.setItem(LMS_PORTAL_STORAGE_KEY, JSON.stringify(remote));
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
