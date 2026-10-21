import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  LayoutGrid,
  LayoutList,
  Volume2,
  Square,
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Pencil,
  Plus,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  FileText,
  Eye,
  Crosshair,
  Sun,
  Moon,
  Award,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { StatutoryPdfSlide } from './ProtectedPdfReader';

export interface ParsedPptxSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  speakerNotes: string;
  imageUrls: string[];
}

export interface ProtectedPptReaderProps {
  /** Signed R2 URL or external PPT/PDF URL if uploaded */
  pptUrl?: string | null;
  /** R2 object key if stored in R2 */
  r2ObjectKey?: string;
  /** Uploaded file name */
  fileName?: string;
  /** Uploaded file MIME type */
  mimeType?: string;
  /** File size in bytes */
  fileSizeBytes?: number;
  /** Deck title */
  title: string;
  /** Deck code e.g. PIT-DECK-01 */
  deckCode: string;
  /** Course/lesson subtitle */
  subtitle?: string;
  /** Dynamic student security watermark */
  watermarkText: string;
  /** Structured slides for the class */
  slides: StatutoryPdfSlide[];
  /** Active slide index (0-based) */
  activeSlideIndex: number;
  /** Callback when active slide changes (0-based) */
  onSlideChange: (slideIndex: number) => void;
  /** Array of slide numbers (1-based) already viewed */
  viewedSlideNumbers?: number[];
  /** Callback when user marks PPT deck reviewed */
  onMarkDeckReviewed?: () => void;
  /** Whether signed R2 URL is loading */
  isLoadingSignedUrl?: boolean;
  /** Retry fetching signed R2 URL */
  onRetrySignedUrl?: () => void;
  /** Admin callback to save edited slides and deck title */
  onAdminSaveSlides?: (updatedSlides: StatutoryPdfSlide[], updatedTitle: string) => void;
  /** Whether admin edit controls are enabled */
  isAdmin?: boolean;
}

type DeckViewMode = 'slide-stage' | 'pptx-parsed' | 'pdf-canvas' | 'embedded-deck' | 'grid-sorter';
type SlideTheme = 'executive-dark' | 'courtroom-ivory' | 'emerald-boardroom';

const EMPTY_SLIDES: StatutoryPdfSlide[] = [];
const EMPTY_VIEWED: number[] = [];

