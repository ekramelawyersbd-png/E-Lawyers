const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

// 1. Remove sticky from the main header
content = content.replace(
  '<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm print:hidden">',
  '<header className="relative z-50 bg-white border-b border-slate-200 print:hidden">'
);

// 2. Add sticky to the sub-header
content = content.replace(
  '<div className="hidden lg:block border-t border-slate-100 bg-slate-50/50">',
  '<div className="hidden lg:block border-t border-slate-100 bg-slate-50/95 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all">'
);

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
