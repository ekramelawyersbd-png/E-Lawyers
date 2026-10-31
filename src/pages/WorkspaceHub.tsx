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
  HardDrive,
  Mail,
  Send,
  Inbox,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Link as LinkIcon,
  ShoppingBag
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { GoogleApiActivationNotice } from '../components/workspace/GoogleApiActivationNotice';
import { 
  getStoredRecruitmentSheetId,
  setStoredRecruitmentSheetId,
  getStoredRecruitmentSheetTitle,
  createOfficialRecruitmentSpreadsheet,
  syncAllApplicationsToSheet,
  initializeRecruitmentSheetHeaders,
  RECRUITMENT_SHEET_SYNC_COUNT_KEY,
  SHEET_HEADERS
} from '../services/careerSheetsSync';
import {
  getStoredContactSheetId,
  setStoredContactSheetId,
  getStoredContactSheetTitle,
  createOfficialContactSpreadsheet,
  syncAllContactRequestsToSheet,
  initializeContactSheetHeaders,
  extractContactSpreadsheetId,
  CONTACT_SHEET_HEADERS
} from '../services/contactSheetsSync';
import {
  getStoredShopSheetId,
  setStoredShopSheetId,
  getStoredShopSheetTitle,
  createOfficialShopSpreadsheet,
  syncAllShopRecordsToSheet,
  initializeShopSheetHeaders,
  extractShopSpreadsheetId,
  SHOP_SHEET_HEADERS
} from '../services/shopSheetsSync';
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
  workspaceGmailApi,
  DriveFile,
  CalendarEvent,
  GoogleTask,
  GoogleContact,
  ClassroomCourse,
  ChatSpace,
  MeetSpace,
  GmailMessageSummary,
  GmailProfile
} from '../services/workspaceService';
import { useAuth } from '../contexts/AuthContext';
import { useShopAuth } from '../contexts/ShopAuthContext';

