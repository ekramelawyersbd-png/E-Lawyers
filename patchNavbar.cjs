const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

content = content.replace(
  "import { cn } from '../../lib/utils';",
  "import { cn } from '../../lib/utils';\nimport { useAuth } from '../../contexts/AuthContext';"
);

content = content.replace(
  "const location = useLocation();",
  "const location = useLocation();\n  const { user, logout } = useAuth();"
);

// Desktop login button
const desktopLoginTarget = `<Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-bold text-white hover:bg-emerald-600 bg-slate-900 px-5 py-2.5 rounded-full transition-colors shadow-sm">
              <User className="h-4 w-4" />
              Contributor Login
            </Link>`;
            
const desktopLoginReplacement = `{user ? (
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm font-bold text-slate-700">{user.displayName || user.email?.split('@')[0]}</span>
                <button 
                  onClick={logout}
                  className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:flex items-center gap-2 text-sm font-bold text-white hover:bg-emerald-600 bg-slate-900 px-5 py-2.5 rounded-full transition-colors shadow-sm">
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}`;

content = content.replace(desktopLoginTarget, desktopLoginReplacement);

// Mobile login button
const mobileLoginTarget = `<Link
              to="/dashboard"
              className="block px-4 py-3 mt-4 rounded-xl text-base font-bold text-white bg-slate-900 text-center"
              onClick={() => setIsOpen(false)}
            >
              Contributor Login
            </Link>`;

const mobileLoginReplacement = `{user ? (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="px-4 py-2 text-sm font-bold text-slate-500">
                  Signed in as {user.displayName || user.email}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="block px-4 py-3 mt-4 rounded-xl text-base font-bold text-white bg-slate-900 text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}`;

content = content.replace(mobileLoginTarget, mobileLoginReplacement);

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
console.log("Patched Navbar.tsx");
