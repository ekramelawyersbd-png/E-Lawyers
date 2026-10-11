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
  Share2, 
  Copy, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  Award, 
  HelpCircle, 
  Zap, 
  Lock
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

  // Quantity state & user feedback
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSnippetCopied, setIsSnippetCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'compliance'>('overview');

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
      <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-semibold text-sm">Loading verified product details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 sm:p-10 text-center border border-slate-200 shadow-xs space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Not Found</h1>
            <p className="text-slate-600 text-sm">
              We couldn't find the product <span className="font-mono font-bold text-slate-800">"{slug}"</span>. It may have been archived or updated in our compliance repository.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Digital Shop</span>
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
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
      <div className="min-h-screen bg-[#F6F8FB] py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 sm:p-10 text-center border border-slate-200 shadow-xs space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product in Preparation (Draft)</h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              The product <strong className="text-slate-800 font-semibold">"{product.title}"</strong> is currently unpublished and not visible to public customers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Live Products</span>
            </Link>
            <Link
              to={`/admin/login?redirect=${encodeURIComponent(`/shop/${product.slug}`)}`}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
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

  const productType = product.productType || inferProductType(product);

  return (
    <div className="bg-[#F6F8FB] min-h-screen text-slate-800 antialiased">
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

      {/* Top Clean Breadcrumbs & Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <nav className="flex items-center gap-2 text-slate-500 font-medium overflow-x-auto">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to="/shop" className="hover:text-slate-900 transition-colors">Digital Shop</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link 
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="hover:text-emerald-700 transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-xs">{product.title}</span>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Show admin desk button strictly for authenticated users */}
            {isAuthenticated && (
              <Link
                to="/admin/shop"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors text-xs"
              >
                <span>⚙️ Manage in Admin</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors cursor-pointer text-xs"
              title="Share this product link"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied!</span>
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
              className="inline-flex items-center gap-1 px-3 py-1.5 text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Products</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Admin Draft Mode Notice Banner */}
      {isDraft && isAuthenticated && (
        <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-4">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Draft Preview: This product is currently hidden from the public Shop catalog.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => togglePublishStatus(product.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Publish Live
              </button>
              <Link
                to="/admin/shop"
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded-lg text-xs transition-colors"
              >
                Admin Desk
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container: 1200-1280px Max Width with Balanced 2-Column Grid */}
      <main 
        className="max-w-[1280px] mx-auto" 
        style={{ paddingLeft: '7px', paddingRight: '7px', paddingTop: '7px', paddingBottom: '7px' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* LEFT COLUMN: Visual Media (40% width on Desktop = 5 cols), Specs, Excerpt, Guarantee */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 1. Product Image & Preview Container */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {/* Refined single corner badge overlay */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <Link
                    to={`/shop?type=${encodeURIComponent(productType)}`}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-xs shadow-sm hover:bg-slate-900 transition-colors"
                  >
                    {productType}
                  </Link>
                  {discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Subtle updated mark top-right */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/95 text-slate-700 backdrop-blur-xs border border-slate-200 shadow-xs">
                    Updated 2026
                  </span>
                </div>

                {/* Clean Bottom Digital Download Strip */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant Digital Download</span>
                  </div>
                  <span className="font-mono text-emerald-300 text-[11px] font-medium">{product.pagesOrFiles}</span>
                </div>
              </div>

              {/* Format & License Meta Row */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{product.format}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Commercial License</span>
              </div>
            </div>

            {/* 2. Technical Specifications (Clean 2-Column Rows with Fixed Alignment) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Technical & Legal Specifications</span>
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                {product.governingLaw && (
                  <div className="py-2.5 flex items-start justify-between gap-4">
                    <span className="text-slate-500 font-medium w-36 shrink-0">Governing Law</span>
                    <span className="font-semibold text-slate-900 text-right">{product.governingLaw}</span>
                  </div>
                )}
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium w-36 shrink-0">File Format</span>
                  <span className="font-semibold text-slate-900 text-right">{product.format}</span>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium w-36 shrink-0">Document Scope</span>
                  <span className="font-semibold text-slate-900 text-right">{product.pagesOrFiles}</span>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium w-36 shrink-0">Verified Authority</span>
                  <span className="font-semibold text-emerald-800 text-right">{product.authorOrVettedBy}</span>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium w-36 shrink-0">Fiscal Year</span>
                  <span className="font-semibold text-slate-900 text-right">FY 2026–2027 (Statutory)</span>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium w-36 shrink-0">Delivery Method</span>
                  <span className="font-semibold text-slate-900 text-right">Immediate Email + Screen Link</span>
                </div>
              </div>
            </div>

            {/* 3. Document Excerpt Preview */}
            {product.samplePreviewSnippet && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Document Excerpt
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isSnippetCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Sample</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed max-h-40 overflow-y-auto">
                  "{product.samplePreviewSnippet}"
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  * Complete download includes editable clauses, definitions, execution schedules, and practitioner guidelines.
                </p>
              </div>
            )}

            {/* 4. Trust & Assurance Card (High contrast Navy-Teal institutional card) */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Institutional Assurance</div>
                  <div className="text-sm font-bold text-white">Chamber-Certified Legal Standards</div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every contract clause, tax calculation schedule, and corporate resolution has been vetted by practicing Supreme Court Advocates and Chartered Accountants under Bangladesh statutory jurisdiction.
              </p>
              <div className="pt-1 flex items-center gap-4 text-[11px] text-slate-400 font-medium border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Applicable FY 2026–27</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Non-Judicial Stamp Ready</span>
                </span>
              </div>
            </div>

          </div>


          {/* RIGHT COLUMN: Product Hero, Clear Pricing Block, Unified CTA, Content Tabs (60% width = 7 cols) */}
          <div className="lg:col-span-7 space-y-5">

            {/* 1. Primary Product Information & Purchase Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              
              {/* Category, Type & Rating Line */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Link
                    to={`/shop?category=${encodeURIComponent(product.category)}`}
                    className="text-emerald-700 hover:text-emerald-800 font-bold uppercase tracking-wider text-[11px]"
                  >
                    {product.category}
                  </Link>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">{productType}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">Updated 2026</span>
                </div>

                {/* Rating display */}
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900">{product.rating}</span>
                  <span className="text-slate-500 font-medium">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Product Title & Description */}
              <div className="space-y-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                  {product.title}
                </h1>
                <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {/* Unified Pricing Block */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Price · Commercial License · Lifetime Access
                  </div>
                  <div className="flex items-baseline gap-3 mt-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      BDT {product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-base line-through text-slate-400 font-medium">
                        BDT {product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Save {discountPercent}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Includes all revisions and updates for AY 2026–27</span>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-2.5 sm:self-center">
                  <span className="text-xs font-semibold text-slate-600">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-sm transition-colors cursor-pointer"
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-9 text-center font-bold text-xs text-slate-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-sm transition-colors cursor-pointer"
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Purchase Actions: Primary Buy Now (Emerald) & Secondary Add to Cart (Clean Navy Border) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                {/* Primary CTA: Buy Now */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now (Instant Checkout)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary CTA: Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`h-12 px-6 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    isAdded
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 shadow-2xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-slate-700" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

              </div>

              {/* Trust Assurances Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
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


            {/* 2. Detailed Content Tabs (Overview, Features, Compliance) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              
              {/* Tab Navigation with consistent Emerald underline */}
              <div className="flex border-b border-slate-200 bg-slate-50/60 overflow-x-auto scrollbar-none px-2 sm:px-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-emerald-600 text-emerald-800 bg-white -mb-px'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Overview & Legal Context
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className={`px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                    activeTab === 'features'
                      ? 'border-emerald-600 text-emerald-800 bg-white -mb-px'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Features ({product.features.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('compliance')}
                  className={`px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                    activeTab === 'compliance'
                      ? 'border-emerald-600 text-emerald-800 bg-white -mb-px'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Compliance & Stamp Duty
                </button>
              </div>

              {/* Tab Content Panels with comfortable spacing and readable line-height */}
              <div className="p-6 sm:p-8">
                
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2.5">
                        About This Legal & Business Toolkit
                      </h2>
                      <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed whitespace-pre-line">
                        {product.fullDescription}
                      </p>
                    </div>

                    {/* Author & Review Panel Card */}
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Author & Review Panel</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Authored and vetted by <strong className="text-slate-900">{product.authorOrVettedBy}</strong> in collaboration with Accounticca Senior Advisory and E-Lawyers Chambers.
                      </p>
                    </div>

                    {/* Who Is This Product Designed For? */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Who is this product designed for?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                        <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Startup Founders & Co-Founders in Bangladesh</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Corporate CFOs, Accountants & Tax Planners</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Company Secretaries & In-House Legal Officers</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Freelancers, Consultancies & SME Business Owners</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-4">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                      Included Document Features
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                      Every element is pre-drafted and verified for immediate execution.
                    </p>
                    <div className="space-y-2.5">
                      {product.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                            {idx + 1}
                          </div>
                          <span className="text-xs font-medium text-slate-800 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'compliance' && (
                  <div className="space-y-5 text-xs text-slate-600 leading-relaxed">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Bangladesh Jurisdiction & Execution Guidance
                    </h2>
                    
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-emerald-600" />
                        <span>Stamp Duty & Execution Under Bangladesh Law</span>
                      </h3>
                      <p>
                        Agreements executed in Bangladesh are subject to the Stamp Act, 1899. For agreements (NDAs, Service Agreements, Leases), execution on non-judicial stamp paper of appropriate denomination (typically BDT 300 or as prescribed by latest Finance Act) makes them admissible evidence in a court of law.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Arbitration & Dispute Resolution</span>
                      </h3>
                      <p>
                        All draft dispute clauses provide for amicable negotiation followed by institutional arbitration in Dhaka under the Arbitration Act, 2001, saving significant legal expenditure and delays.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-700" />
                        <span>Need Custom Tailoring or Negotiation Assistance?</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        If your contract involves foreign entities, cross-border remittance, or high-value investment, book a 1-on-1 consultation session with our Supreme Court counsel.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* 3. Need Customization Chamber Banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Custom Legal Assistance
                </div>
                <div className="text-base font-bold text-white">
                  Need custom clauses or negotiation assistance?
                </div>
                <p className="text-xs text-slate-400 max-w-md">
                  Our chamber can review your counterpart's comments, adapt covenants, or draft bespoke agreements.
                </p>
              </div>

              <Link
                to="/contact"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap inline-flex items-center gap-2 shrink-0"
              >
                <span>Consult An Advocate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>


        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Recommended Add-Ons</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Related Compliance Kits & Toolkits
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 hover:underline"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-16/9 bg-slate-100 overflow-hidden relative">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-white">
                      {rel.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-1 text-amber-600 text-xs mb-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-900">{rel.rating}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {rel.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-base text-slate-900">
                        BDT {rel.price.toLocaleString('en-IN')}
                      </span>
                      <Link
                        to={`/shop/${rel.slug}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
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
            className="flex items-center gap-2.5 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-lg hover:scale-105 transition-all duration-200 border border-emerald-500/40 cursor-pointer"
            title="Open Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            </div>
            <div className="text-left font-bold text-xs">
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
