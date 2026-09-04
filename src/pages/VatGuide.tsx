import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FileText, Calendar, CheckCircle2, AlertTriangle, Scale, PoundSterling } from 'lucide-react';
import { BookmarkButton } from '../components/BookmarkButton';
import { ReadProgress } from '../components/ReadProgress';

export function VatGuide() {
  return (
    <>
      <ReadProgress />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Tax Updates', path: '/category/tax' },
          { label: 'VAT Registration & Compliance', path: '/vat-guide' }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="bg-emerald-900 rounded-3xl p-8 md:p-16 mb-12 relative overflow-hidden text-white border border-emerald-800 shadow-md">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-900 via-emerald-800/90 to-emerald-900/40" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-md">
              Comprehensive Guide
            </span>
            <span className="text-emerald-100/80 text-sm font-medium">Updated: Aug 2026</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
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
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Executive Summary */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FileText className="text-emerald-600 w-7 h-7" />
              Executive Summary
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Value-Added Tax (VAT) is an indirect tax on the consumption of goods/services. Businesses must register for VAT once they cross local turnover thresholds (e.g. £90,000 in the UK) and then charge VAT on sales and reclaim VAT on purchases. 
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              This guide explains how to register, account for VAT, and remain compliant with filings and payments. Compliance involves periodic VAT returns, paying net VAT due, and maintaining meticulous records.
            </p>
          </section>

          {/* VAT Basics */}
          <section className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">VAT Basics</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              VAT is a multi-stage tax ultimately borne by the consumer. Businesses act as intermediaries:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-emerald-200/60 shadow-sm">
                <div className="text-emerald-700 font-bold text-lg mb-2">Output VAT</div>
                <p className="text-sm text-slate-600">The VAT you <strong>charge</strong> to your customers on sales of goods and services.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-emerald-200/60 shadow-sm">
                <div className="text-emerald-700 font-bold text-lg mb-2">Input VAT</div>
                <p className="text-sm text-slate-600">The VAT you <strong>claim</strong> back on purchases and expenses for your business.</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-emerald-100/50 rounded-xl border border-emerald-200 text-sm text-emerald-800 font-medium">
              Example: If a UK business sells £1000 of goods at 20% VAT, it invoices £1,200. If it bought materials for £500 + £100 VAT, it only remits £100 net to HMRC.
            </div>
          </section>

          {/* Registration Process */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600 w-7 h-7" />
              Registration Process
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Monitor Thresholds</h3>
                  <p className="text-slate-600">In the UK, mandatory registration occurs when taxable turnover exceeds £90,000 in the past 12 months or expected within 30 days. Voluntary registration is possible below the threshold.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Register Online</h3>
                  <p className="text-slate-600">Typically online via the tax authority's portal. Requires business details, bank account, nature of supplies. After registration, a VAT number is issued.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Effective Date</h3>
                  <p className="text-slate-600">Registration is backdated to when the threshold was exceeded. Missing a late registration can incur penalties.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Compliance Requirements */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Scale className="text-emerald-600 w-7 h-7" />
              Compliance Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-3xl p-6 hover:border-emerald-300 transition-colors">
                <h4 className="font-bold text-slate-900 mb-3">VAT Returns</h4>
                <p className="text-sm text-slate-600">Usually quarterly. Return summarises output VAT charged and input VAT claimed. In the UK, returns are filed via Making Tax Digital (MTD) compliant software.</p>
              </div>
              <div className="border border-slate-200 rounded-3xl p-6 hover:border-emerald-300 transition-colors">
                <h4 className="font-bold text-slate-900 mb-3">VAT Payments</h4>
                <p className="text-sm text-slate-600">Due with each return. Late payment incurs interest/penalties. Some jurisdictions have monthly, quarterly, or annual payment schemes.</p>
              </div>
              <div className="border border-slate-200 rounded-3xl p-6 hover:border-emerald-300 transition-colors">
                <h4 className="font-bold text-slate-900 mb-3">Record-Keeping</h4>
                <p className="text-sm text-slate-600">Maintain VAT invoices, credit notes, import/export documents. HMRC expects "clear audit trails" – every VAT treatment should be documented.</p>
              </div>
              <div className="border border-slate-200 rounded-3xl p-6 hover:border-emerald-300 transition-colors">
                <h4 className="font-bold text-slate-900 mb-3">VAT Schemes</h4>
                <p className="text-sm text-slate-600">Small businesses may use simplified schemes (flat rate, cash accounting) to ease compliance; these require eligibility.</p>
              </div>
            </div>
          </section>

          {/* Common Pitfalls */}
          <section className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="text-rose-600 w-7 h-7" />
              Common Pitfalls
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                <p className="text-slate-700"><strong className="text-slate-900">Late Registration:</strong> Missing the registration deadline can lead to backdated VAT liability and penalties.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                <p className="text-slate-700"><strong className="text-slate-900">Threshold Miscalculation:</strong> Forgetting to include all taxable turnover (e.g. inter-company supplies, reverse-charge services) can cause surprises.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                <p className="text-slate-700"><strong className="text-slate-900">Software Issues:</strong> Not using MTD-compatible software in jurisdictions like the UK. If records aren't digitally linked, returns may be rejected.</p>
              </li>
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Calendar className="text-emerald-600 w-5 h-5" />
              Timeline Summary
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-200 before:to-transparent">
              <div className="relative z-10 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="text-emerald-700 font-bold text-xs uppercase tracking-widest mb-1">Initial</div>
                <div className="font-bold text-slate-900 text-sm">Register within 30 days</div>
                <div className="text-slate-500 text-xs mt-1">Apply as soon as threshold is met.</div>
              </div>
              <div className="relative z-10 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="text-emerald-700 font-bold text-xs uppercase tracking-widest mb-1">First Return</div>
                <div className="font-bold text-slate-900 text-sm">Deadline assigned</div>
                <div className="text-slate-500 text-xs mt-1">Based on registration date.</div>
              </div>
              <div className="relative z-10 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="text-emerald-700 font-bold text-xs uppercase tracking-widest mb-1">Ongoing</div>
                <div className="font-bold text-slate-900 text-sm">File by deadline</div>
                <div className="text-slate-500 text-xs mt-1">Each period (e.g. 1 month after quarter-end).</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white text-center">
            <h3 className="font-bold text-xl mb-4">Need VAT Assistance?</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Our experts can help you handle VAT registration, compliance, and strategic advisory.
            </p>
            <Link to="/corporate-planner" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-colors w-full">
              Get Expert Support
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
