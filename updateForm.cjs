const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const target = `          <form className="bg-white p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 border border-slate-200 shadow-sm">
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
          </form>`;

const replacement = `          <form className="bg-white p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 border border-slate-200 shadow-sm">
            <input 
              type="text" 
              name="name"
              autoComplete="name"
              placeholder="Your Name" 
              className="flex-1 bg-transparent border-none py-3 px-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              required
            />
            <div className="hidden md:block w-px h-8 bg-slate-200 self-center"></div>
            <input 
              type="email" 
              name="email"
              autoComplete="email"
              placeholder="Email Address" 
              className="flex-1 bg-transparent border-none py-3 px-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              required
            />
            <div className="hidden md:block w-px h-8 bg-slate-200 self-center"></div>
            <input 
              type="tel" 
              name="tel"
              autoComplete="tel"
              placeholder="Phone Number" 
              className="flex-1 bg-transparent border-none py-3 px-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl md:rounded-full font-bold transition-all hover:scale-105 whitespace-nowrap shadow-sm"
            >
              Subscribe Now
            </button>
          </form>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Home.tsx', content);
