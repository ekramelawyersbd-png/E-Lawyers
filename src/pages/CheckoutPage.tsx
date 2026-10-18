import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  ShoppingBag, 
  CheckCircle2, 
  FileCheck2, 
  Download, 
  Printer, 
  Sparkles, 
  ArrowLeft, 
  ExternalLink,
  Check,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { usePurchases } from '../contexts/PurchaseContext';
import { SHOP_PRODUCTS, ShopProduct } from '../data/shopProducts';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productSlug = searchParams.get('product') || searchParams.get('slug');
  
  const { items, subtotal, discount, total, clearCart } = useCart();
  const { purchaseProduct } = usePurchases();

  // Determine if purchasing a single product from URL or cart items
  const singleProduct = useMemo(() => {
    if (!productSlug) return null;
    return SHOP_PRODUCTS.find(p => p.slug === productSlug || p.id === productSlug) || null;
  }, [productSlug]);

  const checkoutItems = singleProduct 
    ? [{ product: singleProduct, quantity: 1 }] 
    : items;

  const orderSubtotal = singleProduct ? singleProduct.price : subtotal;
  const orderDiscount = singleProduct ? 0 : discount;
  const orderTotal = singleProduct ? singleProduct.price : total;

  const isFree = orderTotal === 0;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedBkash, setCopiedBkash] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState('');
  const [purchasedProducts, setPurchasedProducts] = useState<ShopProduct[]>([]);

  const handleCopyBkash = () => {
    navigator.clipboard.writeText('01744883636');
    setCopiedBkash(true);
    setTimeout(() => setCopiedBkash(false), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      alert('Please complete your full name, email address, and phone number.');
      return;
    }

    if (!isFree && !trxId.trim()) {
      alert('Please enter your bKash Transaction ID (TrxID) to confirm your payment.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderNum = `ACC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrderNumber(orderNum);
      const prods = checkoutItems.map(i => i.product);
      setPurchasedProducts(prods);
      const methodLabel = isFree ? 'Free Access (BDT 0)' : 'bKash Personal';
      prods.forEach(p => purchaseProduct(p.id, p.title, p.price, methodLabel, 'completed'));
      setIsSubmitting(false);
      setIsOrderComplete(true);
      if (!singleProduct) {
        clearCart();
      }
    }, 1200);
  };

  const handleDownloadSimulatedFile = (product: ShopProduct) => {
    const content = `========================================================
ACCOUNTICCA & E-LAWYERS LEGAL & TAX DIGITAL REPOSITORY
========================================================
Product Title: ${product.title}
Product ID: ${product.id}
Format: ${product.format}
Governing Law: ${product.governingLaw || 'Bangladesh Jurisdictional Law'}
Authorized Licensee: ${fullName || 'Registered Purchaser'}
Order Number: ${completedOrderNumber}
Date of Delivery: ${new Date().toLocaleDateString('en-GB')}

--- OVERVIEW & INSTRUCTIONS ---
${product.fullDescription}

--- WHAT IS INCLUDED ---
${product.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

--- SAMPLE TEXT PREVIEW ---
${product.samplePreviewSnippet || 'Full verified statutory template.'}

For consultation or document customization:
Hotline: +88 01335230170 | support@accounticca.com
Contact & Advisory: https://blog.accounticca.com/contact
========================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.slug}-${completedOrderNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SEO 
        title="Checkout & Digital Procurement | Accounticca" 
        description="Complete your order for statutory tax calculators, legal contract templates, and corporate compliance toolkits." 
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Shop', path: '/shop' }, { label: 'Checkout & Procurement' }]} />

        {/* Top Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {isOrderComplete ? 'Order Procurement Complete' : 'Digital Checkout & Procurement Page'}
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {isOrderComplete 
                  ? `Order #${completedOrderNumber} verified. Assets ready for instant download.` 
                  : 'Separate dedicated page for order processing, option selection, and instant file dispatch.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalog</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3.5 py-2 rounded-xl border border-emerald-800 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* Body View */}
        {isOrderComplete ? (
          /* Success Screen */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">Checkout Successful &amp; Unlocked!</h3>
                  <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                    Your digital assets have been dispatched to <strong>{email}</strong> and unlocked for instant access in your portal profile.
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-emerald-950 font-black text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-all shrink-0"
              >
                <span>Go to My Purchases</span>
                <ExternalLink className="w-4 h-4 text-emerald-700" />
              </Link>
            </div>

            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check className="w-9 h-9 stroke-3" />
              </div>
              <h2 className="text-2xl font-black text-emerald-950">
                Payment Verified &amp; Kit Ready
              </h2>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
                Order Token: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300">{completedOrderNumber}</strong>
              </p>
            </div>

            {/* Downloads List */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-600" />
                <span>Your Purchased Downloads</span>
              </h3>

              <div className="space-y-3">
                {purchasedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-emerald-700 shrink-0">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-extrabold text-base text-slate-900">{p.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Format: {p.format} • {p.pagesOrFiles}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {p.brochureUrl && (
                        <a
                          href={p.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-xs"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Open Resource</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDownloadSimulatedFile(p)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all shadow-xs"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>Download Kit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <Link
                to="/shop"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-colors"
              >
                Return to Shop Catalog
              </Link>
            </div>
          </div>
        ) : checkoutItems.length === 0 ? (
          /* Empty Cart/No product selected */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xl space-y-4">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No Item Selected for Checkout</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Please select a digital legal kit or tax calculation model from our shop catalog to proceed.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <span>Browse Shop Products</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Contact & Payment (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Customer Details Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                  <span>Customer &amp; Delivery Details</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address (for Downloads) *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tanvir@company.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company / Organization Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Tech Ventures Ltd."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Instructions Box (HIDDEN if Total Due equals 0) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
                  <span>Payment Method &amp; Settlement</span>
                </h2>

                {!isFree ? (
                  <div className="space-y-4">
                    {/* bKash Header Badge */}
                    <div className="p-4 rounded-2xl border-2 border-pink-500 bg-pink-50/70 text-pink-950 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                          bK
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                            <span>bKash Personal Payment</span>
                            <span className="text-[10px] bg-pink-100 text-pink-800 font-extrabold px-2 py-0.5 rounded-full border border-pink-200">
                              Send Money
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">Direct Mobile Wallet Gateway</div>
                        </div>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    </div>

                    {/* Instruction Card */}
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-4">
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        To complete your payment via <strong>bKash Personal</strong>, please send the exact payment amount specified below to the provided bKash number.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Payment Amount
                          </span>
                          <div className="text-lg font-black text-slate-900">
                            BDT {orderTotal.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            bKash Personal Number
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-pink-700 text-lg font-black tracking-wide">
                              01744883636
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyBkash}
                              className="px-2.5 py-1 text-[11px] font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg transition-colors"
                            >
                              {copiedBkash ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 bg-pink-50/80 border border-pink-200 rounded-xl text-[11px] text-pink-950 leading-relaxed font-medium">
                        Please select the <strong>Send Money</strong> option and complete the transaction. After payment, enter your Transaction ID (TrxID) in the field below to confirm your payment.
                      </div>

                      <div className="pt-1 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          Transaction ID (TrxID): *
                        </label>
                        <input
                          type="text"
                          required
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="[Enter Your Transaction ID]"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                        />
                        <span className="text-[11px] text-slate-500 block">
                          Enter the 10-character TrxID received in your bKash confirmation SMS.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Payment method hidden when total due = 0 */
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-start gap-3.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-base text-emerald-900">Total Due: BDT 0 (Free Access)</h4>
                      <p className="text-emerald-800 mt-1 leading-relaxed">
                        Payment method is hidden because the total due amount equals <strong>BDT 0</strong>. No bKash payment or transaction ID is needed. Simply fill in your contact information and confirm your order below to unlock instant downloads.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Summary & Confirmation (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs text-slate-500 font-bold">{checkoutItems.length} items</span>
                </h2>

                {/* Items List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {checkoutItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 text-xs p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">{item.product.title}</div>
                        <div className="text-[10px] text-slate-500">Format: {item.product.format} • Qty: {item.quantity}</div>
                      </div>
                      <div className="font-black text-slate-900 shrink-0 text-sm">
                        BDT {(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal Amount:</span>
                    <span className="font-bold text-slate-900">BDT {orderSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {orderDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount Savings:</span>
                      <span>-BDT {orderDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total Due:</span>
                    <span className="text-lg text-emerald-700 font-black">
                      BDT {orderTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-2 space-y-4">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      I verify my contact details are correct and agree to the digital procurement terms &amp; conditions.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || !agreeTerms || checkoutItems.length === 0}
                    className="w-full py-4 px-5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Processing Order...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          {isFree 
                            ? 'Confirm Order • Free (BDT 0)' 
                            : `Confirm Order • BDT ${orderTotal.toLocaleString('en-IN')}`}
                        </span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
