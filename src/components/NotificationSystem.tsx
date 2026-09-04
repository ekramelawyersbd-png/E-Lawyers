import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: number;
  title: string;
  message: string;
  link?: string;
  time: string;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate receiving a notification for a bookmarked item update
    const timer = setTimeout(() => {
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now(),
          title: "Bookmarked Article Updated",
          message: "The VAT registration guidelines have been updated following the latest NBR circular.",
          link: "/article/3", // Links to VAT article
          time: "Just now"
        }
      ]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none print:hidden">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div 
            key={notification.id} 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex items-start gap-4 relative overflow-hidden pointer-events-auto"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl shrink-0 mt-0.5">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-900 text-sm">{notification.title}</h4>
                <button 
                  onClick={() => removeNotification(notification.id)}
                  className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-600 text-xs mb-3 leading-relaxed">
                {notification.message}
              </p>
              {notification.link && (
                <Link 
                  to={notification.link} 
                  className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                  onClick={() => removeNotification(notification.id)}
                >
                  Review Updates
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
