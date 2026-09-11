import React, { useState, useMemo } from 'react';
import { Calculator, ShieldAlert, CheckCircle2, AlertCircle, ArrowRight, DollarSign } from 'lucide-react';

type Category = 'general' | 'female_senior' | 'disabled' | 'freedom_fighter';
type Location = 'dhaka_ctg' | 'other_cc' | 'non_cc';

export function TaxPlanner() {
  const [income, setIncome] = useState<string>('');
  const [investment, setInvestment] = useState<string>('');
  const [tds, setTds] = useState<string>('');
  const [category, setCategory] = useState<Category>('general');
  const [disabledDependents, setDisabledDependents] = useState<number>(0);
  const [location, setLocation] = useState<Location>('dhaka_ctg');
  const [isFirstTimeFiler, setIsFirstTimeFiler] = useState<boolean>(false);

  // Compute logic
  const results = useMemo(() => {
    const numIncome = Math.max(0, parseInt(income || '0', 10));
    const numInvestment = Math.max(0, parseInt(investment || '0', 10));
    const numTds = Math.max(0, parseInt(tds || '0', 10));

    // 1. Determine base tax-free limit
    let baseLimit = 400000;
    if (category === 'female_senior') baseLimit = 450000;
    else if (category === 'disabled') baseLimit = 525000;
    else if (category === 'freedom_fighter') baseLimit = 550000;

    // Add dependent limit
    const totalLimit = baseLimit + (disabledDependents * 50000);

    // 2. Calculate progressive tax
    let taxableIncome = Math.max(0, numIncome - totalLimit);
    let grossTax = 0;
    
    let remaining = taxableIncome;

    const slabs = [
      { limit: 300000, rate: 0.10 },
      { limit: 400000, rate: 0.15 },
      { limit: 500000, rate: 0.20 },
      { limit: 2000000, rate: 0.25 }
    ];

    for (const slab of slabs) {
      if (remaining > 0) {
        const taxableAtSlab = Math.min(remaining, slab.limit);
        grossTax += taxableAtSlab * slab.rate;
        remaining -= taxableAtSlab;
      } else {
        break;
      }
    }

    if (remaining > 0) {
      grossTax += remaining * 0.30; // 30% on the rest
    }

    // 3. Investment Rebate (Simplified 15% on actual eligible investment)
    const rebate = numInvestment * 0.15;
    const netTaxBeforeMin = Math.max(0, grossTax - rebate);

    // 4. Minimum Tax Rule
    let minimumTax = 0;
    if (numIncome > totalLimit) {
      if (isFirstTimeFiler) {
        minimumTax = 1000;
      } else {
        if (location === 'dhaka_ctg') minimumTax = 5000;
        else if (location === 'other_cc') minimumTax = 4000;
        else minimumTax = 3000;
      }
    }

    // 5. Final Liability
    const finalLiability = numIncome > totalLimit ? Math.max(netTaxBeforeMin, minimumTax) : 0;
    
    // 6. Net Payable
    const netPayable = finalLiability - numTds;
    
    return {
      totalLimit,
      taxableIncome,
      grossTax,
      rebate,
      netTaxBeforeMin,
      minimumTax,
      finalLiability,
      netPayable
    };

  }, [income, investment, tds, category, disabledDependents, location, isFirstTimeFiler]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
          Individual Income <span className="text-emerald-600">Tax Planner</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Estimate your annual tax liability based on the 2026 guidelines. Input your income, approved investments, and TDS to calculate your net payable tax.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-slate-900">Tax Inputs</h2>
          </div>

          <div className="space-y-6">
            {/* Financial Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Total Annual Income (BDT)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="e.g. 1200000"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Eligible Investments (BDT)</label>
                  <input
                    type="number"
                    min="0"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    placeholder="e.g. 200000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">TDS Already Paid (BDT)</label>
                  <input
                    type="number"
                    min="0"
                    value={tds}
                    onChange={(e) => setTds(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Profile Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Taxpayer Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium appearance-none"
                >
                  <option value="general">General Individual (Male under 65)</option>
                  <option value="female_senior">Female or Senior Citizen (65+)</option>
                  <option value="disabled">Person with Disability / Third Gender</option>
                  <option value="freedom_fighter">Gazetted War-Wounded Freedom Fighter</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location Zone</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value as Location)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium appearance-none"
                  >
                    <option value="dhaka_ctg">Dhaka / Chattogram City Corp.</option>
                    <option value="other_cc">Other City Corporations</option>
                    <option value="non_cc">Non-City Corporation Area</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Disabled Dependents (Count)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={disabledDependents}
                    onChange={(e) => setDisabledDependents(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input
                  type="checkbox"
                  checked={isFirstTimeFiler}
                  onChange={(e) => setIsFirstTimeFiler(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors"></div>
                <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">I am filing for the very first time</span>
                <p className="text-xs text-slate-500 mt-1">First-time filers enjoy a reduced minimum tax rate cliff of 1,000 BDT.</p>
              </div>
            </label>

          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileTextIcon /> Calculation Summary
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Personal Tax-Free Limit</span>
                <span className="font-semibold text-white">{results.totalLimit.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Taxable Income</span>
                <span className="font-semibold text-white">{results.taxableIncome.toLocaleString()} BDT</span>
              </div>
              
              <div className="h-px bg-slate-700 my-4" />
              
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Gross Tax (Progressive)</span>
                <span className="font-semibold text-white">{results.grossTax.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Investment Rebate (Est.)</span>
                <span className="font-semibold text-emerald-400">- {results.rebate.toLocaleString()} BDT</span>
              </div>
              
              <div className="h-px bg-slate-700 my-4" />

              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Calculated Tax</span>
                <span className="font-semibold text-white">{results.netTaxBeforeMin.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Mandatory Minimum Tax</span>
                <span className="font-semibold text-amber-400">{results.minimumTax.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm pt-2">
                <span>Final Tax Liability</span>
                <span className="font-semibold text-white text-lg">{results.finalLiability.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 text-sm">
                <span>Less: TDS Already Paid</span>
                <span className="font-semibold text-emerald-400">- {results.netPayable < 0 ? results.finalLiability.toLocaleString() : (results.finalLiability - results.netPayable).toLocaleString()} BDT</span>
              </div>
            </div>

            <div className="bg-emerald-600 rounded-2xl p-5 text-center">
              <p className="text-emerald-100 text-sm font-medium mb-1">
                {results.netPayable < 0 ? 'Estimated Refund' : 'Net Tax Payable'}
              </p>
              <p className="text-3xl font-black text-white">
                {Math.abs(results.netPayable).toLocaleString()} <span className="text-lg font-semibold">BDT</span>
              </p>
            </div>
          </div>

          {results.taxableIncome > 0 && results.finalLiability === results.minimumTax && (
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 flex gap-4 items-start">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 mb-1">Minimum Tax Cliff Reached</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your gross tax after rebates ({results.netTaxBeforeMin.toLocaleString()} BDT) is lower than the mandatory minimum tax for your region ({results.minimumTax.toLocaleString()} BDT). You are required to pay the minimum tax.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileTextIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
