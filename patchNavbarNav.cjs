const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const oldStr = `className={cn(
                    "text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors hover:text-emerald-700 py-2 border-b-2",
                    location.pathname === link.path ? "text-emerald-700 border-emerald-700" : "text-slate-600 border-transparent"
                  )}`;
                  
const newStr = `className={cn(
                    "inline-block text-[13px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out hover:scale-[1.05] hover:-translate-y-[1px] hover:text-emerald-600 py-2 border-b-2",
                    location.pathname === link.path ? "text-emerald-700 border-emerald-700" : "text-slate-600 border-transparent"
                  )}`;

content = content.replace(oldStr, newStr);

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
