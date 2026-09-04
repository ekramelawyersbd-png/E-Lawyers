const fs = require('fs');

let content = fs.readFileSync('src/components/BookmarkButton.tsx', 'utf8');

// Add firebase imports
content = content.replace(
  "import { saveItem, removeItem, isItemSaved } from '../utils/readingList';",
  `import { saveItem, removeItem, isItemSaved } from '../utils/readingList';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';`
);

// Add useAuth to BookmarkButton
content = content.replace(
  "const [isSaved, setIsSaved] = useState(false);",
  `const [isSaved, setIsSaved] = useState(false);
  const [firebaseDocId, setFirebaseDocId] = useState<string | null>(null);
  const { user } = useAuth();`
);

// Update useEffect to check Firebase if logged in
const targetUseEffect = `  useEffect(() => {
    setIsSaved(isItemSaved(id));
    
    // Listen for custom event to update state across components
    const handleStorageChange = () => {
      setIsSaved(isItemSaved(id));
    };
    
    window.addEventListener('bookmarksUpdated', handleStorageChange);
    return () => window.removeEventListener('bookmarksUpdated', handleStorageChange);
  }, [id]);`;

const replaceUseEffect = `  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'favorites'), where('userId', '==', user.uid), where('articleId', '==', id));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setIsSaved(true);
            setFirebaseDocId(snapshot.docs[0].id);
          } else {
            setIsSaved(false);
            setFirebaseDocId(null);
          }
        } catch (e) {
          console.error("Error checking favorite", e);
        }
      } else {
        setIsSaved(isItemSaved(id));
      }
    };
    
    checkStatus();
    
    const handleStorageChange = () => {
      if (!user) setIsSaved(isItemSaved(id));
    };
    
    window.addEventListener('bookmarksUpdated', handleStorageChange);
    return () => window.removeEventListener('bookmarksUpdated', handleStorageChange);
  }, [id, user]);`;

content = content.replace(targetUseEffect, replaceUseEffect);

// Update toggleSave to use Firebase if logged in
const targetToggleSave = `  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if inside a Link
    e.stopPropagation();
    
    if (isSaved) {
      removeItem(id);
    } else {
      saveItem({
        id,
        title,
        type,
        url,
        dateSaved: new Date().toISOString()
      });
    }
    setIsSaved(!isSaved);
    window.dispatchEvent(new Event('bookmarksUpdated'));
  };`;

const replaceToggleSave = `  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if inside a Link
    e.stopPropagation();
    
    if (user) {
      if (isSaved && firebaseDocId) {
        // Remove from Firebase
        try {
          const { doc } = await import('firebase/firestore');
          await deleteDoc(doc(db, 'favorites', firebaseDocId));
          setIsSaved(false);
          setFirebaseDocId(null);
        } catch (err) {
          console.error("Error removing favorite", err);
        }
      } else {
        // Add to Firebase
        try {
          const docRef = await addDoc(collection(db, 'favorites'), {
            userId: user.uid,
            articleId: id,
            title,
            url,
            type,
            createdAt: serverTimestamp()
          });
          setIsSaved(true);
          setFirebaseDocId(docRef.id);
        } catch (err) {
          console.error("Error adding favorite", err);
        }
      }
    } else {
      // Local storage fallback
      if (isSaved) {
        removeItem(id);
      } else {
        saveItem({
          id,
          title,
          type,
          url,
          dateSaved: new Date().toISOString()
        });
      }
      setIsSaved(!isSaved);
      window.dispatchEvent(new Event('bookmarksUpdated'));
    }
  };`;

content = content.replace(targetToggleSave, replaceToggleSave);

fs.writeFileSync('src/components/BookmarkButton.tsx', content);
console.log("Patched BookmarkButton.tsx");
