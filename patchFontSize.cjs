const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Import useState and icons
if (!content.includes("import { useState } from 'react';")) {
  content = "import { useState } from 'react';\n" + content;
}
if (!content.includes("Minus, Plus")) {
  content = content.replace(
    "import { ArrowRight",
    "import { ArrowRight, Minus, Plus, Type,"
  );
}

// 2. Add state to Home
if (!content.includes('const [newsFontScale, setNewsFontScale]')) {
  content = content.replace(
    'export function Home() {',
    `export function Home() {\n  const [newsFontScale, setNewsFontScale] = useState(1);\n  const handleIncreaseFont = () => setNewsFontScale(p => Math.min(p + 1, 3));\n  const handleDecreaseFont = () => setNewsFontScale(p => Math.max(p - 1, 0));\n`
  );
}

// 3. Add font sizes
const titleClassOrig = 'text-3xl md:text-4xl font-bold text-slate-900 mb-4';
const titleClassNew = 'font-bold text-slate-900 mb-4 transition-all';
const pClassOrig = 'text-lg text-slate-600 mb-10';
const pClassNew = 'text-slate-600 mb-10 transition-all';

const titleSizes = "['text-2xl md:text-3xl', 'text-3xl md:text-4xl', 'text-4xl md:text-5xl', 'text-5xl md:text-6xl'][newsFontScale]";
const pSizes = "['text-base', 'text-lg', 'text-xl', 'text-2xl'][newsFontScale]";

// 4. Update the section
const target = `<div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 flex items-center gap-2">
          <BookmarkSectionButton 
            id="newsletter-section" 
            title="Legal & Tax News Newsletter" 
            url="/#newsletter" 
          />
          <CopySectionButton content="Stay Updated with Legal & Tax News

Subscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.

By subscribing, you agree to our Privacy Policy and Terms of Service." />
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Stay Updated with Legal & Tax News</h2>
          <p className="text-lg text-slate-600 mb-10">`;

const replacement = `<div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button type="button" onClick={handleDecreaseFont} disabled={newsFontScale === 0} className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded disabled:opacity-30 disabled:hover:bg-transparent" title="Decrease font size">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <Type className="w-3.5 h-3.5 text-slate-400" />
            <button type="button" onClick={handleIncreaseFont} disabled={newsFontScale === 3} className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded disabled:opacity-30 disabled:hover:bg-transparent" title="Increase font size">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <BookmarkSectionButton 
            id="newsletter-section" 
            title="Legal & Tax News Newsletter" 
            url="/#newsletter" 
          />
          <CopySectionButton content="Stay Updated with Legal & Tax News\n\nSubscribe to our newsletter to receive the latest legal updates, NBR circulars, and compliance tips directly in your inbox.\n\nBy subscribing, you agree to our Privacy Policy and Terms of Service." />
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className={\`\${${titleSizes}} ${titleClassNew}\`}>Stay Updated with Legal & Tax News</h2>
          <p className={\`\${${pSizes}} ${pClassNew}\`}>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/Home.tsx', content);
