import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  FileSpreadsheet, 
  Calendar, 
  FileText, 
  Presentation, 
  CheckSquare, 
  Users, 
  Video, 
  GraduationCap, 
  MessageSquare, 
  FileCheck2, 
  ExternalLink, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Search, 
  AlertTriangle,
  FolderOpen,
  ArrowUpRight,
  Sparkles,
  Layers,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { 
  getAccessToken, 
  signInWithWorkspaceGoogle, 
  logoutWorkspace, 
  getConnectedWorkspaceEmail,
  DEFAULT_WORKSPACE_EMAIL,
  WORKSPACE_SCOPES 
} from '../services/workspaceAuth';
import { 
  workspaceDriveApi, 
  workspaceSheetsApi, 
  workspaceCalendarApi, 
  workspaceDocsApi, 
  workspaceSlidesApi, 
  workspaceTasksApi, 
  workspaceContactsApi, 
  workspaceMeetApi, 
  workspaceClassroomApi, 
  workspaceChatApi, 
  workspaceFormsApi,
  DriveFile,
  CalendarEvent,
  GoogleTask,
  GoogleContact,
  ClassroomCourse,
  ChatSpace,
  MeetSpace
} from '../services/workspaceService';
import { useAuth } from '../contexts/AuthContext';
import { useShopAuth } from '../contexts/ShopAuthContext';

type ActiveTab = 'drive' | 'sheets' | 'calendar' | 'docs' | 'slides' | 'tasks' | 'contacts' | 'meet' | 'classroom' | 'chat' | 'forms';

