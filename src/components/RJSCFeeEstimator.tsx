import { useState } from 'react';
import { Calculator, Building2, CalendarClock, Receipt, ExternalLink, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LegalTooltip } from './LegalTooltip';
import { buildAppointmentUrl } from '../utils/appointmentRedirect';

export function RJSCFeeEstimator() {
  const [entityType, setEntityType] = useState<string>('pvt');
  const [filingPeriod, setFilingPeriod] = useState<string>('on-time');
  const [estimatedFee, setEstimatedFee] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for UI effect
    setTimeout(() => {
      let baseFee = 0;
      let lateFee = 0;

      // Mock Base Fee calculation
      switch (entityType) {
        case 'pvt':
          baseFee = 800; // Schedule X (400) + Audited Financials (400)
          break;
        case 'plc':
          baseFee = 1200;
          break;
        case 'partnership':
        case 'society':
          baseFee = 400;
          break;
      }

      // Mock Late Fee calculation
      switch (filingPeriod) {
        case 'on-time':
          lateFee = 0;
          break;
        case 'late-30':
          lateFee = 1000;
          break;
        case 'late-90':
          lateFee = 2000;
          break;
        case 'late-90-plus':
          lateFee = 5000;
          break;
      }

      setEstimatedFee(baseFee + lateFee);
      setIsCalculating(false);
    }, 600);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-indigo-100 text-indigo-700 p-3 rounded-2xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Mini RJSC Fee Estimator</h2>
          <p className="text-sm text-slate-500">Estimate your government return filing fees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Entity Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <LegalTooltip term="Entity Type" definition="The legal structure under which your organization is registered with the RJSC (e.g., Private Limited Company, Partnership).">
              Entity Type
            </LegalTooltip>
          </label>
          <select 
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setEstimatedFee(null); // Reset estimation on change
            }}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-colors"
          >
            <option value="pvt">Private Limited Company</option>
            <option value="plc">Public Limited Company</option>
            <option value="partnership">Partnership Firm</option>
            <option value="society">Society / Foundation</option>
          </select>
        </div>

        {/* Filing Period Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-slate-400" />
            <LegalTooltip term="Filing Period" definition="The duration after your AGM within which the documents are submitted. RJSC imposes compounding late fees if submitted after the statutory deadline.">
              Filing Period
            </LegalTooltip>
          </label>
          <select 
            value={filingPeriod}
            onChange={(e) => {
              setFilingPeriod(e.target.value);
              setEstimatedFee(null); // Reset estimation on change
            }}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-colors"
          >
            <option value="on-time">On-time (Within 30 days of AGM)</option>
            <option value="late-30">Late (1 - 30 days)</option>
            <option value="late-90">Late (31 - 90 days)</option>
            <option value="late-90-plus">Late (More than 90 days)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <button 
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Calculating...
            </span>
          ) : (
            'Calculate Estimate'
          )}
        </button>

        <div className="flex-1 w-full flex justify-end">
          <AnimatePresence mode="wait">
            {estimatedFee !== null ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
              >
                <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-emerald-200 shadow-sm w-full sm:w-auto">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Estimated Fee</div>
                    <div className="text-2xl font-black text-slate-900">
                      ৳ {estimatedFee.toLocaleString()}
                    </div>
                  </div>
                </div>

                <a
                  href={buildAppointmentUrl({
                    service: 'RJSC Annual Return & Compliance',
                    notes: `Entity: ${entityType}, Filing Period: ${filingPeriod}, Est. Gov Fee: ৳${estimatedFee}`,
                    source: 'RJSC Fee Estimator'
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 text-emerald-200" />
                  <span>Consult Lawyer for Filing</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                </a>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-slate-400 font-medium italic text-center sm:text-right w-full sm:w-auto"
              >
                Click calculate to see the estimated government fee.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <p className="text-xs text-slate-400 mt-4 text-center">
        * This is a simplified estimation based on standard filing fees. Actual fees may vary depending on authorized capital, the number of documents, and specific RJSC assessments.
      </p>
    </div>
  );
}
