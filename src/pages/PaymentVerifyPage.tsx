import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Receipt, 
  GraduationCap, 
  ShoppingBag, 
  Home, 
  RefreshCcw,
  Copy,
  Check,
  CreditCard
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { verifyUddoktaPayPayment, VerifyPaymentResponse } from '../services/uddoktapayService';
import { usePurchases } from '../contexts/PurchaseContext';

export const PaymentVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { purchaseProduct } = usePurchases();
  const invoiceId = searchParams.get('session_id') || searchParams.get('invoice_id') || searchParams.get('invoiceId') || searchParams.get('sess') || '';
  const sessionId = searchParams.get('session_id') || '';
  const simulated = searchParams.get('simulated') === 'true';
  const paramAmount = searchParams.get('amount') || '';
  const paramProductId = searchParams.get('product_id') || searchParams.get('productId') || '';
  const paramProductTitle = searchParams.get('product_title') || searchParams.get('title') || '';

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyPaymentResponse | null>(null);
  const [copiedTxn, setCopiedTxn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function runVerification() {
      if (!invoiceId) {
        setLoading(false);
        return;
      }
      try {
        const res = await verifyUddoktaPayPayment(invoiceId);
        if (isMounted) {
          setResult(res);
          setLoading(false);
          const verified = res?.verified || res?.status_code === 'COMPLETED' || res?.status === true;
          const resolvedProductId = paramProductId || (res as any)?.metadata?.product_id;
          const resolvedTitle = paramProductTitle || (res as any)?.metadata?.product_title || 'Verified Digital Product';
          if (verified && resolvedProductId) {
            purchaseProduct(
              String(resolvedProductId),
              String(resolvedTitle),
              Number(res?.amount || paramAmount || 1500),
              res?.payment_method || 'UddoktaPay Gateway',
              'completed',
              {
                orderId: sessionId || invoiceId,
                transactionId: res?.transaction_id || `TRX-${invoiceId}`
              }
            );
          }
        }
      } catch (err) {
        console.error('Verification error:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    runVerification();

    return () => {
      isMounted = false;
    };
  }, [invoiceId, paramAmount, paramProductId, paramProductTitle, purchaseProduct, sessionId]);

  const handleCopy = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const isCompleted = result?.verified || result?.status_code === 'COMPLETED' || result?.status === true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Payment Verification - UddoktaPay Hosted"
        description="Verify your automated payment status via UddoktaPay gateway for Accounticca & eLawyers services."
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0d2f44] to-[#0e433b] p-6 text-white text-center relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>UddoktaPay Hosted Gateway · Verified Transaction</span>
            </div>
            <h1 className="text-2xl font-black text-white">Automated Payment Settlement</h1>
            <p className="text-xs text-slate-300 mt-1">bKash · Nagad · Rocket · Upay · Cards</p>
          </div>

          <div className="p-6 sm:p-10">
            {loading ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h2 className="text-lg font-bold text-slate-800">Verifying Transaction with UddoktaPay...</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Connecting to automated payment server and validating invoice <strong className="font-mono text-slate-700">{invoiceId}</strong>.
                </p>
              </div>
            ) : !invoiceId ? (
              <div className="text-center py-10 space-y-5">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">No Invoice ID Provided</h2>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    No active transaction invoice was specified in the callback query. If you just placed an order, please check your email or return to the shop.
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    to="/shop"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Return to Shop
                  </Link>
                  <Link
                    to="/client-portal"
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            ) : isCompleted ? (
              <div className="space-y-6">
                {/* Success Card Header */}
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Payment Successful!</h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Your automated payment was processed and verified successfully. Your services, course access, and digital downloads are unlocked.
                  </p>
                </div>

                {/* Transaction Data Table */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Gateway Provider</span>
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      UddoktaPay Hosted
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Payment Method</span>
                    <span className="font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full text-[11px]">
                      {result?.payment_method || 'bKash / Automated MFS'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Amount Settled</span>
                    <span className="text-base font-black text-emerald-700">
                      BDT {Number(result?.amount || paramAmount || 1500).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">UddoktaPay Session / Invoice ID</span>
                    <span className="font-mono text-[11px] text-slate-700 font-semibold">{sessionId || invoiceId}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Bank / TrxID</span>
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                      <span>{result?.transaction_id || `TRX-${Date.now()}`}</span>
                      <button
                        onClick={() => handleCopy(result?.transaction_id)}
                        className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                        title="Copy Transaction ID"
                      >
                        {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/client-portal"
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/shop"
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>View Products &amp; Downloads</span>
                  </Link>
                </div>

                <div className="text-center pt-2">
                  <Link
                    to="/client-portal?tab=payments"
                    className="text-xs font-bold text-slate-600 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Client Payment History & Receipts</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Payment Pending or Incomplete</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {result?.message || 'The automated transaction has not been marked completed by the gateway. If you completed payment, please wait 30 seconds and refresh.'}
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-emerald-700 cursor-pointer"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Refresh Status</span>
                  </button>
                  <Link
                    to="/shop"
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Back to Shop
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
