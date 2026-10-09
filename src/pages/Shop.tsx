import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  FileText, 
  Download, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  Building2, 
  Calculator, 
  GraduationCap, 
  Clock, 
  Tag, 
  Eye, 
  Check, 
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lock,
  LogOut
} from 'lucide-react';
import { ServiceSEO } from '../components/SEO';
import { SHOP_CATEGORIES, ShopProduct, ShopCategory } from '../data/shopProducts';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { useShopAuth } from '../contexts/ShopAuthContext';
import { CartDrawer } from '../components/shop/CartDrawer';
import { CheckoutModal } from '../components/shop/CheckoutModal';

export function Shop() {
  const { products, loading } = useProducts();
  const { addToCart, totalItemsCount, setIsCartOpen } = useCart();
  const { adminUser, isAuthenticated, logout } = useShopAuth();

  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'bestselling' | 'price_low' | 'price_high' | 'rating'>('bestselling');
  
  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [instantCheckoutProduct, setInstantCheckoutProduct] = useState<ShopProduct | null>(null);

  // Draft vs Published stats
  const publishedCount = useMemo(() => products.filter(p => p.status !== 'draft').length, [products]);
  const draftsCount = useMemo(() => products.filter(p => p.status === 'draft').length, [products]);

  // Added-to-cart animation feedback map
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // FAQ accordion open/close state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleAddToCart = (e: React.MouseEvent, product: ShopProduct) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleInstantBuy = (e: React.MouseEvent, product: ShopProduct) => {
    e.stopPropagation();
    setInstantCheckoutProduct(product);
    setIsCheckoutOpen(true);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    // Only items with Published status should be displayed on the public Shop Page
    let prods = products.filter(p => p.status !== 'draft');

    if (selectedCategory !== 'All Products') {
      prods = prods.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      prods = prods.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.features.some(f => f.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'bestselling') {
      prods.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'price_low') {
      prods.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      prods.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      prods.sort((a, b) => b.rating - a.rating);
    }

    return prods;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const faqs = [
    {
      q: 'How do I receive my purchased digital templates?',
      a: 'Immediately upon completing payment confirmation, you will receive instant on-screen download links for Microsoft Word (.docx), Excel (.xlsx), and PDF files. An automated confirmation email with permanent download links and your transaction token is dispatched simultaneously.'
    },
    {
      q: 'Can I edit and customize the legal agreements for my company?',
      a: 'Yes, 100%. All contracts and deeds are delivered in fully editable Microsoft Word (.docx) format with highlighted placeholder fields (e.g. [Company Name], [Party Details], [Consideration Amount]). You can modify, adapt, and print on appropriate non-judicial stamp paper.'
    },
    {
      q: 'Are these contracts and tax toolkits updated for FY 2026–27?',
      a: 'Yes. All tax calculators, TDS matrices, and investment rebate sheets incorporate the latest rules under the Income Tax Act 2023 and Bangladesh Finance Act 2026. Every template is vetted by Supreme Court of Bangladesh Advocates and Chartered Accountants.'
    },
    {
      q: 'How does the 1-on-1 Legal & Corporate Advisory Session work?',
      a: 'After purchasing an advisory package, our legal case manager connects via WhatsApp/Email within 2 business hours to schedule your private 30 or 45-minute video conference with Adv. Ekram Hossain or senior corporate tax counsel, along with document review.'
    },
    {
      q: 'What payment methods are supported in Bangladesh?',
      a: 'We accept bKash, Nagad, Rocket, Direct Bank Transfer (BEFTN/NPSB to City Bank PLC), and major debit/credit cards (Visa, MasterCard, Amex).'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <ServiceSEO
        title="Legal & Tax Templates Shop | Accounticca & E-Lawyers"
        description="Download ready-to-use business contracts, NDA agreements, income tax calculation workbooks (AY 2026-27), VAT spreadsheets, and RJSC packs for Bangladesh."
        serviceType="Legal & Tax Digital Products Store"
        canonicalUrl="/shop"
        keywords={[
          'Accounticca Shop',
          'Legal Templates Bangladesh',
          'NDA Agreement Bangladesh Word',
          'Income Tax Return Excel Sheet AY 2026-27',
          'TDS VDS Calculator Bangladesh',
          'Company Incorporation RJSC Kit',
          'Employment Contract Bangladesh Labour Act'
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Digital Shop', url: '/shop' }
        ]}
      />

      {/* Admin Session Security Bar (Visible only when authorized admin is logged in) */}
      {isAuthenticated && adminUser && (
        <div className="bg-slate-900 border-b border-slate-800 text-white text-xs py-2.5 px-4 sm:px-6 lg:px-8 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-emerald-400">Admin Session Active:</span>
              <span className="text-slate-300 font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {adminUser?.email || 'admin@admin.com'}
              </span>
              <span className="hidden md:inline text-[11px] text-slate-400">
                ({publishedCount} Published Live • {draftsCount} Drafts Hidden)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Link
                to="/admin/shop"
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>⚙️ Admin Catalog Desk</span>
                {draftsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black rounded-full text-[10px]">
                    {draftsCount} Drafts
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-1 border border-slate-700 cursor-pointer"
                title="Sign out of admin session"
              >
                <LogOut className="w-3 h-3 text-slate-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-100/70 text-slate-900 pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 relative overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-300 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official Digital Repository • Accounticca × E-Lawyers</span>
              </div>
              <Link
                to="/admin/shop"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
                title="Open Shop Product Admin Desk"
              >
                <span>⚙️ Manage Products (Admin)</span>
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Legal, Tax & Corporate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">Compliance Store</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Practitioner-drafted legal agreements, automated NBR tax & VAT workbooks, corporate secretarial toolkits, and on-demand legal advisory sessions.
            </p>

            {/* Search Input Box */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search NDA, Income Tax Excel, Employment Agreement, RJSC Kit..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 focus:bg-white rounded-2xl border border-slate-300 focus:border-emerald-500 text-sm font-semibold placeholder-slate-400 focus:placeholder-slate-500 focus:outline-none transition-all shadow-md"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Trust Points Pill Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Supreme Court Advocate Vetted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>FY 2026–27 Statutory Compliance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Instant Word, Excel & PDF Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Category Filter & Sorting Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SHOP_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              <option value="bestselling">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-6">
          <span>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
            {selectedCategory !== 'All Products' && ` in ${selectedCategory}`}
          </span>
          {searchQuery && (
            <span>
              Search query: <em>"{searchQuery}"</em>
            </span>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No products match your search</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try searching with different terms like "NDA", "Tax", "RJSC", or reset your category filters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All Products');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = !!addedIds[product.id];
              const discountPercent = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Image & Badges (Clickable to /shop/:slug) */}
                  <Link to={`/shop/${product.slug}`} className="relative aspect-16/10 bg-slate-100 overflow-hidden block">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-amber-300 backdrop-blur-xs shadow-xs">
                          {product.badge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs border border-white/40">
                        {product.category}
                      </span>
                    </div>

                    {discountPercent > 0 && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                        -{discountPercent}%
                      </span>
                    )}

                    {/* Format pill overlay */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                      <span className="font-semibold truncate">{product.format}</span>
                      <span className="font-mono text-emerald-300 shrink-0">{product.pagesOrFiles}</span>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Rating & Review */}
                      <div className="flex items-center gap-1.5 text-amber-500 text-xs mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-extrabold text-slate-900">{product.rating}</span>
                        <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
                      </div>

                      <Link to={`/shop/${product.slug}`}>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Pricing Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">One-Time Fee</div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-slate-900">
                            BDT {product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs line-through text-slate-400 font-medium">
                              BDT {product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/shop/${product.slug}`}
                        className="text-xs text-slate-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1 p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="View Full Product Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Preview</span>
                      </Link>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleInstantBuy(e, product)}
                      className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Buy Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* Corporate Advisory & Custom Drafting Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/10">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Custom Legal Drafting & Consultation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Need a Bespoke Agreement or Complex Corporate Structuring?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Our team of Supreme Court of Bangladesh advocates, chartered accountants, and RJSC consultants draft customized joint-venture deeds, cross-border M&A contracts, shareholder covenants, and corporate tax advisory memos.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center"
              >
                <span>Book Legal Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+8801335230170"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors border border-white/10 text-center"
              >
                <span>Call Helpline: +88 01335 230170</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Answers regarding instant file delivery, document editing, and payment verification.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

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

      {/* Cart Drawer Component */}
      <CartDrawer 
        onCheckout={() => {
          setInstantCheckoutProduct(null);
          setIsCheckoutOpen(true);
        }} 
      />

      {/* Checkout Modal */}
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

export default Shop;
