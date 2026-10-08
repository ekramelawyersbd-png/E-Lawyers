import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  ShoppingBag, 
  FileDown, 
  Download, 
  CreditCard, 
  Building2, 
  Smartphone, 
  ArrowRight, 
  ExternalLink, 
  Printer, 
  Lock,
  Sparkles,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { ShopProduct } from '../../data/shopProducts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  singleProduct?: ShopProduct | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  singleProduct
}) => {
  const { items, subtotal, discount, total, clearCart } = useCart();

  // If singleProduct is passed from instant checkout, use it; otherwise use cart items
  const checkoutItems = singleProduct 
    ? [{ product: singleProduct, quantity: 1 }] 
    : items;

  const orderSubtotal = singleProduct ? singleProduct.price : subtotal;
  const orderDiscount = singleProduct ? 0 : discount;
  const orderTotal = singleProduct ? singleProduct.price : total;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'bank' | 'card'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState('');
  const [purchasedProducts, setPurchasedProducts] = useState<ShopProduct[]>([]);

  if (!isOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      alert('Please complete your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    // Simulate order placement
    setTimeout(() => {
      const orderNum = `ACC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrderNumber(orderNum);
      setPurchasedProducts(checkoutItems.map(i => i.product));
      setIsSubmitting(false);
      setIsOrderComplete(true);
      if (!singleProduct) {
        clearCart();
      }
    }, 1200);
  };

  const handleDownloadSimulatedFile = (product: ShopProduct) => {
    // Generate a simple simulated text/markdown file for the download
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-slate-200">
          
          {/* Close button */}
          {!isOrderComplete && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-white">
                  {isOrderComplete ? 'Order Completed & Verified' : 'Secure Checkout & Delivery'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {isOrderComplete 
                    ? `Thank you for your purchase! Order #${completedOrderNumber}` 
                    : 'Accounticca × E-Lawyers Digital Procurement Gateway'}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
              <Lock className="w-3.5 h-3.5" />
              <span>256-bit Encrypted</span>
            </div>
          </div>

          {/* Body */}
          {isOrderComplete ? (
            /* Order Success View */
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-8 h-8 stroke-3" />
                </div>
                <h4 className="text-xl font-black text-emerald-950">
                  Payment Verified & Files Ready
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Your purchase of <strong>{purchasedProducts.length} legal/tax {purchasedProducts.length === 1 ? 'item' : 'items'}</strong> is confirmed. A receipt and lifetime access token has been dispatched to <strong>{email}</strong>.
                </p>
                <div className="inline-block bg-white px-3.5 py-1.5 rounded-xl border border-emerald-300 text-xs font-mono font-bold text-emerald-900">
                  Token: {completedOrderNumber}
                </div>
              </div>

              {/* Instant Download Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Your Digital Downloads</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">Click to download immediately</span>
                </div>

                <div className="space-y-2.5">
                  {purchasedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-emerald-700 shrink-0">
                          <FileCheck2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{p.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Format: {p.format} • {p.pagesOrFiles}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadSimulatedFile(p)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Kit</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advisory note if consultation included */}
              {purchasedProducts.some(p => p.category === 'Expert Advisory') && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-900 flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Advisory Consultation Booking:</span>
                    Our legal coordinator will connect via WhatsApp/Phone at <strong>{phone}</strong> within 2 hours to confirm your video appointment schedule with our Supreme Court advocate.
                  </div>
                </div>
              )}

              {/* Close / Return Button */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Return to Shop
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left: Customer Info & Payment (7 cols) */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                      <span>Customer & Delivery Details</span>
                    </h4>

                    <div className="space-y-3">
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
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Company / Business Name <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Apex Tech Ventures Ltd."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                      <span>Payment Method (Bangladesh)</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bkash')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'bkash'
                            ? 'border-pink-500 bg-pink-50/50 text-pink-900 ring-2 ring-pink-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-pink-500 flex items-center justify-center text-[9px] font-bold">
                          {paymentMethod === 'bkash' && '✓'}
                        </span>
                        <div>
                          <div className="text-xs font-bold">bKash</div>
                          <div className="text-[10px] text-slate-500">Merchant / Personal</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('nagad')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'nagad'
                            ? 'border-orange-500 bg-orange-50/50 text-orange-900 ring-2 ring-orange-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-orange-500 flex items-center justify-center text-[9px] font-bold">
                          {paymentMethod === 'nagad' && '✓'}
                        </span>
                        <div>
                          <div className="text-xs font-bold">Nagad</div>
                          <div className="text-[10px] text-slate-500">Fast Mobile Pay</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'bank'
                            ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-indigo-500 flex items-center justify-center text-[9px] font-bold">
                          {paymentMethod === 'bank' && '✓'}
                        </span>
                        <div>
                          <div className="text-xs font-bold">Bank Transfer</div>
                          <div className="text-[10px] text-slate-500">BEFTN / NPSB</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          paymentMethod === 'card'
                            ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-emerald-500 flex items-center justify-center text-[9px] font-bold">
                          {paymentMethod === 'card' && '✓'}
                        </span>
                        <div>
                          <div className="text-xs font-bold">Card / Gateway</div>
                          <div className="text-[10px] text-slate-500">Visa, Master, Amex</div>
                        </div>
                      </button>
                    </div>

                    {/* Payment Instruction details */}
                    <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                      {paymentMethod === 'bkash' && (
                        <div>
                          <div className="font-bold text-slate-800">
                            bKash Payment Number: <span className="font-mono text-pink-700 text-sm font-extrabold">+880 1335 230170</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1">
                            Send BDT <strong>{orderTotal.toLocaleString('en-IN')}</strong> to the bKash number above with reference "Shop", then enter the Transaction ID below:
                          </p>
                        </div>
                      )}

                      {paymentMethod === 'nagad' && (
                        <div>
                          <div className="font-bold text-slate-800">
                            Nagad Account: <span className="font-mono text-orange-700 text-sm font-extrabold">+880 1335 230170</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1">
                            Send BDT <strong>{orderTotal.toLocaleString('en-IN')}</strong> via Nagad Cash Out / Send Money, then input the TrxID below:
                          </p>
                        </div>
                      )}

                      {paymentMethod === 'bank' && (
                        <div>
                          <div className="font-bold text-slate-800">Accounticca Corporate Bank Account:</div>
                          <div className="text-[11px] text-slate-600 space-y-0.5 mt-1 font-mono">
                            <div>Bank: City Bank PLC (Principal Branch, Dhaka)</div>
                            <div>A/C Name: Accounticca Consultancy</div>
                            <div>A/C No: 1102948572001 | Routing: 225272635</div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div>
                          <div className="font-bold text-slate-800">Card & Instant Gateway:</div>
                          <p className="text-[11px] text-slate-600 mt-1">
                            Processed through secure SSLCommerz / AamarPay sandbox. Instant token generated automatically.
                          </p>
                        </div>
                      )}

                      {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'bank') && (
                        <div className="pt-1.5">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Transaction ID / Reference Number:
                          </label>
                          <input
                            type="text"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            placeholder="e.g. 9J4K2L8X1M"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Order Summary Box (5 cols) */}
                <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center justify-between">
                      <span>Order Summary</span>
                      <span className="text-[11px] text-slate-500 font-bold">{checkoutItems.length} items</span>
                    </h4>

                    {/* Items List */}
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {checkoutItems.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-2.5 text-xs">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 truncate">{item.product.title}</div>
                            <div className="text-[10px] text-slate-500">Qty: {item.quantity}</div>
                          </div>
                          <div className="font-black text-slate-900 shrink-0">
                            BDT {(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Breakdown */}
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-bold text-slate-900">BDT {orderSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      {orderDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Discount Applied:</span>
                          <span>-BDT {orderDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                        <span>Total Due:</span>
                        <span className="text-base text-emerald-700 font-black">
                          BDT {orderTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Submit Button */}
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>
                        I agree to the terms of digital procurement and verify my email address is accurate for file dispatch.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting || !agreeTerms || checkoutItems.length === 0}
                      className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Confirm Order • BDT {orderTotal.toLocaleString('en-IN')}</span>
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
    </div>
  );
};
