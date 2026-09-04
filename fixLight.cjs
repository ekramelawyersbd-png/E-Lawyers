const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target = `      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated with Legal & Tax News</h2>
          <p className="text-lg text-slate-400 mb-10">
            Subscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.
          </p>
          <form className="bg-slate-900 p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 border border-slate-800 shadow-2xl">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="flex-1 bg-transparent border-none py-3 px-6 text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
              required
            />
            <div className="hidden md:block w-px h-8 bg-slate-800 self-center"></div>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-1 bg-transparent border-none py-3 px-6 text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
              required
            />
            <div className="hidden md:block w-px h-8 bg-slate-800 self-center"></div>
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="flex-1 bg-transparent border-none py-3 px-6 text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
            />
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl md:rounded-full font-bold transition-all whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-6">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
        </div>
      </section>`;

const replacement = `      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-50 border-t border-emerald-100 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Stay Updated with Legal & Tax News</h2>
          <p className="text-lg text-slate-600 mb-10">
            Subscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.
          </p>
          <form className="bg-white p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 border border-slate-200 shadow-sm">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="flex-1 bg-transparent border-none py-3 px-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              required
            />
            <div className="hidden md:block w-px h-8 bg-slate-200 self-center"></div>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-1 bg-transparent border-none py-3 px-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              required
            />
            <div className="hidden md:block w-px h-8 bg-slate-200 self-center"></div>
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="flex-1 bg-transparent border-none py-3 px-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl md:rounded-full font-bold transition-all whitespace-nowrap shadow-sm"
            >
              Subscribe Now
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-6">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
        </div>
      </section>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Home.tsx', content);
