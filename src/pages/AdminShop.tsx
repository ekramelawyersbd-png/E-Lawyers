import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Search, 
  RotateCcw, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  DollarSign, 
  Tag, 
  Layers, 
  Eye, 
  EyeOff,
  ArrowLeft, 
  Copy, 
  AlertCircle,
  Image as ImageIcon,
  CheckCircle2,
  ListPlus,
  X,
  Scale,
  LogOut,
  Lock
} from 'lucide-react';
import { ServiceSEO } from '../components/SEO';
import { useProducts } from '../hooks/useProducts';
import { useShopAuth } from '../contexts/ShopAuthContext';
import { 
  ShopProduct, 
  SHOP_CATEGORIES, 
  ShopCategory,
  ProductType,
  PRODUCT_TYPES,
  inferProductType
} from '../data/shopProducts';
import { generateSlug } from '../services/productService';

// Curated Unsplash images for quick selection by admin
const IMAGE_PRESETS = [
  {
    name: 'Legal Contract & Agreement',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Tax, VAT & Spreadsheet',
    url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Corporate & Company Formation',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Employment & HR Policy',
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Legal Book & Handbook',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Legal Consultation & Advisory',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  }
];

export function AdminShop() {
  const navigate = useNavigate();
  const { products, addOrUpdateProduct, removeProduct, resetDefaults, loading, togglePublishStatus } = useProducts();
  const { adminUser, logout } = useShopAuth();

  // Filter & Search in Admin list
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');
  const [selectedFilterType, setSelectedFilterType] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Form mode: false = collapsed, 'create' = new product, 'edit' = editing product
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ShopProduct['category']>('Legal Contracts');
  const [productType, setProductType] = useState<ProductType>('Templates');
  const [price, setPrice] = useState<number>(1000);
  const [originalPrice, setOriginalPrice] = useState<number>(1500);
  const [badge, setBadge] = useState<string>('New');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [format, setFormat] = useState('DOCX + PDF • Bilingual Clause Notes');
  const [pagesOrFiles, setPagesOrFiles] = useState('6 Pages • 2 File Formats');
  const [governingLaw, setGoverningLaw] = useState('Contract Act, 1872 & Arbitration Act, 2001 (Bangladesh)');
  const [authorOrVettedBy, setAuthorOrVettedBy] = useState('Adv. Ekram Hossain, Advocate, Supreme Court of Bangladesh');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Fully editable Microsoft Word (.docx) & PDF file',
    'Clause-by-clause practitioner notes & guidelines',
    'Compliant with Bangladesh statutory laws & court precedents'
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [samplePreviewSnippet, setSamplePreviewSnippet] = useState('');
  const [imageUrl, setImageUrl] = useState(IMAGE_PRESETS[0].url);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug when title changes (if creating or if slug was untouched)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (formMode === 'create') {
      setSlug(generateSlug(val));
    }
  };

  const handleOpenCreateForm = () => {
    setFormMode('create');
    setEditingId(null);
    setTitle('');
    setSlug('');
    setCategory('Legal Contracts');
    setProductType('Templates');
    setPrice(1200);
    setOriginalPrice(2000);
    setBadge('New');
    setStatus('published');
    setFormat('DOCX + PDF • Bilingual Notes');
    setPagesOrFiles('8 Pages • 2 File Formats (.docx, .pdf)');
    setGoverningLaw('Contract Act, 1872 (Bangladesh)');
    setAuthorOrVettedBy('Adv. Ekram Hossain, Advocate, Supreme Court of Bangladesh');
    setShortDescription('');
    setFullDescription('');
    setFeatures([
      'Editable Microsoft Word (.docx) & Print-Ready PDF',
      'Clause-by-clause commentary and guidance notes',
      'Dhaka-seated dispute resolution and arbitration provisions'
    ]);
    setSamplePreviewSnippet('This Agreement is entered into by and between the First Party and the Second Party in accordance with the laws of Bangladesh...');
    setImageUrl(IMAGE_PRESETS[0].url);

    // Scroll to form
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleOpenEditForm = (prod: ShopProduct) => {
    setFormMode('edit');
    setEditingId(prod.id);
    setTitle(prod.title);
    setSlug(prod.slug);
    setCategory(prod.category);
    setProductType(prod.productType || inferProductType(prod));
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice);
    setBadge(prod.badge || '');
    setStatus(prod.status || 'published');
    setFormat(prod.format);
    setPagesOrFiles(prod.pagesOrFiles);
    setGoverningLaw(prod.governingLaw || '');
    setAuthorOrVettedBy(prod.authorOrVettedBy);
    setShortDescription(prod.shortDescription);
    setFullDescription(prod.fullDescription);
    setFeatures(prod.features && prod.features.length > 0 ? prod.features : ['Standard compliance clauses']);
    setSamplePreviewSnippet(prod.samplePreviewSnippet || '');
    setImageUrl(prod.imageUrl);

    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFeatures([...features, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };

  const handleTogglePublish = async (prod: ShopProduct) => {
    const nextStatus = prod.status === 'draft' ? 'published' : 'draft';
    setTogglingId(prod.id);
    try {
      await togglePublishStatus(prod.id);
      setStatusMessage({
        type: 'success',
        text: `"${prod.title}" is now ${nextStatus === 'published' ? 'Published (visible on public Shop page)' : 'Unpublished (saved as Draft and hidden from Shop)'}.`
      });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to update publication status'
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatusMessage({ type: 'error', text: 'Product Title is required!' });
      return;
    }

    const finalSlug = slug.trim() || generateSlug(title);
    const productId = editingId || finalSlug;

    const productPayload: ShopProduct = {
      id: productId,
      title: title.trim(),
      slug: finalSlug,
      category,
      productType,
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || Number(price) || 0,
      rating: 4.95,
      reviewsCount: 15,
      format: format.trim() || 'Digital Package',
      badge: badge ? (badge as any) : undefined,
      status,
      shortDescription: shortDescription.trim() || title.trim(),
      fullDescription: fullDescription.trim() || shortDescription.trim() || title.trim(),
      governingLaw: governingLaw.trim() || undefined,
      pagesOrFiles: pagesOrFiles.trim() || '1 Package',
      features: features.length > 0 ? features : ['Complete document and guidelines included'],
      samplePreviewSnippet: samplePreviewSnippet.trim() || undefined,
      imageUrl: imageUrl.trim() || IMAGE_PRESETS[0].url,
      authorOrVettedBy: authorOrVettedBy.trim() || 'Adv. Ekram Hossain, Advocate Supreme Court of Bangladesh'
    };

    setIsSubmitting(true);
    try {
      await addOrUpdateProduct(productPayload);
      setStatusMessage({
        type: 'success',
        text: `Product "${title}" successfully ${formMode === 'edit' ? 'updated' : 'added to catalog'} with status: ${status.toUpperCase()}!`
      });
      setFormMode(null);
      setEditingId(null);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Could not save product' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, prodTitle: string) => {
    if (window.confirm(`Are you sure you want to remove "${prodTitle}" from the digital shop?`)) {
      try {
        await removeProduct(id);
        setStatusMessage({ type: 'success', text: `Product "${prodTitle}" removed successfully.` });
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: err?.message || 'Failed to delete' });
      }
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all shop products back to the official default catalog? Any custom products will be overwritten.')) {
      try {
        await resetDefaults();
        setStatusMessage({ type: 'success', text: 'Shop catalog reset to default products.' });
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: err?.message || 'Failed to reset' });
      }
    }
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const pType = p.productType || inferProductType(p);
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedFilterCategory === 'All' || p.category === selectedFilterCategory;
    const matchesType = selectedFilterType === 'All' || pType === selectedFilterType;
    const matchesStatus = 
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'published' && p.status !== 'draft') ||
      (selectedStatusFilter === 'draft' && p.status === 'draft');
    return matchesSearch && matchesCat && matchesType && matchesStatus;
  });

  // Calculate catalog stats
  const totalProducts = products.length;
  const publishedCount = products.filter(p => p.status !== 'draft').length;
  const draftsCount = products.filter(p => p.status === 'draft').length;
  const avgPrice = totalProducts > 0 
    ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / totalProducts) 
    : 0;
  const categoriesCount = new Set(products.map(p => p.category)).size;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <ServiceSEO
        title="Admin: Digital Products Catalog Manager | Accounticca & E-Lawyers"
        description="Admin dashboard to add, edit, price, and manage digital legal templates, tax calculators, and business compliance kits."
        serviceType="Shop Product Administration"
        canonicalUrl="/admin/shop"
      />

      {/* Admin Session Security Top Bar */}
      <div className="bg-slate-950 border-b border-slate-800 text-xs py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-emerald-400 text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Authorized Session:</span>
            </span>
            <span className="text-white font-mono text-[11px] bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
              {adminUser?.email || 'admin@admin.com'}
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              (Server-Side Verified Identity)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/shop"
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors inline-flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shop Page ({publishedCount} Published)</span>
            </Link>

            <button
              type="button"
              onClick={() => logout()}
              className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/80 text-red-200 hover:text-white font-bold rounded text-xs transition-colors inline-flex items-center gap-1 border border-red-800/60 cursor-pointer"
              title="Terminate admin session and logout"
            >
              <LogOut className="w-3 h-3 text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Accounticca & E-Lawyers • Catalog Control Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Digital Shop Product Administration
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Add new agreements, tax workbooks, set BDT pricing, customize features, and publish instant download kits.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/shop"
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Shop</span>
              </Link>
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Catalog Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Products</div>
              <div className="text-2xl font-black text-white mt-1">{totalProducts} Items</div>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Published (Live)</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{publishedCount} Live</div>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Drafts (Hidden)</span>
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">{draftsCount} Drafts</div>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Categories</div>
              <div className="text-2xl font-black text-slate-200 mt-1">{categoriesCount} Categories</div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Status Toast Alert */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-md ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' 
              : 'bg-red-50 text-red-900 border border-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Product Create / Edit Form Card */}
        {formMode && (
          <div className="bg-white rounded-3xl border-2 border-emerald-500/50 p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{formMode === 'create' ? 'Create New Catalog Item' : 'Edit Existing Item'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {formMode === 'create' ? 'Add New Product to Shop' : `Editing: ${title}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFormMode(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Close Form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form Fields Column (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* 1. Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>1. Product Identity & Category</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Product Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="e.g. Mutual Non-Disclosure Agreement (NDA) Pro Kit"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Short URL Slug (/shop/<span className="text-emerald-700">{slug || 'short-name'}</span>) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().trim().replace(/[^\w-]/g, ''))}
                          placeholder="e.g. mutual-nda-pro-kit"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-mono text-emerald-800 font-bold focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          This defines the direct page address: <code className="text-slate-600 font-mono">/shop/{slug || '...'}</code>
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Product Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={productType}
                          onChange={(e) => setProductType(e.target.value as ProductType)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
                        >
                          {PRODUCT_TYPES.filter(t => t !== 'All Types').map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Discipline / Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as ShopProduct['category'])}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
                        >
                          {SHOP_CATEGORIES.filter(c => c !== 'All Products').map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. Pricing & Highlights */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>2. Pricing & Marketing Tag</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Selling Price (BDT) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="50"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          placeholder="1200"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-black text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Regular / Crossed-Out Price (BDT)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(Number(e.target.value))}
                          placeholder="2000"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-bold text-slate-600 focus:outline-none"
                        />
                        {originalPrice > price && (
                          <span className="text-[11px] font-bold text-emerald-700 mt-1 block">
                            Auto Discount: {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Highlight Badge
                        </label>
                        <select
                          value={badge}
                          onChange={(e) => setBadge(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
                        >
                          <option value="">No Badge</option>
                          <option value="Bestseller">Bestseller</option>
                          <option value="New">New</option>
                          <option value="Popular">Popular</option>
                          <option value="Essential">Essential</option>
                          <option value="Updated for 2026">Updated for 2026</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Publication Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-bold focus:outline-none"
                        >
                          <option value="published">● Published (Live on Shop)</option>
                          <option value="draft">○ Draft (Hidden from Shop)</option>
                        </select>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {status === 'published' ? 'Visible on public Shop' : 'Hidden from customers'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. File & Legal Specs */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-600" />
                      <span>3. Format, Pages & Vetting Authority</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          File Format & Notes
                        </label>
                        <input
                          type="text"
                          value={format}
                          onChange={(e) => setFormat(e.target.value)}
                          placeholder="e.g. DOCX + PDF • Bilingual Clause Notes"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Pages / Scope
                        </label>
                        <input
                          type="text"
                          value={pagesOrFiles}
                          onChange={(e) => setPagesOrFiles(e.target.value)}
                          placeholder="e.g. 6 Pages • 2 File Formats"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Governing Law / Statutory Reference
                        </label>
                        <input
                          type="text"
                          value={governingLaw}
                          onChange={(e) => setGoverningLaw(e.target.value)}
                          placeholder="e.g. Contract Act, 1872 & Arbitration Act, 2001"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Vetted Authority / Counsel
                        </label>
                        <input
                          type="text"
                          value={authorOrVettedBy}
                          onChange={(e) => setAuthorOrVettedBy(e.target.value)}
                          placeholder="e.g. Adv. Ekram Hossain, Advocate Supreme Court of Bangladesh"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Descriptions */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>4. Short & Comprehensive Descriptions</span>
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Short Description (Catalog Cards)
                      </label>
                      <textarea
                        rows={2}
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        placeholder="Brief 1-2 sentence overview highlighting main protection or utility..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Comprehensive Description (Product Detail Page)
                      </label>
                      <textarea
                        rows={4}
                        value={fullDescription}
                        onChange={(e) => setFullDescription(e.target.value)}
                        placeholder="Detailed legal commentary, clause background, execution context, and specific benefits..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 5. Features List */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                      5. Inclusions & Key Features (Bullet Points)
                    </label>

                    <div className="space-y-2">
                      {features.map((feat, index) => (
                        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-medium text-slate-800 flex-1">{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-md"
                            title="Remove feature"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        placeholder="Add another feature (e.g. Non-solicitation covenants included)..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Add Bullet
                      </button>
                    </div>
                  </div>

                  {/* 6. Sample Snippet */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                      6. Document Excerpt / Sample Clause Snippet
                    </label>
                    <textarea
                      rows={2}
                      value={samplePreviewSnippet}
                      onChange={(e) => setSamplePreviewSnippet(e.target.value)}
                      placeholder="e.g. The Receiving Party agrees to hold all proprietary confidential materials in strict confidence..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-mono text-slate-700 focus:outline-none"
                    />
                  </div>

                  {/* 7. Image Presets & Custom URL */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                      7. Cover Image
                    </label>
                    
                    {/* Quick presets buttons */}
                    <div className="flex flex-wrap gap-2">
                      {IMAGE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            imageUrl === preset.url
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>

                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium focus:outline-none"
                    />
                  </div>

                </div>


                {/* Live Card Preview Column (4 Cols) */}
                <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 sticky top-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Live Shop Card Preview
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                      Real-time
                    </span>
                  </div>

                  {/* Card mockup */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="relative aspect-16/10 bg-slate-200 overflow-hidden">
                      <img
                        src={imageUrl || IMAGE_PRESETS[0].url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-900/90 text-amber-300">
                            {badge}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-slate-800">
                          {category}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        {status === 'draft' ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500 text-white shadow-xs">
                            Draft (Hidden)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-600 text-white shadow-xs">
                            Published
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 text-[10px] bg-slate-900/80 text-white px-2 py-1 rounded-md flex justify-between">
                        <span className="truncate">{format || 'DOCX + PDF'}</span>
                        <span className="text-emerald-300 font-mono">{pagesOrFiles || '6 Pages'}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-2">
                        {title || 'Untitled Product'}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {shortDescription || 'Short description will appear here...'}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <div>
                          <div className="text-[9px] text-slate-400 uppercase font-semibold">One-Time Fee</div>
                          <div className="font-black text-sm text-slate-900">
                            BDT {Number(price || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          Preview
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-700">Dedicated Page URL:</div>
                    <code className="text-emerald-700 font-mono break-all text-[10px] font-bold">
                      /shop/{slug || '...'}
                    </code>
                  </div>

                </div>

              </div>


              {/* Form Action Buttons */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormMode(null)}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{formMode === 'create' ? 'Publish Product to Shop' : 'Save Changes'}</span>
                </button>
              </div>

            </form>
          </div>
        )}


        {/* Catalog Table & Management Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Catalog Items ({filteredProducts.length})
              </h2>
              <p className="text-xs text-slate-500">
                Search, edit price, inspect live preview page, or remove items.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                title="Restore default product catalog"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Status Quick Filter Tabs & Search Bar */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 mr-1">Status Filter:</span>
              <button
                type="button"
                onClick={() => setSelectedStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedStatusFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All Products ({totalProducts})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatusFilter('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStatusFilter === 'published'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Published ({publishedCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStatusFilter === 'draft'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Drafts ({draftsCount})</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by title, slug, or keywords..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedFilterType}
                  onChange={(e) => setSelectedFilterType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option value="All">All Types ({products.length})</option>
                  {PRODUCT_TYPES.filter(t => t !== 'All Types').map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedFilterCategory}
                  onChange={(e) => setSelectedFilterCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option value="All">All Categories ({products.length})</option>
                  {SHOP_CATEGORIES.filter(c => c !== 'All Products').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Type & Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Direct Page URL</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => {
                  const isDraft = prod.status === 'draft';
                  const isToggling = togglingId === prod.id;
                  const pType = prod.productType || inferProductType(prod);

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Item */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.title}
                            className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-extrabold text-slate-900 truncate">{prod.title}</div>
                            <div className="text-[11px] text-slate-400 truncate">{prod.format}</div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              pType === 'Templates'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : pType === 'Legal Kits'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : pType === 'Consultation'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {pType}
                            </span>
                            {prod.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-900 text-amber-300">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">{prod.category}</span>
                        </div>
                      </td>

                      {/* Status Indicator Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isDraft ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Draft (Hidden)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Published (Live)</span>
                          </span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-black text-slate-900">
                          BDT {prod.price.toLocaleString('en-IN')}
                        </div>
                        {prod.originalPrice > prod.price && (
                          <div className="text-[10px] line-through text-slate-400">
                            BDT {prod.originalPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Slug */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Link
                          to={`/shop/${prod.slug}`}
                          target="_blank"
                          className="text-emerald-700 hover:text-emerald-800 font-mono text-[11px] font-bold inline-flex items-center gap-1 hover:underline"
                          title="Open product detail page in new tab"
                        >
                          <span>/shop/{prod.slug}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>

                      {/* Actions Column with Publish / Unpublish Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          
                          {/* 1-Click Publish / Unpublish Toggle Button */}
                          {isDraft ? (
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(prod)}
                              disabled={isToggling}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer disabled:opacity-50"
                              title="Publish item: Make it publicly visible on the Shop Page"
                            >
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Publish</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(prod)}
                              disabled={isToggling}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-300 hover:border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                              title="Unpublish item: Hide from public Shop Page and save as Draft"
                            >
                              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                              <span>Unpublish</span>
                            </button>
                          )}

                          <div className="h-4 w-px bg-slate-200 mx-0.5" />

                          <Link
                            to={`/shop/${prod.slug}`}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Live Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(prod)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(prod.id, prod.title)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No products matched your search or status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>

      </main>
    </div>
  );
}

export default AdminShop;
