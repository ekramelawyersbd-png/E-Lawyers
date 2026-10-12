import React, { useState } from 'react';
import { Lock, ShieldCheck, ShoppingCart, CheckCircle2, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { ShopProduct } from '../../data/shopProducts';
import { usePurchases } from '../../contexts/PurchaseContext';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

interface RequirePurchaseProps {
  product: ShopProduct;
  children: React.ReactNode;
  toolTitle?: string;
}

export const RequirePurchase: React.FC<RequirePurchaseProps> = ({ product, children, toolTitle }) => {
  const { isPurchased, simulateInstantPurchase } = usePurchases();
  const { addToCart } = useCart();
  const [justUnlocked, setJustUnlocked] = useState(false);

  const unlocked = isPurchased(product.id) || justUnlocked;

  if (unlocked) {
    return <>{children}</>;
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleTestUnlock = () => {
    simulateInstantPurchase(product);
    setJustUnlocked(true);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-blue-50/60 p-8 shadow-xl">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-4 shadow-sm border border-amber-200">
          <Lock className="w-3.5 h-3.5 text-amber-600" />
          Shop-Protected Professional Tool & Resource
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {toolTitle || product.title}
        </h3>

        <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
          {product.shortDescription}
        </p>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200/80 text-left mb-8 max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Access Fee</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-950">৳{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
                )}
                <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">One-time Access</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Format: {product.format}</span>
              <span className="text-xs font-medium text-blue-600 flex items-center gap-1 justify-end mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified by E-Lawyers
              </span>
            </div>
          </div>

          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">What's Included:</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {product.features.slice(0, 4).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Shop Cart (৳{product.price.toLocaleString()})
          </button>

          <Link
            to={`/shop/${product.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition-all"
          >
            View Shop Details <ExternalLink className="w-4 h-4 text-slate-400" />
          </Link>

          <button
            onClick={handleTestUnlock}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium text-xs transition-all border border-amber-300"
            title="Simulate successful payment for immediate demo testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Quick Demo Unlock (Test)
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-4">
          Need custom corporate licensing or assistance? Contact our support desk at <span className="font-semibold text-slate-700">support@elawyersbd.com</span>
        </p>
      </div>
    </div>
  );
};
