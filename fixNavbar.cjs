const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const targetDesktop = `          <div className="hidden lg:flex items-center space-x-8 ml-[38px] mr-0 pt-0">
            {navLinks.map((link) => (
              link.isDropdown ? (
                <div key={link.name} className="relative group">
                  <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">
                    {link.name}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-2">
                      {link.children?.map(child => (
                        <Link 
                          key={child.name} 
                          to={child.path}
                          className="block px-4 py-2 text-sm text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path!}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-emerald-700",
                    location.pathname === link.path ? "text-emerald-700" : "text-slate-600"
                  )}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>`;

const newDesktop = `          <div className="hidden lg:flex items-center space-x-8 ml-[38px] mr-0 pt-0">
            {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-emerald-700",
                    location.pathname === link.path ? "text-emerald-700" : "text-slate-600"
                  )}
                >
                  {link.name}
                </Link>
            ))}
          </div>`;

const targetMobile = `          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              link.isDropdown ? (
                <div key={link.name} className="py-2">
                  <div className="px-3 py-2 text-sm font-bold text-slate-900">{link.name}</div>
                  <div className="pl-6 space-y-1 mt-1">
                    {link.children?.map(child => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path!}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              )
            ))}
            <Link`;

const newMobile = `          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
            ))}
            <Link`;

content = content.replace(targetDesktop, newDesktop);
content = content.replace(targetMobile, newMobile);
fs.writeFileSync('src/components/layout/Navbar.tsx', content);
