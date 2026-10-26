import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ShoppingBag, ShieldCheck, RefreshCw } from 'lucide-react';
import { SEO } from '../components/SEO';

export const PaymentCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Payment was cancelled by user';

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Payment Cancelled - UddoktaPay Hosted"
        description="Payment session was cancelled. No charges were incurred."
      />

      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 sm:p-10 space-y-6">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">Payment Process Cancelled</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Your UddoktaPay automated checkout was cancelled or closed before completion. No deductions were made from your bKash, Nagad, Rocket, or card account.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-500 font-mono">
          Status: <span className="font-bold text-amber-700">TRANSACTION_ABORTED</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Return to Shop</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected by Accounticca Verified Security & UddoktaPay</span>
        </div>
      </div>
    </div>
  );
};
