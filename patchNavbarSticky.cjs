const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

// Change the main header to sticky
content = content.replace(
  '<header className="relative z-50 bg-white border-b border-slate-200 print:hidden">',
  '<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all print:hidden">'
);

// Remove sticky from sub-header as the parent is now sticky
content = content.replace(
  '<div className="hidden lg:block border-t border-slate-100 bg-slate-50/95 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all">',
  '<div className="hidden lg:block border-t border-slate-100 bg-transparent transition-all">'
);

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
