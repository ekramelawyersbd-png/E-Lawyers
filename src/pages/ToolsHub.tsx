import { Calculator, Calendar, ClipboardCheck, X, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function ToolsHub() {
  
  const [hiddenTools, setHiddenTools] = useState<string[]>([]);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('toolsPreferences');
    if (savedPrefs) {
      try {
        setHiddenTools(JSON.parse(savedPrefs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const hideTool = (e: React.MouseEvent, toolName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newHidden = [...hiddenTools, toolName];
    setHiddenTools(newHidden);
    localStorage.setItem('toolsPreferences', JSON.stringify(newHidden));
  };

  const clearPreferences = () => {
    setHiddenTools([]);
    localStorage.removeItem('toolsPreferences');
  };

  const tools = [
    {
      name: 'Tax Calculator',
      description: 'Calculate your individual or corporate tax liability for the 2026-27 assessment year.',
      tooltip: 'Quickly compute income tax, corporate tax, and understand your tax brackets.',
      icon: <Calculator className="w-8 h-8" />,
      path: '/tax-calculator',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      name: 'Compliance Calendar',
      description: 'Track key tax deadlines and statutory requirements for the fiscal year.',
      tooltip: 'View all upcoming tax return and VAT submission deadlines based on your entity type.',
      icon: <Calendar className="w-8 h-8" />,
      path: '/dashboard',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      name: 'Corporate Checklist',
      description: 'Ensure you meet all corporate tax and VAT compliance obligations.',
      tooltip: 'Step-by-step compliance checklist to ensure all your statutory filings are complete.',
      icon: <ClipboardCheck className="w-8 h-8" />,
      path: '/dashboard',
      color: 'bg-purple-100 text-purple-700',
    }
  ];
  const visibleTools = tools.filter(t => !hiddenTools.includes(t.name));

  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tools Hub</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Access a comprehensive suite of tools designed to help you calculate, plan, and stay compliant with the latest tax policies.
        </p>
      </div>

      
      <div className="tools-container grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleTools.map((tool) => (
          <Link 
            key={tool.name}
            to={tool.path}
            title={tool.tooltip}
            className="relative group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all hover:border-emerald-200 flex flex-col items-center text-center gap-4"
          >
            <button 
              onClick={(e) => hideTool(e, tool.name)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              title="Hide this tool"
            >
              <X className="w-4 h-4" />
            </button>
            <div className={`p-5 rounded-3xl shrink-0 ${tool.color}`}>

              {tool.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                {tool.name}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      
      </div>
      
      {hiddenTools.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={clearPreferences}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Clear All Saved Preferences
          </button>
        </div>
      )}
    </div>
  );
}