export const WorkspaceHub: React.FC = () => {
  const { user } = useAuth();
  const { adminUser, logout: shopLogout } = useShopAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('drive');
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Data states
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Tab-specific state
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [newSummary, setNewSummary] = useState('');
  const [newDate, setNewDate] = useState('');

  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [newGivenName, setNewGivenName] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const [classroomCourses, setClassroomCourses] = useState<ClassroomCourse[]>([]);
  const [newCourseName, setNewCourseName] = useState('');

  const [chatSpaces, setChatSpaces] = useState<ChatSpace[]>([]);
  const [createdMeet, setCreatedMeet] = useState<MeetSpace | null>(null);
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);
  const [createdSheetId, setCreatedSheetId] = useState<string | null>(null);
  const [createdSlideId, setCreatedSlideId] = useState<string | null>(null);
  const [createdFormId, setCreatedFormId] = useState<string | null>(null);

  // Confirmation Modal state for destructive operations (MANDATORY per skill instructions)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: async () => {}
  });

  // Sync token state and auto-load if already permanently connected
  useEffect(() => {
    const existingToken = getAccessToken();
    setToken(existingToken);
    if (existingToken) {
      loadTabData(activeTab);
    }
  }, [activeTab]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await signInWithWorkspaceGoogle(DEFAULT_WORKSPACE_EMAIL);
      setToken(res.accessToken);
      setFeedback({ 
        message: `Successfully connected Google Workspace permanently for ${res.user.email || DEFAULT_WORKSPACE_EMAIL}!`, 
        type: 'success' 
      });
      loadTabData(activeTab);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Authentication failed. Please verify popup permission.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logoutWorkspace();
    setToken(null);
    setFeedback({ message: 'Disconnected from Google Workspace.', type: 'success' });
  };

  const loadTabData = async (tab: ActiveTab) => {
    if (!getAccessToken()) return;
    setLoading(true);
    setFeedback(null);

    try {
      if (tab === 'drive') {
        const files = await workspaceDriveApi.listFiles(25);
        setDriveFiles(files);
      } else if (tab === 'calendar') {
        const events = await workspaceCalendarApi.listEvents(20);
        setCalendarEvents(events);
      } else if (tab === 'tasks') {
        const items = await workspaceTasksApi.listTasks();
        setTasks(items);
      } else if (tab === 'contacts') {
        const conns = await workspaceContactsApi.listContacts(30);
        setContacts(conns);
      } else if (tab === 'classroom') {
        const courses = await workspaceClassroomApi.listCourses();
        setClassroomCourses(courses);
      } else if (tab === 'chat') {
        try {
          const spaces = await workspaceChatApi.listSpaces();
          setChatSpaces(spaces);
        } catch (chatErr: any) {
          // Google Chat API requires Chat app configuration on GCP
          console.warn('Google Chat notice:', chatErr.message);
        }
      }
    } catch (err: any) {
      setFeedback({ 
        message: err.message || `Failed to fetch data for ${tab}.`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadTabData(activeTab);
    }
  }, [activeTab, token]);

  // Destructive Confirmation Handler
  const triggerDestructiveAction = (title: string, description: string, action: () => Promise<void>) => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      onConfirm: async () => {
        try {
          await action();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          setFeedback({ message: err.message || 'Operation failed', type: 'error' });
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Tab definitions
  const tabs = [
    { id: 'drive', label: 'Google Drive', icon: FolderGit2, desc: 'Files & Storage' },
    { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet, desc: 'Spreadsheets' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, desc: 'Events & Deadlines' },
    { id: 'docs', label: 'Docs', icon: FileText, desc: 'Drafts & Agreements' },
    { id: 'slides', label: 'Slides', icon: Presentation, desc: 'Presentations' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, desc: 'Action Items' },
    { id: 'contacts', label: 'Contacts', icon: Users, desc: 'Clients & Directory' },
    { id: 'meet', label: 'Google Meet', icon: Video, desc: 'Instant Meetings' },
    { id: 'classroom', label: 'Classroom', icon: GraduationCap, desc: 'Courses & CPD' },
    { id: 'chat', label: 'Google Chat', icon: MessageSquare, desc: 'Spaces & Team' },
    { id: 'forms', label: 'Forms', icon: FileCheck2, desc: 'Tax Questionnaires' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Enterprise Workspace Integration
                </div>
                {adminUser && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>Admin: {adminUser.email}</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Google Workspace Hub
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Connect your Google Workspace suite to streamline tax returns, sync client schedules, generate legal documents, and collaborate in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {token ? (
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Permanently Connected</span>
                    </span>
                    <span className="text-[11px] text-emerald-200 truncate max-w-[210px] font-medium">
                      {getConnectedWorkspaceEmail()}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="ml-2 text-xs text-rose-300 hover:text-white underline font-semibold transition cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-bold px-6 py-3 rounded-2xl shadow-xl transition active:scale-95 disabled:opacity-50 cursor-pointer border border-white/40"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-extrabold leading-tight text-slate-900">
                      {isAuthenticating ? 'Connecting...' : 'Connect as ekram.elawyersbd@gmail.com'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Permanent Workspace Sync &bull; 1-Click
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-xs font-bold underline">Dismiss</button>
          </div>
        )}

        {authError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-sm">
            <strong>Authentication Notice:</strong> {authError}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as ActiveTab)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
                    isActive 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Unauthenticated State Notice */}
        {!token && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Workspace Authorization Required</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To read and manage documents, spreadsheets, meetings, calendar events, and client contacts with permission from your Google account, click below to authorize access.
            </p>
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition active:scale-95"
            >
              <span>{isAuthenticating ? 'Connecting...' : 'Authorize Google Workspace'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Content Panes (When Authenticated) */}
        {token && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* 📁 DRIVE TAB */}
            {activeTab === 'drive' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <FolderGit2 className="w-5 h-5 text-emerald-600" />
                      Google Drive Files & Documents
                    </h2>
                    <p className="text-xs text-slate-500">Access recent uploaded compliance notes, tax drafts, and folders</p>
                  </div>
                  <button
                    onClick={() => loadTabData('drive')}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* Create Quick Text Note on Drive */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Upload Legal / Tax Memorandum to Drive</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="File title (e.g., Tax_Assessment_Memo_2026.txt)"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Content text / Summary observations"
                      value={newFileContent}
                      onChange={(e) => setNewFileContent(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (!newFileName.trim()) return;
                      try {
                        setLoading(true);
                        await workspaceDriveApi.createFile(newFileName, newFileContent || 'Accounticca tax memorandum draft');
                        setNewFileName('');
                        setNewFileContent('');
                        setFeedback({ message: 'File uploaded to Google Drive!', type: 'success' });
                        loadTabData('drive');
                      } catch (e: any) {
                        setFeedback({ message: e.message, type: 'error' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Note to Drive
                  </button>
                </div>

                {/* File List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Drive Files</h4>
                  {driveFiles.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No files found or loading...</p>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                      {driveFiles.map((f) => (
                        <div key={f.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FolderOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <p className="text-sm font-semibold text-slate-800 truncate">{f.name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{f.mimeType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {f.webViewLink && (
                              <a
                                href={f.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                                title="Open in Google Drive"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                triggerDestructiveAction(
                                  'Delete File from Google Drive',
                                  `Are you sure you want to permanently delete "${f.name}"? This action cannot be undone.`,
                                  async () => {
                                    await workspaceDriveApi.deleteFile(f.id);
                                    setFeedback({ message: `Deleted ${f.name}`, type: 'success' });
                                    loadTabData('drive');
                                  }
                                );
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 📊 SHEETS TAB */}
            {activeTab === 'sheets' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    Google Sheets Integration
                  </h2>
                  <p className="text-xs text-slate-500">Generate tax computation sheets, TDS reconciliation sheets, and audit registers</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Create Tax Calculation Spreadsheet</h3>
                  <p className="text-xs text-slate-600">
                    Instantly create a structured Google Sheet with columns pre-configured for Bangladesh Finance Act 2026 Assessment Year 2026–27.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const res = await workspaceSheetsApi.createSpreadsheet('Accounticca_Tax_Schedule_2026-27');
                        setCreatedSheetId(res.spreadsheetId);
                        
                        // Seed headers
                        await workspaceSheetsApi.appendValues(
                          res.spreadsheetId,
                          'Sheet1!A1:E1',
                          [['Asset/Income Head', 'Gross Income (BDT)', 'Allowable Deductions', 'Net Taxable', 'Applicable Tax (15%/Slab)']]
                        );

                        setFeedback({ 
                          message: `Spreadsheet created! ID: ${res.spreadsheetId}`, 
                          type: 'success' 
                        });
                      } catch (e: any) {
                        setFeedback({ message: e.message, type: 'error' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Create 2026 Tax Computation Sheet
                  </button>

                  {createdSheetId && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="text-xs text-emerald-900">
                        Spreadsheet created! Open in Google Sheets to view and edit.
                      </div>
                      <a
                        href={`https://docs.google.com/spreadsheets/d/${createdSheetId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                      >
                        <span>Open Sheet</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 📅 CALENDAR TAB */}
            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      Google Calendar Tax Deadlines & Hearings
                    </h2>
                    <p className="text-xs text-slate-500">Sync filing deadlines, RJSC compliance schedules, and tribunal hearings</p>
                  </div>
                  <button
                    onClick={() => loadTabData('calendar')}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* Create Event Form */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Schedule Tax Compliance Deadline / Reminder</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Event title (e.g. NBR Advance Tax Q3 Filing)"
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                    />
                    <input
                      type="datetime-local"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (!newSummary.trim() || !newDate) {
                        setFeedback({ message: 'Please provide event title and date.', type: 'error' });
                        return;
                      }
                      try {
                        setLoading(true);
                        const startIso = new Date(newDate).toISOString();
                        const endIso = new Date(new Date(newDate).getTime() + 60 * 60 * 1000).toISOString();
                        await workspaceCalendarApi.createEvent({
                          summary: newSummary,
                          start: { dateTime: startIso },
                          end: { dateTime: endIso },
                          description: 'Scheduled via Accounticca Tax & Compliance Hub'
                        });
                        setNewSummary('');
                        setNewDate('');
                        setFeedback({ message: 'Event scheduled in Google Calendar!', type: 'success' });
                        loadTabData('calendar');
                      } catch (e: any) {
                        setFeedback({ message: e.message, type: 'error' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Event
                  </button>
                </div>

                {/* Event list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Calendar Events</h4>
                  {calendarEvents.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No upcoming events found.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                      {calendarEvents.map((evt) => (
                        <div key={evt.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <p className="text-sm font-semibold text-slate-800 truncate">{evt.summary}</p>
                              <p className="text-[11px] text-slate-400">
                                {evt.start.dateTime ? new Date(evt.start.dateTime).toLocaleString() : evt.start.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {evt.htmlLink && (
                              <a
                                href={evt.htmlLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                                title="Open in Calendar"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                triggerDestructiveAction(
                                  'Delete Calendar Event',
                                  `Are you sure you want to remove "${evt.summary}" from your calendar?`,
                                  async () => {
                                    await workspaceCalendarApi.deleteEvent(evt.id);
                                    setFeedback({ message: `Deleted ${evt.summary}`, type: 'success' });
                                    loadTabData('calendar');
                                  }
                                );
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 📝 DOCS TAB */}
            {activeTab === 'docs' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Google Docs Legal & Tax Document Generator
                  </h2>
                  <p className="text-xs text-slate-500">Draft Power of Attorney, NDAs, and Tax Appeal Petitions straight into Google Docs</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Generate Legal Document Draft</h3>
                  <p className="text-xs text-slate-600">
                    Creates a formatted Google Doc with standard Bangladesh corporate tax & legal headers.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const doc = await workspaceDocsApi.createDocument('Tax_Appeal_Petition_AY2026-27');
                        setCreatedDocId(doc.documentId);
                        
                        await workspaceDocsApi.insertText(
                          doc.documentId,
                          'BEFORE THE TAXES APPELLATE TRIBUNAL, DHAKA\nIN THE MATTER OF: ASSESSMENT YEAR 2026-2027\n\nMEMORANDUM OF APPEAL UNDER THE INCOME TAX ACT 2023 / FINANCE ACT 2026\n\nDrafted via Accounticca Legal Advisory Suite\n\n'
                        );

                        setFeedback({ 
                          message: `Google Doc created! ID: ${doc.documentId}`, 
                          type: 'success' 
                        });
                      } catch (e: any) {
                        setFeedback({ message: e.message, type: 'error' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Generate Tax Appeal Google Doc
                  </button>

                  {createdDocId && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="text-xs text-emerald-900">
                        Document ready! Open in Google Docs to draft and share.
                      </div>
                      <a
                        href={`https://docs.google.com/document/d/${createdDocId}/edit`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                      >
                        <span>Open Document</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 📽️ SLIDES TAB */}
            {activeTab === 'slides' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Presentation className="w-5 h-5 text-emerald-600" />
                    Google Slides Presentation Generator
                  </h2>
                  <p className="text-xs text-slate-500">Create client presentation decks on Finance Act 2026 reforms</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Generate Client Tax Advisory Deck</h3>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const pres = await workspaceSlidesApi.createPresentation('Finance_Act_2026_Advisory_Deck');
                        setCreatedSlideId(pres.presentationId);
                        setFeedback({ message: `Google Slides deck created!`, type: 'success' });
                      } catch (e: any) {
                        setFeedback({ message: e.message, type: 'error' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Create Advisory Slide Deck
                  </button>

                  {createdSlideId && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="text-xs text-emerald-900">
                        Slide deck initialized! Open in Google Slides.
                      </div>
                      <a
                        href={`https://docs.google.com/presentation/d/${createdSlideId}/edit`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                      >
                        <span>Open Presentation</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ✅ TASKS TAB */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                      Google Tasks & Action Items
                    </h2>
                    <p className="text-xs text-slate-500">Track pending tax returns, withholding certificates, and client deliverables</p>
                  </div>
                  <button
                    onClick={() => loadTabData('tasks')}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* Add task form */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex gap-3">
                  <input
                    type="text"
                    placeholder="New compliance task (e.g. Verify Section 89 TDS challans for XYZ Ltd)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  />
                  <button
                    onClick={async () => {
                      if (!newTaskTitle.trim()) return;
                      try {
                        setLoading(true);
                        await workspaceTasksApi.createTask({ title: newTaskTitle });
                        setNewTaskTitle('');
                        setFeedback({ message: 'Task added to Google Tasks!', type: 'success' });
                        loadTabData('tasks');
                      } catch (e: any) {
                        setFeedback({ message: e.message, type: 'error' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    Add Task
                  </button>
                </div>

                {/* Task list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Tasks</h4>
                  {tasks.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No tasks found.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                      {tasks.map((t) => (
                        <div key={t.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={t.status === 'completed'}
                              onChange={async () => {
                                const newStatus = t.status === 'completed' ? 'needsAction' : 'completed';
                                await workspaceTasksApi.updateTaskStatus(t.id, newStatus);
                                loadTabData('tasks');
                              }}
                              className="w-4 h-4 text-emerald-600 rounded-sm"
                            />
                            <span className={`text-sm ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                              {t.title}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              triggerDestructiveAction(
                                'Delete Task',
                                `Are you sure you want to remove "${t.title}" from Google Tasks?`,
                                async () => {
                                  await workspaceTasksApi.deleteTask(t.id);
                                  loadTabData('tasks');
                                }
                              );
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 👥 CONTACTS TAB */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      Google Contacts (Clients & Directory)
                    </h2>
                    <p className="text-xs text-slate-500">Manage client contact information, corporate representatives, and advisors</p>
                  </div>
                  <button
                    onClick={() => loadTabData('contacts')}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* Add contact form */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Add New Client Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={newGivenName}
                      onChange={(e) => setNewGivenName(e.target.value)}
                      className="px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      className="px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      className="px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      className="px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (!newGivenName.trim()) {
                        setFeedback({ message: 'First name is required.', type: 'error' });
                        return;
                      }
                      try {
                        setLoading(true);
                        await workspaceContactsApi.createContact({
                          givenName: newGivenName,
                          familyName: newFamilyName,
                          email: newContactEmail,
                          phone: newContactPhone
                        });
                        setNewGivenName('');
                        setNewFamilyName('');
                        setNewContactEmail('');
                        setNewContactPhone('');
                        setFeedback({ message: 'Contact saved to Google Contacts!', type: 'success' });
                        loadTabData('contacts');
                      } catch (e: any) {
                        setFeedback({ message: e.message, type: 'error' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save Contact
                  </button>
                </div>

                {/* Contacts list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Google Contacts</h4>
                  {contacts.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No contacts found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {contacts.map((c) => {
                        const name = c.names?.[0]?.displayName || 'Unnamed Contact';
                        const email = c.emailAddresses?.[0]?.value;
                        const phone = c.phoneNumbers?.[0]?.value;
                        return (
                          <div key={c.resourceName} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-slate-800 truncate">{name}</p>
                              {email && <p className="text-xs text-slate-500 truncate">{email}</p>}
                              {phone && <p className="text-xs text-slate-400">{phone}</p>}
                            </div>
                            <button
                              onClick={() => {
                                triggerDestructiveAction(
                                  'Delete Contact',
                                  `Are you sure you want to delete "${name}" from your Google Contacts?`,
                                  async () => {
                                    await workspaceContactsApi.deleteContact(c.resourceName);
                                    setFeedback({ message: `Deleted ${name}`, type: 'success' });
                                    loadTabData('contacts');
                                  }
                                );
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                              title="Delete contact"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 📹 MEET TAB */}
            {activeTab === 'meet' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-emerald-600" />
                    Google Meet Instant Video Consultation
                  </h2>
                  <p className="text-xs text-slate-500">Generate secure Google Meet spaces for client tax hearings and case advisory</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Create Client Consultation Meeting</h3>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const space = await workspaceMeetApi.createMeetingSpace();
                        setCreatedMeet(space);
                        setFeedback({ message: 'Google Meet conference room generated!', type: 'success' });
                      } catch (e: any) {
                        setFeedback({ message: e.message, type: 'error' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <Video className="w-4 h-4" />
                    Generate Google Meet Room
                  </button>

                  {createdMeet && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                      <p className="text-xs font-bold text-emerald-900">Meeting Space Code: {createdMeet.meetingCode}</p>
                      <div className="flex items-center gap-3">
                        <a
                          href={createdMeet.meetingUri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                        >
                          <span>Join Google Meet</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(createdMeet.meetingUri);
                            setFeedback({ message: 'Meeting URL copied to clipboard!', type: 'success' });
                          }}
                          className="text-xs text-emerald-800 underline font-medium"
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 🎓 CLASSROOM TAB */}
            {activeTab === 'classroom' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                      Google Classroom CPD & Tax Workshops
                    </h2>
                    <p className="text-xs text-slate-500">Manage courses, student cohorts, and professional training certifications</p>
                  </div>
                  <button
                    onClick={() => loadTabData('classroom')}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* Create course */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Create Classroom Cohort</h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Course name (e.g. Bangladesh Finance Act 2026 Masterclass)"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                    />
                    <button
                      onClick={async () => {
                        if (!newCourseName.trim()) return;
                        try {
                          setLoading(true);
                          await workspaceClassroomApi.createCourse(newCourseName);
                          setNewCourseName('');
                          setFeedback({ message: 'Course created in Google Classroom!', type: 'success' });
                          loadTabData('classroom');
                        } catch (e: any) {
                          setFeedback({ message: e.message, type: 'error' });
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                    >
                      Create Course
                    </button>
                  </div>
                </div>

                {/* Courses list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Classroom Courses</h4>
                  {classroomCourses.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No courses found or you are not enrolled as a teacher.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                      {classroomCourses.map((c) => (
                        <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.section}</p>
                          </div>
                          {c.alternateLink && (
                            <a
                              href={c.alternateLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100"
                            >
                              <span>Open in Classroom</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 💬 CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    Google Chat Spaces
                  </h2>
                  <p className="text-xs text-slate-500">Enterprise workspace spaces and communications</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Google Chat Spaces allow teams to communicate, discuss audit files, and collaborate.
                  </p>
                  <a
                    href="https://chat.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <span>Launch Google Chat Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {chatSpaces.length > 0 && (
                    <div className="space-y-2 pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Connected Spaces</h4>
                      <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden">
                        {chatSpaces.map((s) => (
                          <div key={s.name} className="p-3 text-xs text-slate-800 font-semibold">
                            {s.displayName || s.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 📋 FORMS TAB */}
            {activeTab === 'forms' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-emerald-600" />
                    Google Forms Tax Questionnaire Generator
                  </h2>
                  <p className="text-xs text-slate-500">Create client onboarding and tax asset collection surveys</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Generate Client Tax Intake Survey</h3>
                  <p className="text-xs text-slate-600">
                    Instantly create a Google Form for collecting investment rebates, wealth statement documents, and salary slips.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const form = await workspaceFormsApi.createForm('Accounticca Client Tax Intake Survey AY 2026-27');
                        setCreatedFormId(form.formId);
                        setFeedback({ message: 'Google Form created successfully!', type: 'success' });
                      } catch (e: any) {
                        setFeedback({ message: e.message, type: 'error' });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Create Client Intake Google Form
                  </button>

                  {createdFormId && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="text-xs text-emerald-900">
                        Form initialized! Open in Google Forms to edit questions and share.
                      </div>
                      <a
                        href={`https://docs.google.com/forms/d/${createdFormId}/edit`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                      >
                        <span>Open Form</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Confirmation Modal for Destructive Operations (MANDATORY per workspace skill) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{confirmModal.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {confirmModal.description}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
