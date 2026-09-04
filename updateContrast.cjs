const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. imports
content = content.replace("Minus, Plus, Type,", "Minus, Plus, Type, Contrast,");

// 2. Add state
content = content.replace(
  "const [newsFontScale, setNewsFontScale] = useState(1);",
  "const [newsFontScale, setNewsFontScale] = useState(1);\n  const [isHighContrast, setIsHighContrast] = useState(false);"
);

// 3. Replace section
const startTag = '<section id="newsletter"';
const endTag = '</section>';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag, startIndex) + endTag.length;

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find section");
  process.exit(1);
}

const newSection = `      <section id="newsletter" className={\`py-20 px-4 sm:px-6 lg:px-8 text-center relative group transition-colors \${isHighContrast ? 'bg-black border-t-[6px] border-yellow-400' : 'bg-emerald-50 border-t border-emerald-100'}\`}>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 flex items-center gap-2">
          
          <button 
            type="button" 
            onClick={() => setIsHighContrast(!isHighContrast)} 
            className={\`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shadow-sm \${isHighContrast ? 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'}\`}
            title="Toggle High Contrast Mode"
          >
            <Contrast className="w-3.5 h-3.5" />
            High Contrast
          </button>
          
          <div className={\`flex items-center gap-1 border rounded-lg p-1 shadow-sm transition-colors \${isHighContrast ? 'bg-black border-yellow-400' : 'bg-white border-slate-200'}\`}>
            <button type="button" onClick={handleDecreaseFont} disabled={newsFontScale === 0} className={\`p-1 rounded disabled:opacity-30 disabled:hover:bg-transparent \${isHighContrast ? 'text-yellow-400 hover:text-black hover:bg-yellow-400' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}\`} title="Decrease font size">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <Type className={\`w-3.5 h-3.5 \${isHighContrast ? 'text-white' : 'text-slate-400'}\`} />
            <button type="button" onClick={handleIncreaseFont} disabled={newsFontScale === 3} className={\`p-1 rounded disabled:opacity-30 disabled:hover:bg-transparent \${isHighContrast ? 'text-yellow-400 hover:text-black hover:bg-yellow-400' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}\`} title="Increase font size">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <BookmarkSectionButton 
            id="newsletter-section" 
            title="Legal & Tax News Newsletter" 
            url="/#newsletter"
            className={isHighContrast ? '!bg-black !text-yellow-400 !border-yellow-400 hover:!bg-yellow-400 hover:!text-black' : ''}
          />
          <CopySectionButton 
            content="Stay Updated with Legal & Tax News\n\nSubscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.\n\nBy subscribing, you agree to our Privacy Policy and Terms of Service." 
            className={isHighContrast ? '!bg-black !text-yellow-400 !border-yellow-400 hover:!bg-yellow-400 hover:!text-black' : ''}
          />
        </div>
        <div className="max-w-3xl mx-auto">
          <div className={\`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors shadow-sm \${isHighContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-emerald-100 text-emerald-600'}\`}>
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className={\`\${['text-2xl md:text-3xl', 'text-3xl md:text-4xl', 'text-4xl md:text-5xl', 'text-5xl md:text-6xl'][newsFontScale]} font-bold mb-4 transition-all \${isHighContrast ? 'text-white' : 'text-slate-900'}\`}>Stay Updated with Legal & Tax News</h2>
          <p className={\`\${['text-base', 'text-lg', 'text-xl', 'text-2xl'][newsFontScale]} mb-10 transition-all \${isHighContrast ? 'text-yellow-400 font-bold tracking-wide' : 'text-slate-600'}\`}>
            Subscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.
          </p>
          <form className={\`p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 border shadow-sm transition-colors \${isHighContrast ? 'bg-black border-4 border-yellow-400' : 'bg-white border-slate-200'}\`}>
            <input 
              type="text" 
              name="name"
              autoComplete="name"
              placeholder="Your Name" 
              className={\`flex-1 bg-transparent border-none py-3 px-6 focus:outline-none focus:ring-0 \${isHighContrast ? 'text-white placeholder:text-white/50 font-bold' : 'text-slate-900 placeholder:text-slate-400'}\`}
              required
            />
            <div className={\`hidden md:block w-px h-8 self-center transition-colors \${isHighContrast ? 'bg-yellow-400' : 'bg-slate-200'}\`}></div>
            <input 
              type="email" 
              name="email"
              autoComplete="email"
              placeholder="Email Address" 
              className={\`flex-1 bg-transparent border-none py-3 px-6 focus:outline-none focus:ring-0 \${isHighContrast ? 'text-white placeholder:text-white/50 font-bold' : 'text-slate-900 placeholder:text-slate-400'}\`}
              required
            />
            <div className={\`hidden md:block w-px h-8 self-center transition-colors \${isHighContrast ? 'bg-yellow-400' : 'bg-slate-200'}\`}></div>
            <input 
              type="tel" 
              name="tel"
              autoComplete="tel"
              placeholder="Phone Number" 
              className={\`flex-1 bg-transparent border-none py-3 px-6 focus:outline-none focus:ring-0 \${isHighContrast ? 'text-white placeholder:text-white/50 font-bold' : 'text-slate-900 placeholder:text-slate-400'}\`}
            />
            <button 
              type="submit" 
              className={\`px-8 py-4 rounded-xl md:rounded-full font-bold transition-all hover:scale-105 whitespace-nowrap shadow-sm \${isHighContrast ? 'bg-yellow-400 text-black hover:bg-yellow-300 uppercase tracking-widest' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}\`}
            >
              Subscribe Now
            </button>
          </form>
          <p className={\`text-xs mt-6 transition-colors \${isHighContrast ? 'text-white font-bold' : 'text-slate-500'}\`}>By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
        </div>
      </section>`;

content = content.substring(0, startIndex) + newSection + content.substring(endIndex);

fs.writeFileSync('src/pages/Home.tsx', content);
