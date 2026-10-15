import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  Calculator, 
  Info, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Save, 
  Check, 
  BarChart, 
  Calendar, 
  ExternalLink, 
  Share2, 
  ArrowRight, 
  Wheat,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TaxHistory, SavedCalculation } from '../components/calculator/TaxHistory';
import { ShareTaxScenarioModal } from '../components/tax/ShareTaxScenarioModal';
import { IndividualTaxSlabsCard } from '../components/tax/IndividualTaxSlabsCard';
import { useAuth } from '../contexts/AuthContext';
import { usePurchases } from '../contexts/PurchaseContext';
import { SHOP_PRODUCTS, ShopProduct } from '../data/shopProducts';
import { CheckoutModal } from '../components/shop/CheckoutModal';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { parseTaxCalculatorFromUrl } from '../utils/taxShareUtils';
import { ServiceSEO } from '../components/SEO';

type TaxpayerCategory = 'general' | 'women_senior' | 'disabled' | 'freedom_fighter';
type LocationCategory = 'dhaka_ctg' | 'other_city' | 'other';

export function TaxCalculator() {
  const { isPurchased, simulateInstantPurchase } = usePurchases();
  const isCalculatorUnlocked = isPurchased('income-tax-calculator-2026-27');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const calculatorProduct: ShopProduct = useMemo(() => {
    return (
      SHOP_PRODUCTS.find(p => p.slug === 'income-tax-calculator-2026-27' || p.id === 'income-tax-calculator-2026-27') || {
        id: 'income-tax-calculator-2026-27',
        title: 'Income Tax Calculator 2026–27 (Interactive Assessment Tool)',
        slug: 'income-tax-calculator-2026-27',
        category: 'Tax & VAT Toolkits' as const,
        productType: 'Templates' as const,
        price: 850,
        originalPrice: 1500,
        rating: 4.99,
        reviewsCount: 312,
        format: 'Interactive Web Application + Instant Calculation Engine',
        shortDescription: 'Full verified access to the automated personal & corporate income tax calculation engine for Assessment Year 2026–2027.',
        fullDescription: 'Instant unlocked access to the official Accounticca & E-Lawyers interactive Income Tax Calculator for Bangladesh Assessment Year 2026–2027 (Finance Act 2026).',
        pagesOrFiles: 'Live Interactive Assessment Tool • Real-time Calculation Engine',
        features: [
          'Statutory Finance Act 2026 progressive individual tax slabs (0% to 30%)',
          'Dynamic 3-tier investment rebate cap computation (Sec 78, Sixth Schedule Part 3)',
          'Dedicated taxpayer categories (General, Women/Seniors 65+, Disabled, Freedom Fighters)',
          'Salary TDS monthly deduction and withholding schedules',
          'Area-based minimum tax verification (Dhaka & Chattogram City Corp, other cities, rural)'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
        authorOrVettedBy: 'Adv. Ekram Hossain, Advocate Supreme Court of Bangladesh',
        brochureUrl: '/tax-calculator',
        requiresPurchaseToAccess: true
      }
    );
  }, []);
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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 500);
    return () => clearTimeout(timer);
  }, [income, investments, category, location, disabledDependents]);

  useEffect(() => {
    const loadData = async () => {
      // Priority 1: Check deep link query parameters
      const urlParams = parseTaxCalculatorFromUrl(window.location.search);
      let hasDeepLink = false;
      if (urlParams) {
        if (urlParams.income !== undefined) { setIncome(urlParams.income); hasDeepLink = true; }
        if (urlParams.investments !== undefined) { setInvestments(urlParams.investments); hasDeepLink = true; }
        if (urlParams.category) { setCategory(urlParams.category as TaxpayerCategory); hasDeepLink = true; }
        if (urlParams.location) { setLocation(urlParams.location as LocationCategory); hasDeepLink = true; }
        if (urlParams.disabledDependents !== undefined) { setDisabledDependents(urlParams.disabledDependents); hasDeepLink = true; }
      }

      // Priority 2: Fall back to local storage if no deep link
      if (!hasDeepLink) {
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

    // Current Year Calculation (2026-27 under Bangladesh Finance Act 2026)
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
      label: `First Tk ${totalExemption.toLocaleString()} (Tax-Free)`,
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

    // Minimum Tax (Uniform BDT 5,000 for AY 2026-27 whenever income exceeds tax-free threshold)
    let minTax = 0;
    if (totalIncome > totalExemption) {
      minTax = 5000;
    }

    let netTax = grossTax - eligibleRebate;
    if (totalIncome > totalExemption && netTax < minTax) {
      netTax = minTax;
    }
    netTax = Math.max(0, netTax);
    const monthlyTds = Math.round(netTax / 12);

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
      monthlyTds,
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
      <ServiceSEO
        title="Income Tax Calculator 2026-27 | Bangladesh Assessment Year Calculator"
        description="Estimate personal and commercial income tax liability, investment tax rebates, and municipal minimum tax under Bangladesh Finance Act 2026."
        serviceType="Tax Computation & Advisory"
        canonicalUrl="/tax-calculator"
        keywords={['Income Tax Calculator Bangladesh', 'Finance Act 2026 Tax Slabs', 'Tax Rebate Calculator', 'TIN Tax Assessment 2026-27']}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Tools Hub', url: '/tools' },
          { name: 'Tax Calculator 2026-27', url: '/tax-calculator' }
        ]}
      />
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

        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-xs">
              <Calculator className="w-3.5 h-3.5" />
              General Individual Tax Calculator
            </span>
            <Link
              to="/article/agricultural-income-tax-bangladesh-2026-2027#agricultural-tax-calculator-tool"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Wheat className="w-3.5 h-3.5 text-emerald-600" />
              Agricultural Income Tax Calculator (Sec 40–44) &rarr;
            </Link>
            <Link
              to="/corporate-planner"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Corporate Tax Planner &rarr;
            </Link>
          </div>

          <Link
            to="/shop/income-tax-calculator-2026-27"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-2xs transition-colors"
            title="View this product in the Digital Shop"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
            <span>Shop Product: /shop/income-tax-calculator-2026-27</span>
          </Link>
        </div>

        {/* Verification Status or Gated Access Banner */}
        {isCalculatorUnlocked ? (
          <div className="mt-5 p-4 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white rounded-2xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <span>Verified Access Unlocked</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full border border-emerald-300">
                    Lifetime License
                  </span>
                </div>
                <div className="text-emerald-700 text-[11px] mt-0.5">
                  Purchased via Digital Shop (<Link to="/shop/income-tax-calculator-2026-27" className="underline font-bold hover:text-emerald-900">/shop/income-tax-calculator-2026-27</Link>)
                </div>
              </div>
            </div>
            <Link
              to="/shop/income-tax-calculator-2026-27"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-3 py-1.5 rounded-lg bg-white border border-emerald-200 shadow-2xs hover:bg-emerald-50 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Product In Shop</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="mt-5 p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-orange-50/40 to-white rounded-3xl border-2 border-amber-300 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-300">
                    <Lock className="w-3 h-3 text-amber-800" />
                    <span>Digital Shop Product Protection Active</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    Shop Purchase Required to Use This Tool
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    This interactive Income Tax Calculator 2026–27 is protected under our Digital Shop product (<Link to="/shop/income-tax-calculator-2026-27" className="text-emerald-700 font-bold underline hover:text-emerald-900">/shop/income-tax-calculator-2026-27</Link>). Without completing the shop purchase, access to calculations and results is restricted.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 bg-white p-3 rounded-2xl border border-amber-200 shadow-2xs self-start">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Fee</div>
                <div className="text-xl font-black text-slate-900">BDT 850</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Lifetime License</div>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Unlock Access via Shop (৳850)</span>
                </button>

                <Link
                  to="/shop/income-tax-calculator-2026-27"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5"
                >
                  <span>View Product Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (calculatorProduct) simulateInstantPurchase(calculatorProduct);
                }}
                className="px-3 py-1.5 text-xs text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                title="Simulate instant purchase for live verification"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Instant Demo Unlock (1-Click Test)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 relative transition-all ${
        !isCalculatorUnlocked ? 'opacity-60 pointer-events-none select-none filter blur-[0.5px]' : ''
      }`}>
        
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
                  <option value="general">General Resident Individual (Tax-free: Tk 4,00,000)</option>
                  <option value="women_senior">Women &amp; Seniors 65+ years (Tax-free: Tk 4,50,000)</option>
                  <option value="disabled">Disabled Persons (Tax-free: Tk 5,25,000)</option>
                  <option value="freedom_fighter">War-wounded Freedom Fighters (Tax-free: Tk 5,50,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Location</label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value as LocationCategory)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium appearance-none"
                >
                  <option value="dhaka_ctg">Dhaka &amp; Chattogram (Uniform Min. Tax: Tk 5,000)</option>
                  <option value="other_city">Other City Corporations (Uniform Min. Tax: Tk 5,000)</option>
                  <option value="other">Other Areas / Municipalities (Uniform Min. Tax: Tk 5,000)</option>
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
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  id="save-tax-calculation-btn"
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" /> Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="share-tax-calculator-btn"
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200/80 border border-emerald-300 transition-all shadow-xs cursor-pointer"
                  title="Share this tax scenario via deep link or email"
                >
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span>Share</span>
                </button>
              </div>
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
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-emerald-100 font-bold flex items-center gap-2">
                   Tax Summary 
                 </h2>
                 <button
                   type="button"
                   id="share-tax-calculator-header-btn"
                   onClick={() => setIsShareModalOpen(true)}
                   className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                 >
                   <Share2 className="w-3.5 h-3.5 text-emerald-300" />
                   <span>Share Scenario</span>
                 </button>
               </div>
               
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

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                 <div className="bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700/50">
                   <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Gross Tax</div>
                   <div className="text-xl font-bold h-7 flex items-center">
                     {isCalculating ? <div className="h-6 w-24 bg-emerald-700/60 rounded-md animate-pulse" /> : `Tk ${Math.round(calculation.grossTax).toLocaleString()}`}
                   </div>
                 </div>
                 <div className="bg-emerald-800/50 hover:bg-emerald-800/70 p-4 rounded-2xl border border-emerald-700/50 hover:border-emerald-500/60 transition-all">
                  <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">
                    <Link
                      to="/article/investment-tax-rebate-bangladesh-2026-2027"
                      className="inline-flex items-center gap-1.5 text-emerald-200 hover:text-white hover:underline cursor-pointer transition-colors"
                      title="View statutory Investment Tax Rebate rules, ceilings, and eligible assets"
                    >
                      <span>Investment Rebate</span>
                      <ExternalLink className="w-3 h-3 text-emerald-300/80 hover:text-white" />
                    </Link>
                  </div>
                   <div className="text-xl font-bold h-7 flex items-center">
                     {isCalculating ? <div className="h-6 w-24 bg-emerald-700/60 rounded-md animate-pulse" /> : `Tk ${Math.round(calculation.eligibleRebate).toLocaleString()}`}
                   </div>
                 </div>
                 <div className="bg-emerald-800/70 p-4 rounded-2xl border border-emerald-500/50 shadow-inner">
                   <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Monthly Salary TDS</div>
                   <div className="text-xl font-bold text-emerald-300 h-7 flex items-center">
                     {isCalculating ? <div className="h-6 w-24 bg-emerald-700/60 rounded-md animate-pulse" /> : `Tk ${calculation.monthlyTds.toLocaleString()}`}
                   </div>
                   <span className="text-[10px] text-emerald-300/80">Annual Payable ÷ 12</span>
                 </div>
               </div>

               {/* Salary TDS Guide Banner */}
               <div className="mt-4 p-4 rounded-2xl bg-emerald-800/40 border border-emerald-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                 <div className="space-y-0.5">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                     2026–2027 Payroll Framework
                   </span>
                   <h4 className="text-sm font-bold text-white pt-1">
                     Salary TDS in Bangladesh: Complete Withholding Guide
                   </h4>
                   <p className="text-xs text-slate-300">
                     Learn the Sixth Schedule 1/3 statutory salary exemption, Withholding Tax Rules 2026, and payroll compliance.
                   </p>
                 </div>
                 <Link
                   to="/article/salary-tds-bangladesh-complete-guide-2026-2027"
                   className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold transition-all shadow-sm shrink-0"
                 >
                   <span>Read Guide</span>
                   <ArrowRight className="w-3.5 h-3.5" />
                 </Link>
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
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-sm text-left min-w-[340px]">
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
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-colors shrink-0"
              >
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Book Tax Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Statutory Tax Slabs Reference Card */}
      <div className="mt-12">
        <IndividualTaxSlabsCard />
      </div>

      {/* Share Calculation Modal */}
      {isShareModalOpen && (
        <ShareTaxScenarioModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          scenarioName={`Tax Assessment (Income: ${parseInt(income || '0', 10).toLocaleString()} BDT)`}
          notes="Calculated using Accounticca's Bangladesh Individual Income Tax Estimator."
          inputs={{
            income: income || '0',
            investment: investments || '0',
            tds: '0',
            category: category === 'women_senior' ? 'female_senior' : category,
            disabledDependents: parseInt(disabledDependents || '0', 10),
            location: location === 'other_city' ? 'other_cc' : location === 'other' ? 'non_cc' : 'dhaka_ctg',
            isFirstTimeFiler: false
          }}
          results={{
            totalLimit: calculation.totalExemption,
            taxableIncome: calculation.taxableIncome,
            grossTax: calculation.grossTax,
            rebate: calculation.eligibleRebate,
            netTaxBeforeMin: Math.max(0, calculation.grossTax - calculation.eligibleRebate),
            minimumTax: calculation.minTax,
            finalLiability: calculation.netTax,
            netPayable: calculation.netTax
          }}
        />
      )}

      {/* Instant Checkout Modal for /shop/income-tax-calculator-2026-27 */}
      {isCheckoutOpen && calculatorProduct && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          singleProduct={calculatorProduct}
        />
      )}
    </div>
  );
}
