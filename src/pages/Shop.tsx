import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
  Scale, 
  Eye, 
  Check, 
  ChevronDown,
  ChevronUp,
  LogOut,
  Video,
  Package,
  BookOpen,
  Layers,
  X,
  RotateCcw,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Phone,
  BriefcaseBusiness,
  Award,
  ArrowUpDown,
  TrendingUp,
  ArrowDown,
  ArrowUp,
  Heart,
  GraduationCap
} from 'lucide-react';
import { ServiceSEO } from '../components/SEO';
import { 
  SHOP_CATEGORIES, 
  ShopProduct, 
  ShopCategory, 
  ProductType, 
  PRODUCT_TYPES, 
  inferProductType 
} from '../data/shopProducts';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { useShopAuth } from '../contexts/ShopAuthContext';
import { useBookmarks } from '../contexts/BookmarkContext';
import { ProductComparisonModal } from '../components/shop/ProductComparisonModal';
import { ProductComparisonDock } from '../components/shop/ProductComparisonDock';
import { AcademyCoursesShopBox } from '../components/shop/AcademyCoursesShopBox';

export type ShopSortOption = 'bestselling' | 'price_low' | 'price_high' | 'rating';

export interface SortOptionConfig {
  value: ShopSortOption;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SORT_OPTIONS: SortOptionConfig[] = [
  {
    value: 'bestselling',
    label: 'Popularity (Most Popular)',
    subtitle: 'Best selling & top vetted',
    icon: TrendingUp,
  },
  {
    value: 'price_low',
    label: 'Price: Low to High',
    subtitle: 'Affordable statutory starter toolkits',
    icon: ArrowDown,
  },
  {
    value: 'price_high',
    label: 'Price: High to Low',
    subtitle: 'Comprehensive executive suites',
    icon: ArrowUp,
  },
  {
    value: 'rating',
    label: 'Highest Customer Rating',
    subtitle: '5-star practitioner reviewed',
    icon: Star,
  },
];

export function Shop() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart, totalItemsCount, setIsCartOpen } = useCart();
  const { adminUser, isAuthenticated, logout } = useShopAuth();
  const { isBookmarked, toggleBookmark, savedIds } = useBookmarks();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial query params if present
  const paramType = searchParams.get('type') as ProductType | null;
  const paramCat = searchParams.get('category') as ShopCategory | null;
  const paramSort = searchParams.get('sort') as ShopSortOption | null;
  const paramSaved = searchParams.get('saved') === 'true';

  const [selectedType, setSelectedType] = useState<'All Types' | ProductType>(
    paramType && (PRODUCT_TYPES as readonly string[]).includes(paramType) ? paramType : 'All Types'
  );
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>(
    paramCat && (SHOP_CATEGORIES as readonly string[]).includes(paramCat) ? paramCat : 'All Products'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(paramSaved);
  const [sortBy, setSortBy] = useState<ShopSortOption>(
    paramSort && ['bestselling', 'price_low', 'price_high', 'rating'].includes(paramSort)
      ? paramSort
      : 'bestselling'
  );
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Set of live product IDs that are bookmarked
  const bookmarkedProductIds = useMemo(() => {
    const pIds = new Set(products.map((p) => p.id));
    return new Set(Array.from(savedIds || []).filter((id) => pIds.has(id)));
  }, [products, savedIds]);

  const handleToggleFavorite = async (e: React.MouseEvent, product: ShopProduct) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleBookmark({
      id: product.id,
      title: product.title,
      url: `/shop/${product.slug}`,
      type: 'article',
      category: product.category,
      offlineExcerpt: product.shortDescription,
      offlineImageUrl: product.imageUrl,
      authorName: 'Accounticca × E-Lawyers',
    });
  };

  // Multi-select Compare Mode state
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [compareWarningToast, setCompareWarningToast] = useState<string | null>(null);

  const selectedCompareProducts = useMemo(() => {
    return compareProductIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is ShopProduct => Boolean(p));
  }, [compareProductIds, products]);

  const toggleCompareProduct = (productId: string) => {
    setCompareProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        setCompareWarningToast('You can compare a maximum of 4 legal toolkits at a time.');
        setTimeout(() => setCompareWarningToast(null), 3500);
        return prev;
      }
      setIsCompareMode(true);
      return [...prev, productId];
    });
  };

  const removeCompareProduct = (productId: string) => {
    setCompareProductIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearCompareAll = () => {
    setCompareProductIds([]);
    setIsCompareModalOpen(false);
  };

  // Close sort dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentSortConfig = useMemo(
    () => SORT_OPTIONS.find((opt) => opt.value === sortBy) || SORT_OPTIONS[0],
    [sortBy]
  );

  const handleSortChange = (newSort: ShopSortOption) => {
    setSortBy(newSort);
    setIsSortOpen(false);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newSort === 'bestselling') {
        next.delete('sort');
      } else {
        next.set('sort', newSort);
      }
      return next;
    });
  };

  // Draft vs Published stats
  const publishedProducts = useMemo(() => products.filter(p => p.status !== 'draft'), [products]);
  const publishedCount = publishedProducts.length;
  const draftsCount = useMemo(() => products.filter(p => p.status === 'draft').length, [products]);

  // Dynamic Type & Category item counts among live published products
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Types': publishedProducts.length,
      'Academy Courses': 0,
      'Templates': 0,
      'Consultation': 0,
      'Legal Kits': 0,
      'Books & Manuals': 0
    };
    publishedProducts.forEach(p => {
      const t = p.productType || inferProductType(p);
      if (counts[t] !== undefined) {
        counts[t]++;
      }
    });
    return counts;
  }, [publishedProducts]);

  // All Academy courses derived from live products
  const academyCourses = useMemo(() => {
    return publishedProducts.filter(
      (p) =>
        p.category === 'Academy Courses' ||
        (p.productType || inferProductType(p)) === 'Academy Courses' ||
        p.id.startsWith('academy-')
    );
  }, [publishedProducts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Products': publishedProducts.length
    };
    SHOP_CATEGORIES.forEach(c => {
      if (c !== 'All Products') {
        counts[c] = publishedProducts.filter(p => p.category === c).length;
      }
    });
    return counts;
  }, [publishedProducts]);

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
    navigate(`/checkout?product=${encodeURIComponent(product.slug)}`);
  };

  // Reset all filters helper
  const handleResetFilters = () => {
    setSelectedType('All Types');
    setSelectedCategory('All Products');
    setSearchQuery('');
    setSortBy('bestselling');
    setShowOnlyBookmarked(false);
    setSearchParams({});
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let prods = products.filter(p => p.status !== 'draft');

    if (showOnlyBookmarked) {
      prods = prods.filter(p => isBookmarked(p.id));
    }

    if (selectedType !== 'All Types') {
      prods = prods.filter(p => (p.productType || inferProductType(p)) === selectedType);
    }

    if (selectedCategory !== 'All Products') {
      prods = prods.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      prods = prods.filter(p => {
        const pType = (p.productType || inferProductType(p)).toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          pType.includes(q) ||
          p.format.toLowerCase().includes(q) ||
          p.features.some(f => f.toLowerCase().includes(q))
        );
      });
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
  }, [products, showOnlyBookmarked, isBookmarked, selectedType, selectedCategory, searchQuery, sortBy]);

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
      a: 'Yes. All tax calculators, TDS matrices, and investment rebate sheets incorporate the latest statutory rules under the Income Tax Act 2023 and Bangladesh Finance Act 2026. Every template is vetted by Supreme Court of Bangladesh Advocates and Chartered Accountants.'
    },
    {
      q: 'How does the 1-on-1 Legal & Corporate Advisory Session work?',
      a: 'After purchasing an advisory package, our legal case manager connects via WhatsApp/Email within 2 business hours to schedule your private 30 or 45-minute video conference with Adv. Ekram Hossain or senior corporate tax counsel, along with pre-session document review.'
    },
    {
      q: 'What payment methods are supported in Bangladesh?',
      a: 'We accept bKash, Nagad, Rocket, Direct Bank Transfer (BEFTN/NPSB to City Bank PLC), and major debit/credit cards (Visa, MasterCard, Amex) through secured SSL gateway integration.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f4] pb-20 text-slate-900">
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

      {/* Admin Session Security Bar */}
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
                to="/workspace"
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 border border-amber-400/30 whitespace-nowrap"
              >
                <span>Google Sheet Sync (/workspace)</span>
              </Link>
              <Link
                to="/admin/shop"
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
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

      {/* Executive Hero Banner (Matches /contact design language & navy/gold layout) */}
      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-amber-500/25 bg-gradient-to-br from-slate-950 via-[#0b162c] to-[#071120] text-white shadow-2xl shadow-slate-950/20">
          {/* Ambient luxury glow rings */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(217,170,84,0.16),transparent_48%),radial-gradient(ellipse_at_0%_100%,rgba(16,185,129,0.14),transparent_45%)]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-amber-400/10" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-amber-400/15" />

          <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-slate-300">
              <Link to="/" className="transition hover:text-amber-300">Home</Link>
              <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span className="font-semibold text-amber-300">Digital Shop & Toolkits</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                {/* Brand Badge */}
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-amber-300 backdrop-blur-xs">
                  <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  ACCOUNTICCA <span className="text-amber-400">×</span> E-LAWYERS • Official Repository
                </div>

                <h1 className="max-w-3xl text-[31px] font-semibold leading-tight tracking-tight text-white font-serif">
                  Practitioner-vetted legal & tax toolkits.
                  <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 font-sans font-bold">
                    Ready for immediate execution.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-300">
                  Supreme Court advocate-drafted contracts, automated NBR tax & VAT calculators for FY 2026–27, RJSC compliance formats, and on-demand legal counsel vouchers.
                </p>

                {/* Search Bar Embedded in Hero */}
                <div className="mt-8 max-w-xl">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400/80" aria-hidden="true" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search NDA, Income Tax Excel, Employment Contract, RJSC Kit..."
                      className="w-full pl-12 pr-20 py-3.5 bg-slate-900/90 text-white rounded-xl border border-amber-400/30 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 text-sm font-medium placeholder-slate-400 focus:outline-none transition-all shadow-inner backdrop-blur-sm"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Advisory Desk Spotlight Card */}
              <div className="rounded-2xl border border-amber-400/20 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">Corporate Advisory Desk</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Support
                  </span>
                </div>
                
                <h3 className="mt-3 text-xl font-semibold text-white tracking-tight">
                  Need custom clauses or statutory vetting?
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Speak directly with Adv. Ekram Hossain or our senior corporate tax associates for customized agreements.
                </p>

                <div className="mt-5 border-t border-slate-800 pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact?tab=appointment"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:from-amber-400 hover:to-amber-500"
                  >
                    <BriefcaseBusiness className="h-4 w-4" /> Book Consultation
                  </Link>
                  <a
                    href="tel:+8801335230170"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                  >
                    <Phone className="h-3.5 w-3.5 text-amber-400" /> Helpline
                  </a>
                </div>
              </div>
            </div>

            {/* Trust Points Row (Contact Page Style) */}
            <div className="mt-10 grid gap-3 border-t border-slate-800/80 pt-6 sm:grid-cols-3">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/20">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>Supreme Court Advocate Vetted</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/20">
                  <Scale className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>FY 2026–27 Statutory Compliance</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/20">
                  <Download className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>Instant Word, Excel & PDF Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog & Filter Hub */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Category & Segmented Tab Navigation Hub */}
        <div className="space-y-4 mb-8">
          
          {/* Segmented Horizontal Tabs (Modeled directly after Contact page tab switcher) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between px-2 pb-3 text-xs border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
                  Catalog Disciplinary Format
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 text-[11px]">
                  Select product type to filter
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                {publishedCount} items published
              </span>
            </div>

            {/* Segmented Switcher Row */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="Product types">
              {[
                {
                  id: 'All Types' as const,
                  label: 'All Products',
                  subtitle: 'Complete Catalog',
                  icon: Layers,
                  count: typeCounts['All Types'],
                },
                {
                  id: 'Academy Courses' as const,
                  label: 'Academy Courses',
                  subtitle: 'Live & LMS Cohorts',
                  icon: GraduationCap,
                  count: typeCounts['Academy Courses'] || academyCourses.length,
                },
                {
                  id: 'Templates' as const,
                  label: 'Templates',
                  subtitle: 'Agreements & Sheets',
                  icon: FileText,
                  count: typeCounts['Templates'],
                },
                {
                  id: 'Consultation' as const,
                  label: 'Consultation',
                  subtitle: '1-on-1 Counsel',
                  icon: Video,
                  count: typeCounts['Consultation'],
                },
                {
                  id: 'Legal Kits' as const,
                  label: 'Legal Kits',
                  subtitle: 'Turnkey Bundles',
                  icon: Package,
                  count: typeCounts['Legal Kits'],
                },
                {
                  id: 'Books & Manuals' as const,
                  label: 'Books & Manuals',
                  subtitle: 'Statutory Guides',
                  icon: BookOpen,
                  count: typeCounts['Books & Manuals'],
                }
              ].map((item) => {
                const isSelected = selectedType === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedType(item.id);
                      setSearchParams(prev => {
                        const next = new URLSearchParams(prev);
                        if (item.id === 'All Types') {
                          next.delete('type');
                        } else {
                          next.set('type', item.id);
                        }
                        return next;
                      });
                    }}
                    className={`flex flex-col justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer min-h-[70px] ${
                      isSelected
                        ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60 ring-2 ring-emerald-600/20'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200/70 text-slate-600'}`}>
                        <IconComponent className="h-4 w-4" />
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    </div>

                    <div className="text-left">
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Practice Area Filter Pills & Sort Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            
            {/* Practice Area Horizontal Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 pl-1 hidden sm:inline">
                Practice Area:
              </span>
              {SHOP_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = categoryCounts[cat] ?? 0;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchParams(prev => {
                        const next = new URLSearchParams(prev);
                        if (cat === 'All Products') {
                          next.delete('category');
                        } else {
                          next.set('category', cat);
                        }
                        return next;
                      });
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Executive Sort Dropdown Menu */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-between md:justify-end">
              <div className="relative w-full md:w-auto" ref={sortDropdownRef}>
                <button
                  type="button"
                  id="shop-sort-menu-button"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="w-full md:w-auto inline-flex items-center justify-between md:justify-start gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-xs font-bold text-slate-800 hover:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500/25 transition-all cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
                    <ArrowUpDown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Sort:</span>
                  </span>
                  <span className="text-slate-950 font-black truncate">{currentSortConfig.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isSortOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {/* Animated Dropdown Menu Panel */}
                {isSortOpen && (
                  <div
                    role="listbox"
                    aria-label="Sort advisory products"
                    className="absolute right-0 z-40 mt-2 w-72 origin-top-right rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-950/10 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                      <span>Sort Advisory Products</span>
                      <ArrowUpDown className="w-3 h-3 text-amber-500" />
                    </div>
                    <div className="py-1 space-y-0.5">
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = sortBy === opt.value;
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleSortChange(opt.value)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                              isSelected
                                ? 'bg-amber-50 text-slate-950 font-black border border-amber-200/80 shadow-2xs'
                                : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`p-1.5 rounded-lg shrink-0 ${
                                  isSelected
                                    ? 'bg-amber-400/25 text-amber-700'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </span>
                              <div>
                                <div className="leading-tight">{opt.label}</div>
                                <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                                  {opt.subtitle}
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Active Filters Feedback Bar */}
          {(selectedType !== 'All Types' || selectedCategory !== 'All Products' || searchQuery.trim() !== '' || sortBy !== 'bestselling') && (
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-amber-50/60 border border-amber-200/70 rounded-2xl px-4 py-2.5 text-xs text-amber-950">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-amber-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                  Active Filters:
                </span>

                {selectedType !== 'All Types' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px] shadow-2xs">
                    <span>Type: {selectedType}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedType('All Types');
                        setSearchParams(prev => {
                          const next = new URLSearchParams(prev);
                          next.delete('type');
                          return next;
                        });
                      }}
                      className="hover:text-amber-300 cursor-pointer ml-0.5"
                      title="Clear type filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCategory !== 'All Products' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]">
                    <span>Practice Area: {selectedCategory}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('All Products');
                        setSearchParams(prev => {
                          const next = new URLSearchParams(prev);
                          next.delete('category');
                          return next;
                        });
                      }}
                      className="hover:text-amber-950 cursor-pointer ml-0.5"
                      title="Clear practice area filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchQuery.trim() !== '' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-slate-800 border border-slate-300 font-bold text-[11px]">
                    <span>Keyword: "{searchQuery}"</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="hover:text-slate-950 cursor-pointer ml-0.5"
                      title="Clear search query"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {showOnlyBookmarked && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500 text-white font-bold text-[11px] shadow-2xs">
                    <Heart className="w-3 h-3 fill-current text-white" />
                    <span>Saved Favorites ({bookmarkedProductIds.size})</span>
                    <button
                      type="button"
                      onClick={() => setShowOnlyBookmarked(false)}
                      className="hover:text-rose-100 cursor-pointer ml-0.5"
                      title="Clear bookmarked filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {sortBy !== 'bestselling' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[11px] shadow-2xs">
                    <ArrowUpDown className="w-3 h-3 text-slate-950" />
                    <span>Sorted: {currentSortConfig.label}</span>
                    <button
                      type="button"
                      onClick={() => handleSortChange('bestselling')}
                      className="hover:text-white cursor-pointer ml-0.5"
                      title="Reset to default popularity sort"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-800 hover:text-amber-950 underline cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Dedicated Academy Courses Shop Box (All Training Programs from /training) */}
        {academyCourses.length > 0 &&
          (selectedType === 'All Types' ||
            selectedType === 'Academy Courses' ||
            selectedCategory === 'Academy Courses' ||
            selectedCategory === 'All Products') &&
          !searchQuery.trim() &&
          !showOnlyBookmarked && (
            <AcademyCoursesShopBox
              courses={academyCourses}
              onAddToCart={(course) => handleAddToCart({ stopPropagation: () => {} } as any, course)}
              onInstantBuy={(course) => handleInstantBuy({ stopPropagation: () => {} } as any, course)}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleFavorite}
              addedIds={addedIds}
            />
          )}

        {/* Results Counter Summary & Active Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-medium mb-6 pb-2 border-b border-slate-200/60">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Displaying <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'solution' : 'solutions'}
              {selectedType !== 'All Types' && <span> under <strong className="text-emerald-800">{selectedType}</strong></span>}
              {selectedCategory !== 'All Products' && <span> in <strong className="text-slate-800">{selectedCategory}</strong></span>}
            </span>
            {searchQuery && (
              <span className="truncate max-w-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Matched: <em>"{searchQuery}"</em>
              </span>
            )}
            {bookmarkedProductIds.size > 0 && (
              <button
                type="button"
                onClick={() => setShowOnlyBookmarked((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ml-1 ${
                  showOnlyBookmarked
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs ring-2 ring-rose-400/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600 shadow-2xs'
                }`}
                title={showOnlyBookmarked ? 'Show all products' : 'Show only personal bookmarked products'}
              >
                <Heart className={`w-3.5 h-3.5 ${showOnlyBookmarked ? 'fill-current text-rose-500' : 'text-rose-500'}`} />
                <span>Saved ({bookmarkedProductIds.size})</span>
              </button>
            )}

            {/* Compare Mode Multi-Select Toggle */}
            <button
              type="button"
              onClick={() => setIsCompareMode((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ml-1 ${
                isCompareMode || compareProductIds.length > 0
                  ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-400/30'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400/60 hover:text-amber-900 shadow-2xs'
              }`}
              title="Toggle Compare Mode to select multiple toolkits for side-by-side comparison"
            >
              <Scale className="w-3.5 h-3.5 text-slate-950" />
              <span>Compare Mode</span>
              {compareProductIds.length > 0 && (
                <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {compareProductIds.length}
                </span>
              )}
            </button>

            {compareProductIds.length >= 2 && (
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-slate-900 text-amber-300 border border-amber-400/40 shadow-xs hover:bg-slate-800 cursor-pointer ml-1"
                title="Open side-by-side comparison table"
              >
                <span>View Comparison Table ({compareProductIds.length})</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Ordered by:</span>
            <button
              type="button"
              onClick={() => setIsSortOpen(true)}
              className="font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Click to change product sorting"
            >
              <currentSortConfig.icon className="w-3 h-3 text-amber-500" />
              <span>{currentSortConfig.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Products Grid (Luxury Advisory Cards Matching Contact Page Aesthetic) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-lg mx-auto space-y-4 my-8 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner border border-amber-200">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">No products match your criteria</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                No items found for {selectedType !== 'All Types' ? `type "${selectedType}"` : ''} 
                {selectedCategory !== 'All Products' ? ` in "${selectedCategory}"` : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
              <button
                type="button"
                onClick={() => { setSelectedType('Templates'); setSelectedCategory('All Products'); setSearchQuery(''); }}
                className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Browse Templates ({typeCounts['Templates']})
              </button>
              <button
                type="button"
                onClick={() => { setSelectedType('Consultation'); setSelectedCategory('All Products'); setSearchQuery(''); }}
                className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Browse Consultation ({typeCounts['Consultation']})
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = !!addedIds[product.id];
              const isSaved = isBookmarked(product.id);
              const isCompareSelected = compareProductIds.includes(product.id);
              const discountPercent = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );
              const pType = product.productType || inferProductType(product);

              return (
                <article
                  key={product.id}
                  className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                    isCompareSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/80 shadow-xl shadow-amber-950/10'
                      : 'border-slate-200/90 hover:border-amber-400/40 shadow-sm hover:shadow-xl hover:shadow-slate-950/5'
                  }`}
                >
                  {/* Visual Preview Header */}
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden block">
                    <Link to={`/shop/${product.slug}`} className="block w-full h-full">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Top Badges & Compare Toggle */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                      {/* Multi-Select Compare Pill */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleCompareProduct(product.id);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isCompareSelected
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-white/90 scale-105'
                            : isCompareMode
                            ? 'bg-slate-950 text-amber-300 border border-amber-400/50 hover:bg-slate-900'
                            : 'bg-slate-950/80 text-slate-300 border border-slate-700 hover:border-amber-400/60 hover:text-white'
                        }`}
                        title={isCompareSelected ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                      >
                        <span className={`w-3 h-3 rounded flex items-center justify-center border transition-colors ${
                          isCompareSelected ? 'bg-slate-950 border-slate-950 text-amber-400' : 'border-slate-400 bg-slate-900/60'
                        }`}>
                          {isCompareSelected ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Scale className="w-2 h-2 text-slate-400" />}
                        </span>
                        <span>{isCompareSelected ? 'Comparing' : 'Compare'}</span>
                      </button>

                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/95 text-amber-300 border border-amber-400/30 backdrop-blur-xs shadow-xs">
                          {product.badge}
                        </span>
                      )}

                      {/* Product Type Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedType(pType);
                        }}
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs shadow-2xs transition-all hover:scale-105 cursor-pointer flex items-center gap-1 bg-slate-900/90 text-white border border-slate-700 hover:border-amber-400"
                        title={`Filter by type: ${pType}`}
                      >
                        {pType === 'Templates' && <FileText className="w-3 h-3 text-amber-400" />}
                        {pType === 'Legal Kits' && <Package className="w-3 h-3 text-amber-400" />}
                        {pType === 'Consultation' && <Video className="w-3 h-3 text-purple-400" />}
                        {pType === 'Books & Manuals' && <BookOpen className="w-3 h-3 text-amber-400" />}
                        {pType === 'Academy Courses' && <GraduationCap className="w-3 h-3 text-emerald-400" />}
                        <span>{pType}</span>
                      </button>
                    </div>

                    {/* Top Right Badges & Favorite Heart Button */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      {discountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                          -{discountPercent}%
                        </span>
                      )}

                      <button
                        type="button"
                        aria-label={isSaved ? `Remove ${product.title} from personal bookmarks` : `Save ${product.title} to personal bookmarks`}
                        title={isSaved ? 'Remove from saved bookmarks' : 'Save to personal bookmarks'}
                        onClick={(e) => handleToggleFavorite(e, product)}
                        className={`group/heart flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm ${
                          isSaved
                            ? 'bg-rose-500 text-white ring-2 ring-white/90 shadow-rose-950/30 scale-105'
                            : 'bg-slate-950/70 text-slate-200 hover:bg-slate-950 hover:text-rose-400 hover:scale-110 border border-white/20'
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isSaved ? 'fill-current text-white scale-110' : 'text-slate-200 group-hover/heart:scale-110'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Format and Specs Overlay Pill */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-white bg-slate-950/85 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="font-medium truncate text-slate-200">{product.format}</span>
                      <span className="font-mono text-amber-300 shrink-0 font-bold">{product.pagesOrFiles}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Rating & Category Line */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-900">{product.rating}</span>
                          <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
                        </div>

                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                      </div>

                      {/* Product Title */}
                      <Link to={`/shop/${product.slug}`}>
                        <h3 className="font-bold text-sm sm:text-base text-slate-950 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {/* Compact Features / Specs Grid */}
                      {product.features && product.features.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                          {product.features.slice(0, 2).map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Statutory Toolkit</div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-slate-950">
                            BDT {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs line-through text-slate-400 font-medium">
                              BDT {product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/shop/${product.slug}`}
                        className="text-xs text-slate-600 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="View Full Product Specs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Inspect</span>
                      </Link>
                    </div>
                  </div>

                  {/* Card Actions (Dual CTA: Add to Cart + Instant Checkout) */}
                  <div className="px-5 pb-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isAdded
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs hover:border-slate-300'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleInstantBuy(e, product)}
                      className={`w-full py-2.5 px-3 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer hover:shadow-md ${
                        pType === 'Academy Courses'
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      <span>{pType === 'Academy Courses' ? 'Enroll Now' : 'Buy Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </section>

      {/* Corporate Advisory & Custom Drafting Callout (Matches Contact Office Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-r from-slate-950 via-[#0b162c] to-slate-900 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Legal Drafting & High-Value Advisory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight font-serif">
                Need a bespoke agreement or complex corporate structuring?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-sans">
                Our Supreme Court of Bangladesh advocates and corporate tax specialists provide custom joint-venture structuring, cross-border M&A contracts, shareholder covenants, and NBR dispute briefs.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to="/contact?tab=appointment"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center"
              >
                <span>Book Legal Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+8801335230170"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors border border-white/10 text-center"
              >
                <Phone className="h-3.5 w-3.5 text-amber-400" />
                <span>Call Hotline: +880 1335-230170</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8 space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Support & Fulfillment</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Answers regarding instant file delivery, document editing, and statutory updates.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  id={`shop-faq-trigger-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`shop-faq-panel-${index}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div
                    id={`shop-faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`shop-faq-trigger-${index}`}
                    className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Cart Trigger Button */}
      {totalItemsCount > 0 && (
        <div className={`fixed left-6 z-40 transition-all duration-300 animate-in fade-in ${
          selectedCompareProducts.length > 0 ? 'bottom-24 sm:bottom-6' : 'bottom-6'
        }`}>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200 border border-amber-400/40 cursor-pointer"
            title="Open Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            </div>
            <div className="text-left font-bold text-xs">
              <div>View Cart</div>
            </div>
          </button>
        </div>
      )}

      {/* Compare Limit Warning Toast */}
      {compareWarningToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5 rounded-2xl bg-slate-950 border border-amber-400 text-white px-4 py-3 shadow-2xl text-xs font-semibold backdrop-blur-md">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{compareWarningToast}</span>
          </div>
        </div>
      )}

      {/* Floating Comparison Dock Bar */}
      <ProductComparisonDock
        selectedProducts={selectedCompareProducts}
        onOpenModal={() => setIsCompareModalOpen(true)}
        onRemoveProduct={removeCompareProduct}
        onClearAll={clearCompareAll}
        onToggleCompareMode={() => setIsCompareMode((prev) => !prev)}
      />

      {/* Side-by-Side Product Comparison Modal */}
      <ProductComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={selectedCompareProducts}
        onRemoveProduct={removeCompareProduct}
        onClearAll={clearCompareAll}
        onAddToCart={(p) => {
          addToCart(p, 1);
          setAddedIds((prev) => ({ ...prev, [p.id]: true }));
          setTimeout(() => setAddedIds((prev) => ({ ...prev, [p.id]: false })), 1800);
        }}
        onInstantBuy={(p) => navigate(`/checkout?product=${encodeURIComponent(p.slug)}`)}
      />

    </div>
  );
}

export default Shop;