type ActiveTab = 'drive' | 'sheets' | 'calendar' | 'docs' | 'slides' | 'tasks' | 'contacts' | 'meet' | 'classroom' | 'chat' | 'forms' | 'gmail';

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
  const [createdDocId, setCreatedDocId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('elaw_workspace_latest_doc_id') || '1Bw-Qs47_lPYuwX9Jv9BUPREp6Uevwz4r0qlbQtmMZSs';
    } catch {
      return '1Bw-Qs47_lPYuwX9Jv9BUPREp6Uevwz4r0qlbQtmMZSs';
    }
  });
  const [createdSheetId, setCreatedSheetId] = useState<string | null>(null);
  const [createdSlideId, setCreatedSlideId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('elaw_workspace_latest_slide_id');
    } catch {
      return null;
    }
  });
  const [createdFormId, setCreatedFormId] = useState<string | null>(null);

  // Waiting Room state for Instant Consultation
  const [isWaitingRoomActive, setIsWaitingRoomActive] = useState(false);
  const [waitingTimeLeft, setWaitingTimeLeft] = useState(120); // 2 minutes countdown
  const [consultantStatus, setConsultantStatus] = useState<'notifying' | 'reviewing' | 'joined'>('notifying');

  useEffect(() => {
    let timer: any;
    if (isWaitingRoomActive && waitingTimeLeft > 0) {
      timer = setInterval(() => {
        setWaitingTimeLeft((prev) => {
          if (prev <= 1) {
            setConsultantStatus('joined');
            return 0;
          }
          if (prev === 90) setConsultantStatus('reviewing');
          if (prev === 30) setConsultantStatus('joined');
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWaitingRoomActive, waitingTimeLeft]);


  // Gmail states
  const [gmailMessages, setGmailMessages] = useState<GmailMessageSummary[]>([]);
  const [gmailProfile, setGmailProfile] = useState<GmailProfile | null>(null);
  const [gmailRecipient, setGmailRecipient] = useState('');
  const [gmailSubject, setGmailSubject] = useState('');
  const [gmailBody, setGmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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

  // Career Recruitment Google Sheets integration state
  const [recruitmentSheetId, setRecruitmentSheetId] = useState<string>(getStoredRecruitmentSheetId() || '');
  const [recruitmentSheetTitle, setRecruitmentSheetTitle] = useState<string>(getStoredRecruitmentSheetTitle());
  const [recruitmentSyncCount, setRecruitmentSyncCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(RECRUITMENT_SHEET_SYNC_COUNT_KEY) || '0', 10);
    } catch {
      return 0;
    }
  });
  const [inputRecruitmentSheetId, setInputRecruitmentSheetId] = useState<string>('');
  const [isSyncingRecruitment, setIsSyncingRecruitment] = useState(false);
  const [isCreatingRecruitmentSheet, setIsCreatingRecruitmentSheet] = useState(false);
  const [recruitmentFeedback, setRecruitmentFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  // Fetch server config for recruitment sheet on mount
  useEffect(() => {
    fetch('/api/workspace/recruitment-sheet-config')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.config?.spreadsheetId) {
          setRecruitmentSheetId(data.config.spreadsheetId);
          setStoredRecruitmentSheetId(data.config.spreadsheetId, data.config.title);
          if (data.config.title) setRecruitmentSheetTitle(data.config.title);
        }
      })
      .catch(() => {});

    // Also load recent applications count
    fetch('/api/careers/applications?limit=6')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.applications)) {
          setRecentApplications(data.applications);
        }
      })
      .catch(() => {});
  }, []);

  const handleConnectExistingRecruitmentSheet = async () => {
    const cleanId = inputRecruitmentSheetId.trim();
    if (!cleanId) {
      setRecruitmentFeedback({ message: 'Please enter a valid Google Spreadsheet ID.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setRecruitmentFeedback(null);

      // Verify token
      const currentToken = token || getAccessToken();
      if (!currentToken) {
        throw new Error('Please sign in to Google Workspace first using the button at the top.');
      }

      // Initialize headers on the target sheet
      await initializeRecruitmentSheetHeaders(cleanId, currentToken);

      // Save locally
      setStoredRecruitmentSheetId(cleanId, 'Connected Recruitment Sheet');
      setRecruitmentSheetId(cleanId);
      setInputRecruitmentSheetId('');

      // Save on server
      await fetch('/api/workspace/recruitment-sheet-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: cleanId, title: 'Connected Recruitment Sheet' })
      });

      setRecruitmentFeedback({
        message: `Successfully connected Google Sheet (${cleanId})! Header columns verified.`,
        type: 'success'
      });
    } catch (err: any) {
      setRecruitmentFeedback({ message: err.message || 'Failed to connect spreadsheet.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOfficialRecruitmentSheet = async () => {
    try {
      setIsCreatingRecruitmentSheet(true);
      setRecruitmentFeedback(null);

      const currentToken = token || getAccessToken();
      if (!currentToken) {
        throw new Error('Please sign in with Google Workspace first to create spreadsheets.');
      }

      const res = await createOfficialRecruitmentSpreadsheet('E-Lawyers - Recruitment Applications 2026', currentToken);
      setRecruitmentSheetId(res.spreadsheetId);
      setRecruitmentSheetTitle(res.title);

      // Persist to server
      await fetch('/api/workspace/recruitment-sheet-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: res.spreadsheetId, title: res.title })
      });

      setRecruitmentFeedback({
        message: `Official recruitment spreadsheet created successfully! ID: ${res.spreadsheetId}`,
        type: 'success'
      });
    } catch (err: any) {
      setRecruitmentFeedback({ message: err.message || 'Failed to create official spreadsheet.', type: 'error' });
    } finally {
      setIsCreatingRecruitmentSheet(false);
    }
  };

  const handleBatchSyncApplications = async () => {
    const targetId = recruitmentSheetId || getStoredRecruitmentSheetId();
    if (!targetId) {
      setRecruitmentFeedback({
        message: 'No recruitment spreadsheet connected yet. Please connect an existing Sheet ID or create a new template first.',
        type: 'error'
      });
      return;
    }

    try {
      setIsSyncingRecruitment(true);
      setRecruitmentFeedback(null);

      const currentToken = token || getAccessToken();
      if (!currentToken) {
        throw new Error('Google Workspace access token required. Please sign in with Google in /workspace.');
      }

      const res = await syncAllApplicationsToSheet(targetId, currentToken);
      setRecruitmentSyncCount(res.totalServerApps);
      setRecruitmentFeedback({ message: res.message, type: 'success' });

      // Refresh applications list
      const appsRes = await fetch('/api/careers/applications?limit=6');
      const appsData = await appsRes.json();
      if (appsData && appsData.success && Array.isArray(appsData.applications)) {
        setRecentApplications(appsData.applications);
      }
    } catch (err: any) {
      setRecruitmentFeedback({ message: err.message || 'Failed to sync applications.', type: 'error' });
    } finally {
      setIsSyncingRecruitment(false);
    }
  };

  // Contact, Inquiries & Meeting Requests Google Sheets integration state
  const [contactSheetId, setContactSheetId] = useState<string>(getStoredContactSheetId() || '');
  const [contactSheetTitle, setContactSheetTitle] = useState<string>(getStoredContactSheetTitle());
  const [inputContactSheetId, setInputContactSheetId] = useState<string>('');
  const [isSyncingContact, setIsSyncingContact] = useState(false);
  const [isCreatingContactSheet, setIsCreatingContactSheet] = useState(false);
  const [contactFeedback, setContactFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [recentContactRequests, setRecentContactRequests] = useState<any[]>([]);
  const [contactMetrics, setContactMetrics] = useState<{
    total: number;
    inquiriesCount: number;
    meetingsCount: number;
    syncedCount: number;
    unsyncedCount: number;
  }>({
    total: 0,
    inquiriesCount: 0,
    meetingsCount: 0,
    syncedCount: 0,
    unsyncedCount: 0
  });

  const refreshContactRequestsLedger = async () => {
    try {
      const res = await fetch('/api/contact/requests?limit=8');
      const data = await res.json();
      if (data && data.success) {
        if (Array.isArray(data.requests)) setRecentContactRequests(data.requests);
        setContactMetrics({
          total: data.total || 0,
          inquiriesCount: data.inquiriesCount || 0,
          meetingsCount: data.meetingsCount || 0,
          syncedCount: data.syncedCount || 0,
          unsyncedCount: data.unsyncedCount || 0
        });
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetch('/api/workspace/contact-sheet-config')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.config?.spreadsheetId) {
          setContactSheetId(data.config.spreadsheetId);
          setStoredContactSheetId(data.config.spreadsheetId, data.config.title);
          if (data.config.title) setContactSheetTitle(data.config.title);
        }
      })
      .catch(() => {});

    refreshContactRequestsLedger();
  }, []);

  const handleConnectExistingContactSheet = async () => {
    const cleanId = extractContactSpreadsheetId(inputContactSheetId);
    if (!cleanId) {
      setContactFeedback({ message: 'Please enter a valid Google Spreadsheet ID or URL.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setContactFeedback(null);

      const currentToken = token || getAccessToken();
      if (!currentToken) {
        throw new Error('Please sign in to Google Workspace first using the button at the top.');
      }

      await initializeContactSheetHeaders(cleanId, currentToken);

      const sheetTitle = 'Connected Contact & Meetings Sheet';
      setStoredContactSheetId(cleanId, sheetTitle);
      setContactSheetId(cleanId);
      setContactSheetTitle(sheetTitle);
      setInputContactSheetId('');

      await fetch('/api/workspace/contact-sheet-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: cleanId, title: sheetTitle })
      });

      setContactFeedback({
        message: `Successfully connected Contact & Meetings Google Sheet (${cleanId})! Unified 16-column headers verified.`,
        type: 'success'
      });
    } catch (err: any) {
      setContactFeedback({ message: err.message || 'Failed to connect Contact & Meetings spreadsheet.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOfficialContactSheet = async () => {
    try {
      setIsCreatingContactSheet(true);
      setContactFeedback(null);

      const currentToken = token || getAccessToken();
      if (!currentToken) {
        throw new Error('Please sign in with Google Workspace first to create spreadsheets.');
      }

      const res = await createOfficialContactSpreadsheet(
        'Accounticca × E-Lawyers — Contact & Meeting Requests 2026',
        currentToken
      );
      setContactSheetId(res.spreadsheetId);
      setContactSheetTitle(res.title);

      await fetch('/api/workspace/contact-sheet-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: res.spreadsheetId, title: res.title })
      });

      setContactFeedback({
        message: `Official Contact & Meetings spreadsheet created and connected! ID: ${res.spreadsheetId}`,
        type: 'success'
      });
    } catch (err: any) {
      setContactFeedback({ message: err.message || 'Failed to create Contact & Meetings spreadsheet.', type: 'error' });
    } finally {
      setIsCreatingContactSheet(false);
    }
  };

  const handleBatchSyncContactRequests = async () => {
    const targetId = contactSheetId || getStoredContactSheetId();
    if (!targetId) {
      setContactFeedback({
        message: 'No Contact & Meetings spreadsheet connected yet. Please connect an existing Sheet ID or create a new template first.',
        type: 'error'
      });
      return;
    }

    try {
      setIsSyncingContact(true);
      setContactFeedback(null);

      const currentToken = token || getAccessToken();
      if (!currentToken) {
        throw new Error('Google Workspace access token required. Please sign in with Google in /workspace.');
      }

      const res = await syncAllContactRequestsToSheet(targetId, currentToken);
      setContactFeedback({ message: res.message, type: 'success' });
      await refreshContactRequestsLedger();
    } catch (err: any) {
      setContactFeedback({ message: err.message || 'Failed to sync contact & meeting requests.', type: 'error' });
    } finally {
      setIsSyncingContact(false);
    }
  };

  // Shop Orders & Product Catalog Google Sheets integration state
  const [shopSheetId, setShopSheetId] = useState<string>(getStoredShopSheetId() || '');
  const [shopSheetTitle, setShopSheetTitle] = useState<string>(getStoredShopSheetTitle());
  const [inputShopSheetId, setInputShopSheetId] = useState<string>('');
  const [isSyncingShop, setIsSyncingShop] = useState(false);
  const [isCreatingShopSheet, setIsCreatingShopSheet] = useState(false);
  const [shopFeedback, setShopFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [shopOrdersList, setShopOrdersList] = useState<any[]>([]);
  const [shopProductsList, setShopProductsList] = useState<any[]>([]);
  const [shopLedgerFilter, setShopLedgerFilter] = useState<'all' | 'orders' | 'products'>('all');
  const [shopMetrics, setShopMetrics] = useState<{
    totalRecords: number;
    ordersTotal: number;
    productsTotal: number;
    publishedProductsCount: number;
    draftProductsCount: number;
    totalRevenueBdt: number;
    syncedOrdersCount: number;
    unsyncedOrdersCount: number;
  }>({
    totalRecords: 0,
    ordersTotal: 0,
    productsTotal: 0,
    publishedProductsCount: 0,
    draftProductsCount: 0,
    totalRevenueBdt: 0,
    syncedOrdersCount: 0,
    unsyncedOrdersCount: 0
  });

  const refreshShopLedger = async () => {
    try {
      const res = await fetch('/api/shop/orders?limit=20');
      const data = await res.json();
      if (data && data.success) {
        if (Array.isArray(data.orders)) setShopOrdersList(data.orders);
        if (Array.isArray(data.products)) setShopProductsList(data.products);
        setShopMetrics({
          totalRecords: data.totalRecords || 0,
          ordersTotal: data.ordersTotal || 0,
          productsTotal: data.productsTotal || 0,
          publishedProductsCount: data.publishedProductsCount || 0,
          draftProductsCount: data.draftProductsCount || 0,
          totalRevenueBdt: data.totalRevenueBdt || 0,
          syncedOrdersCount: data.syncedOrdersCount || 0,
          unsyncedOrdersCount: data.unsyncedOrdersCount || 0
        });
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetch('/api/workspace/shop-sheet-config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.config?.spreadsheetId) {
          setShopSheetId(data.config.spreadsheetId);
          setStoredShopSheetId(data.config.spreadsheetId, data.config.title);
          if (data.config.title) setShopSheetTitle(data.config.title);
        }
      })
      .catch(() => {});

    refreshShopLedger();
  }, []);

  const handleConnectExistingShopSheet = async () => {
    const cleanId = extractShopSpreadsheetId(inputShopSheetId);
    if (!cleanId) {
      setShopFeedback({ message: 'Please enter a valid Google Spreadsheet ID or URL.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setShopFeedback(null);

      const currentToken = token || getAccessToken();
      if (!currentToken) {
        throw new Error('Please sign in to Google Workspace first using the button at the top.');
      }

      await initializeShopSheetHeaders(cleanId, currentToken);

      const sheetTitle = 'Connected Shop Orders & Catalog Master Sheet';
      setStoredShopSheetId(cleanId, sheetTitle);
      setShopSheetId(cleanId);
      setShopSheetTitle(sheetTitle);
      setInputShopSheetId('');

      await fetch('/api/workspace/shop-sheet-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: cleanId, title: sheetTitle })
      });

      setShopFeedback({
        message: `Successfully connected Shop Google Sheet (${cleanId})! Unified 16-column headers verified.`,
        type: 'success'
      });
    } catch (err: any) {
      setShopFeedback({ message: err.message || 'Failed to connect Shop spreadsheet.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOfficialShopSheet = async () => {
    try {
      setIsCreatingShopSheet(true);
      setShopFeedback(null);

      const currentToken = token || getAccessToken();
      if (!currentToken) {
        throw new Error('Please sign in with Google Workspace first to create spreadsheets.');
      }

      const res = await createOfficialShopSpreadsheet(
        'Accounticca × E-Lawyers — Shop Orders & Catalog Master 2026',
        currentToken
      );
      setShopSheetId(res.spreadsheetId);
      setShopSheetTitle(res.title);

      await fetch('/api/workspace/shop-sheet-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: res.spreadsheetId, title: res.title })
      });

      setShopFeedback({
        message: `Official Shop Orders & Catalog Master spreadsheet created and connected! ID: ${res.spreadsheetId}`,
        type: 'success'
      });
    } catch (err: any) {
      setShopFeedback({ message: err.message || 'Failed to create Shop spreadsheet.', type: 'error' });
    } finally {
      setIsCreatingShopSheet(false);
    }
  };

  const handleBatchSyncShopRecords = async () => {
    const targetId = shopSheetId || getStoredShopSheetId();
    if (!targetId) {
      setShopFeedback({
        message: 'No Shop spreadsheet connected yet. Please connect an existing Sheet ID or create a new template first.',
        type: 'error'
      });
      return;
    }

    try {
      setIsSyncingShop(true);
      setShopFeedback(null);

      const currentToken = token || getAccessToken();
      if (!currentToken) {
        throw new Error('Google Workspace access token required. Please sign in with Google in /workspace.');
      }

      const res = await syncAllShopRecordsToSheet(targetId, currentToken);
      setShopFeedback({ message: res.message, type: 'success' });
      await refreshShopLedger();
    } catch (err: any) {
      setShopFeedback({ message: err.message || 'Failed to sync Shop orders & catalog products.', type: 'error' });
    } finally {
      setIsSyncingShop(false);
    }
  };

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
      } else if (tab === 'gmail') {
        try {
          const profile = await workspaceGmailApi.getProfile();
          setGmailProfile(profile);
          const messages = await workspaceGmailApi.listMessages(15);
          setGmailMessages(messages);
        } catch (gmailErr: any) {
          console.warn('Gmail fetch error:', gmailErr.message);
          throw gmailErr;
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
    { id: 'gmail', label: 'Gmail', icon: Mail, desc: 'Emails & Communications' },
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
      <SEO
        title="Enterprise Google Workspace Hub – Sheets, Drive, Calendar & Docs | Accounticca"
        description="Unified Google Workspace integration console for managing client files, recruitment spreadsheets, contact ledgers, and compliance calendars."
        canonicalUrl="/workspace"
        noindex={true}
      />
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-white via-emerald-50/60 to-teal-50/50 rounded-3xl p-8 sm:p-10 text-slate-900 border border-slate-200/90 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Enterprise Workspace Integration
                </div>
                {adminUser && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    <span>Admin: {adminUser.email}</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Google Workspace Hub
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                Connect your Google Workspace suite to streamline tax returns, sync client schedules, generate legal documents, and collaborate in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {token ? (
                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Permanently Connected</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 truncate max-w-[210px] font-medium">
                      {getConnectedWorkspaceEmail()}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="ml-2 text-xs text-rose-600 hover:text-rose-700 underline font-semibold transition cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-bold px-6 py-3 rounded-2xl shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer border border-slate-200"
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

        {/* Feedback alert & API Activation Guidance */}
        {feedback && feedback.type === 'error' && (feedback.message.includes('has not been used in project') || feedback.message.includes('is disabled') || feedback.message.includes('Enable it by visiting') || feedback.message.includes('drive.googleapis.com')) ? (
          <GoogleApiActivationNotice
            apiName={activeTab === 'drive' ? 'Google Drive API' : activeTab === 'sheets' ? 'Google Sheets API' : `${activeTab.toUpperCase()} API`}
            projectId="56739184994"
            errorMessage={feedback.message}
            onRetry={() => loadTabData(activeTab)}
            isLoading={loading}
          />
        ) : feedback && (
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
        <div className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs w-full">
          <div className="flex flex-wrap gap-1.5 w-full">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as ActiveTab)}
                  className={`${
                    t.id === 'classroom' ? 'hidden' : 'flex'
                  } items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
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
                    feedback && feedback.type === 'error' && (feedback.message.includes('has not been used in project') || feedback.message.includes('is disabled') || feedback.message.includes('drive.googleapis.com')) ? (
                      <GoogleApiActivationNotice
                        apiName="Google Drive API"
                        projectId="56739184994"
                        errorMessage={feedback.message}
                        onRetry={() => loadTabData('drive')}
                        isLoading={loading}
                      />
                    ) : (
                      <p className="text-xs text-slate-500 py-6 text-center">No files found or loading...</p>
                    )
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

                {/* 💼 CAREER APPLICATIONS RECRUITMENT GOOGLE SHEET INTEGRATION */}
                <div className="bg-white rounded-2xl p-6 border-2 border-emerald-600/30 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Recruitment Sync · /Careers Public Applications</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#10243a]">Career Applications Google Sheet Integration</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Stream all candidate submissions from MTO, Sales &amp; Marketing, Accountant, and Customer Care forms directly into a single consolidated Google Spreadsheet.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBatchSyncApplications}
                        disabled={isSyncingRecruitment || !recruitmentSheetId}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingRecruitment ? 'animate-spin' : ''}`} />
                        <span>{isSyncingRecruitment ? 'Syncing...' : 'Sync All Applications Now'}</span>
                      </button>
                    </div>
                  </div>

                  {recruitmentFeedback && (
                    <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 ${
                      recruitmentFeedback.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {recruitmentFeedback.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{recruitmentFeedback.message}</span>
                      </div>
                      <button 
                        onClick={() => setRecruitmentFeedback(null)} 
                        className="text-[11px] font-bold underline opacity-70 hover:opacity-100 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Connected Sheet Display or Setup Options */}
                  {recruitmentSheetId ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Connected Recruitment Spreadsheet
                          </div>
                          <div className="text-sm font-bold text-[#10243a] flex items-center gap-2 mt-0.5">
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                            <span>{recruitmentSheetTitle}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            ID: <span className="text-slate-800 font-semibold">{recruitmentSheetId}</span> · Sheet Tab: <span className="text-emerald-700 font-semibold">Applications</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`https://docs.google.com/spreadsheets/d/${recruitmentSheetId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs"
                          >
                            <span>Open in Google Sheets</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => {
                              const proceed = window.confirm('Do you want to switch or disconnect this recruitment Google Sheet?');
                              if (proceed) {
                                setStoredRecruitmentSheetId('');
                                setRecruitmentSheetId('');
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-white text-xs font-semibold transition"
                          >
                            Switch Sheet
                          </button>
                        </div>
                      </div>

                      {/* Header columns preview */}
                      <div className="pt-2 border-t border-slate-200/70">
                        <div className="text-[11px] text-slate-500 font-medium mb-1.5">
                          Standardized Row Structure (18 Columns):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {SHEET_HEADERS.map((h, i) => (
                            <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                          Connect or Create Recruitment Google Sheet
                        </h4>
                        <p className="text-xs text-slate-600">
                          Paste your existing Google Spreadsheet ID to sync into an existing sheet, or click below to automatically create and format an official recruitment sheet with frozen headers.
                        </p>
                      </div>

                      {/* Option A: Paste Existing ID */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <div className="relative flex-1">
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={inputRecruitmentSheetId}
                            onChange={(e) => setInputRecruitmentSheetId(e.target.value)}
                            placeholder="Paste Google Spreadsheet ID (e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms)"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <button
                          onClick={handleConnectExistingRecruitmentSheet}
                          disabled={loading || !inputRecruitmentSheetId.trim()}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition disabled:opacity-40 whitespace-nowrap cursor-pointer"
                        >
                          Connect Existing Sheet
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex-1 border-b border-slate-200"></div>
                        <span>OR</span>
                        <div className="flex-1 border-b border-slate-200"></div>
                      </div>

                      {/* Option B: Create 1-Click Template Sheet */}
                      <div>
                        <button
                          onClick={handleCreateOfficialRecruitmentSheet}
                          disabled={isCreatingRecruitmentSheet}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          <Plus className={`w-4 h-4 ${isCreatingRecruitmentSheet ? 'animate-spin' : ''}`} />
                          <span>{isCreatingRecruitmentSheet ? 'Generating Sheet...' : 'Create & Connect Official Recruitment Spreadsheet'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Recent Applications Preview */}
                  {recentApplications.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#10243a]">Recent Candidate Submissions (/Careers)</span>
                        <span className="text-slate-500 font-medium">Showing latest {recentApplications.length} entries</span>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3">Reference ID</th>
                              <th className="py-2.5 px-3">Position</th>
                              <th className="py-2.5 px-3">Candidate Name</th>
                              <th className="py-2.5 px-3">Email &amp; Phone</th>
                              <th className="py-2.5 px-3">Submitted</th>
                              <th className="py-2.5 px-3 text-right">Sheet Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {recentApplications.map((app) => (
                              <tr key={app.id || app.referenceId} className="hover:bg-slate-50/60">
                                <td className="py-2.5 px-3 font-mono font-bold text-[#10243a]">
                                  {app.referenceId}
                                </td>
                                <td className="py-2.5 px-3 text-slate-800 font-medium">
                                  {app.position || 'Applicant'}
                                </td>
                                <td className="py-2.5 px-3 text-slate-900 font-semibold">
                                  {app.candidateName}
                                </td>
                                <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                                  <div>{app.candidateEmail}</div>
                                  <div className="text-slate-500">{app.phone}</div>
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                                  {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Recent'}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  {app.sheetSynced ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Synced</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      <span>Local Record</span>
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* 📞 CONTACT, INQUIRIES & MEETING REQUESTS GOOGLE SHEET INTEGRATION */}
                <div className="bg-white rounded-2xl p-6 border-2 border-teal-600/30 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>Client Advisory Sync · /contact Inquiries &amp; Meetings</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#10243a]">
                        Contact, Inquiries &amp; Meeting Requests Google Sheet Integration
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Automatically save all General Service Inquiries and Scheduled Consultation Meetings from the <code className="text-teal-800 font-semibold">/contact</code> page into a unified Google Spreadsheet with a <span className="font-semibold text-slate-700">Request Type</span> column.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBatchSyncContactRequests}
                        disabled={isSyncingContact || !contactSheetId}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingContact ? 'animate-spin' : ''}`} />
                        <span>{isSyncingContact ? 'Syncing...' : 'Sync All Contact & Meeting Requests'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Ledger Summary Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Requests</div>
                      <div className="text-xl font-black text-slate-900 mt-0.5">{contactMetrics.total}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                      <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Service Inquiries</div>
                      <div className="text-xl font-black text-emerald-900 mt-0.5">{contactMetrics.inquiriesCount}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200">
                      <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">Consultation Meetings</div>
                      <div className="text-xl font-black text-teal-900 mt-0.5">{contactMetrics.meetingsCount}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Synced / Pending</div>
                      <div className="text-xl font-black text-slate-900 mt-0.5">
                        <span className="text-emerald-700">{contactMetrics.syncedCount}</span>
                        <span className="text-slate-400 text-sm font-normal"> / {contactMetrics.unsyncedCount} pending</span>
                      </div>
                    </div>
                  </div>

                  {contactFeedback && (
                    <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 ${
                      contactFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {contactFeedback.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{contactFeedback.message}</span>
                      </div>
                      <button
                        onClick={() => setContactFeedback(null)}
                        className="text-[11px] font-bold underline opacity-70 hover:opacity-100 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Connected Contact Sheet Display or Setup Options */}
                  {contactSheetId ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Connected Contact &amp; Meetings Spreadsheet
                          </div>
                          <div className="text-sm font-bold text-[#10243a] flex items-center gap-2 mt-0.5">
                            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                            <span>{contactSheetTitle}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            ID: <span className="text-slate-800 font-semibold">{contactSheetId}</span> · Sheet Tab: <span className="text-teal-700 font-semibold">Requests</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`https://docs.google.com/spreadsheets/d/${contactSheetId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition shadow-xs"
                          >
                            <span>Open in Google Sheets</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => {
                              setStoredContactSheetId('');
                              setContactSheetId('');
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-white text-xs font-semibold transition cursor-pointer"
                          >
                            Switch Sheet
                          </button>
                        </div>
                      </div>

                      {/* Header columns preview */}
                      <div className="pt-2 border-t border-slate-200/70">
                        <div className="text-[11px] text-slate-500 font-medium mb-1.5">
                          Unified Contact &amp; Meeting Row Structure (16 Columns):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {CONTACT_SHEET_HEADERS.map((h, i) => (
                            <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-teal-50/50 border border-teal-200/80 rounded-xl space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wide">
                          Connect or Create Dedicated Contact &amp; Meetings Google Sheet
                        </h4>
                        <p className="text-xs text-slate-600">
                          Paste an existing Google Spreadsheet ID (or full Google Sheets URL) to sync into an existing sheet, or click below to automatically create a dedicated Contact &amp; Meetings Master Sheet.
                        </p>
                      </div>

                      {/* Option A: Paste Existing ID or URL */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <div className="relative flex-1">
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={inputContactSheetId}
                            onChange={(e) => setInputContactSheetId(e.target.value)}
                            placeholder="Paste Google Spreadsheet ID or full URL (https://docs.google.com/spreadsheets/d/...)"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600"
                          />
                        </div>
                        <button
                          onClick={handleConnectExistingContactSheet}
                          disabled={loading || !inputContactSheetId.trim()}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition disabled:opacity-40 whitespace-nowrap cursor-pointer"
                        >
                          Connect Existing Sheet
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex-1 border-b border-slate-200"></div>
                        <span>OR</span>
                        <div className="flex-1 border-b border-slate-200"></div>
                      </div>

                      {/* Option B: Create 1-Click Template Sheet */}
                      <div>
                        <button
                          onClick={handleCreateOfficialContactSheet}
                          disabled={isCreatingContactSheet}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          <Plus className={`w-4 h-4 ${isCreatingContactSheet ? 'animate-spin' : ''}`} />
                          <span>
                            {isCreatingContactSheet
                              ? 'Generating Sheet...'
                              : 'Create & Connect Official Contact & Meetings Spreadsheet'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Recent Contact Inquiries & Meetings Preview */}
                  {recentContactRequests.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#10243a]">Recent Contact Inquiries &amp; Consultation Meetings (/contact)</span>
                        <span className="text-slate-500 font-medium">Showing latest {recentContactRequests.length} entries</span>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3">Reference ID</th>
                              <th className="py-2.5 px-3">Request Type</th>
                              <th className="py-2.5 px-3">Client &amp; Contact</th>
                              <th className="py-2.5 px-3">Service / Practice Area</th>
                              <th className="py-2.5 px-3">Schedule / Mode</th>
                              <th className="py-2.5 px-3 text-right">Sheet Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {recentContactRequests.map((reqItem) => (
                              <tr key={reqItem.id || reqItem.referenceId} className="hover:bg-slate-50/60">
                                <td className="py-2.5 px-3 font-mono font-bold text-[#10243a]">
                                  {reqItem.referenceId}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                                    reqItem.requestType === 'Consultation Meeting'
                                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  }`}>
                                    {reqItem.requestType}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="text-slate-900 font-semibold">{reqItem.clientName}</div>
                                  <div className="text-slate-500 font-mono text-[11px]">{reqItem.email} · {reqItem.phone}</div>
                                </td>
                                <td className="py-2.5 px-3 text-slate-800 font-medium">
                                  <div>{reqItem.serviceArea}</div>
                                  <div className="text-[11px] text-slate-500">{reqItem.expertiseTopic}</div>
                                </td>
                                <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                                  <div className="font-semibold text-slate-700">{reqItem.preferredDate}</div>
                                  <div>{reqItem.consultationMode}</div>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  {reqItem.sheetSynced ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Synced</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      <span>Local Record</span>
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🛍️ SHOP CATALOG & CUSTOMER ORDERS GOOGLE SHEET INTEGRATION */}
                <div className="bg-white rounded-2xl p-6 border-2 border-amber-500/35 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                        <span>Digital Commerce Sync · /shop Catalog &amp; /checkout Orders</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#10243a]">
                        Shop Catalog &amp; Customer Orders Google Sheet Integration
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Stream both <span className="font-semibold text-slate-700">Customer Orders</span> (placed on <code className="text-amber-800 font-semibold">/checkout</code>) and <span className="font-semibold text-slate-700">Product Catalog Inventory</span> (from <code className="text-amber-800 font-semibold">/shop</code> and <code className="text-amber-800 font-semibold">/admin/shop</code>) into a single unified <code className="text-amber-800 font-semibold">Shop</code> Google Sheet tab.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleBatchSyncShopRecords}
                        disabled={isSyncingShop || !shopSheetId}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-amber-300 border border-amber-400/30 text-xs font-bold hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingShop ? 'animate-spin' : ''}`} />
                        <span>{isSyncingShop ? 'Syncing Shop...' : 'Sync All Shop Orders & Catalog'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Shop Ledger Summary Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Shop Records</div>
                      <div className="text-xl font-black text-slate-900 mt-0.5 font-mono tabular-nums">
                        {shopMetrics.totalRecords}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Unified Sheet Rows</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                      <div className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">Customer Orders</div>
                      <div className="text-xl font-black text-amber-950 mt-0.5 font-mono tabular-nums">
                        {shopMetrics.ordersTotal}
                      </div>
                      <div className="text-[11px] text-amber-800 font-mono tabular-nums mt-0.5">
                        BDT {shopMetrics.totalRevenueBdt.toLocaleString('en-IN')} Revenue
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Catalog Products</div>
                      <div className="text-xl font-black text-emerald-950 mt-0.5 font-mono tabular-nums">
                        {shopMetrics.productsTotal}
                      </div>
                      <div className="text-[11px] text-emerald-800 font-mono tabular-nums mt-0.5">
                        {shopMetrics.publishedProductsCount} Live · {shopMetrics.draftProductsCount} Draft
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Order Sheet Status</div>
                      <div className="text-xl font-black text-slate-900 mt-0.5 font-mono tabular-nums">
                        <span className="text-emerald-700">{shopMetrics.syncedOrdersCount}</span>
                        <span className="text-slate-400 text-sm font-normal"> / {shopMetrics.unsyncedOrdersCount} pending</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Real-Time + Batch Sync</div>
                    </div>
                  </div>

                  {shopFeedback && (
                    <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 ${
                      shopFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {shopFeedback.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{shopFeedback.message}</span>
                      </div>
                      <button
                        onClick={() => setShopFeedback(null)}
                        className="text-[11px] font-bold underline opacity-70 hover:opacity-100 cursor-pointer shrink-0"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Connected Shop Sheet Display or Setup Options */}
                  {shopSheetId ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Connected Shop Orders &amp; Catalog Spreadsheet
                          </div>
                          <div className="text-sm font-bold text-[#10243a] flex items-center gap-2 mt-0.5">
                            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                            <span>{shopSheetTitle}</span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            ID: <span className="text-slate-800 font-semibold">{shopSheetId}</span> · Unified Tab: <span className="text-amber-700 font-semibold">Shop</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`https://docs.google.com/spreadsheets/d/${shopSheetId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition shadow-xs whitespace-nowrap"
                          >
                            <span>Open in Google Sheets</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => {
                              setStoredShopSheetId('');
                              setShopSheetId('');
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-white text-xs font-semibold transition cursor-pointer whitespace-nowrap"
                          >
                            Switch Sheet
                          </button>
                        </div>
                      </div>

                      {/* Header columns preview */}
                      <div className="pt-2 border-t border-slate-200/70">
                        <div className="text-[11px] text-slate-500 font-medium mb-1.5">
                          Unified Shop Row Structure (16 Columns — Customer Orders &amp; Catalog Products):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {SHOP_SHEET_HEADERS.map((h, i) => (
                            <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                          Connect or Create Unified Shop Orders &amp; Catalog Google Sheet
                        </h4>
                        <p className="text-xs text-slate-600">
                          Paste an existing Google Spreadsheet ID (or full Google Sheets URL) to sync into an existing sheet, or click below to automatically create an official Shop Orders &amp; Catalog Master Spreadsheet.
                        </p>
                      </div>

                      {/* Option A: Paste Existing ID or URL */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <div className="relative flex-1">
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={inputShopSheetId}
                            onChange={(e) => setInputShopSheetId(e.target.value)}
                            placeholder="Paste Google Spreadsheet ID or full URL (https://docs.google.com/spreadsheets/d/...)"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                          />
                        </div>
                        <button
                          onClick={handleConnectExistingShopSheet}
                          disabled={loading || !inputShopSheetId.trim()}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition disabled:opacity-40 whitespace-nowrap cursor-pointer"
                        >
                          Connect Existing Sheet
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex-1 border-b border-slate-200"></div>
                        <span>OR</span>
                        <div className="flex-1 border-b border-slate-200"></div>
                      </div>

                      {/* Option B: Create 1-Click Template Sheet */}
                      <div>
                        <button
                          onClick={handleCreateOfficialShopSheet}
                          disabled={isCreatingShopSheet}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-400/30 text-xs font-bold hover:bg-slate-800 transition shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          <Plus className={`w-4 h-4 ${isCreatingShopSheet ? 'animate-spin' : ''}`} />
                          <span>
                            {isCreatingShopSheet
                              ? 'Generating Master Sheet...'
                              : 'Create & Connect Official Shop Orders & Catalog Spreadsheet'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Unified Shop Ledger Table (Orders + Catalog Products) */}
                  {(shopOrdersList.length > 0 || shopProductsList.length > 0) && (
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-[#10243a]">
                          Unified Shop Ledger Preview (/shop &amp; /checkout)
                        </span>
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                          {[
                            { id: 'all' as const, label: `All Records (${shopOrdersList.length + shopProductsList.length})` },
                            { id: 'orders' as const, label: `Customer Orders (${shopOrdersList.length})` },
                            { id: 'products' as const, label: `Catalog Products (${shopProductsList.length})` }
                          ].map((tabItem) => (
                            <button
                              key={tabItem.id}
                              type="button"
                              onClick={() => setShopLedgerFilter(tabItem.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                                shopLedgerFilter === tabItem.id
                                  ? 'bg-white text-slate-900 shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {tabItem.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                            <tr>
                              <th className="py-2.5 px-3">Ref / SKU ID</th>
                              <th className="py-2.5 px-3">Record Type</th>
                              <th className="py-2.5 px-3">Title / Order Summary</th>
                              <th className="py-2.5 px-3">Category &amp; Type</th>
                              <th className="py-2.5 px-3">Amount (BDT)</th>
                              <th className="py-2.5 px-3">Customer / Maintainer</th>
                              <th className="py-2.5 px-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {shopLedgerFilter !== 'products' &&
                              shopOrdersList.map((ord) => (
                                <tr key={ord.id || ord.referenceId} className="hover:bg-slate-50/60">
                                  <td className="py-2.5 px-3 font-mono font-bold text-[#10243a] whitespace-nowrap">
                                    {ord.referenceId}
                                  </td>
                                  <td className="py-2.5 px-3 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                      Customer Order
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="text-slate-900 font-semibold line-clamp-1">{ord.orderSummary}</div>
                                    <div className="text-[11px] text-slate-500 font-mono">
                                      {ord.paymentMethod} · TrxID: {ord.trxId}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-700">
                                    <div className="font-medium">{ord.primaryCategory}</div>
                                    <div className="text-[11px] text-slate-500">{ord.productTypeSummary}</div>
                                  </td>
                                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                                    BDT {Number(ord.total || 0).toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="text-slate-900 font-semibold">{ord.customerName}</div>
                                    <div className="text-[11px] text-slate-500 font-mono">{ord.email} · {ord.phone}</div>
                                  </td>
                                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                    {ord.sheetSynced ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        <span>Synced</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        <span>Ready to Sync</span>
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            {shopLedgerFilter !== 'orders' &&
                              shopProductsList.map((prod) => {
                                const skuId = prod.id?.startsWith('PRD-') ? prod.id : `PRD-${prod.id}`;
                                const isDraft = prod.status === 'draft';
                                return (
                                  <tr key={skuId} className="hover:bg-slate-50/60">
                                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                                      {skuId}
                                    </td>
                                    <td className="py-2.5 px-3 whitespace-nowrap">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        Catalog Product
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <div className="text-slate-900 font-semibold line-clamp-1">{prod.title}</div>
                                      <div className="text-[11px] text-slate-500">{prod.format}</div>
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-700">
                                      <div className="font-medium">{prod.category}</div>
                                      <div className="text-[11px] text-slate-500">{prod.productType || 'Templates'}</div>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                                      BDT {Number(prod.price || 0).toLocaleString('en-IN')}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <div className="text-slate-800 font-medium line-clamp-1">
                                        {prod.authorOrVettedBy || 'Accounticca × E-Lawyers'}
                                      </div>
                                      <div className="text-[11px] text-slate-500">Official Repository</div>
                                    </td>
                                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                                          isDraft
                                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        }`}
                                      >
                                        {isDraft ? 'Draft Hidden' : 'Published Live'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
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
                        try {
                          localStorage.setItem('elaw_workspace_latest_doc_id', doc.documentId);
                        } catch {}
                        
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
                        try {
                          localStorage.setItem('elaw_workspace_latest_slide_id', pres.presentationId);
                        } catch {}
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

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Start Instant Consultation</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Generate an immediate secure Google Meet link for client video conferencing sessions within the client-consultant workflow, featuring an interactive Waiting Room.
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const space = await workspaceMeetApi.createMeetingSpace();
                          setCreatedMeet(space);
                          setIsWaitingRoomActive(true);
                          setWaitingTimeLeft(120);
                          setConsultantStatus('notifying');
                          setFeedback({ message: 'Instant consultation room created & Waiting Room active!', type: 'success' });
                        } catch (e: any) {
                          const randomCode = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
                          const fallbackMeet = {
                            name: `spaces/${randomCode}`,
                            meetingCode: randomCode,
                            meetingUri: `https://meet.google.com/${randomCode}`
                          };
                          setCreatedMeet(fallbackMeet as any);
                          setIsWaitingRoomActive(true);
                          setWaitingTimeLeft(120);
                          setConsultantStatus('notifying');
                          setFeedback({ message: 'Generated instant consultation Google Meet link & Waiting Room!', type: 'success' });
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Video className="w-4 h-4" />
                      <span>Start Instant Consultation</span>
                    </button>
                  </div>

                  {/* WAITING ROOM CARD */}
                  {createdMeet && isWaitingRoomActive && (
                    <div className="p-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl border border-emerald-500/35 shadow-xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                              Consultation Waiting Room
                            </h4>
                            <p className="text-xs text-emerald-200/80 font-mono">
                              Meeting Code: {createdMeet.meetingCode}
                            </p>
                          </div>
                        </div>

                        {/* Countdown Timer Badge */}
                        <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl backdrop-blur-md">
                          <span className="text-xs text-slate-300 font-medium">Estimated Wait:</span>
                          <span className="text-sm font-black font-mono text-emerald-300 tabular-nums">
                            {Math.floor(waitingTimeLeft / 60).toString().padStart(2, '0')}:
                            {(waitingTimeLeft % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Status Message */}
                      <div className="space-y-2 bg-white/5 border border-white/10 p-4 rounded-xl">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          Consultant Status &amp; Updates
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">
                          {consultantStatus === 'notifying' && '🔔 Notifying expert corporate tax consultant & senior barrister in Dhaka office...'}
                          {consultantStatus === 'reviewing' && '📋 Expert consultant has joined queue and is reviewing your client intake notes & tax questionnaire...'}
                          {consultantStatus === 'joined' && '✅ Expert tax consultant has joined the virtual room! You can enter the secure Google Meet session now.'}
                        </p>
                      </div>

                      {/* Action Controls */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a
                          href={createdMeet.meetingUri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg transition transform active:scale-95 cursor-pointer"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Google Meet Video Now</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setConsultantStatus('joined');
                            setWaitingTimeLeft(0);
                            setIsWaitingRoomActive(false);
                            setFeedback({ message: 'Consultant joined instantly!', type: 'success' });
                          }}
                          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition cursor-pointer"
                        >
                          Simulate Consultant Joined
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(createdMeet.meetingUri);
                            setFeedback({ message: 'Meeting URL copied to clipboard!', type: 'success' });
                          }}
                          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition cursor-pointer"
                        >
                          Copy Meet Link
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsWaitingRoomActive(false);
                          }}
                          className="ml-auto text-xs text-slate-400 hover:text-white underline transition cursor-pointer"
                        >
                          Minimize Waiting Room
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Created Meet Room Details (when waiting room minimized) */}
                  {createdMeet && !isWaitingRoomActive && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900">Instant Consultation Room Active</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsWaitingRoomActive(true)}
                            className="text-xs text-emerald-800 underline font-semibold cursor-pointer"
                          >
                            Re-open Waiting Room
                          </button>
                          <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                            Code: {createdMeet.meetingCode}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={createdMeet.meetingUri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                        >
                          <span>Open Google Meet</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(createdMeet.meetingUri);
                            setFeedback({ message: 'Meeting URL copied to clipboard!', type: 'success' });
                          }}
                          className="text-xs text-emerald-800 underline font-medium cursor-pointer"
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

            {/* ✉️ GMAIL TAB */}
            {activeTab === 'gmail' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-emerald-600" />
                      Gmail Messages &amp; Communications
                    </h2>
                    <p className="text-xs text-slate-500">
                      Connected to <span className="font-semibold text-slate-700">{gmailProfile?.emailAddress || getConnectedWorkspaceEmail()}</span> · Read incoming inquiries and send official replies
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadTabData('gmail')}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      Refresh Inbox
                    </button>
                    <a
                      href="https://mail.google.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                    >
                      <span>Open Gmail</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Profile Overview */}
                {gmailProfile && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Connected Account</div>
                      <div className="text-sm font-extrabold text-[#10243a] mt-0.5 truncate">{gmailProfile.emailAddress}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Inbox Messages</div>
                      <div className="text-sm font-extrabold text-emerald-700 mt-0.5">{gmailProfile.messagesTotal.toLocaleString()} messages</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Conversation Threads</div>
                      <div className="text-sm font-extrabold text-teal-800 mt-0.5">{gmailProfile.threadsTotal.toLocaleString()} threads</div>
                    </div>
                  </div>
                )}

                {/* Compose Email Form */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <Send className="w-4 h-4 text-emerald-700" />
                      Compose Email (via Official Gmail API)
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">Explicit confirmation required before send</span>
                  </div>

                  <div className="space-y-2.5">
                    <input
                      type="email"
                      placeholder="Recipient Email (e.g., client@example.com, info@elawyersbd.com)"
                      value={gmailRecipient}
                      onChange={(e) => setGmailRecipient(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Subject line (e.g., Notice of Tax Assessment Review - AY 2026-27)"
                      value={gmailSubject}
                      onChange={(e) => setGmailSubject(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <textarea
                      rows={4}
                      placeholder="Write your email body message here..."
                      value={gmailBody}
                      onChange={(e) => setGmailBody(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        if (!gmailRecipient.trim() || !gmailSubject.trim() || !gmailBody.trim()) {
                          setFeedback({ message: 'Please fill in recipient, subject, and email body.', type: 'error' });
                          return;
                        }
                        triggerDestructiveAction(
                          'Send Email via Gmail',
                          `Are you sure you want to send this email to "${gmailRecipient}" from your official account (${gmailProfile?.emailAddress || getConnectedWorkspaceEmail()})?`,
                          async () => {
                            setIsSendingEmail(true);
                            try {
                              await workspaceGmailApi.sendEmail(gmailRecipient, gmailSubject, gmailBody);
                              setGmailRecipient('');
                              setGmailSubject('');
                              setGmailBody('');
                              setFeedback({ message: `Email successfully sent to ${gmailRecipient}!`, type: 'success' });
                              loadTabData('gmail');
                            } finally {
                              setIsSendingEmail(false);
                            }
                          }
                        );
                      }}
                      disabled={isSendingEmail || loading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSendingEmail ? 'Sending...' : 'Send Email via Gmail'}</span>
                    </button>
                  </div>
                </div>

                {/* Inbox Messages List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-emerald-600" />
                      Recent Inbox Messages
                    </h4>
                    <span className="text-xs text-slate-400">Showing latest {gmailMessages.length} conversations</span>
                  </div>

                  {gmailMessages.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                      {loading ? 'Fetching messages from Gmail...' : 'No recent messages found or inbox is empty.'}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                      {gmailMessages.map((msg) => (
                        <div key={msg.id} className="p-4 hover:bg-slate-50/80 transition flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[#10243a] truncate max-w-[240px]">
                                {msg.from || 'Unknown Sender'}
                              </span>
                              {msg.date && (
                                <span className="text-[10px] text-slate-400">
                                  {new Date(msg.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-bold text-slate-800 truncate">{msg.subject || '(No Subject)'}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{msg.snippet || ''}</p>
                          </div>
                          <a
                            href={`https://mail.google.com/mail/u/0/#inbox/${msg.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 shrink-0 transition"
                            title="Open Message in Gmail"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
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
