const fs = require('fs');
let content = fs.readFileSync('src/pages/VatGuide.tsx', 'utf8');

if (!content.includes('BookmarkButton')) {
  content = content.replace("import { FileText, Calendar, CheckCircle2, AlertTriangle, Scale, PoundSterling } from 'lucide-react';", "import { FileText, Calendar, CheckCircle2, AlertTriangle, Scale, PoundSterling } from 'lucide-react';\nimport { BookmarkButton } from '../components/BookmarkButton';");
}

const target = `          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            VAT Registration & Compliance
          </h1>
          <p className="text-lg md:text-xl text-emerald-50/90 leading-relaxed max-w-2xl">
            Learn when to register for VAT, how to comply with VAT rules, filing obligations, and avoid common pitfalls in VAT compliance.
          </p>`;

const replacement = `          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              VAT Registration & Compliance
            </h1>
            <BookmarkButton 
              id="vat-guide" 
              title="VAT Registration & Compliance Guide" 
              url="/article/303"
              className="p-3 rounded-full bg-emerald-800/50 hover:bg-emerald-700/80 text-emerald-100 hover:text-white border border-emerald-700/50 transition-colors shrink-0 sm:mt-2 self-start" 
            />
          </div>
          <p className="text-lg md:text-xl text-emerald-50/90 leading-relaxed max-w-2xl">
            Learn when to register for VAT, how to comply with VAT rules, filing obligations, and avoid common pitfalls in VAT compliance.
          </p>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/VatGuide.tsx', content);
