import { useState, useMemo } from 'react';
import { Calculator, Info, DollarSign, Lightbulb, TrendingDown, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

type CompanyCategory = 
  | 'public_10' 
  | 'public_other' 
  | 'non_public' 
  | 'bank_listed' 
  | 'bank_non_listed' 
  | 'tobacco' 
  | 'mobile';

const TAX_RATES: Record<CompanyCategory, { label: string, standard: number, reduced: number, condition?: string }> = {
  public_10: { 
    label: 'Publicly traded (min 10% IPO)', 
    standard: 0.225, 
    reduced: 0.20, 
    condition: 'if all income transactions are conducted through bank transfer' 
  },
  public_other: { 
    label: 'Other publicly traded', 
    standard: 0.275, 
    reduced: 0.25, 
    condition: 'if all income transactions are conducted through bank transfer' 
  },
  non_public: { 
    label: 'Non-publicly traded', 
    standard: 0.275, 
    reduced: 0.275 
  },
  bank_listed: { 
    label: 'Banks, Insurance & Financial (Listed)', 
    standard: 0.375, 
    reduced: 0.375 
  },
  bank_non_listed: { 
    label: 'Banks, Insurance & Financial (Non-listed)', 
    standard: 0.40, 
    reduced: 0.40 
  },
  tobacco: { 
    label: 'Tobacco Manufacturers', 
    standard: 0.45, 
    reduced: 0.45 
  },
  mobile: { 
    label: 'Mobile Phone Operators', 
    standard: 0.45, 
    reduced: 0.40,
    condition: 'if specific stock exchange listing conditions are fulfilled'
  },
};

export function CorporateTaxPlanner() {
  const [category, setCategory] = useState<CompanyCategory>('non_public');
  const [revenue, setRevenue] = useState<string>('');
  const [expenses, setExpenses] = useState<string>('');
  const [plannedCapEx, setPlannedCapEx] = useState<string>('');
  const [meetsConditions, setMeetsConditions] = useState<boolean>(false);
  const [plansEarlyFiling, setPlansEarlyFiling] = useState<boolean>(true);

  const analysis = useMemo(() => {
    const rev = parseFloat(revenue) || 0;
    const exp = parseFloat(expenses) || 0;
    const capex = parseFloat(plannedCapEx) || 0;

    // Simplified assumption: 10% depreciation on new CapEx for the year if executed before year-end
    const estimatedDepreciation = capex * 0.10;
    const operatingProfit = Math.max(0, rev - exp);
    const taxableIncome = Math.max(0, operatingProfit - estimatedDepreciation);

    const rateInfo = TAX_RATES[category];
    const applicableRate = meetsConditions ? rateInfo.reduced : rateInfo.standard;
    
    let baseTax = taxableIncome * applicableRate;
    
    // Early filing incentive: 5% of payable tax, up to 25,000
    let earlyFilingRebate = 0;
    if (plansEarlyFiling && baseTax > 0) {
      earlyFilingRebate = Math.min(baseTax * 0.05, 25000);
    }
    
    const finalTax = Math.max(0, baseTax - earlyFilingRebate);

    // Alternative scenario: No CapEx, standard rate, no early filing
    const altTaxable = operatingProfit;
    const altBaseTax = altTaxable * rateInfo.standard;
    const potentialSavings = altBaseTax - finalTax;

    const strategies = [];

    if (rateInfo.standard > rateInfo.reduced) {
      strategies.push({
        id: 'conditions',
        title: 'Meet Reduced Rate Conditions',
        description: `Ensure you meet the requirement: ${rateInfo.condition}. This drops your rate from ${(rateInfo.standard * 100).toFixed(1)}% to ${(rateInfo.reduced * 100).toFixed(1)}%.`,
        impact: taxableIncome * (rateInfo.standard - rateInfo.reduced)
      });
    }

    if (capex > 0) {
      strategies.push({
        id: 'capex',
        title: 'Accelerate Capital Expenditure',
        description: 'Execute your planned CapEx before the income year ends. This allows you to claim depreciation allowances (estimated at 10%) for the current assessment year, lowering taxable income.',
        impact: estimatedDepreciation * applicableRate
      });
    }

    if (baseTax > 0) {
      strategies.push({
        id: 'early_filing',
        title: 'Early Filing Incentive',
        description: 'File your corporate tax return within 6 months from the end of your income year to receive a 5% tax incentive on payable tax (up to Tk 25,000).',
        impact: Math.min(baseTax * 0.05, 25000)
      });
    }

    // Sort strategies by highest impact
    strategies.sort((a, b) => b.impact - a.impact);

    return {
      operatingProfit,
      taxableIncome,
      baseTax,
      finalTax,
      potentialSavings,
      strategies,
      applicableRate
    };
  }, [category, revenue, expenses, plannedCapEx, meetsConditions, plansEarlyFiling]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: 'Tools' }, { label: 'Corporate Tax Planner 2026' }]} />
      
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Corporate Tax Planner</h1>
        </div>
        <p className="text-slate-600 text-lg max-w-3xl">
          Analyze your financial data and discover strategies to minimize your corporate tax liability for the Assessment Year 2026-27.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Financial Projections</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Category</label>
                <select 
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as CompanyCategory);
                    setMeetsConditions(false);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium appearance-none"
                >
                  {Object.entries(TAX_RATES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Estimated Annual Revenue (Tk)</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    min="0"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder="e.g. 50000000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Estimated Operating Expenses (Tk)</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    min="0"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    placeholder="e.g. 35000000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Planned Capital Expenditure (Tk)</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    min="0"
                    value={plannedCapEx}
                    onChange={(e) => setPlannedCapEx(e.target.value)}
                    placeholder="e.g. 5000000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">E.g., machinery, equipment, or vehicles planned for purchase.</p>
              </div>

              {TAX_RATES[category].standard > TAX_RATES[category].reduced && (
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl cursor-pointer">
                    <div className="flex items-center h-5 mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={meetsConditions}
                        onChange={(e) => setMeetsConditions(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-slate-900 mb-1">Meet Reduced Rate Conditions</span>
                      <span className="block text-xs text-slate-600">{TAX_RATES[category].condition}</span>
                    </div>
                  </label>
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-200 transition-colors">
                  <div className="flex items-center h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={plansEarlyFiling}
                      onChange={(e) => setPlansEarlyFiling(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 mb-1">Plan to File Early</span>
                    <span className="block text-xs text-slate-600">Within 6 months from the end of the income year.</span>
                  </div>
                </label>
              </div>

            </div>
          </div>
        </div>

        {/* Results & Strategies Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm p-6 md:p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <TrendingDown className="w-32 h-32" />
             </div>
             
             <div className="relative z-10">
               <h2 className="text-slate-300 font-bold mb-6 flex items-center gap-2">
                 Projected Tax Liability
               </h2>
               
               <div className="mb-8 flex flex-col md:flex-row md:items-end gap-6 justify-between border-b border-slate-800 pb-8">
                 <div>
                   <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-1">Optimized Tax Payable</div>
                   <div className="text-4xl md:text-5xl font-bold">
                     Tk {Math.round(analysis.finalTax).toLocaleString()}
                   </div>
                   <div className="text-slate-400 text-sm mt-2 font-medium">Effective Rate: {((analysis.finalTax / (analysis.operatingProfit || 1)) * 100).toFixed(1)}%</div>
                 </div>
                 
                 <div className="bg-emerald-500/20 px-4 py-3 rounded-xl border border-emerald-500/30 text-right">
                   <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Total Potential Savings</div>
                   <div className="text-2xl font-bold text-emerald-400">Tk {Math.round(analysis.potentialSavings).toLocaleString()}</div>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                   <div className="text-slate-400 font-medium mb-1">Taxable Income</div>
                   <div className="text-lg font-bold">Tk {Math.round(analysis.taxableIncome).toLocaleString()}</div>
                 </div>
                 <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                   <div className="text-slate-400 font-medium mb-1">Applicable Rate</div>
                   <div className="text-lg font-bold">{(analysis.applicableRate * 100).toFixed(1)}%</div>
                 </div>
               </div>
             </div>
          </div>

          {/* Tax Planning Strategies */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-emerald-50/50 flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Tax Planning Strategies</h3>
                <p className="text-sm text-slate-600">Actionable steps to minimize your liability</p>
              </div>
            </div>
            
            <div className="p-0">
              {analysis.strategies.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {analysis.strategies.map((strategy, index) => (
                    <div key={strategy.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          {strategy.title}
                        </h4>
                        {strategy.impact > 0 && (
                          <span className="shrink-0 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">
                            Save Tk {Math.round(strategy.impact).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 ml-8 leading-relaxed">
                        {strategy.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium">Enter your financial data to see customized tax planning strategies.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <p className="text-xs text-slate-500 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Disclaimer: This planner provides estimates based on standard rules from the Finance Act 2026. Actual tax liability may vary based on non-allowable expenses, detailed depreciation schedules, and other specific adjustments. Always consult a certified tax professional.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
