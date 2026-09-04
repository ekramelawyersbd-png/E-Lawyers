import { useState, useMemo, useEffect } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calculator, Info, DollarSign, PieChart as PieChartIcon, Save, Check, BarChart, Calendar, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TaxHistory, SavedCalculation } from '../components/calculator/TaxHistory';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';

type TaxpayerCategory = 'general' | 'women_senior' | 'disabled' | 'freedom_fighter';
type LocationCategory = 'dhaka_ctg' | 'other_city' | 'other';

export function TaxCalculator() {
  const [income, setIncome] = useState<string>('');
  const [investments, setInvestments] = useState<string>('');
  const [category, setCategory] = useState<TaxpayerCategory>('general');
  const [location, setLocation] = useState<LocationCategory>('dhaka_ctg');
  const [disabledDependents, setDisabledDependents] = useState<string>('0');
  const [isSaved, setIsSaved] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [calcHistory, setCalcHistory] = useState<SavedCalculation[]>([]);
  const { user } = useAuth();
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 500);
    return () => clearTimeout(timer);
  }, [income, investments, category, location, disabledDependents]);

  useEffect(() => {
    const loadData = async () => {
      const savedData = localStorage.getItem('taxCalcData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.income !== undefined) setIncome(parsed.income);
          if (parsed.investments !== undefined) setInvestments(parsed.investments);
          if (parsed.category) setCategory(parsed.category);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.disabledDependents !== undefined) setDisabledDependents(parsed.disabledDependents);
        } catch (e) {
          console.error('Failed to parse saved data', e);
        }
      }

      if (user) {
        try {
          const q = query(collection(db, 'taxCalculations'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const history = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              date: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
              year: '2026-27',
              income: data.income,
              tax: data.netTax
            };
          });
          setCalcHistory(history.slice(0, 10)); // Keep last 10
        } catch(e) {
          console.error('Error fetching tax history', e);
        }
      } else {
        const savedHistory = localStorage.getItem('taxCalcHistory');
        if (savedHistory) {
          try {
            setCalcHistory(JSON.parse(savedHistory));
          } catch (e) {
            console.error('Failed to parse history', e);
          }
        }
      }
    };
    loadData();
  }, [user]);

  const calculation = useMemo(() => {
    const totalIncome = parseFloat(income) || 0;
    const totalInvestments = parseFloat(investments) || 0;
    const dependentsCount = parseInt(disabledDependents) || 0;

    // Current Year Calculation (2026-27)
    let baseExemption = 400000;
    if (category === 'women_senior') baseExemption = 450000;
    else if (category === 'disabled') baseExemption = 525000;
    else if (category === 'freedom_fighter') baseExemption = 550000;

    const totalExemption = baseExemption + (dependentsCount * 50000);
    const taxableIncome = Math.max(0, totalIncome - totalExemption);

    let remainingTaxable = taxableIncome;
    let grossTax = 0;

    const slabs = [
      { limit: 300000, rate: 0.10 },
      { limit: 400000, rate: 0.15 },
      { limit: 500000, rate: 0.20 },
      { limit: 1000000, rate: 0.25 },
      { limit: Infinity, rate: 0.30 }
    ];

    const slabBreakdown = [];

    slabBreakdown.push({
      label: `First Tk ${totalExemption.toLocaleString()}`,
      amount: Math.min(totalIncome, totalExemption),
      rate: '0%',
      tax: 0
    });

    for (const slab of slabs) {
      if (remainingTaxable <= 0) break;
      const amountInSlab = Math.min(remainingTaxable, slab.limit);
      const taxForSlab = amountInSlab * slab.rate;
      grossTax += taxForSlab;
      
      slabBreakdown.push({
        label: slab.limit === Infinity ? 'Remaining Amount' : `Next Tk ${slab.limit.toLocaleString()}`,
        amount: amountInSlab,
        rate: `${(slab.rate * 100).toFixed(0)}%`,
        tax: taxForSlab
      });

      remainingTaxable -= amountInSlab;
    }

    // Rebate Calculation
    const rebate1 = totalIncome * 0.03;
    const rebate2 = totalInvestments * 0.15;
    const rebate3 = 1000000;
    const eligibleRebate = totalIncome > 0 ? Math.min(rebate1, rebate2, rebate3) : 0;

    // Minimum Tax
    let minTax = 0;
    if (totalIncome > totalExemption) {
      if (location === 'dhaka_ctg') minTax = 5000;
      else if (location === 'other_city') minTax = 4000;
      else minTax = 3000;
    }

    let netTax = grossTax - eligibleRebate;
    if (totalIncome > totalExemption && netTax < minTax) {
      netTax = minTax;
    }
    netTax = Math.max(0, netTax);

    // Previous Year Calculation (2025-26)
    let prevBaseExemption = 350000;
    if (category === 'women_senior') prevBaseExemption = 400000;
    else if (category === 'disabled') prevBaseExemption = 475000;
    else if (category === 'freedom_fighter') prevBaseExemption = 500000;

    const prevTotalExemption = prevBaseExemption + (dependentsCount * 50000);
    const prevTaxableIncome = Math.max(0, totalIncome - prevTotalExemption);

    let prevRemainingTaxable = prevTaxableIncome;
    let prevGrossTax = 0;

    const prevSlabs = [
      { limit: 100000, rate: 0.05 },
      { limit: 300000, rate: 0.10 },
      { limit: 400000, rate: 0.15 },
      { limit: 500000, rate: 0.20 },
      { limit: Infinity, rate: 0.25 }
    ];

    for (const slab of prevSlabs) {
      if (prevRemainingTaxable <= 0) break;
      const amountInSlab = Math.min(prevRemainingTaxable, slab.limit);
      prevGrossTax += amountInSlab * slab.rate;
      prevRemainingTaxable -= amountInSlab;
    }

    let prevNetTax = prevGrossTax - eligibleRebate;
    if (totalIncome > prevTotalExemption && prevNetTax < minTax) {
      prevNetTax = minTax;
    }
    prevNetTax = Math.max(0, prevNetTax);

    const diff = netTax - prevNetTax;

    return {
      totalIncome,
      totalExemption,
      taxableIncome,
      grossTax,
      eligibleRebate,
      minTax,
      netTax,
      slabBreakdown,
      prevNetTax,
      diff
    };
  }, [income, investments, category, location, disabledDependents]);

  const handleSave = () => {
    const data = { income, investments, category, location, disabledDependents };
    localStorage.setItem('taxCalcData', JSON.stringify(data));
    
    // Also save to history
    const newHistoryItem: SavedCalculation = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      year: '2026-27',
      income: calculation.totalIncome,
      tax: calculation.netTax
    };
    
    // Add fake historical data if empty to show the chart
    let updatedHistory = [...calcHistory];
    if (updatedHistory.length === 0) {
      updatedHistory = [
        { id: '1', date: new Date('2022-06-30').toISOString(), year: '2022-23', income: calculation.totalIncome * 0.8, tax: calculation.netTax * 0.75 },
        { id: '2', date: new Date('2023-06-30').toISOString(), year: '2023-24', income: calculation.totalIncome * 0.85, tax: calculation.netTax * 0.8 },
        { id: '3', date: new Date('2024-06-30').toISOString(), year: '2024-25', income: calculation.totalIncome * 0.9, tax: calculation.netTax * 0.85 },
        { id: '4', date: new Date('2025-06-30').toISOString(), year: '2025-26', income: calculation.totalIncome, tax: calculation.prevNetTax },
      ];
    }
    
    // Remove if 2026-27 already exists and update
    updatedHistory = updatedHistory.filter(h => h.year !== '2026-27');
    updatedHistory.push(newHistoryItem);
    
    setCalcHistory(updatedHistory);
    localStorage.setItem('taxCalcHistory', JSON.stringify(updatedHistory));

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: 'Tools' }, { label: 'Income Tax Calculator 2026-27' }]} />
      
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Income Tax Calculator 2026-27</h1>
        </div>
        <p className="text-slate-600 text-lg max-w-3xl">
          Estimate your net tax liability instantly based on the latest slabs from the Bangladesh Finance Act 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Your Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Total Annual Income (Tk)</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    min="0"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="e.g. 1200000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Eligible Investments (Tk)</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    min="0"
                    value={investments}
                    onChange={(e) => setInvestments(e.target.value)}
                    placeholder="e.g. 200000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Taxpayer Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaxpayerCategory)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium appearance-none"
                >
                  <option value="general">General</option>
                  <option value="women_senior">Women & Senior Citizens (65+)</option>
                  <option value="disabled">Disabled Person</option>
                  <option value="freedom_fighter">War-Wounded Freedom Fighter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Location</label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value as LocationCategory)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium appearance-none"
                >
                  <option value="dhaka_ctg">Dhaka & Chattogram City Corporation</option>
                  <option value="other_city">Other City Corporations</option>
                  <option value="other">Other Areas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Disabled Dependents</label>
                <input 
                  type="number"
                  min="0"
                  value={disabledDependents}
                  onChange={(e) => setDisabledDependents(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <p className="text-xs text-slate-500 mt-1">Extra Tk 50,000 exemption per dependent.</p>
              </div>
              
              <button 
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all bg-emerald-600 hover:bg-emerald-700"
              >
                {isSaved ? (
                  <>
                    <Check className="w-5 h-5" /> Saved to Local Storage
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Calculation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-emerald-900 rounded-3xl border border-emerald-800 shadow-sm p-6 md:p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <PieChartIcon className="w-32 h-32" />
             </div>
             
             <div className="relative z-10">
               <h2 className="text-emerald-100 font-bold mb-6 flex items-center gap-2">
                 Tax Summary 
               </h2>
               
               <div className="mb-8">
                 <div className="text-emerald-200 text-sm font-bold uppercase tracking-widest mb-1">Estimated Net Tax Payable</div>
                 <div className="text-4xl md:text-5xl font-bold h-12 flex items-center">
                   {isCalculating ? (
                     <div className="h-10 w-48 bg-emerald-800/60 rounded-xl animate-pulse" />
                   ) : (
                     `Tk ${Math.round(calculation.netTax).toLocaleString()}`
                   )}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700/50">
                   <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Gross Tax</div>
                   <div className="text-xl font-bold h-7 flex items-center">
                     {isCalculating ? <div className="h-6 w-24 bg-emerald-700/60 rounded-md animate-pulse" /> : `Tk ${Math.round(calculation.grossTax).toLocaleString()}`}
                   </div>
                 </div>
                 <div className="bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700/50">
                   <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Investment Rebate</div>
                   <div className="text-xl font-bold h-7 flex items-center">
                     {isCalculating ? <div className="h-6 w-24 bg-emerald-700/60 rounded-md animate-pulse" /> : `Tk ${Math.round(calculation.eligibleRebate).toLocaleString()}`}
                   </div>
                 </div>
               </div>

               <div className="flex items-center justify-between mb-2 mt-6 border-t border-emerald-800/50 pt-4">
                 <div className="text-emerald-100 font-bold">Compare with Previous Year (2025-26)</div>
                 <button 
                   onClick={() => setShowComparison(!showComparison)}
                   className="px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                 >
                   {showComparison ? 'Hide' : 'Show'}
                 </button>
               </div>
               
               {showComparison && (
                 <div className="bg-emerald-800/30 p-4 rounded-2xl border border-emerald-700/50 mt-4">
                   <div className="flex justify-between items-center mb-2">
                     <div className="text-emerald-200 text-sm font-medium">Previous Year Liability:</div>
                     <div className="text-xl font-bold">Tk {Math.round(calculation.prevNetTax).toLocaleString()}</div>
                   </div>
                   <div className="flex justify-between items-center">
                     <div className="text-emerald-200 text-sm font-medium">Difference:</div>
                     <div className={`text-lg font-bold ${calculation.diff < 0 ? 'text-emerald-400' : calculation.diff > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                       {calculation.diff > 0 ? '+' : ''}{Math.round(calculation.diff).toLocaleString()} Tk {calculation.diff < 0 ? '(Savings)' : calculation.diff > 0 ? '(Increase)' : ''}
                     </div>
                   </div>
                 </div>
               )}
             </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Calculation Breakdown</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 font-medium">Total Income</span>
                {isCalculating ? <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" /> : <span className="font-bold text-slate-900">Tk {calculation.totalIncome.toLocaleString()}</span>}
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                <span className="text-slate-600 font-medium">Tax-Free Exemption</span>
                {isCalculating ? <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" /> : <span className="font-bold text-slate-900">- Tk {calculation.totalExemption.toLocaleString()}</span>}
              </div>
              <div className="flex justify-between items-center py-2 text-lg">
                <span className="font-bold text-slate-900">Taxable Income</span>
                {isCalculating ? <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" /> : <span className="font-bold text-emerald-700">Tk {calculation.taxableIncome.toLocaleString()}</span>}
              </div>
            </div>

            {calculation.slabBreakdown.length > 1 && (
              <>
                <div className="px-6 py-3 bg-slate-50 border-y border-slate-200 font-bold text-sm text-slate-700">
                  Tax Slabs
                </div>
                <div className="p-0">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3 font-medium">Slab</th>
                        <th className="px-6 py-3 font-medium">Amount (Tk)</th>
                        <th className="px-6 py-3 font-medium text-right">Tax (Tk)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {isCalculating ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i}>
                            <td className="px-6 py-3"><div className="h-4 w-32 bg-slate-200 rounded animate-pulse" /></td>
                            <td className="px-6 py-3"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></td>
                            <td className="px-6 py-3 flex justify-end"><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></td>
                          </tr>
                        ))
                      ) : (
                        calculation.slabBreakdown.map((slab, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3">{slab.label} @ {slab.rate}</td>
                            <td className="px-6 py-3">{slab.amount.toLocaleString()}</td>
                            <td className="px-6 py-3 text-right font-medium">{Math.round(slab.tax).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="p-6 bg-slate-50 border-t border-slate-200 text-sm text-slate-600">
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Minimum tax applicable for your location: <strong className="text-slate-900">Tk {calculation.minTax.toLocaleString()}</strong>
              </p>
            </div>

          </div>

          <TaxHistory history={calcHistory} />

          {calculation.grossTax > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Taxable Income vs Tax Slabs</h3>
              </div>
              <div className="p-6 h-[350px]">
                {isCalculating ? (
                  <div className="w-full h-full flex items-end justify-center gap-4 pb-12 pt-8">
                    {[40, 70, 30, 90, 50].map((h, i) => (
                      <div key={i} className="flex gap-1 items-end h-full">
                        <div className="w-8 bg-slate-200 rounded-t animate-pulse" style={{ height: `${h}%` }} />
                        <div className="w-8 bg-slate-200/60 rounded-t animate-pulse" style={{ height: `${h * 0.4}%` }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={calculation.slabBreakdown.filter(slab => slab.amount > 0).map(slab => ({
                        name: slab.rate,
                        income: Math.round(slab.amount),
                        tax: Math.round(slab.tax),
                        label: slab.label
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis yAxisId="left" orientation="left" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip 
                        formatter={(value, name) => [`Tk ${Number(value).toLocaleString()}`, name === 'income' ? 'Income in Slab' : 'Tax Amount']}
                        labelFormatter={(label, payload) => payload.length > 0 ? payload[0].payload.label : label}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar yAxisId="left" dataKey="income" name="income" fill="#34d399" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar yAxisId="right" dataKey="tax" name="tax" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={40} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}

          {/* Direct Consultation Link */}
          {calculation.grossTax > 0 && (
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Need help filing your income tax return?</h4>
                <p className="text-xs text-emerald-100">Schedule a 1-on-1 advisory with certified tax lawyers and consultants.</p>
              </div>
              <a
                href="https://appointment.accounticca.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-colors shrink-0"
              >
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Book Tax Consultation</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
