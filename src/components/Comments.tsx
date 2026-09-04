import { useState } from 'react';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';

interface CommentsProps {
  articleId?: string;
}

export function Comments({ articleId }: CommentsProps) {
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentsList, setCommentsList] = useState([
    {
      id: 1,
      author: "Rahim Uddin",
      role: "Business Owner",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
      text: "This is very insightful! The new regulations are crucial for our compliance.",
      date: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim()) return;
    
    const newComment = {
      id: Date.now(),
      author: commentName,
      role: "Reader",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(commentName)}`,
      text: commentText,
      date: new Date().toISOString()
    };
    
    setCommentsList([newComment, ...commentsList]);
    setCommentText("");
    setCommentName("");
    setCommentEmail("");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-6 h-6 text-emerald-600" />
        <h3 className="text-2xl font-bold text-slate-900">Discussion ({commentsList.length})</h3>
      </div>
      
      <form onSubmit={handleSubmitComment} className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Leave a Reply</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Name *</label>
            <input 
              type="text" 
              required
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
            <input 
              type="email" 
              required
              value={commentEmail}
              onChange={(e) => setCommentEmail(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="john@example.com"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-2">Comment *</label>
          <textarea 
            rows={4}
            required
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
            placeholder="Share your thoughts or ask a question..."
          />
        </div>
        <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
          Post Comment
        </button>
      </form>

      <div className="space-y-6">
        {commentsList.map(comment => (
          <div key={comment.id} className="flex gap-4">
            <img src={comment.avatar} alt={comment.author} className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 shrink-0 object-cover" />
            <div>
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">{comment.author}</h4>
                  <span className="text-xs text-slate-500">{format(new Date(comment.date), 'MMM d, yyyy')}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
              </div>
              <button className="text-xs font-bold text-slate-500 mt-2 ml-2 hover:text-emerald-600 transition-colors flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> Helpful
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
