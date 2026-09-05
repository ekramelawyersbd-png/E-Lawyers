import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { saveItem, removeItem, isItemSaved } from '../utils/readingList';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export function BookmarkButton({ 
  id, 
  title, 
  url, 
  type = 'article',
  className = ''
}: { 
  id: string; 
  title: string; 
  url: string; 
  type?: 'article' | 'policy';
  className?: string;
}) {
  const [isSaved, setIsSaved] = useState(() => isItemSaved(id));
  const [firebaseDocId, setFirebaseDocId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsSaved(isItemSaved(id));

    const checkFirebaseStatus = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'favorites'), where('userId', '==', user.uid), where('articleId', '==', id));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setFirebaseDocId(snapshot.docs[0].id);
          } else {
            setFirebaseDocId(null);
          }
        } catch {
          // ignore firebase offline / permission errors
        }
      }
    };
    
    checkFirebaseStatus();
    
    const handleStorageChange = () => {
      setIsSaved(isItemSaved(id));
    };
    
    window.addEventListener('bookmarksUpdated', handleStorageChange);
    return () => window.removeEventListener('bookmarksUpdated', handleStorageChange);
  }, [id, user]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if inside a Link
    e.stopPropagation();
    
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    // Always update localStorage first for instant, reliable local bookmarking
    if (nextSaved) {
      saveItem({
        id,
        title,
        type,
        url,
        dateSaved: new Date().toISOString()
      });
    } else {
      removeItem(id);
    }

    // Secondary: If user is authenticated, sync with Firestore in background
    if (user) {
      if (!nextSaved && firebaseDocId) {
        try {
          const { doc } = await import('firebase/firestore');
          await deleteDoc(doc(db, 'favorites', firebaseDocId));
          setFirebaseDocId(null);
        } catch {
          // background sync error ignored
        }
      } else if (nextSaved && !firebaseDocId) {
        try {
          const docRef = await addDoc(collection(db, 'favorites'), {
            userId: user.uid,
            articleId: id,
            title,
            url,
            type,
            createdAt: serverTimestamp()
          });
          setFirebaseDocId(docRef.id);
        } catch {
          // background sync error ignored
        }
      }
    }
  };

  return (
    <button 
      id={`bookmark-btn-${id}`}
      type="button"
      onClick={toggleSave}
      title={isSaved ? "Remove from bookmarks" : "Bookmark this guide"}
      aria-label={isSaved ? "Remove from bookmarks" : "Bookmark this guide"}
      className={className}
    >
      <Bookmark 
        className={`w-5 h-5 transition-transform active:scale-125 duration-150 ${isSaved ? "fill-current text-emerald-600" : ""}`} 
        fill={isSaved ? "currentColor" : "none"} 
      />
    </button>
  );
}
