import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { MessageSquare, ThumbsUp, LogIn, Send, Loader2, User as UserIcon } from 'lucide-react';

interface Comment {
  id: string;
  articleId: string;
  userId: string;
  authorName: string;
  authorEmail: string;
  text: string;
  helpfulCount: number;
  createdAt: any;
}

interface CommentSectionProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const { user, signInWithGoogle } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleId) return;

    const q = query(
      collection(db, 'comments'),
      where('articleId', '==', articleId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];

      // Sort client-side to avoid needing a composite index
      fetchedComments.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
        return timeB - timeA;
      });

      setComments(fetchedComments);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching comments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        articleId,
        userId: user.uid,
        authorName: user.displayName || 'Anonymous User',
        authorEmail: user.email || '',
        text: newComment.trim(),
        helpfulCount: 0,
        createdAt: serverTimestamp(),
      });
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndorse = async (commentId: string) => {
    if (!user) {
      alert("Please sign in to endorse comments.");
      return;
    }
    try {
      const commentRef = doc(db, 'comments', commentId);
      await updateDoc(commentRef, {
        helpfulCount: increment(1)
      });
    } catch (error) {
      console.error("Error endorsing comment:", error);
    }
  };

  return (
    <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-100 rounded-xl">
          <MessageSquare className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Professional Discussion</h3>
          <p className="text-slate-500 text-sm mt-1">Join the conversation with other professionals.</p>
        </div>
      </div>

      {/* Comment Input Section */}
      <div className="mb-10">
        {!user ? (
          <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Sign in to join the discussion</h4>
            <p className="text-slate-500 mb-6 text-sm max-w-md mx-auto">
              You must be signed in with your Google account to post comments and endorse others' insights.
            </p>
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="hidden sm:block shrink-0 mt-1">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200">
                <span className="text-emerald-700 font-bold text-sm">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your insights or ask a question..."
                className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                required
              />
              <div className="absolute bottom-3 right-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Post</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No comments yet.</p>
            <p className="text-slate-400 text-sm mt-1">Be the first to share your thoughts on this topic.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="hidden sm:block shrink-0 mt-1">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-500">
                  <UserIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">{comment.authorName}</h4>
                    <span className="text-xs text-slate-400">
                      {comment.createdAt?.toDate ? new Date(comment.createdAt.toDate()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Just now'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEndorse(comment.id)}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors border border-slate-100 hover:border-emerald-200"
                    title="Endorse this comment"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${comment.helpfulCount > 0 ? 'text-emerald-500' : ''}`} />
                    <span className="text-xs font-bold">{comment.helpfulCount || 0}</span>
                  </button>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
