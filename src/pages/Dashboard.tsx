import { useState, useEffect } from 'react';
import { FileText, Settings, BookMarked, PenSquare, Calendar, Bell, BellRing, Download } from 'lucide-react';
import { ComplianceCalendar } from '../components/dashboard/ComplianceCalendar';
import { ComplianceChecklist } from '../components/dashboard/ComplianceChecklist';
import { generateComplianceSummaryPDF } from '../utils/pdfGenerator';
import { getSavedItems, SavedItem, removeItem } from '../utils/readingList';
import { Link } from 'react-router-dom';
import { ExternalLink, Trash2 } from 'lucide-react';

export function Dashboard() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [activeTab, setActiveTab] = useState<'articles' | 'saved'>('articles');
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    setSavedItems(getSavedItems());
    
    const handleStorageChange = () => {
      setSavedItems(getSavedItems());
    };
    window.addEventListener('bookmarksUpdated', handleStorageChange);
    return () => window.removeEventListener('bookmarksUpdated', handleStorageChange);
  }, [activeTab]);

  const handleRemoveSaved = (id: string) => {
    removeItem(id);
    setSavedItems(getSavedItems());
  };


  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const simulateAmendmentAlert = () => {
    if (notificationPermission === 'granted') {
      const notification = new Notification('Finance Act 2026 Amendment', {
        body: 'A new amendment affecting "Corporate Tax" (your bookmarked category) has been published.',
        icon: '/vite.svg',
      });

      notification.onclick = function() {
        window.focus();
        this.close();
      };
    } else {
      alert('Please enable notifications first.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              JD
            </div>
            <div>
              <h2 className="font-bold text-slate-900">John Doe</h2>
              <p className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold">Contributor</p>
            </div>
          </div>
          <nav className="space-y-2 mb-6">
            <button onClick={() => setActiveTab('articles')} className={`w-full flex items-center gap-3 px-3 py-2 transition-colors rounded-xl font-bold text-sm ${activeTab === 'articles' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
              <PenSquare className="w-5 h-5" /> My Articles
            </button>
            <button onClick={() => setActiveTab('saved')} className={`w-full flex items-center gap-3 px-3 py-2 transition-colors rounded-xl font-bold text-sm ${activeTab === 'saved' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
              <BookMarked className="w-5 h-5" /> Saved Articles
            </button>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors rounded-xl font-bold text-sm">
              <Settings className="w-5 h-5" /> Settings
            </a>
          </nav>
          
          <div className="border-t border-slate-100 pt-6">
            <button 
              onClick={generateComplianceSummaryPDF}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Summary PDF
            </button>
          </div>
        </div>

        <div className="bg-emerald-900 rounded-3xl border border-emerald-800 p-6 shadow-sm text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-800 p-2 rounded-xl">
              {notificationPermission === 'granted' ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </div>
            <h3 className="font-bold">Alerts</h3>
          </div>
          <p className="text-emerald-200 text-sm mb-4">
            Get notified instantly when amendments affect your bookmarked categories.
          </p>
          
          {notificationPermission !== 'granted' ? (
            <button 
              onClick={requestNotificationPermission}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 rounded-xl text-sm transition-colors"
            >
              Enable Notifications
            </button>
          ) : (
            <button 
              onClick={simulateAmendmentAlert}
              className="w-full bg-emerald-800 border border-emerald-700 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-sm transition-colors"
            >
              Test Alert Simulation
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-8">
        <ComplianceCalendar />
        <ComplianceChecklist />

        
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm min-h-[500px]">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
            <h1 className="text-2xl font-bold text-slate-900">{activeTab === 'articles' ? 'My Articles' : 'Saved Articles'}</h1>
            {activeTab === 'articles' && (
              <button className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-colors flex items-center gap-2">
                <PenSquare className="w-4 h-4" /> New Article
              </button>
            )}
          </div>
          
          {activeTab === 'articles' ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No articles yet</h3>
              <p className="text-slate-500 max-w-sm mb-6 text-sm">You haven't written any articles. Share your expertise with the community.</p>
              <button className="text-emerald-700 font-bold hover:underline text-sm">
                Start writing now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                    <BookMarked className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">You have no saved articles</h3>
                  <p className="text-slate-500 max-w-sm text-sm">Save articles and policies to read them later.</p>
                </div>
              ) : (
                savedItems.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 rounded-2xl transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.type === 'policy' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-500">Saved {new Date(item.dateSaved).toLocaleDateString()}</span>
                      </div>
                      <Link to={item.url} className="text-slate-900 font-bold hover:text-emerald-700 transition-colors flex items-center gap-2">
                        {item.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                      </Link>
                    </div>
                    <button 
                      onClick={() => handleRemoveSaved(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove from saved articles"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
