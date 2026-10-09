import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  FileText, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Scale, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  ArrowRight, 
  ChevronRight,
  FileSpreadsheet,
  BookOpen,
  FileCode,
  Users,
  Award,
  HelpCircle,
  ExternalLink,
  Zap,
  Lock,
  Printer
} from 'lucide-react';
import { ServiceSEO } from '../components/SEO';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { useShopAuth } from '../contexts/ShopAuthContext';
import { CartDrawer } from '../components/shop/CartDrawer';
import { CheckoutModal } from '../components/shop/CheckoutModal';
import { ShopProduct, inferProductType } from '../data/shopProducts';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, getProductBySlug, loading, togglePublishStatus } = useProducts();
  const { addToCart, totalItemsCount, setIsCartOpen } = useCart();
  const { isAuthenticated } = useShopAuth();

  const product = slug ? getProductBySlug(slug) : undefined;
  const isDraft = product?.status === 'draft';

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [instantCheckoutProduct, setInstantCheckoutProduct] = useState<ShopProduct | null>(null);

  // Quantity state
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSnippetCopied, setIsSnippetCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'preview' | 'compliance'>('overview');

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setIsAdded(false);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    setInstantCheckoutProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopySnippet = () => {
    if (!product?.samplePreviewSnippet) return;
    navigator.clipboard.writeText(product.samplePreviewSnippet);
    setIsSnippetCopied(true);
    setTimeout(() => setIsSnippetCopied(false), 2000);
  };

  // If loading and product not yet found
  if (loading && !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Product Not Found</h1>
            <p className="text-slate-600 text-sm">
              We couldn't find the product <span className="font-mono font-bold text-slate-800">"{slug}"</span>. It may have been moved or updated in our digital catalog.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Digital Shop</span>
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-bold transition-colors"
            >
              Contact Legal Desk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If item is saved as draft and viewer is not logged in as authorized admin
  if (isDraft && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Product in Preparation (Draft)</h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              The product <strong className="text-slate-800 font-bold">"{product.title}"</strong> is currently unpublished and not visible to public customers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Live Products in Shop</span>
            </Link>
            <Link
              to={`/admin/login?redirect=${encodeURIComponent(`/shop/${product.slug}`)}`}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Related products (published only)
  const relatedProducts = products
    .filter(p => p.status !== 'draft' && p.id !== product.id && (p.category === product.category || p.rating >= 4.9))
    .slice(0, 3);

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-slate-50 min-h-screen">
      <ServiceSEO
        title={`${product.title} | Accounticca Digital Shop`}
        description={product.shortDescription}
        serviceType="Legal & Tax Digital Product"
        canonicalUrl={`/shop/${product.slug}`}
        keywords={[
          product.title,
          product.category,
          'Bangladesh Legal Document',
          'Accounticca Shop',
          product.governingLaw || 'Bangladesh Law'
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Digital Shop', url: '/shop' },
          { name: product.category, url: '/shop' },
          { name: product.title, url: `/shop/${product.slug}` }
        ]}
      />

      {/* Top Breadcrumbs & Back Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <nav className="flex items-center gap-2 text-slate-500 font-medium overflow-x-auto">
            <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to="/shop" className="hover:text-emerald-700 transition-colors">Digital Shop</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-600 font-semibold">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/admin/shop"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors text-xs"
            >
              <span>⚙️ Manage in Admin</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer text-xs"
              title="Share this product"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Products</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Draft Mode Notice Banner */}
      {isDraft && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Draft Preview: This product is currently unpublished and hidden from the public Shop catalog.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => togglePublishStatus(product.id)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Publish to Shop
              </button>
              <Link
                to="/admin/shop"
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-xs transition-colors"
              >
                Admin Desk
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Product Showcase Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT COLUMN: Visual Media, Badges, Excerpt Preview, File Specs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Product Image Container */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs relative">
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {/* Badges Overlays */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                  {product.badge && (
                    <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-slate-900/90 text-amber-300 backdrop-blur-xs shadow-md">
                      {product.badge}
                    </span>
                  )}
                  {(() => {
                    const pType = product.productType || inferProductType(product);
                    return (
                      <Link
                        to={`/shop?type=${encodeURIComponent(pType)}`}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider backdrop-blur-xs shadow-xs transition-transform hover:scale-105 ${
                          pType === 'Templates'
                            ? 'bg-emerald-600 text-white'
                            : pType === 'Legal Kits'
                            ? 'bg-indigo-600 text-white'
                            : pType === 'Consultation'
                            ? 'bg-purple-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                        title={`Browse all ${pType} in Shop`}
                      >
                        {pType}
                      </Link>
                    );
                  })()}
                  <Link
                    to={`/shop?category=${encodeURIComponent(product.category)}`}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs border border-white/60 hover:bg-white hover:text-emerald-700 transition-colors"
                    title={`Browse all ${product.category} in Shop`}
                  >
                    {product.category}
                  </Link>
                </div>

                {discountPercent > 0 && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white shadow-md">
                    SAVE {discountPercent}%
                  </span>
                )}

                {/* Bottom Delivery Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Instant Digital Download</span>
                  </div>
                  <span className="font-mono text-emerald-300 text-[11px] font-semibold">{product.pagesOrFiles}</span>
                </div>
              </div>

              {/* Format & Compatibility Strip */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">{product.format}</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">Unrestricted Use</span>
              </div>
            </div>

            {/* Document Preview Snippet Box */}
            {product.samplePreviewSnippet && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Document Excerpt Preview
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {isSnippetCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy sample</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 font-mono leading-relaxed max-h-36 overflow-y-auto">
                  "{product.samplePreviewSnippet}"
                </div>
                <p className="text-[11px] text-slate-400">
                  * Note: Complete document includes full preamble, definitions, operative clauses, execution blocks, and bilingual guidelines.
                </p>
              </div>
            )}

            {/* Technical Specifications Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Legal & Technical Specifications</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                {product.governingLaw && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Governing Law</span>
                    <span className="font-bold text-slate-900 text-right max-w-xs">{product.governingLaw}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">File Format</span>
                  <span className="font-bold text-slate-900 text-right">{product.format}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Document Scope</span>
                  <span className="font-bold text-slate-900 text-right">{product.pagesOrFiles}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Vetted Authority</span>
                  <span className="font-bold text-emerald-800 text-right max-w-xs">{product.authorOrVettedBy}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Fiscal Year Applicability</span>
                  <span className="font-bold text-emerald-700">FY 2026–2027 (Current)</span>
                </div>
              </div>
            </div>

            {/* Institutional Seal / Chamber Guarantee */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 border border-emerald-800/40 shadow-lg space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-300">Official Assurance</div>
                  <div className="text-sm font-extrabold text-white">Chamber-Certified Legal Standards</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every contract clause, tax calculation schedule, and corporate resolution has been verified by practicing Supreme Court Advocates and Chartered Accountants under Bangladesh jurisdiction.
              </p>
            </div>

          </div>


          {/* RIGHT COLUMN: Title, Pricing, Actions, Descriptions, Tabs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Header info */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
              
              {/* Category & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-900 text-amber-300">
                      ★ {product.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-slate-900">{product.rating}</span>
                  <span className="text-slate-500 font-medium">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Title & Short Description */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.title}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Pricing Box & Value Prop */}
              <div className="bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-2xl p-5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    One-Time Purchase • Lifetime License
                  </div>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950">
                      BDT {product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-base line-through text-slate-400 font-semibold">
                        BDT {product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Includes all taxes & future revision updates for AY 2026–27</span>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600">Qty:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-black text-sm transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 font-bold text-xs text-slate-900 min-w-8 text-center font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-black text-sm transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Call To Action Buttons: Add To Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`py-4 px-6 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 scale-[0.99]'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Buy Now Button (Instant Checkout) */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-sm font-black transition-all shadow-lg hover:shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now (Instant Checkout)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

              {/* Trust Assurances Pill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>bKash / Nagad / Bank</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Editable .docx / .xlsx</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Advocate Vetted</span>
                </div>
              </div>

            </div>


            {/* Detailed Content Tabs & Sections */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-5 py-3.5 text-xs font-black transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-emerald-600 text-emerald-800 bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Overview & Legal Context
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className={`px-5 py-3.5 text-xs font-black transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                    activeTab === 'features'
                      ? 'border-emerald-600 text-emerald-800 bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Included Features ({product.features.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('compliance')}
                  className={`px-5 py-3.5 text-xs font-black transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                    activeTab === 'compliance'
                      ? 'border-emerald-600 text-emerald-800 bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Compliance & Stamp Duty
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="p-6 sm:p-8">
                
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 mb-3">
                        About This Legal & Business Toolkit
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {product.fullDescription}
                      </p>
                    </div>

                    <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900">
                        <Award className="w-4 h-4 text-emerald-700" />
                        <span>Author & Review Panel</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        Authored and vetted by <strong>{product.authorOrVettedBy}</strong> in collaboration with Accounticca Senior Advisory and E-Lawyers Chambers.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Who is this product designed for?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                        <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Startup Founders & Co-Founders in Bangladesh</span>
                        </div>
                        <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Corporate CFOs, Accountants & Tax Planners</span>
                        </div>
                        <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Company Secretaries & In-House Legal Officers</span>
                        </div>
                        <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Freelancers, Consultancies & SME Business Owners</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-extrabold text-slate-900 mb-2">
                      Comprehensive Document Inclusions
                    </h2>
                    <div className="space-y-2.5">
                      {product.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">
                            {idx + 1}
                          </div>
                          <span className="text-xs font-semibold text-slate-800 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'compliance' && (
                  <div className="space-y-5 text-xs text-slate-600 leading-relaxed">
                    <h2 className="text-base font-extrabold text-slate-900">
                      Bangladesh Jurisdiction & Execution Guidance
                    </h2>
                    
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-emerald-600" />
                        <span>Stamp Duty & Execution</span>
                      </h3>
                      <p>
                        Agreements executed in Bangladesh are subject to the Stamp Act, 1899. For agreements (NDAs, Service Agreements, Leases), execution on non-judicial stamp paper of appropriate denomination (typically BDT 300 or as prescribed by latest Finance Act) makes them admissible evidence in a court of law.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Arbitration & Dispute Resolution</span>
                      </h3>
                      <p>
                        All draft dispute clauses provide for amicable negotiation followed by institutional arbitration in Dhaka under the Arbitration Act, 2001, saving significant legal expenditure and delays.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                      <div className="font-extrabold flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-700" />
                        <span>Need Custom Tailoring or Negotiation Assistance?</span>
                      </div>
                      <p className="text-[11px]">
                        If your contract involves foreign entities, cross-border remittance, or high-value investment, book a 1-on-1 consultation session with our Supreme Court counsel.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Need Customization Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Custom Legal Assistance
                </div>
                <div className="text-base font-extrabold text-white">
                  Need custom clauses or specific revisions?
                </div>
                <p className="text-xs text-slate-400 max-w-md">
                  Our chamber can review your counterpart's comments, adapt covenants, or draft bespoke agreements.
                </p>
              </div>

              <Link
                to="/contact"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-colors whitespace-nowrap inline-flex items-center gap-2 shrink-0"
              >
                <span>Consult An Advocate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>


        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Recommended Add-Ons</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Related Compliance Kits & Toolkits
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-16/9 bg-slate-100 overflow-hidden relative">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-slate-800">
                      {rel.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-extrabold text-slate-900">{rel.rating}</span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {rel.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-black text-base text-slate-900">
                        BDT {rel.price.toLocaleString('en-IN')}
                      </span>
                      <Link
                        to={`/shop/${rel.slug}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Floating Cart Trigger Button (When Cart Has Items) */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200 border border-emerald-500/40 cursor-pointer"
            title="Open Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            </div>
            <div className="text-left font-black text-xs">
              <div>View Cart</div>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        onCheckout={() => {
          setInstantCheckoutProduct(null);
          setIsCheckoutOpen(true);
        }} 
      />

      {/* Instant Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setInstantCheckoutProduct(null);
        }}
        singleProduct={instantCheckoutProduct}
      />

    </div>
  );
}

export default ProductDetail;
