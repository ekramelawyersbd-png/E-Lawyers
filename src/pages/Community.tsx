import { Users, PenTool, MessageSquare, Star, Search, ThumbsUp, MessageCircle, HelpCircle, Award } from 'lucide-react';

const expertContributors = [
  {
    id: 1,
    name: "Sadia Rahman",
    role: "Tax Consultant",
    credentials: "FCA, Tax Bar Member",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    answers: 142,
    rating: 4.9,
    topTopics: ["Income Tax", "Corporate Tax"]
  },
  {
    id: 2,
    name: "Aminul Islam",
    role: "Corporate Lawyer",
    credentials: "LL.M, Supreme Court Advocate",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces",
    answers: 89,
    rating: 4.8,
    topTopics: ["Company Registration", "FDI"]
  },
  {
    id: 3,
    name: "Karim Chowdhury",
    role: "VAT Specialist",
    credentials: "FCMA, Ex-NBR Consultant",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
    answers: 215,
    rating: 5.0,
    topTopics: ["VAT Assessment", "Customs"]
  }
];

const mockQuestions = [
  {
    id: 1,
    title: "How does the new VAT act affect e-commerce businesses in Bangladesh?",
    content: "With the recent changes in the VAT act, I am confused about the mandatory VAT registration threshold for online businesses...",
    author: "Rahim Uddin",
    role: "Business Owner",
    answers: 5,
    upvotes: 24,
    tags: ["VAT", "E-commerce"],
    time: "2 hours ago"
  },
  {
    id: 2,
    title: "Tax rebate on IT sector investments for FY 2024-25",
    content: "Can someone clarify the maximum allowable tax rebate percentage for investments made in recognized IT sector companies this fiscal year?",
    author: "Sadia Rahman",
    role: "Tax Consultant",
    answers: 2,
    upvotes: 15,
    tags: ["Tax", "IT Sector"],
    time: "5 hours ago"
  },
  {
    id: 3,
    title: "Process for repatriating dividends for foreign investors",
    content: "What are the latest Bangladesh Bank guidelines and required BIDA approvals for a foreign entity to repatriate dividends from a local subsidiary?",
    author: "Aminul Islam",
    role: "Corporate Lawyer",
    answers: 8,
    upvotes: 32,
    tags: ["Corporate Law", "FDI"],
    time: "1 day ago"
  }
];

export function Community() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Accounticca Community</h1>
        <p className="text-lg text-slate-600">
          Join a growing network of lawyers, accountants, tax consultants, and business professionals in Bangladesh. Share knowledge, ask questions, and grow together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <PenTool className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Publish Articles</h3>
          <p className="text-slate-600 text-sm">Share your expertise on legal or tax matters and build your professional profile.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Engage & Discuss</h3>
          <p className="text-slate-600 text-sm">Participate in deep discussions about recent NBR circulars or court rulings.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Recognition</h3>
          <p className="text-slate-600 text-sm">Get recognized as a verified expert in your domain and attract potential clients.</p>
        </div>
      </div>

      {/* Top Experts Section */}
      <div className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-600" /> Top Expert Contributors
            </h2>
            <p className="text-slate-600 text-sm">Recognized professionals sharing their expertise.</p>
          </div>
          <button className="text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors hidden sm:block">
            View All Experts &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {expertContributors.map(expert => (
            <div key={expert.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="relative mb-4">
                <img src={expert.avatar} alt={expert.name} className="w-20 h-20 rounded-full object-cover border-4 border-emerald-50 group-hover:border-emerald-100 transition-colors" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shadow-sm whitespace-nowrap">
                  <Star className="w-3 h-3 fill-emerald-700" /> {expert.rating}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{expert.name}</h3>
              <p className="text-emerald-700 font-semibold text-sm mb-1">{expert.role}</p>
              <p className="text-slate-500 text-xs font-medium mb-4">{expert.credentials}</p>
              
              <div className="w-full pt-4 border-t border-slate-100 mt-auto">
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {expert.topTopics.map(topic => (
                    <span key={topic} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-widest rounded-md">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center w-full px-2">
                  <div className="text-slate-500 text-sm">
                    <strong className="text-slate-700">{expert.answers}</strong> answers
                  </div>
                  <button className="text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Q&A Section */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-600" /> Professional Q&A
            </h2>
            <p className="text-slate-600 text-sm">Ask questions and get answers from industry experts.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
            <button className="bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-colors whitespace-nowrap shadow-sm">
              Ask a Question
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockQuestions.map(q => (
            <div key={q.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Voting / Stats Desktop */}
                <div className="hidden md:flex flex-col items-center gap-4 min-w-[80px]">
                  <div className="flex flex-col items-center">
                    <button className="p-1 text-slate-400 hover:text-emerald-600 transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-slate-700 text-sm">{q.upvotes}</span>
                  </div>
                  <div className="flex flex-col items-center text-slate-500">
                    <MessageCircle className="w-5 h-5 mb-1" />
                    <span className="font-bold text-sm">{q.answers}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {q.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-emerald-700 cursor-pointer transition-colors leading-tight">
                    {q.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {q.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {q.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{q.author}</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{q.role}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{q.time}</div>
                  </div>

                  {/* Voting / Stats Mobile */}
                  <div className="flex md:hidden items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-bold text-sm">{q.upvotes}</span>
                    </button>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-bold text-sm">{q.answers} Answers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
            View All Discussions
          </button>
        </div>
      </div>

      <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 border border-emerald-800 text-center text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 p-6 opacity-10">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45z"/></svg>
        </div>
        <div className="relative z-10">
          <Users className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to share your knowledge?</h2>
          <p className="text-emerald-100/80 max-w-2xl mx-auto mb-8">
            Create an account to start publishing your insights, saving favorite articles, and engaging with other professionals.
          </p>
          <button className="bg-white text-emerald-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg">
            Create Contributor Account
          </button>
        </div>
      </div>
    </div>
  );
}
