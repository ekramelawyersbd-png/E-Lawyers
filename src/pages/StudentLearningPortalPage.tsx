import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, CheckCircle2, RotateCcw, ExternalLink, Award, FileCheck2 } from 'lucide-react';
import {
  LmsContentTabType,
  LmsPortalDataMap,
  loadLmsPortalData,
  saveLmsPortalData,
  cloneDefaultLmsData,
  syncLmsPortalDataFromFirestore,
  resolveEmbedBehavior
} from '../utils/lmsPortalStore';
import { useLms, LmsCertificateRecord } from '../contexts/LmsContext';
import { FinalExamModal } from '../components/lms/FinalExamModal';
import { LmsCertificateViewerModal } from '../components/lms/LmsCertificateViewerModal';
import { ServiceSEO } from '../components/SEO';

const CONTENT_TABS: { id: LmsContentTabType; label: string }[] = [
  { id: 'live', label: 'Live Class' },
  { id: 'recorded', label: 'Recorded Video' },
  { id: 'note', label: 'Note' },
  { id: 'ppt', label: 'PPT' },
  { id: 'mcq', label: 'MCQ' }
];

export const StudentLearningPortalPage: React.FC<{
  autoOpenExam?: boolean;
}> = ({ autoOpenExam = false }) => {
  const { certificateId: paramCertificateId } = useParams<{
    courseId?: string;
    certificateId?: string;
  }>();

  const { activeCourse, allCertificates } = useLms();

  // Core LMS Portal State matching the specification
  const [lmsData, setLmsData] = useState<LmsPortalDataMap>(() => loadLmsPortalData());
  const [adminDraftData, setAdminDraftData] = useState<LmsPortalDataMap>(() => loadLmsPortalData());
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  const classKeys = useMemo(() => Object.keys(lmsData), [lmsData]);
  const [currentClass, setCurrentClass] = useState<string>(() => {
    const keys = Object.keys(loadLmsPortalData());
    return keys[0] || 'Class 01';
  });
  const [currentTab, setCurrentTab] = useState<LmsContentTabType>('live');

  // In-UI notification & reset confirmation states (replacing window.alert / window.confirm)
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);

  // Exam & Certificate modals
  const [isExamModalOpen, setIsExamModalOpen] = useState<boolean>(Boolean(autoOpenExam));
  const [activeCertificateModal, setActiveCertificateModal] =
    useState<LmsCertificateRecord | null>(null);

  // Sync from Firestore on mount if available
  useEffect(() => {
    let mounted = true;
    syncLmsPortalDataFromFirestore().then((remote) => {
      if (mounted && remote) {
        setLmsData(remote);
        setAdminDraftData(remote);
        const firstKey = Object.keys(remote)[0];
        if (firstKey && !remote[currentClass]) {
          setCurrentClass(firstKey);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Listen for external updates to lmsData
  useEffect(() => {
    const handleDataUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<LmsPortalDataMap>;
      if (customEvent.detail) {
        setLmsData(customEvent.detail);
        setAdminDraftData(customEvent.detail);
      }
    };
    window.addEventListener('lmsDataUpdated', handleDataUpdated);
    return () => window.removeEventListener('lmsDataUpdated', handleDataUpdated);
  }, []);

  // Ensure currentClass remains valid if classes change
  useEffect(() => {
    if (classKeys.length > 0 && !lmsData[currentClass]) {
      setCurrentClass(classKeys[0]);
    }
  }, [classKeys, currentClass, lmsData]);

  // Open certificate modal if URL contains certificateId
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

  // Student View Content Protection (Block Ctrl/Cmd + C, P, S and F12 when Student View is active)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAdminView) {
        const key = e.key.toLowerCase();
        if (
          (e.ctrlKey || e.metaKey) &&
          (key === 'c' || key === 'p' || key === 's')
        ) {
          e.preventDefault();
        }
        if (e.key === 'F12') {
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminView]);

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleToggleView = () => {
    if (!isAdminView) {
      // Entering Admin View: sync draft with current saved data
      setAdminDraftData(JSON.parse(JSON.stringify(lmsData)));
      setConfirmResetOpen(false);
      setIsAdminView(true);
    } else {
      setIsAdminView(false);
    }
  };

  const handleAdminInputChange = (
    classNameKey: string,
    fieldType: LmsContentTabType,
    value: string
  ) => {
    setAdminDraftData((prev) => ({
      ...prev,
      [classNameKey]: {
        ...prev[classNameKey],
        [fieldType]: value
      }
    }));
  };

  const handleAddClassRow = () => {
    const existingKeys = Object.keys(adminDraftData);
    const nextNum = existingKeys.length + 1;
    const formattedNum = String(nextNum).padStart(2, '0');
    let newClassKey = `Class ${formattedNum}`;
    let counter = nextNum;
    while (adminDraftData[newClassKey]) {
      counter += 1;
      newClassKey = `Class ${String(counter).padStart(2, '0')}`;
    }

    setAdminDraftData((prev) => ({
      ...prev,
      [newClassKey]: {
        live: '',
        recorded: '',
        note: '',
        ppt: '',
        mcq: ''
      }
    }));
  };

  const handleRemoveClassRow = (classKey: string) => {
    const keys = Object.keys(adminDraftData);
    if (keys.length <= 1) return;
    setAdminDraftData((prev) => {
      const next = { ...prev };
      delete next[classKey];
      return next;
    });
  };

  const handleSaveAdminChanges = async () => {
    const cleaned: LmsPortalDataMap = {};
    Object.entries(adminDraftData).forEach(([clsKey, links]) => {
      cleaned[clsKey] = {
        live: (links.live || '').trim(),
        recorded: (links.recorded || '').trim(),
        note: (links.note || '').trim(),
        ppt: (links.ppt || '').trim(),
        mcq: (links.mcq || '').trim()
      };
    });

    setLmsData(cleaned);
    await saveLmsPortalData(cleaned);
    showToast('Content updated successfully! Changes are now live on the Student Dashboard.');
    setIsAdminView(false);
  };

  const handleConfirmResetDefaults = async () => {
    const defaults = cloneDefaultLmsData();
    setAdminDraftData(defaults);
    setLmsData(defaults);
    setCurrentClass('Class 01');
    setCurrentTab('live');
    setConfirmResetOpen(false);
    await saveLmsPortalData(defaults);
    showToast('All links have been reset to default settings.');
  };

  const activeUrl = lmsData[currentClass]?.[currentTab] || '';
  const embedState = resolveEmbedBehavior(activeUrl);
  const currentTabLabel = CONTENT_TABS.find((t) => t.id === currentTab)?.label || 'Live Class';
  const dynamicTitle = isAdminView
    ? `Admin Content Management – ${activeCourse.title} | LMS Portal`
    : `${currentClass}: ${currentTabLabel} – ${activeCourse.title} | LMS Portal`;
  const dynamicDescription = isAdminView
    ? `Manage class links for Live Class, Recorded Video, Note, PPT, and MCQ across ${classKeys.length} classes in the Student Learning Management System.`
    : `Access ${currentTabLabel} materials for ${currentClass} in ${activeCourse.title} on the Accounticca & E-Lawyers LMS Portal.`;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#f4f7f6] text-[#333]">
      <ServiceSEO
        title={dynamicTitle}
        description={dynamicDescription}
        serviceType="Student Learning Management System"
        canonicalUrl="/student/dashboard"
      />

      {/* LMS Portal Header */}
      <header className="bg-white px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center gap-3 shadow-[0_2px_5px_rgba(0,0,0,0.1)] z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1e4e75]">
            LMS Portal
          </h1>
          <span className="hidden md:inline-block text-xs font-medium text-slate-500 border-l border-slate-200 pl-4">
            {activeCourse.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {statusBanner && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{statusBanner}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExamModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#1e4e75]" />
            <span>Final Exam</span>
          </button>

          <button
            type="button"
            onClick={handleToggleView}
            className="px-4 py-2 rounded font-bold text-xs sm:text-sm border border-[#1e4e75] text-[#1e4e75] bg-transparent hover:bg-[#1e4e75] hover:text-white transition-colors cursor-pointer"
          >
            {isAdminView ? 'Switch to Student Page' : 'Switch to Admin Page'}
          </button>
        </div>
      </header>

      {/* Views Container */}
      <div id="app-container" className="flex-1 flex flex-col overflow-hidden relative">
        {!isAdminView ? (
          /* --- STUDENT VIEW --- */
          <div
            id="student-view"
            onContextMenu={(e) => e.preventDefault()}
            className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[640px]"
          >
            {/* Left Sidebar */}
            <aside className="w-full md:w-[250px] bg-[#1e4e75] text-white flex flex-col overflow-y-auto shrink-0">
              <div className="p-4 font-bold border-b border-white/10 text-[1.1rem]">
                Class No
              </div>
              <ul className="list-none m-0 p-0 flex md:flex-col overflow-x-auto md:overflow-x-visible">
                {classKeys.map((className) => {
                  const isActive = className === currentClass;
                  return (
                    <li
                      key={className}
                      onClick={() => setCurrentClass(className)}
                      className={`px-4 py-4 cursor-pointer border-b border-white/5 transition-colors text-[0.95rem] whitespace-nowrap select-none ${
                        isActive
                          ? 'bg-[#153a58] border-l-4 border-l-white font-bold text-white'
                          : 'hover:bg-white/10 text-white/95'
                      }`}
                    >
                      {className}
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Top Horizontal Tabs */}
              <div className="flex bg-[#1e4e75] overflow-x-auto shrink-0">
                {CONTENT_TABS.map((tab) => {
                  const isActive = tab.id === currentTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      data-type={tab.id}
                      onClick={() => setCurrentTab(tab.id)}
                      className={`px-6 py-4 whitespace-nowrap transition-all text-[0.95rem] border-b-[3px] cursor-pointer select-none ${
                        isActive
                          ? 'text-white bg-[#2a6b9e] border-b-white font-bold'
                          : 'text-white/80 border-b-transparent hover:text-white hover:bg-white/10 font-normal'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content Display Area (Anti-copy protected for students) */}
              <div
                id="content-display"
                className="flex-1 p-4 sm:p-8 overflow-y-auto select-none bg-[#fafbfc] flex flex-col"
              >
                {embedState.isEmpty ? (
                  <div className="flex-1 flex items-center justify-center min-h-[420px] text-[#94a3b8] italic text-[1.1rem]">
                    No content published for this section yet.
                  </div>
                ) : embedState.canEmbed ? (
                  <div className="flex-1 flex flex-col gap-3 min-h-[480px]">
                    <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                      <span>
                        Showing <strong>{currentClass}</strong> —{' '}
                        <strong>
                          {CONTENT_TABS.find((t) => t.id === currentTab)?.label}
                        </strong>
                      </span>
                      <a
                        href={embedState.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#1e4e75] hover:underline font-semibold"
                      >
                        <span>Open in New Tab</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <iframe
                      title={`${currentClass} - ${currentTab}`}
                      src={embedState.embedUrl}
                      className="w-full flex-1 min-h-[460px] border-0 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.1)] bg-white"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[420px] text-center bg-[#f0f4f8] rounded-lg border-2 border-dashed border-[#cbd5e1] p-8">
                    <p className="mb-6 text-[#64748b] text-[1.1rem] max-w-xl">
                      This content cannot be embedded directly due to security policies of the provider (e.g., Zoom).
                    </p>
                    <a
                      href={embedState.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded bg-[#1e4e75] hover:bg-[#153a58] text-white font-bold text-sm no-underline transition-colors inline-flex items-center gap-2"
                    >
                      <span>Open Content in New Tab</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </main>
          </div>
        ) : (
          /* --- ADMIN VIEW --- */
          <div
            id="admin-view"
            className="flex-1 flex flex-col p-4 sm:p-8 bg-[#f4f7f6] overflow-y-auto"
          >
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1e4e75]">
                  Admin Page - Content Management
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Paste your links below. Changes will immediately reflect on the Student Dashboard upon saving.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddClassRow}
                className="px-4 py-2 rounded bg-[#1e4e75] hover:bg-[#153a58] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr>
                    <th className="p-4 text-left border-b border-[#ddd] bg-[#f8f9fa] font-bold text-[#1e4e75]">
                      Class No
                    </th>
                    <th className="p-4 text-left border-b border-[#ddd] bg-[#f8f9fa] font-bold text-[#1e4e75]">
                      Live Class
                    </th>
                    <th className="p-4 text-left border-b border-[#ddd] bg-[#f8f9fa] font-bold text-[#1e4e75]">
                      Recorded Video
                    </th>
                    <th className="p-4 text-left border-b border-[#ddd] bg-[#f8f9fa] font-bold text-[#1e4e75]">
                      Note
                    </th>
                    <th className="p-4 text-left border-b border-[#ddd] bg-[#f8f9fa] font-bold text-[#1e4e75]">
                      PPT
                    </th>
                    <th className="p-4 text-left border-b border-[#ddd] bg-[#f8f9fa] font-bold text-[#1e4e75]">
                      MCQ
                    </th>
                    <th className="p-4 text-center border-b border-[#ddd] bg-[#f8f9fa] font-bold text-[#1e4e75] w-16">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody id="admin-table-body">
                  {Object.keys(adminDraftData).map((className) => {
                    const row = adminDraftData[className];
                    return (
                      <tr key={className} className="hover:bg-slate-50/60">
                        <td className="p-4 text-left border-b border-[#ddd] whitespace-nowrap">
                          <strong>{className}</strong>
                        </td>
                        {(['live', 'recorded', 'note', 'ppt', 'mcq'] as LmsContentTabType[]).map(
                          (type) => (
                            <td key={type} className="p-4 text-left border-b border-[#ddd]">
                              <input
                                type="url"
                                data-class={className}
                                data-type={type}
                                value={row[type] || ''}
                                onChange={(e) =>
                                  handleAdminInputChange(className, type, e.target.value)
                                }
                                placeholder={`Enter ${type} URL`}
                                className="w-full p-2.5 border border-[#ddd] rounded text-[0.9rem] focus:outline-none focus:border-[#1e4e75] focus:ring-2 focus:ring-[#1e4e75]/20"
                              />
                            </td>
                          )
                        )}
                        <td className="p-4 text-center border-b border-[#ddd]">
                          <button
                            type="button"
                            onClick={() => handleRemoveClassRow(className)}
                            disabled={Object.keys(adminDraftData).length <= 1}
                            title={`Delete ${className}`}
                            className="p-2 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Reset Confirmation Banner (In-UI replacement for window.confirm) */}
            {confirmResetOpen && (
              <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-sm text-amber-900">
                <span>
                  Are you sure you want to reset all links to default?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmResetOpen(false)}
                    className="px-3 py-1.5 rounded border border-amber-300 bg-white text-amber-900 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmResetDefaults}
                    className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Yes, Reset to Defaults
                  </button>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="px-4 py-2.5 rounded font-bold text-sm border border-[#1e4e75] text-[#1e4e75] bg-transparent hover:bg-[#1e4e75] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAdminChanges}
                className="px-5 py-2.5 rounded font-bold text-sm bg-[#1e4e75] hover:bg-[#153a58] text-white transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
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