const PDFJS_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function loadPdfJsForPpt(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window unavailable'));
  const w = window as any;
  if (w.pdfjsLib) {
    w.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    return Promise.resolve(w.pdfjsLib);
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PDFJS_CDN_URL;
    script.async = true;
    script.onload = () => {
      if (w.pdfjsLib) {
        w.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        resolve(w.pdfjsLib);
      } else {
        reject(new Error('PDF.js global not found'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Parses an OpenXML .pptx binary ArrayBuffer using JSZip and extracts slide titles,
 * subtitles, bullet points, speaker notes, and embedded slide images.
 */
async function parsePptxArrayBuffer(buffer: ArrayBuffer): Promise<ParsedPptxSlide[]> {
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
      const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
      return numA - numB;
    });

  if (slideFiles.length === 0) {
    throw new Error('No slides found inside the .pptx archive.');
  }

  const parser = new DOMParser();
  const parsedSlides: ParsedPptxSlide[] = [];

  for (let i = 0; i < slideFiles.length; i++) {
    const slidePath = slideFiles[i];
    const slideNum = i + 1;
    const xmlText = await zip.files[slidePath].async('string');
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    let title = '';
    let subtitle = '';
    const bullets: string[] = [];

    // Inspect shape elements (<p:sp>)
    const shapes = Array.from(xmlDoc.getElementsByTagNameNS('*', 'sp'));
    shapes.forEach((sp) => {
      const ph = sp.getElementsByTagNameNS('*', 'ph')[0];
      const phType = ph?.getAttribute('type') || '';

      const paragraphs = Array.from(sp.getElementsByTagNameNS('*', 'p'));
      const paraTexts: string[] = [];

      paragraphs.forEach((p) => {
        const textNodes = Array.from(p.getElementsByTagNameNS('*', 't'));
        const line = textNodes
          .map((t) => t.textContent || '')
          .join('')
          .trim();
        if (line) paraTexts.push(line);
      });

      if (paraTexts.length === 0) return;

      if ((phType === 'title' || phType === 'ctrTitle') && !title) {
        title = paraTexts.join(' — ');
      } else if ((phType === 'subTitle' || phType === 'body') && !subtitle && title && paraTexts.length === 1 && bullets.length === 0) {
        subtitle = paraTexts[0];
      } else {
        paraTexts.forEach((line) => {
          if (!title) {
            title = line;
          } else if (line !== title) {
            bullets.push(line);
          }
        });
      }
    });

    // Fallback: if no <p:sp> matched, collect all <a:t>
    if (!title && bullets.length === 0) {
      const allT = Array.from(xmlDoc.getElementsByTagNameNS('*', 't'))
        .map((n) => (n.textContent || '').trim())
        .filter(Boolean);
      if (allT.length > 0) {
        title = allT[0];
        bullets.push(...allT.slice(1));
      }
    }

    // Extract speaker notes if present (ppt/notesSlides/notesSlideN.xml)
    let speakerNotes = '';
    const notesPath = `ppt/notesSlides/notesSlide${slideNum}.xml`;
    if (zip.files[notesPath]) {
      try {
        const notesXml = await zip.files[notesPath].async('string');
        const notesDoc = parser.parseFromString(notesXml, 'application/xml');
        const noteTextNodes = Array.from(notesDoc.getElementsByTagNameNS('*', 't'))
          .map((t) => (t.textContent || '').trim())
          .filter((txt) => txt && txt !== String(slideNum));
        speakerNotes = noteTextNodes.join(' ');
      } catch {
        // ignore notes parse error
      }
    }

    // Extract embedded slide images via ppt/slides/_rels/slideN.xml.rels
    const imageUrls: string[] = [];
    const relsPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
    if (zip.files[relsPath]) {
      try {
        const relsXml = await zip.files[relsPath].async('string');
        const relsDoc = parser.parseFromString(relsXml, 'application/xml');
        const relNodes = Array.from(relsDoc.getElementsByTagName('Relationship'));
        for (const rel of relNodes) {
          const target = rel.getAttribute('Target') || '';
          const type = rel.getAttribute('Type') || '';
          if (type.includes('/image') && target) {
            const normalizedPath = target.replace(/^\.\.\//, 'ppt/');
            const mediaFile = zip.files[normalizedPath];
            if (mediaFile) {
              const ext = normalizedPath.split('.').pop()?.toLowerCase() || 'png';
              const mime =
                ext === 'jpg' || ext === 'jpeg'
                  ? 'image/jpeg'
                  : ext === 'svg'
                  ? 'image/svg+xml'
                  : ext === 'gif'
                  ? 'image/gif'
                  : 'image/png';
              const base64 = await mediaFile.async('base64');
              imageUrls.push(`data:${mime};base64,${base64}`);
            }
          }
        }
      } catch {
        // ignore image extraction error
      }
    }

    parsedSlides.push({
      slideNumber: slideNum,
      title: title || `Slide ${slideNum}`,
      subtitle: subtitle || `Uploaded Presentation Deck · Slide ${slideNum}`,
      bulletPoints: bullets.length > 0 ? bullets : ['Visual slide content rendered from uploaded .pptx presentation.'],
      speakerNotes,
      imageUrls,
    });
  }

  return parsedSlides;
}

export const ProtectedPptReader: React.FC<ProtectedPptReaderProps> = ({
  pptUrl,
  r2ObjectKey,
  fileName,
  mimeType,
  fileSizeBytes,
  title,
  deckCode,
  subtitle,
  watermarkText,
  slides = EMPTY_SLIDES,
  activeSlideIndex = 0,
  onSlideChange,
  viewedSlideNumbers = EMPTY_VIEWED,
  onMarkDeckReviewed,
  isLoadingSignedUrl = false,
  onRetrySignedUrl,
  onAdminSaveSlides,
  isAdmin = true,
}) => {
  const hasUploadedFile = Boolean(pptUrl || r2ObjectKey);
  const lowerFileName = (fileName || r2ObjectKey || pptUrl || '').toLowerCase();
  const isUploadedPdf =
    mimeType === 'application/pdf' || lowerFileName.endsWith('.pdf');
  const isUploadedPptx =
    lowerFileName.endsWith('.pptx') ||
    lowerFileName.endsWith('.ppt') ||
    mimeType?.includes('presentation');

  const [viewMode, setViewMode] = useState<DeckViewMode>(() => {
    if (hasUploadedFile && isUploadedPdf) return 'pdf-canvas';
    if (hasUploadedFile && isUploadedPptx) return 'pptx-parsed';
    return 'slide-stage';
  });

  const [slideTheme, setSlideTheme] = useState<SlideTheme>('executive-dark');
  const [zoom, setZoom] = useState<number>(100);
  const [showFilmstrip, setShowFilmstrip] = useState<boolean>(true);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [laserEnabled, setLaserEnabled] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [securityToast, setSecurityToast] = useState<string | null>(null);
  const [adminSaveNotice, setAdminSaveNotice] = useState<string | null>(null);

  // Parsed .pptx slides state
  const [pptxSlides, setPptxSlides] = useState<ParsedPptxSlide[]>([]);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [fileLoadError, setFileLoadError] = useState<string | null>(null);

  // PDF.js state when deck is a .pdf
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPdfPages, setNumPdfPages] = useState<number>(0);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);

  // Admin Edit Mode State
  const [isAdminEditing, setIsAdminEditing] = useState<boolean>(false);
  const [draftTitle, setDraftTitle] = useState<string>(title);
  const [draftSlides, setDraftSlides] = useState<StatutoryPdfSlide[]>(slides);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideStageRef = useRef<HTMLDivElement>(null);

  // Proxied binary URL for fetching R2 / external PPTX or PDF
  const proxiedDeckUrl = useMemo(() => {
    if (!pptUrl && !r2ObjectKey) return null;
    if (pptUrl && pptUrl.startsWith('/api/r2/local-object/')) {
      return pptUrl;
    }
    const params = new URLSearchParams();
    if (pptUrl) params.set('url', pptUrl);
    if (r2ObjectKey) params.set('objectKey', r2ObjectKey);
    return `/api/r2/pdf-proxy?${params.toString()}`;
  }, [pptUrl, r2ObjectKey]);

  // Switch initial mode when uploaded file changes
  useEffect(() => {
    if (hasUploadedFile && isUploadedPdf) {
      setViewMode('pdf-canvas');
    } else if (hasUploadedFile && isUploadedPptx) {
      setViewMode('pptx-parsed');
    } else if (!hasUploadedFile) {
      setViewMode('slide-stage');
    }
  }, [hasUploadedFile, isUploadedPdf, isUploadedPptx]);

  // Load and parse uploaded .pptx or .pdf file
  const loadUploadedDeck = useCallback(async () => {
    if (!proxiedDeckUrl) return;
    setIsLoadingFile(true);
    setFileLoadError(null);

    try {
      const res = await fetch(proxiedDeckUrl);
      if (!res.ok) {
        throw new Error(`Unable to fetch presentation deck stream (HTTP ${res.status}).`);
      }
      const arrayBuffer = await res.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength < 16) {
        throw new Error('Presentation file stream is empty.');
      }

      // Check magic bytes: '%PDF' (0x25 0x50 0x44 0x46) vs 'PK' ZIP/PPTX (0x50 0x4B)
      const headerView = new Uint8Array(arrayBuffer, 0, 4);
      const isPdfBytes =
        headerView[0] === 0x25 &&
        headerView[1] === 0x50 &&
        headerView[2] === 0x44 &&
        headerView[3] === 0x46;
      const isZipBytes = headerView[0] === 0x50 && headerView[1] === 0x4b;

      if (isPdfBytes || (isUploadedPdf && !isZipBytes)) {
        const pdfjsLib = await loadPdfJsForPpt();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setNumPdfPages(doc.numPages || 1);
        setViewMode('pdf-canvas');
      } else if (isZipBytes || isUploadedPptx) {
        const extracted = await parsePptxArrayBuffer(arrayBuffer);
        setPptxSlides(extracted);
        setViewMode('pptx-parsed');
      } else {
        setViewMode('embedded-deck');
      }
    } catch (err: any) {
      console.warn('[ProtectedPptReader] Deck parse notice:', err);
      setFileLoadError(err?.message || 'Unable to parse uploaded presentation file.');
      setViewMode('slide-stage');
    } finally {
      setIsLoadingFile(false);
    }
  }, [proxiedDeckUrl, isUploadedPdf, isUploadedPptx]);

  useEffect(() => {
    if (proxiedDeckUrl && (viewMode === 'pptx-parsed' || viewMode === 'pdf-canvas')) {
      loadUploadedDeck();
    }
  }, [proxiedDeckUrl]);

  // Render PDF page when in pdf-canvas mode
  useEffect(() => {
    if (viewMode !== 'pdf-canvas' || !pdfDoc || !pdfCanvasRef.current) return;
    let cancelled = false;

    const renderPdfSlide = async () => {
      try {
        const pageNum = Math.min(numPdfPages, Math.max(1, activeSlideIndex + 1));
        const page = await pdfDoc.getPage(pageNum);
        if (cancelled || !pdfCanvasRef.current) return;
        const scale = (zoom / 100) * 1.35;
        const viewport = page.getViewport({ scale });
        const canvas = pdfCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch {
        // ignore render cancellation
      }
    };

    renderPdfSlide();
    return () => {
      cancelled = true;
    };
  }, [viewMode, pdfDoc, numPdfPages, activeSlideIndex, zoom]);

  const activeSlidesList = isAdminEditing ? draftSlides : slides;

  const totalSlidesCount = useMemo(() => {
    if (viewMode === 'pptx-parsed' && pptxSlides.length > 0) return pptxSlides.length;
    if (viewMode === 'pdf-canvas' && numPdfPages > 0) return numPdfPages;
    return Math.max(1, activeSlidesList.length);
  }, [viewMode, pptxSlides.length, numPdfPages, activeSlidesList.length]);

  const clampedIndex = Math.max(0, Math.min(totalSlidesCount - 1, activeSlideIndex));
  const currentSlide = activeSlidesList[clampedIndex] || activeSlidesList[0];
  const currentPptxSlide = pptxSlides[clampedIndex] || pptxSlides[0];

  const goToSlide = useCallback(
    (targetIdx: number) => {
      const nextIdx = Math.max(0, Math.min(totalSlidesCount - 1, targetIdx));
      onSlideChange(nextIdx);
    },
    [totalSlidesCount, onSlideChange]
  );

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isAutoPlaying || isAdminEditing) return;
    const timer = setInterval(() => {
      if (clampedIndex < totalSlidesCount - 1) {
        goToSlide(clampedIndex + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, 5500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isAdminEditing, clampedIndex, totalSlidesCount, goToSlide]);

  // Security notice helper
  const triggerProtectionNotice = useCallback((actionLabel: string) => {
    setSecurityToast(
      `Protected PPT Reader: ${actionLabel} is disabled. Authorized read-only presentation stream.`
    );
  }, []);

  useEffect(() => {
    if (!securityToast) return;
    const t = setTimeout(() => setSecurityToast(null), 3200);
    return () => clearTimeout(t);
  }, [securityToast]);

  useEffect(() => {
    if (!adminSaveNotice) return;
    const t = setTimeout(() => setAdminSaveNotice(null), 4000);
    return () => clearTimeout(t);
  }, [adminSaveNotice]);

  // Admin Edit Handlers
  const handleStartAdminEdit = () => {
    setIsAutoPlaying(false);
    setViewMode('slide-stage');
    setDraftTitle(title);
    setDraftSlides(
      slides.map((s, idx) => ({
        ...s,
        slideNumber: idx + 1,
        bulletPoints: [...(s.bulletPoints || [])],
      }))
    );
    setIsAdminEditing(true);
  };

  const handleCancelAdminEdit = () => {
    setDraftTitle(title);
    setDraftSlides(slides);
    setIsAdminEditing(false);
  };

  const handleSaveAdminEdit = () => {
    if (!onAdminSaveSlides) return;
    const cleaned = draftSlides.map((sl, idx) => ({
      slideNumber: idx + 1,
      title: sl.title.trim() || `Slide ${idx + 1}`,
      subtitle: sl.subtitle.trim() || 'Statutory Provision Overview',
      bulletPoints: sl.bulletPoints.map((b) => b.trim()).filter(Boolean),
      keyTakeaway: sl.keyTakeaway.trim() || 'Ensure statutory compliance and documentation.',
      statutoryCitation: sl.statutoryCitation.trim() || 'Income Tax Act, 2023',
    }));
    onAdminSaveSlides(cleaned, draftTitle.trim() || title);
    setIsAdminEditing(false);
    setAdminSaveNotice(
      `Saved ${cleaned.length} Presentation Slide(s) to Course Curriculum & Firestore.`
    );
  };

  const handleAddSlide = () => {
    const newNum = draftSlides.length + 1;
    const newSlide: StatutoryPdfSlide = {
      slideNumber: newNum,
      title: `New Statutory Slide ${newNum}`,
      subtitle: `Class Presentation · Module ${newNum}`,
      bulletPoints: [
        'Primary statutory threshold and legal compliance requirement.',
        'Documentary evidence and return filing verification step.',
      ],
      keyTakeaway: 'Verify all supporting schedules before submission.',
      statutoryCitation: 'Income Tax Act, 2023',
    };
    const next = [...draftSlides, newSlide];
    setDraftSlides(next);
    onSlideChange(next.length - 1);
  };

  const handleDeleteCurrentSlide = () => {
    if (draftSlides.length <= 1) return;
    const next = draftSlides
      .filter((_, i) => i !== clampedIndex)
      .map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
    setDraftSlides(next);
    onSlideChange(Math.max(0, Math.min(clampedIndex, next.length - 1)));
  };

  const handleMoveSlide = (direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? clampedIndex - 1 : clampedIndex + 1;
    if (targetIdx < 0 || targetIdx >= draftSlides.length) return;
    const copy = [...draftSlides];
    const [moved] = copy.splice(clampedIndex, 1);
    copy.splice(targetIdx, 0, moved);
    const renumbered = copy.map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
    setDraftSlides(renumbered);
    onSlideChange(targetIdx);
  };

  // Text-to-Speech (TTS) Narration for current slide
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let text = '';
    if (viewMode === 'pptx-parsed' && currentPptxSlide) {
      text = `Slide ${clampedIndex + 1}: ${currentPptxSlide.title}. ${currentPptxSlide.subtitle}. ${currentPptxSlide.bulletPoints.join('. ')}. ${currentPptxSlide.speakerNotes}`;
    } else if (currentSlide) {
      text = `Slide ${clampedIndex + 1}: ${currentSlide.title}. ${currentSlide.subtitle}. ${currentSlide.bulletPoints.join('. ')}. Key Takeaway: ${currentSlide.keyTakeaway}. Statutory Reference: ${currentSlide.statutoryCitation}`;
    }

    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Keyboard navigation & copy/download protection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      isAdminEditing &&
      (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    if ((e.ctrlKey || e.metaKey) && ['c', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      e.stopPropagation();
      triggerProtectionNotice(`Keyboard shortcut Ctrl+${e.key.toUpperCase()}`);
      return;
    }

    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToSlide(clampedIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(clampedIndex - 1);
    } else if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };

  const slideThemeClasses = useMemo(() => {
    if (slideTheme === 'courtroom-ivory') {
      return {
        stageBg: 'bg-[#faf6ec] text-[#1e1810] border-[#dfd3bc]',
        subtitle: 'text-emerald-800',
        bulletNum: 'text-emerald-700 bg-emerald-900/10 border-emerald-800/20',
        footerBg: 'bg-[#f1ead8] border-[#dfd3bc] text-[#4a3c2c]',
      };
    }
    if (slideTheme === 'emerald-boardroom') {
      return {
        stageBg: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 text-white border-emerald-700/60',
        subtitle: 'text-amber-300',
        bulletNum: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
        footerBg: 'bg-emerald-950/90 border-emerald-800/70 text-emerald-200',
      };
    }
    return {
      stageBg: 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border-slate-700',
      subtitle: 'text-emerald-400',
      bulletNum: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      footerBg: 'bg-slate-900/90 border-slate-800 text-slate-300',
    };
  }, [slideTheme]);

  const canAdminEdit = isAdmin && Boolean(onAdminSaveSlides);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onContextMenu={(e) => {
        if (isAdminEditing) return;
        e.preventDefault();
        e.stopPropagation();
        triggerProtectionNotice('Right-click menu');
      }}
      onCopy={(e) => {
        if (isAdminEditing) return;
        e.preventDefault();
        e.stopPropagation();
        triggerProtectionNotice('Copying slide content');
      }}
      onDragStart={(e) => {
        if (isAdminEditing) return;
        e.preventDefault();
      }}
      className={`${
        isAdminEditing ? 'select-text' : 'select-none'
      } rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl overflow-hidden flex flex-col focus:outline-none transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0 h-screen w-screen' : ''
      }`}
    >
      {/* 1. TOP PPT READER HEADER & MODE SWITCHER BAR */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Presentation className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white truncate">{fileName || title}</span>
              <span className="font-mono text-[11px] text-emerald-400 shrink-0">
                [{deckCode}]
              </span>
              {fileSizeBytes ? (
                <span className="font-mono text-[11px] text-slate-400 shrink-0">
                  ({formatBytes(fileSizeBytes)})
                </span>
              ) : null}
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-700/50 text-[10px] font-mono text-emerald-300 shrink-0">
                <Lock className="w-2.5 h-2.5" />
                Protected PPT Reader
              </span>
            </div>
            {subtitle && (
              <div className="text-[11px] text-slate-400 truncate">{subtitle}</div>
            )}
          </div>
        </div>

        {/* Deck Mode Switcher & Admin Edit Trigger */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="inline-flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 gap-0.5">
            {hasUploadedFile && isUploadedPptx && (
              <button
                type="button"
                onClick={() => {
                  setIsAdminEditing(false);
                  setViewMode('pptx-parsed');
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'pptx-parsed'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Uploaded R2 PPTX Presentation Slides"
              >
                <Presentation className="w-3 h-3" />
                <span>Uploaded PPTX</span>
              </button>
            )}

            {hasUploadedFile && isUploadedPdf && (
              <button
                type="button"
                onClick={() => {
                  setIsAdminEditing(false);
                  setViewMode('pdf-canvas');
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'pdf-canvas'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Canvas PDF Deck View"
              >
                <FileText className="w-3 h-3" />
                <span>PDF Deck</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setViewMode('slide-stage')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'slide-stage' && !isAdminEditing
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Interactive 16:9 Statutory Slide Deck"
            >
              <BookOpen className="w-3 h-3" />
              <span>Interactive Slides</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAdminEditing(false);
                setViewMode((prev) => (prev === 'grid-sorter' ? 'slide-stage' : 'grid-sorter'));
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'grid-sorter'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Slide Sorter Grid Overview"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Slide Grid</span>
            </button>

            {canAdminEdit && (
              <button
                type="button"
                onClick={() => {
                  if (isAdminEditing) {
                    handleCancelAdminEdit();
                  } else {
                    handleStartAdminEdit();
                  }
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  isAdminEditing
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-800/90 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 border border-amber-500/30'
                }`}
                title="Admin Option: Edit Presentation Slides"
              >
                <Pencil className="w-3 h-3" />
                <span>{isAdminEditing ? 'Editing Slides' : 'Admin Edit'}</span>
              </button>
            )}
          </div>

          {onRetrySignedUrl && hasUploadedFile && (
            <button
              type="button"
              onClick={onRetrySignedUrl}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Refresh Signed R2 Presentation Stream"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSignedUrl ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* 2. PRESENTATION TOOLBAR (Slide Nav, Auto-Play, Laser Pointer, Themes, Zoom, TTS, Fullscreen) */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Filmstrip Toggle + Slide Counter + Auto-Play */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowFilmstrip((s) => !s)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showFilmstrip
                ? 'bg-slate-800 border-emerald-500/50 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Slide Filmstrip Sidebar"
          >
            <LayoutList className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <button
              type="button"
              disabled={clampedIndex <= 0}
              onClick={() => goToSlide(0)}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              title="First Slide"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={clampedIndex <= 0}
              onClick={() => goToSlide(clampedIndex - 1)}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Previous Slide (Left Arrow)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="font-mono text-[11px] font-bold text-white px-2">
              Slide {clampedIndex + 1} / {totalSlidesCount}
            </span>

            <button
              type="button"
              disabled={clampedIndex >= totalSlidesCount - 1}
              onClick={() => goToSlide(clampedIndex + 1)}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Next Slide (Right Arrow)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={clampedIndex >= totalSlidesCount - 1}
              onClick={() => goToSlide(totalSlidesCount - 1)}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Last Slide"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAutoPlaying((p) => !p)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isAutoPlaying
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Auto-Play Presentation Slideshow"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3 h-3" />
                <span className="hidden sm:inline">Pause Show</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Slideshow</span>
              </>
            )}
          </button>
        </div>

        {/* Center: Zoom, Laser Pointer, Slide Theme */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(75, z - 15))}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="font-mono tabular-nums text-[11px] font-bold text-emerald-400 px-1.5 cursor-pointer"
              title="Reset Zoom to 100%"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(145, z + 15))}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setLaserEnabled((l) => !l)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              laserEnabled
                ? 'bg-rose-600/25 border-rose-500 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Presentation Laser Pointer"
          >
            <Crosshair className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden md:inline">Laser</span>
          </button>

          {/* Slide Deck Theme Switcher */}
          <div className="hidden sm:flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setSlideTheme('executive-dark')}
              className={`p-1 rounded cursor-pointer ${
                slideTheme === 'executive-dark'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Executive Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSlideTheme('courtroom-ivory')}
              className={`p-1 rounded cursor-pointer ${
                slideTheme === 'courtroom-ivory'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Courtroom Ivory Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSlideTheme('emerald-boardroom')}
              className={`p-1 rounded cursor-pointer ${
                slideTheme === 'emerald-boardroom'
                  ? 'bg-slate-800 text-emerald-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Emerald Boardroom Theme"
            >
              <Award className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Speaker Notes Toggle, TTS Audio, Fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowSpeakerNotes((n) => !n)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
              showSpeakerNotes
                ? 'bg-slate-800 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Speaker Notes & Key Takeaway Bar"
          >
            Notes
          </button>

          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isSpeaking
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Narrate Active Slide (Text-to-Speech)"
          >
            {isSpeaking ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Narrate</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Presentation'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Present</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Admin Save Notice */}
      {adminSaveNotice && (
        <div className="bg-emerald-950/95 border-b border-emerald-700/80 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{adminSaveNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setAdminSaveNotice(null)}
            className="text-[11px] text-emerald-300 hover:text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Security Toast */}
      {securityToast && (
        <div className="bg-amber-950/95 border-b border-amber-700/80 px-4 py-2 text-xs text-amber-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{securityToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSecurityToast(null)}
            className="text-[11px] text-amber-300 hover:text-white underline cursor-pointer"
          >
            OK
          </button>
        </div>
      )}

      {/* 3. MAIN PRESENTATION STAGE + FILMSTRIP SIDEBAR */}
      <div
        className={`flex flex-1 overflow-hidden relative ${
          isFullscreen ? 'h-[calc(100vh-110px)]' : 'min-h-[540px]'
        }`}
      >
        {/* Left Thumbnail Filmstrip Sidebar */}
        {showFilmstrip && viewMode !== 'grid-sorter' && (
          <div className="w-52 sm:w-60 bg-slate-900/90 border-r border-slate-800 overflow-y-auto p-3 space-y-2 shrink-0 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1 flex items-center justify-between">
                <span>Slide Deck ({totalSlidesCount})</span>
                <Presentation className="w-3 h-3 text-emerald-400" />
              </div>

              {Array.from({ length: totalSlidesCount }, (_, idx) => {
                const slideNum = idx + 1;
                const isCurrent = clampedIndex === idx;
                const sl =
                  viewMode === 'pptx-parsed' && pptxSlides[idx]
                    ? pptxSlides[idx]
                    : activeSlidesList[idx];
                const isViewed = viewedSlideNumbers.includes(slideNum);

                return (
                  <button
                    key={`ppt-thumb-${slideNum}`}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isCurrent
                        ? 'bg-emerald-950/80 border-emerald-500/70 text-white shadow-sm'
                        : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-6 rounded border flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                        isCurrent
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      {slideNum}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">
                        {sl ? sl.title : `Slide ${slideNum}`}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                        {sl ? sl.subtitle : deckCode}
                      </div>
                    </div>
                    {isViewed && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {canAdminEdit && (
              <div className="pt-3 border-t border-slate-800">
                {!isAdminEditing ? (
                  <button
                    type="button"
                    onClick={handleStartAdminEdit}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Slide Deck</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add New Slide</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Right Widescreen Presentation Viewport */}
        <div
          ref={slideStageRef}
          onMouseMove={(e) => {
            if (!laserEnabled || !slideStageRef.current) return;
            const rect = slideStageRef.current.getBoundingClientRect();
            setLaserPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
          onMouseLeave={() => setLaserPos(null)}
          className={`flex-1 bg-slate-950 overflow-auto relative flex flex-col items-center justify-between p-4 sm:p-6 ${
            laserEnabled ? 'cursor-crosshair' : ''
          }`}
        >
          {/* Laser Pointer Dot */}
          {laserEnabled && laserPos && (
            <div
              aria-hidden="true"
              style={{
                left: `${laserPos.x - 8}px`,
                top: `${laserPos.y - 8}px`,
              }}
              className="pointer-events-none absolute z-50 w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_16px_6px_rgba(244,63,94,0.85)] ring-2 ring-white"
            />
          )}

          {/* Dynamic Repeating Security Watermark Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden flex flex-col justify-around items-center opacity-15 select-none"
          >
            <div className="-rotate-12 text-xs sm:text-sm font-mono font-bold text-slate-400 tracking-widest whitespace-nowrap">
              {watermarkText} · DO NOT COPY OR DOWNLOAD
            </div>
            <div className="-rotate-12 text-xs sm:text-sm font-mono font-bold text-slate-400 tracking-widest whitespace-nowrap">
              {watermarkText} · PROTECTED PRESENTATION STREAM
            </div>
          </div>

          {/* VIEW 1: SLIDE SORTER GRID OVERVIEW */}
          {viewMode === 'grid-sorter' && (
            <div className="relative z-30 w-full max-w-5xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-emerald-400" />
                  <span>Slide Sorter Overview ({totalSlidesCount} Slides)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setViewMode('slide-stage')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  Return to Active Slide
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(viewMode === 'grid-sorter' && pptxSlides.length > 0
                  ? pptxSlides
                  : activeSlidesList
                ).map((sl: any, idx: number) => {
                  const isCurrent = clampedIndex === idx;
                  return (
                    <button
                      key={`grid-sl-${idx}`}
                      type="button"
                      onClick={() => {
                        goToSlide(idx);
                        setViewMode(pptxSlides.length > 0 ? 'pptx-parsed' : 'slide-stage');
                      }}
                      className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[190px] ${
                        isCurrent
                          ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-500/40'
                          : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                          <span>SLIDE 0{idx + 1}</span>
                          <span>{deckCode}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-2">
                          {sl.title}
                        </h4>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {(sl.bulletPoints || []).slice(0, 2).map((b: string, bIdx: number) => (
                            <li key={`gb-${idx}-${bIdx}`} className="truncate">
                              • {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 truncate">
                        {sl.statutoryCitation || sl.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: PDF CANVAS SLIDE DECK */}
          {viewMode === 'pdf-canvas' && (
            <div className="relative z-30 flex flex-col items-center w-full my-auto">
              {isLoadingSignedUrl || isLoadingFile ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-7 h-7 animate-spin text-emerald-400 mx-auto" />
                  <div className="text-sm font-bold text-slate-200">
                    Rendering Protected Slide Deck...
                  </div>
                </div>
              ) : (
                <div className="shadow-2xl rounded-xl overflow-hidden border border-slate-700 bg-white">
                  <canvas
                    ref={pdfCanvasRef}
                    className="block max-w-full h-auto pointer-events-none select-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: UPLOADED .PPTX PARSED SLIDE STAGE OR STRUCTURED 16:9 SLIDE STAGE */}
          {(viewMode === 'slide-stage' || viewMode === 'pptx-parsed') && (
            <div className="relative z-30 w-full flex flex-col items-center my-auto space-y-4">
              {isLoadingSignedUrl || isLoadingFile ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-7 h-7 animate-spin text-emerald-400 mx-auto" />
                  <div className="text-sm font-bold text-slate-200">
                    Extracting Protected .PPTX Slides...
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: `${Math.min(100, Math.max(70, zoom * 0.92))}%`,
                  }}
                  className={`max-w-4xl w-full rounded-2xl border shadow-2xl p-6 sm:p-10 transition-all duration-200 flex flex-col justify-between min-h-[380px] ${slideThemeClasses.stageBg}`}
                >
                  {/* Slide Top Running Bar */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-current/15 text-xs font-mono">
                      <div className="flex items-center gap-2 opacity-80">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>
                          {deckCode} · SLIDE {clampedIndex + 1} OF {totalSlidesCount}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] opacity-70 truncate max-w-xs">
                          {watermarkText}
                        </span>

                        {canAdminEdit && !isAdminEditing && (
                          <button
                            type="button"
                            onClick={handleStartAdminEdit}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit Slide (Admin)</span>
                          </button>
                        )}

                        {canAdminEdit && isAdminEditing && (
                          <div className="flex items-center gap-1.5 font-sans">
                            <button
                              type="button"
                              onClick={handleAddSlide}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-emerald-400" />
                              <span>+ Add Slide</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveAdminEdit}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save Deck</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelAdminEdit}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* INLINE ADMIN SLIDE EDITOR */}
                    {isAdminEditing && currentSlide ? (
                      <div className="space-y-4 font-sans text-left">
                        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Pencil className="w-3.5 h-3.5" />
                            Admin Presentation Editor — Slide {clampedIndex + 1} of{' '}
                            {draftSlides.length}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={clampedIndex <= 0}
                              onClick={() => handleMoveSlide('up')}
                              className="px-2 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-40 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                              <span>Move Earlier</span>
                            </button>
                            <button
                              type="button"
                              disabled={clampedIndex >= draftSlides.length - 1}
                              onClick={() => handleMoveSlide('down')}
                              className="px-2 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-40 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                              <span>Move Later</span>
                            </button>
                            {draftSlides.length > 1 && (
                              <button
                                type="button"
                                onClick={handleDeleteCurrentSlide}
                                className="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-500 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete Slide</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
                            Presentation Deck Title
                          </label>
                          <input
                            type="text"
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
                              Slide {clampedIndex + 1} Title
                            </label>
                            <input
                              type="text"
                              value={currentSlide.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDraftSlides((prev) =>
                                  prev.map((s, i) =>
                                    i === clampedIndex ? { ...s, title: val } : s
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
                              Slide Subtitle / Module Tag
                            </label>
                            <input
                              type="text"
                              value={currentSlide.subtitle}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDraftSlides((prev) =>
                                  prev.map((s, i) =>
                                    i === clampedIndex ? { ...s, subtitle: val } : s
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
                              Statutory Citation
                            </label>
                            <input
                              type="text"
                              value={currentSlide.statutoryCitation}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDraftSlides((prev) =>
                                  prev.map((s, i) =>
                                    i === clampedIndex
                                      ? { ...s, statutoryCitation: val }
                                      : s
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Editable Slide Bullet Points */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                              Slide Key Points & Statutory Bullets
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setDraftSlides((prev) =>
                                  prev.map((s, i) =>
                                    i === clampedIndex
                                      ? {
                                          ...s,
                                          bulletPoints: [
                                            ...s.bulletPoints,
                                            'New statutory presentation bullet point',
                                          ],
                                        }
                                      : s
                                  )
                                );
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Add Bullet Point</span>
                            </button>
                          </div>

                          {currentSlide.bulletPoints.map((pt, bIdx) => (
                            <div key={`edit-b-${clampedIndex}-${bIdx}`} className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-emerald-400 w-7 shrink-0">
                                0{bIdx + 1}.
                              </span>
                              <input
                                type="text"
                                value={pt}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setDraftSlides((prev) =>
                                    prev.map((s, i) => {
                                      if (i !== clampedIndex) return s;
                                      const nextB = [...s.bulletPoints];
                                      nextB[bIdx] = val;
                                      return { ...s, bulletPoints: nextB };
                                    })
                                  );
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setDraftSlides((prev) =>
                                    prev.map((s, i) => {
                                      if (i !== clampedIndex) return s;
                                      return {
                                        ...s,
                                        bulletPoints: s.bulletPoints.filter(
                                          (_, idx) => idx !== bIdx
                                        ),
                                      };
                                    })
                                  );
                                }}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                                title="Remove Bullet Point"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
                            Key Statutory Takeaway (Speaker / Footer Note)
                          </label>
                          <textarea
                            rows={2}
                            value={currentSlide.keyTakeaway}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDraftSlides((prev) =>
                                prev.map((s, i) =>
                                  i === clampedIndex ? { ...s, keyTakeaway: val } : s
                                )
                              );
                            }}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={handleCancelAdminEdit}
                            className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveAdminEdit}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Slide Deck Configuration</span>
                          </button>
                        </div>
                      </div>
                    ) : viewMode === 'pptx-parsed' && currentPptxSlide ? (
                      /* PARSED .PPTX SLIDE PRESENTATION VIEW */
                      <div className="space-y-6">
                        <div>
                          <div className={`text-xs font-semibold mb-1.5 ${slideThemeClasses.subtitle}`}>
                            {currentPptxSlide.subtitle}
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                            {currentPptxSlide.title}
                          </h3>
                        </div>

                        {currentPptxSlide.imageUrls.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                            {currentPptxSlide.imageUrls.slice(0, 2).map((imgSrc, imgIdx) => (
                              <img
                                key={`pptx-img-${clampedIndex}-${imgIdx}`}
                                src={imgSrc}
                                alt={`Slide ${clampedIndex + 1} visual`}
                                className="max-h-56 w-auto mx-auto rounded-xl border border-white/10 object-contain pointer-events-none"
                              />
                            ))}
                          </div>
                        )}

                        <ul className="space-y-3.5 text-sm sm:text-base">
                          {currentPptxSlide.bulletPoints.map((pt, idx) => (
                            <li
                              key={`pptx-b-${clampedIndex}-${idx}`}
                              className="flex items-start gap-3.5 leading-relaxed"
                            >
                              <span
                                className={`px-2 py-0.5 rounded-md border font-mono text-xs font-bold shrink-0 mt-0.5 ${slideThemeClasses.bulletNum}`}
                              >
                                0{idx + 1}
                              </span>
                              <span className="opacity-95">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : currentSlide ? (
                      /* STRUCTURED 16:9 STATUTORY SLIDE PRESENTATION VIEW */
                      <div className="space-y-6">
                        <div>
                          <div className={`text-xs font-semibold mb-1.5 uppercase tracking-wider ${slideThemeClasses.subtitle}`}>
                            {currentSlide.subtitle}
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                            {currentSlide.title}
                          </h3>
                        </div>

                        <ul className="space-y-3.5 text-sm sm:text-base">
                          {currentSlide.bulletPoints.map((pt, idx) => (
                            <li
                              key={`sl-b-${clampedIndex}-${idx}`}
                              className="flex items-start gap-3.5 leading-relaxed"
                            >
                              <span
                                className={`px-2 py-0.5 rounded-md border font-mono text-xs font-bold shrink-0 mt-0.5 ${slideThemeClasses.bulletNum}`}
                              >
                                0{idx + 1}
                              </span>
                              <span className="opacity-95">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  {/* Slide Bottom Takeaway & Statutory Citation Strip */}
                  {showSpeakerNotes && !isAdminEditing && (
                    <div
                      className={`mt-8 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${slideThemeClasses.footerBg}`}
                    >
                      <div className="leading-relaxed">
                        <strong className="font-bold">Key Takeaway: </strong>
                        <span>
                          {viewMode === 'pptx-parsed' && currentPptxSlide?.speakerNotes
                            ? currentPptxSlide.speakerNotes
                            : currentSlide?.keyTakeaway}
                        </span>
                      </div>
                      {currentSlide?.statutoryCitation && (
                        <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-black/20 border border-white/10 shrink-0">
                          Ref: {currentSlide.statutoryCitation}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: EMBEDDED EXTERNAL DECK STREAM */}
          {viewMode === 'embedded-deck' && pptUrl && (
            <div className="relative z-30 w-full h-full flex flex-col rounded-xl overflow-hidden border border-slate-700 bg-white">
              <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="text-emerald-400 font-bold">
                  Protected Presentation Stream · Copy & Download Disabled
                </span>
                <span>{watermarkText}</span>
              </div>
              <iframe
                src={pptUrl}
                title={title}
                sandbox="allow-scripts allow-same-origin"
                className="w-full flex-1 border-0 bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM PPT READER PROGRESS & NAVIGATION BAR */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Slides Viewed: {viewedSlideNumbers.length} / {totalSlidesCount}
            </span>
          </div>
          {/* Mini slide progress dots */}
          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalSlidesCount }, (_, i) => {
              const isCurrent = i === clampedIndex;
              const isViewed = viewedSlideNumbers.includes(i + 1);
              return (
                <button
                  key={`dot-${i}`}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'w-6 bg-emerald-400'
                      : isViewed
                      ? 'w-2 bg-emerald-600/70'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Jump to Slide ${i + 1}`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canAdminEdit && !isAdminEditing && (
            <button
              type="button"
              onClick={handleStartAdminEdit}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Admin Edit Slides</span>
            </button>
          )}

          <button
            type="button"
            disabled={clampedIndex <= 0}
            onClick={() => goToSlide(clampedIndex - 1)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Slide</span>
          </button>

          {clampedIndex < totalSlidesCount - 1 ? (
            <button
              type="button"
              onClick={() => goToSlide(clampedIndex + 1)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer flex items-center gap-1"
            >
              <span>
                Next Slide ({clampedIndex + 2}/{totalSlidesCount})
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : onMarkDeckReviewed ? (
            <button
              type="button"
              onClick={onMarkDeckReviewed}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete PPT Review</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
