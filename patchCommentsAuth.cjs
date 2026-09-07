const fs = require('fs');
let content = fs.readFileSync('src/components/Comments.tsx', 'utf8');

content = content.replace(
  "const { user } = useAuth();",
  "const { user, signInWithGoogle } = useAuth();"
);

content = content.replace(
  "const handleSubmitComment = async (e: React.FormEvent) => {",
  `const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to post a comment.');
      return;
    }`
);

content = content.replace(
  "const handlePostReply = async (parentId: string) => {",
  `const handlePostReply = async (parentId: string) => {
    if (!user) {
      alert('Please sign in to reply.');
      return;
    }`
);

const formHtml = `      {/* 3. Reply / Comment Formulation Card */}
      <form 
        id="professional-comment-form"
        onSubmit={handleSubmitComment} 
        className="mb-10 bg-slate-50/80 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
            <h4 className="text-base font-bold text-slate-900">Contribute a Professional Opinion</h4>
          </div>
          {user ? (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Signed in as {user.displayName || user.email}
            </span>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" /> Sign in to Post
            </button>
          )}
        </div>

        {/* Inputs Grid */}
        <div className={user ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4" : "hidden"}>`;

content = content.replace(
  `      {/* 3. Reply / Comment Formulation Card */}
      <form 
        id="professional-comment-form"
        onSubmit={handleSubmitComment} 
        className="mb-10 bg-slate-50/80 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
            <h4 className="text-base font-bold text-slate-900">Contribute a Professional Opinion</h4>
          </div>
          {user && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Signed in as {user.displayName || user.email}
            </span>
          )}
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">`,
  formHtml
);

content = content.replace(
  `          {/* Comment Text Area */}
          <div className="mb-4">`,
  `          {/* Comment Text Area */}
          <div className={user ? "mb-4" : "hidden"}>`
);

content = content.replace(
  `          {/* Submit Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/60">`,
  `          {/* Submit Actions */}
          <div className={user ? "flex items-center justify-between mt-6 pt-4 border-t border-slate-200/60" : "hidden"}>`
);

content = content.replace(
  `                {/* Inline Reply Form */}
                {replyingToId === comment.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl animate-in fade-in">`,
  `                {/* Inline Reply Form */}
                {replyingToId === comment.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl animate-in fade-in">
                    {!user ? (
                      <div className="text-center py-4">
                        <p className="text-sm font-medium text-slate-700 mb-3">You must be signed in to reply.</p>
                        <button
                          type="button"
                          onClick={signInWithGoogle}
                          className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <UserIcon className="w-3.5 h-3.5" /> Sign in with Google
                        </button>
                      </div>
                    ) : (`
);

content = content.replace(
  `                        <Send className="w-3 h-3" />
                        <span>{isSubmittingReply ? "Posting..." : "Post Reply"}</span>
                      </button>
                    </div>
                  </div>
                )}`,
  `                        <Send className="w-3 h-3" />
                        <span>{isSubmittingReply ? "Posting..." : "Post Reply"}</span>
                      </button>
                    </div>
                    )}
                  </div>
                )}`
);

fs.writeFileSync('src/components/Comments.tsx', content);
console.log('patched Comments.tsx');
