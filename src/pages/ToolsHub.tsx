import { Calculator, Calendar, ClipboardCheck, X, RefreshCcw, Download, FileText, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RJSCFeeEstimator } from '../components/RJSCFeeEstimator';
import { Gallery } from '../components/Gallery';

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

      {/* Featured Resources: PDF Downloads */}
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Tax Guidelines Card */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 shadow-lg text-white relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 text-indigo-800/30">
            <FileText className="w-64 h-64 rotate-12" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-800/50 text-indigo-300 border border-indigo-700/50 rounded-full text-xs font-bold uppercase tracking-wider mb-4 self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Official Guide
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              আয়কর নির্দেশিকা<br />২০২৬-২০২৭
            </h2>
            <p className="text-indigo-300 font-medium mb-4">NBR Income Tax Guide</p>
            <p className="text-indigo-100/80 leading-relaxed mb-8 flex-1">
              Complete, step-by-step practical guide on income tax return filing, tax calculations, and e-Return for individual taxpayers.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-auto">
              <a 
                href="https://pub-1d8caf41922f46e1952565fc23269fb3.r2.dev/%E0%A6%86%E0%A7%9F%E0%A6%95%E0%A6%B0%20%E0%A6%A8%E0%A6%BF%E0%A6%B0%E0%A7%8D%E0%A6%A6%E0%A7%87%E0%A6%B6%E0%A6%BF%E0%A6%95%E0%A6%BE%20%E0%A7%A8%E0%A7%A6%E0%A7%A8%E0%A7%AC-%E0%A7%A8%E0%A7%A6%E0%A7%A8%E0%A7%AD.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-emerald-500/20"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
              <Link
                to="/article/income-tax-guidelines-2026-2027-pdf-download"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/10 hover:border-white/20"
              >
                Summary
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Income Tax Circular Card */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 shadow-lg text-white relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 text-indigo-900/40">
            <ClipboardCheck className="w-64 h-64 rotate-[-12deg]" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-800/50 text-indigo-300 border border-indigo-700/50 rounded-full text-xs font-bold uppercase tracking-wider mb-4 self-start">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Legal Circular
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              আয়কর পরিপত্র<br />২০২৬-২০২৭
            </h2>
            <p className="text-indigo-300 font-medium mb-4">Income Tax Circular 2026-2027</p>
            <p className="text-indigo-100/80 leading-relaxed mb-8 flex-1">
              Official legal interpretation detailing Finance Act 2026 amendments, updated tax rates, TDS changes, and new compliance structures.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-auto">
              <a 
                href="https://pub-1d8caf41922f46e1952565fc23269fb3.r2.dev/%E0%A6%86%E0%A7%9F%E0%A6%95%E0%A6%B0_%E0%A6%AA%E0%A6%B0%E0%A6%BF%E0%A6%AA%E0%A6%A4%E0%A7%8D%E0%A6%B0_%E0%A7%A8%E0%A7%A6%E0%A7%A8%E0%A7%AC-%E0%A7%A8%E0%A7%A6%E0%A7%A8%E0%A7%AD.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all shadow-sm hover:shadow-amber-500/20"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
              <Link
                to="/article/income-tax-circular-2026-2027-pdf-download"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/10 hover:border-white/20"
              >
                Summary
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-slate-800">Interactive Utilities</h2>
        <div className="h-px bg-slate-200 flex-1 ml-4"></div>
      </div>
      
      <div className="tools-container grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleTools.map((tool) => (
          <Link 
            key={tool.name}
            to={tool.path}
            title={tool.tooltip}
            className="relative group bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 hover:border-emerald-200 overflow-hidden flex flex-col items-center text-center gap-5 z-10"
          >
            {/* Background glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <button 
              onClick={(e) => hideTool(e, tool.name)}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20"
              title="Hide this tool"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className={`relative p-5 rounded-[1.5rem] shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner ${tool.color}`}>
              {/* Inner subtle ring */}
              <div className="absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-black/5" />
              {tool.icon}
            </div>
            
            <div className="relative z-10 mt-2">
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                {tool.name}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm group-hover:text-slate-700 transition-colors">
                {tool.description}
              </p>
            </div>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-full group-hover:translate-y-0" />
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

      <div className="mt-16">
        <Gallery 
          items={[
            {
              id: 'tax-slab-infographic',
              title: 'Tax Slab 2026-2027',
              description: 'Visual breakdown of the latest income tax slabs for individual taxpayers.',
              imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'surcharge-flowchart',
              title: 'Surcharge Calculation Guide',
              description: 'Step-by-step flowchart for determining net wealth surcharge applicability.',
              imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
            },
            {
              id: 'tds-rates-summary',
              title: 'TDS Rates Summary',
              description: 'Quick reference infographic for Withholding Tax Rules and TDS rates.',
              imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80'
            }
          ]}
        />
      </div>

      <div className="mt-16">
        <RJSCFeeEstimator />
      </div>
    </div>
  );
}

