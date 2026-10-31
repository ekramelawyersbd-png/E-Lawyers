import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Calendar, 
  ClipboardCheck, 
  X, 
  RefreshCcw, 
  Download, 
  FileText, 
  ArrowRight, 
  Coins, 
  FolderDown, 
  Wheat, 
  Building2, 
  Scale, 
  Sparkles, 
  Lightbulb, 
  Gem, 
  ShieldCheck, 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { SHOP_PRODUCTS } from '../data/shopProducts';
import { usePurchases } from '../contexts/PurchaseContext';
import { QuickComplianceTipsSidebar } from '../components/tools/QuickComplianceTipsSidebar';
import { Gallery } from '../components/Gallery';
import { ServiceSEO } from '../components/SEO';

export function ToolsHub() {
  const [hiddenTools, setHiddenTools] = useState<string[]>([]);
  const { isPurchased } = usePurchases();

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
      id: 'rjsc-fee-calculator-tool',
      name: 'RJSC Fee Calculator',
      category: 'Corporate & RJSC',
      description: 'Estimate government incorporation fees, non-judicial stamp duties, and capital bands under Companies Act 1994.',
      tooltip: 'Statutory fees under Companies Act 1994 and Stamp Act Schedule 1.',
      icon: <Building2 className="w-7 h-7" />,
      path: '/tools/rjsc-fee-calculator',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'post-registration-checklist-tool',
      name: 'Post-Registration Checklist',
      category: 'Corporate & RJSC',
      description: 'Mandatory post-incorporation roadmap: entity portal account, certified copies, e-TIN, BIN, trade license, and banking.',
      tooltip: 'Guided statutory checklist for newly registered Bangladesh companies.',
      icon: <ShieldCheck className="w-7 h-7" />,
      path: '/tools/post-registration-checklist',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'rjsc-functions-explorer-tool',
      name: 'RJSC Statutory Lifecycle Guide',
      category: 'Corporate & RJSC',
      description: 'Interactive guide covering name clearance, statutory returns (Schedule X/Form XII), certified copies, and winding-up.',
      tooltip: 'Explore RJSC registry functions under Companies Act 1994, Partnership Act 1932, and Societies Act 1860.',
      icon: <BookOpen className="w-7 h-7" />,
      path: '/tools/rjsc-functions-explorer',
      color: 'bg-indigo-100 text-indigo-900',
    },
    {
      id: 'rjsc-returns-filing-guide-tool',
      name: 'RJSC Returns Filing Guide',
      category: 'Corporate & RJSC',
      description: 'Practical guide to annual returns (Schedule X/Balance Sheet) vs event-based forms with interactive deadline calculator.',
      tooltip: 'Calculate exact statutory deadlines based on AGM date or corporate event date.',
      icon: <FileText className="w-7 h-7" />,
      path: '/tools/rjsc-returns-filing-guide',
      color: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'capital-gains-tax-tool',
      name: 'Capital Gains Tax Calculator',
      category: 'Tax & VAT Toolkits',
      description: 'Calculate capital gains tax on land, real estate, personal valuables, and shares under Finance Act 2026.',
      tooltip: 'Holding period rules (>5 yrs 15% flat, ≤5 yrs slab rates), 3-year installment facility, and 5% valuables rate.',
      icon: <Scale className="w-7 h-7" />,
      path: '/tools/capital-gains-tax',
      color: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'corporate-tax-tool',
      name: 'Corporate Tax Calculator',
      category: 'Tax & VAT Toolkits',
      description: 'Calculate corporate taxes for listed vs non-listed entities, evaluate 2.5% banking penalties, and project IPO savings.',
      tooltip: 'Compare non-listed (27.5%), listed >10% IPO (20%), and listed ≤10% IPO (25%) rates under NBR roadmap.',
      icon: <Building2 className="w-7 h-7" />,
      path: '/tools/corporate-tax',
      color: 'bg-indigo-100 text-indigo-900',
    },
    {
      id: 'wealth-surcharge-tool',
      name: 'Wealth Surcharge Visualizer',
      category: 'Tax & VAT Toolkits',
      description: 'Explore progressive net wealth surcharge brackets (0% to 35%) and special luxury triggers under Section 2(86B).',
      tooltip: 'Visualize where your net wealth sits among statutory surcharge brackets.',
      icon: <Coins className="w-7 h-7" />,
      path: '/tools/wealth-surcharge',
      color: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'investment-rebate-calculator-tool',
      name: 'Investment Tax Rebate Calculator',
      category: 'Tax & VAT Toolkits',
      description: 'Calculate maximum tax credit taking the lowest of 3% taxable income, 15% eligible investment, and Tk. 10 Lakh ceiling.',
      tooltip: 'Under Bangladesh Finance Act 2026 & Section 78 with real-time 3-limit evaluation.',
      icon: <Sparkles className="w-7 h-7" />,
      path: '/tools/investment-rebate',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'agricultural-tax-tool',
      name: 'Agricultural Tax Calculator',
      category: 'Tax & VAT Toolkits',
      description: 'Calculate net agricultural income, apply Section 43 deemed 60% expenses, Clause 20 exemption, and tax slabs.',
      tooltip: 'Under Sections 40–44 of Income Tax Act 2023 with FY 2026-27 statutory slabs.',
      icon: <Wheat className="w-7 h-7" />,
      path: '/tools/agricultural-tax',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'minimum-turnover-tax-tool',
      name: 'Minimum Turnover Tax Calculator',
      category: 'Tax & VAT Toolkits',
      description: 'Calculate applicable turnover tax based on Section 163 gross receipts rules and loss-making business insulation.',
      tooltip: 'NBR restructured minimum turnover slabs under Income Tax Act.',
      icon: <Building2 className="w-7 h-7" />,
      path: '/tools/minimum-turnover-tax',
      color: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'national-rate-finder-tool',
      name: 'National Rate Finder (VAT, TDS & Customs)',
      category: 'Tax & VAT Toolkits',
      description: 'Central directory for searching live VAT rates, Withholding Tax (TDS/VDS) sections, and Customs HS tariffs with total tax incidence calculator.',
      tooltip: 'Under VAT & SD Act 2012, Income Tax Act 2023, and Customs Tariff 2026-27.',
      icon: <Scale className="w-7 h-7" />,
      path: '/tools/rate-finder',
      color: 'bg-emerald-100 text-emerald-900',
    },
    {
      id: 'dvc-verification-tool',
      name: 'ICAB DVC Verification Portal',
      category: 'Verification & Audit',
      description: 'Verify audited financial statements and income computation certificates under Income Tax Act Section 73 & ICAB standards.',
      tooltip: 'Simulated secure API validation of Document Verification Codes (DVC).',
      icon: <ShieldCheck className="w-7 h-7" />,
      path: '/tools/dvc-verification',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'resource-library-tool',
      name: 'Legal & Tax Resource Library',
      category: 'Resources',
      description: 'Download PDF templates for NDAs, service agreements, AY 2026-27 tax return Excel workbooks, and tax checklists.',
      tooltip: 'Access official legal and tax document drafts with one-click download.',
      icon: <FolderDown className="w-7 h-7" />,
      path: '/tools/resource-library',
      color: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'early-filing-incentive-tool',
      name: 'Early Filing 5% Rebate Calculator',
      category: 'Tax & VAT Toolkits',
      description: 'Calculate your potential 5% tax rebate for filing returns between July 1 and September 30.',
      tooltip: 'Estimate your savings from the 5% early filing incentive, up to BDT 25,000.',
      icon: <Calendar className="w-7 h-7" />,
      path: '/tools/early-filing-incentive',
      color: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'loss-carry-forward-calculator',
      name: 'Loss Set-Off & Carry-Forward Calculator',
      category: 'Tax & VAT Toolkits',
      description: 'Simulate multi-year business results, unabsorbed depreciation priority rules, and 6-year general vs. 9-year startup sandbox carry-forward limits.',
      tooltip: 'Sections 70, 71 & Eighth Schedule of Income Tax Act 2023.',
      icon: <Calculator className="w-7 h-7" />,
      path: '/tools/loss-carry-forward-calculator',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'vat-apportionment-calculator',
      name: 'VAT Apportionment Calculator (Section 47)',
      category: 'Tax & VAT Toolkits',
      description: 'Compute your Eligible Partial Input Tax Rebate = I × (T ÷ T_total) under Section 47 of the VAT & SD Act 2012 for mixed Standard (15%), Zero-Rated (0%), and Exempt/Reduced-Rate supplies.',
      tooltip: 'Section 47 & Rule 28 partial input tax credit calculator for Mushak 9.1 Part-4 & Part-5.',
      icon: <Calculator className="w-7 h-7" />,
      path: '/tools/vat-apportionment-calculator',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'tax-slabs-explorer',
      name: 'Tax Slabs & Rates Hub',
      category: 'Tax & VAT Toolkits',
      description: 'Explore multi-year statutory income tax slabs (AY 2025-26 through AY 2030-31) and corporate rates under Finance Act 2026.',
      tooltip: 'Includes General, Women/Senior, July Warriors 2024, Disabled, and Corporate tiers.',
      icon: <Scale className="w-7 h-7" />,
      path: '/tools/tax-slabs-explorer',
      color: 'bg-teal-100 text-teal-800',
    }
  ];

  const visibleTools = tools.filter(t => !hiddenTools.includes(t.name));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <ServiceSEO
        title="Business & Tax Compliance Tools Directory | Accounticca & E-Lawyers"
        description="Access interactive dedicated tools for income tax calculation, RJSC fee estimation, wealth surcharge visualizers, and legal agreements."
        serviceType="Compliance & Financial Advisory Tools Directory"
        canonicalUrl="/tools"
        keywords={['Tax Calculator Bangladesh', 'RJSC Fee Estimator', 'Wealth Surcharge', 'Compliance Calendar', 'Legal Templates Bangladesh']}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Tools Hub', url: '/tools' }
        ]}
      />

      {/* Hero Title Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Standalone Tools Directory</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Legal, Tax & RJSC Compliance Tools Hub
        </h1>
        <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
          Select any interactive tool below to launch its dedicated, shop-protected standalone workspace page.
        </p>
      </div>

      {/* Compliance Tips Toggle Bar */}
      <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-0.5">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>Browse All Interactive Compliance Tools</span>
            <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              {visibleTools.length} Tools
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Each tool opens on a separate dedicated page with breadcrumbs, quick-switch menu, and related tools sidebar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-compliance-tips'))}
          className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-300 text-xs font-bold transition-all shadow-2xs hover:scale-102 cursor-pointer shrink-0"
        >
          <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Quick Compliance Tips</span>
          <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-black uppercase">Live</span>
        </button>
      </div>

      {/* Tools Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTools.map((tool) => {
          const matchingProduct = SHOP_PRODUCTS.find(p => p.id === tool.id || p.slug === tool.id);
          const unlocked = matchingProduct ? isPurchased(matchingProduct.id) : true;

          return (
            <div 
              key={tool.id}
              className="relative group bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-emerald-300 flex flex-col justify-between gap-5"
            >
              {/* Hide Button */}
              <button 
                type="button"
                onClick={(e) => hideTool(e, tool.name)}
                className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer"
                title="Hide this tool"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                {/* Header Row: Icon & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`p-3.5 rounded-2xl shrink-0 shadow-xs ${tool.color}`}>
                    {tool.icon}
                  </div>

                  {unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shrink-0">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Shop Protected</span>
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {tool.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Action Button to Open Standalone Tool Page */}
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to={tool.path}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-slate-900 group-hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-2xs"
                >
                  <span>Launch Standalone Tool</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden Tools Preferences Reset */}
      {hiddenTools.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={clearPreferences}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Reset Hidden Tools Preferences ({hiddenTools.length})</span>
          </button>
        </div>
      )}

      {/* Infographics Gallery */}
      <div className="pt-6">
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

      {/* Quick Compliance Tips Sidebar Drawer */}
      <QuickComplianceTipsSidebar />
    </div>
  );
}

export default ToolsHub;
