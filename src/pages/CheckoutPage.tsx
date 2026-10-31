import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  ShoppingBag, 
  CheckCircle2, 
  FileCheck2, 
  Download, 
  Sparkles, 
  ArrowLeft, 
  ExternalLink,
  Check,
  AlertCircle,
  LogOut,
  FileSpreadsheet,
  Mail,
  Copy,
  Send,
  Eye,
  Code2
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { usePurchases } from '../contexts/PurchaseContext';
import { useAuth } from '../contexts/AuthContext';
import { auth, fallbackAuth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useProducts } from '../hooks/useProducts';
import { SHOP_PRODUCTS, ShopProduct, inferProductType } from '../data/shopProducts';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getAccessToken } from '../services/workspaceAuth';
import { getStoredShopSheetId, appendShopOrderToSheet } from '../services/shopSheetsSync';
import {
  sendShopOrderConfirmationEmail,
  SHOP_ORDER_HTML_TEMPLATE,
  type OrderConfirmationEmailResult
} from '../utils/emailService';
import { generateShopOrderEmailHtml } from '../utils/shopOrderEmailTemplate';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productSlug = searchParams.get('product') || searchParams.get('slug');
  const singleQty = useMemo(() => {
    const raw = parseInt(searchParams.get('qty') || '1', 10);
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  }, [searchParams]);
  
  const { products } = useProducts();
  const { items, subtotal, discount, total, clearCart } = useCart();
  const { purchaseProduct } = usePurchases();
  const { user, authUser, signInWithGoogle, signInWithFacebook, logout } = useAuth();

  // Determine if purchasing a single product from URL or cart items
  const singleProduct = useMemo(() => {
    if (!productSlug) return null;
    return (
      products.find(p => p.slug === productSlug || p.id === productSlug) ||
      SHOP_PRODUCTS.find(p => p.slug === productSlug || p.id === productSlug) ||
      null
    );
  }, [productSlug, products]);

  const checkoutItems = singleProduct 
    ? [{ product: { ...singleProduct, price: singleProduct.price || 10 }, quantity: singleQty }] 
    : items.length > 0
      ? items.map(item => ({ ...item, product: { ...item.product, price: item.product.price || 10 } }))
      : [];

  const rawSubtotal = checkoutItems.reduce((acc, curr) => acc + (curr.product?.price || 10) * curr.quantity, 0);
  const orderSubtotal = rawSubtotal > 0 ? rawSubtotal : 10;
  const orderDiscount = 0;
  const orderTotal = Math.max(0, orderSubtotal - orderDiscount);

  const isFree = orderTotal === 0;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedBkash, setCopiedBkash] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);

  const activeProvider = useMemo<'google' | 'facebook' | 'email' | null>(() => {
    if (authUser?.provider === 'google' || authUser?.provider === 'facebook' || authUser?.provider === 'email') {
      return authUser.provider;
    }
    const providerData = user?.providerData || [];
    if (providerData.some((p) => p.providerId === 'google.com')) return 'google';
    if (providerData.some((p) => p.providerId === 'facebook.com')) return 'facebook';
    if (user?.email) return 'email';
    return null;
  }, [authUser, user]);

  const isSocialAuthenticated = Boolean((authUser || user) && activeProvider);
  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);
  const authenticatedUid = authUser?.uid || user?.uid || '';
  const authenticatedPhoto = authUser?.photoURL || user?.photoURL || null;

  useEffect(() => {
    if (authUser || user) {
      const providerEmail = user?.providerData?.find((p) => p?.email)?.email || '';
      const resolvedName =
        authUser?.displayName ||
        user?.displayName ||
        user?.providerData?.find((p) => p?.displayName)?.displayName ||
        '';
      const resolvedEmail = (authUser?.email || user?.email || providerEmail || '').trim();
      const resolvedPhone = user?.phoneNumber || '';
      if (resolvedName) setFullName((prev) => prev || resolvedName);
      if (resolvedEmail) setEmail((prev) => prev || resolvedEmail);
      if (resolvedPhone) setPhone((prev) => prev || resolvedPhone);
      setSocialError(null);
    }
  }, [authUser, user]);

  const handleGoogleLogin = async () => {
    setSocialError(null);
    setSocialLoading('google');
    try {
      const session = await signInWithGoogle();
      if (session.displayName) setFullName(session.displayName);
      if (session.email) setEmail(session.email);
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        setSocialError('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (err?.code === 'auth/account-exists-with-different-credential') {
        setSocialError('An account already exists with this email using a different sign-in provider.');
      } else if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setSocialError(err?.message || 'Firebase Google authentication failed. Please try again.');
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    setSocialError(null);
    setSocialLoading('facebook');
    try {
      const session = await signInWithFacebook();
      if (session.displayName) setFullName(session.displayName);
      if (session.email) setEmail(session.email);
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        setSocialError('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (err?.code === 'auth/account-exists-with-different-credential') {
        setSocialError('An account already exists with this email using a different sign-in provider.');
      } else if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setSocialError(err?.message || 'Firebase Facebook authentication failed. Please try again.');
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState('');
  const [purchasedProducts, setPurchasedProducts] = useState<ShopProduct[]>([]);
  const [orderSheetSynced, setOrderSheetSynced] = useState<boolean>(false);
  const [orderEmailResult, setOrderEmailResult] = useState<OrderConfirmationEmailResult | null>(null);
  const [completedOrderSnapshot, setCompletedOrderSnapshot] = useState<{
    items: Array<{
      productId: string;
      slug?: string;
      title: string;
      category: string;
      productType?: string;
      format: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
    trxId: string;
  } | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailPreviewTab, setEmailPreviewTab] = useState<'rendered' | 'template'>('rendered');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
    previewUrl?: string;
  } | null>(null);

  const liveEmailPreview = useMemo(() => {
    const activeItems =
      completedOrderSnapshot?.items ||
      checkoutItems.map((item) => ({
        productId: item.product.id,
        slug: item.product.slug,
        title: item.product.title,
        category: item.product.category,
        productType: item.product.productType || inferProductType(item.product),
        format: item.product.format,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: item.product.price * item.quantity
      }));
    const activeSubtotal = completedOrderSnapshot?.subtotal ?? orderSubtotal;
    const activeDiscount = completedOrderSnapshot?.discount ?? orderDiscount;
    const activeTotal = completedOrderSnapshot?.total ?? orderTotal;
    const providerLabel = activeProvider === 'facebook' ? 'Facebook Auth' : 'Google Auth';
    const activeMethod =
      completedOrderSnapshot?.paymentMethod ||
      (activeTotal === 0 ? `Free Access (${providerLabel})` : `bKash Personal (${providerLabel})`);
    const activeTrxId =
      completedOrderSnapshot?.trxId || (activeTotal === 0 ? 'FREE-ACCESS' : trxId.trim().toUpperCase() || 'PENDING-TRX');

    return generateShopOrderEmailHtml({
      orderId: completedOrderNumber || `ACC-${new Date().getFullYear()}-PREVIEW`,
      customerName: fullName.trim() || 'Valued Client',
      customerEmail: email.trim().toLowerCase() || 'client@example.com',
      customerPhone: phone.trim() || '+880 17XX-XXXXXX',
      companyName: company.trim() || 'Direct Individual Client',
      items: activeItems,
      subtotal: activeSubtotal,
      discount: activeDiscount,
      totalCost: activeTotal,
      paymentMethod: activeMethod,
      trxId: activeTrxId
    });
  }, [
    completedOrderSnapshot,
    checkoutItems,
    orderSubtotal,
    orderDiscount,
    orderTotal,
    activeProvider,
    trxId,
    completedOrderNumber,
    fullName,
    email,
    phone,
    company
  ]);

  const handleCopyEmailTemplate = () => {
    navigator.clipboard.writeText(SHOP_ORDER_HTML_TEMPLATE);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleResendConfirmationEmail = async () => {
    if (!completedOrderSnapshot || !completedOrderNumber) return;
    setResendingEmail(true);
    try {
      const emailRes = await sendShopOrderConfirmationEmail({
        orderId: completedOrderNumber,
        customerName: fullName.trim() || 'Valued Client',
        customerEmail: email.trim().toLowerCase(),
        customerPhone: phone.trim(),
        companyName: company.trim() || 'Direct Individual Client',
        items: completedOrderSnapshot.items,
        subtotal: completedOrderSnapshot.subtotal,
        discount: completedOrderSnapshot.discount,
        totalCost: completedOrderSnapshot.total,
        paymentMethod: completedOrderSnapshot.paymentMethod,
        trxId: completedOrderSnapshot.trxId,
        authProvider: activeProvider === 'facebook' ? 'facebook' : 'google'
      });
      setOrderEmailResult(emailRes);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleCopyBkash = () => {
    navigator.clipboard.writeText('01744883636');
    setCopiedBkash(true);
    setTimeout(() => setCopiedBkash(false), 2000);
  };

  const handleSendTestOrderEmail = async () => {
    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      setTestEmailFeedback({
        type: 'error',
        text: 'Please enter a valid email address in the Email Address field above first.'
      });
      return;
    }

    setTestEmailSending(true);
    setTestEmailFeedback(null);
    try {
      const sampleOrderNum = completedOrderNumber || `ACC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const providerLabel =
        activeProvider === 'facebook'
          ? 'Facebook Auth'
          : activeProvider === 'google'
          ? 'Google Auth'
          : 'Verified Email';
      const methodLabel = isFree
        ? `Free Access (${providerLabel})`
        : `bKash Personal (${providerLabel})`;
      const resolvedTrxId = isFree ? 'FREE-ACCESS' : trxId.trim().toUpperCase() || 'VERIFIED-ORDER';

      const itemsList = checkoutItems.map((item) => ({
        productId: item.product.id,
        slug: item.product.slug,
        title: item.product.title,
        category: item.product.category,
        productType: item.product.productType || inferProductType(item.product),
        format: item.product.format,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: item.product.price * item.quantity
      }));

      const res = await sendShopOrderConfirmationEmail({
        orderId: sampleOrderNum,
        customerName: fullName.trim() || 'Valued Client',
        customerEmail: targetEmail,
        customerPhone: phone.trim() || '+880 17XX-XXXXXX',
        companyName: company.trim() || 'Direct Individual Client',
        items: itemsList,
        subtotal: orderSubtotal,
        discount: orderDiscount,
        totalCost: orderTotal,
        paymentMethod: methodLabel,
        trxId: resolvedTrxId,
        authProvider: activeProvider === 'facebook' ? 'facebook' : 'google'
      });

      setOrderEmailResult(res);
      setTestEmailFeedback({
        type: 'success',
        text: `Confirmation email dispatched to ${targetEmail} (${itemsList.length} item(s) • BDT ${orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`,
        previewUrl: res.previewUrl
      });
    } catch (err: any) {
      setTestEmailFeedback({
        type: 'error',
        text: err?.message || 'Unable to send confirmation email. Please check your email address.'
      });
    } finally {
      setTestEmailSending(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setSocialError('Please complete your full name, valid email address, and phone number.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSocialError('Please enter a valid email address to receive your order confirmation and digital kit.');
      return;
    }

    if (!isFree && !trxId.trim()) {
      setSocialError('Please enter your bKash Transaction ID (TrxID) to confirm your payment.');
      return;
    }

    setSocialError(null);
    setIsSubmitting(true);

    try {
      const firebaseCurrentUser = auth.currentUser || fallbackAuth.currentUser;
      if (firebaseCurrentUser) {
        await firebaseCurrentUser.getIdToken();
      }
      if (authenticatedUid) {
        await setDoc(
          doc(db, 'users', authenticatedUid),
          {
            email: email.trim().toLowerCase(),
            displayName: fullName.trim(),
            createdAt: serverTimestamp()
          },
          { merge: true }
        ).catch(() => {});
      }
    } catch {
      // Non-blocking profile sync fallback
    }

    const orderNum = `ACC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const prods = checkoutItems.map((i) => i.product);
    const providerLabel = activeProvider === 'facebook' ? 'Facebook Auth' : 'Google Auth';
    const methodLabel = isFree
      ? `Free Access (${providerLabel})`
      : `bKash Personal (${providerLabel})`;
    const resolvedTrxId = isFree ? 'FREE-ACCESS' : trxId.trim().toUpperCase();

    const orderItemsPayload = checkoutItems.map((item) => ({
      productId: item.product.id,
      slug: item.product.slug,
      title: item.product.title,
      category: item.product.category,
      productType: item.product.productType || inferProductType(item.product),
      format: item.product.format,
      quantity: item.quantity,
      unitPrice: item.product.price,
      lineTotal: item.product.price * item.quantity
    }));

    let syncedToSheet = false;
    try {
      const workspaceToken = getAccessToken() || '';
      const storedSheetId = getStoredShopSheetId() || '';

      const orderRes = await fetch('/api/shop/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(workspaceToken ? { 'x-workspace-token': workspaceToken } : {})
        },
        body: JSON.stringify({
          referenceId: orderNum,
          customerName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          companyName: company.trim() || 'Direct Individual Client',
          items: orderItemsPayload,
          subtotal: orderSubtotal,
          discount: orderDiscount,
          total: orderTotal,
          paymentMethod: methodLabel,
          trxId: resolvedTrxId,
          authProvider: activeProvider,
          status: 'Completed Order',
          workspaceAccessToken: workspaceToken,
          spreadsheetId: storedSheetId
        })
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        syncedToSheet = Boolean(orderData?.sheetSynced);
      }

      if (!syncedToSheet && workspaceToken) {
        const fallbackAppend = await appendShopOrderToSheet(
          {
            referenceId: orderNum,
            customerName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            companyName: company.trim() || 'Direct Individual Client',
            items: orderItemsPayload,
            subtotal: orderSubtotal,
            discount: orderDiscount,
            total: orderTotal,
            paymentMethod: methodLabel,
            trxId: resolvedTrxId,
            authProvider: activeProvider,
            status: 'Completed Order',
            submittedAt: new Date().toISOString()
          },
          workspaceToken
        );
        syncedToSheet = fallbackAppend.synced;
      }
    } catch {
      // Non-blocking order ledger fallback
    }

    // Automatically trigger Order Confirmation Email with itemized products & total cost
    try {
      const emailConfirmation = await sendShopOrderConfirmationEmail({
        orderId: orderNum,
        customerName: fullName.trim(),
        customerEmail: email.trim().toLowerCase(),
        customerPhone: phone.trim(),
        companyName: company.trim() || 'Direct Individual Client',
        items: orderItemsPayload,
        subtotal: orderSubtotal,
        discount: orderDiscount,
        totalCost: orderTotal,
        paymentMethod: methodLabel,
        trxId: resolvedTrxId,
        authProvider: activeProvider === 'facebook' ? 'facebook' : 'google'
      });
      setOrderEmailResult(emailConfirmation);
    } catch {
      // Non-blocking order confirmation fallback
    }

    setCompletedOrderSnapshot({
      items: orderItemsPayload,
      subtotal: orderSubtotal,
      discount: orderDiscount,
      total: orderTotal,
      paymentMethod: methodLabel,
      trxId: resolvedTrxId
    });
    setCompletedOrderNumber(orderNum);
    setPurchasedProducts(prods);
    setOrderSheetSynced(syncedToSheet);
    prods.forEach((p) => purchaseProduct(p.id, p.title, p.price, methodLabel, 'completed'));
    setIsSubmitting(false);
    setIsOrderComplete(true);
    if (!singleProduct) {
      clearCart();
    }
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
Verified Social Account: ${email} (${activeProvider === 'facebook' ? 'Facebook' : 'Google'} Firebase Auth)
Firebase UID: ${authenticatedUid || 'Verified'}
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
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  to="/student/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md hover:bg-emerald-300 transition-all shrink-0"
                >
                  <span>Open Student Learning Portal</span>
                  <ExternalLink className="w-4 h-4 text-slate-900" />
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-emerald-950 font-black text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-all shrink-0"
                >
                  <span>Go to My Purchases</span>
                  <ExternalLink className="w-4 h-4 text-emerald-700" />
                </Link>
              </div>
            </div>


            {/* Order Confirmation Email Panel */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                      <span>Automated Order Confirmation</span>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        · {completedOrderSnapshot?.items.length || purchasedProducts.length} Item(s) · BDT {(completedOrderSnapshot?.total ?? orderTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {orderEmailResult?.message ||
                        `Order confirmation email generated for ${email} confirming itemized products and total settlement cost.`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowEmailPreview((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{showEmailPreview ? 'Hide Email Preview' : 'View Confirmation Email'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResendConfirmationEmail}
                    disabled={resendingEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{resendingEmail ? 'Sending...' : 'Resend Confirmation'}</span>
                  </button>
                </div>
              </div>

              {showEmailPreview && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setEmailPreviewTab('rendered')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          emailPreviewTab === 'rendered'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Rendered Customer Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailPreviewTab('template')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          emailPreviewTab === 'template'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        HTML Template
                      </button>
                    </div>

                    {emailPreviewTab === 'template' && (
                      <button
                        type="button"
                        onClick={handleCopyEmailTemplate}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{copiedTemplate ? 'Copied HTML Template!' : 'Copy HTML Template'}</span>
                      </button>
                    )}
                  </div>

                  {emailPreviewTab === 'rendered' ? (
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                      <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900">Subject:</span>{' '}
                          <span>{orderEmailResult?.subject || liveEmailPreview.subject}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          To: <strong className="text-slate-800">{email}</strong>
                        </div>
                      </div>
                      <div
                        className="max-h-[520px] overflow-y-auto"
                        dangerouslySetInnerHTML={{
                          __html: orderEmailResult?.html || liveEmailPreview.html
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-[11px] text-slate-600">
                        Dynamic variables include{' '}
                        <code className="font-mono text-emerald-700">{'{{order_id}}'}</code>,{' '}
                        <code className="font-mono text-emerald-700">{'{{to_name}}'}</code>,{' '}
                        <code className="font-mono text-emerald-700">{'{{{items_rows_html}}}'}</code>,{' '}
                        <code className="font-mono text-emerald-700">{'{{subtotal_bdt}}'}</code>,{' '}
                        <code className="font-mono text-emerald-700">{'{{discount_bdt}}'}</code>, and{' '}
                        <code className="font-mono text-emerald-700">{'{{total_cost_bdt}}'}</code>.
                      </div>
                      <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-80 leading-relaxed">
                        {SHOP_ORDER_HTML_TEMPLATE}
                      </pre>
                    </div>
                  )}
                </div>
              )}
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

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
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
          <form
            onSubmit={handleSubmitOrder}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-start"
          >
            
            {/* Left Column: Contact & Payment (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Customer Details Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
                    <span>Customer &amp; Delivery Details</span>
                  </h2>
                  {isSocialAuthenticated ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Verified via{' '}
                        {activeProvider === 'facebook'
                          ? 'Facebook'
                          : activeProvider === 'google'
                          ? 'Google'
                          : 'Authenticated Session'}
                      </span>
                    </span>
                  ) : isEmailValid ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivery Email Ready</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full w-fit">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sign In or Enter Delivery Email</span>
                    </span>
                  )}
                </div>

                {/* Express Social Login Options (Google & Facebook) */}
                <div
                  className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                    isSocialAuthenticated
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {isSocialAuthenticated && (
                        authenticatedPhoto ? (
                          <img
                            src={authenticatedPhoto}
                            alt={fullName || 'Verified User'}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                            {(fullName || email || 'U').charAt(0).toUpperCase()}
                          </div>
                        )
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>
                            {isSocialAuthenticated
                              ? 'Firebase Authenticated Client Account'
                              : '1-Click Express Auto-Fill (Google or Facebook)'}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                          {isSocialAuthenticated
                            ? `Signed in as ${email || authUser?.email || user?.email || fullName}. Order confirmation will be emailed to your address below.`
                            : 'Sign in with Google or Facebook to auto-fill your profile, or enter your delivery email and details directly below.'}
                        </p>
                      </div>
                    </div>
                    {isSocialAuthenticated && (
                      <button
                        type="button"
                        onClick={logout}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>

                  {socialError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700 font-medium">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{socialError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={socialLoading !== null}
                      className={`w-full py-3 px-4 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer ${
                        activeProvider === 'google'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-slate-400 ring-1 ring-slate-900/5'
                      } disabled:opacity-60`}
                    >
                      <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>
                        {socialLoading === 'google'
                          ? 'Connecting Google...'
                          : activeProvider === 'google'
                          ? 'Signed in with Google ✓'
                          : 'Sign in with Google'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFacebookLogin}
                      disabled={socialLoading !== null}
                      className={`w-full py-3 px-4 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer ${
                        activeProvider === 'facebook'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2]'
                      } disabled:opacity-60`}
                    >
                      <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>
                        {socialLoading === 'facebook'
                          ? 'Connecting Facebook...'
                          : activeProvider === 'facebook'
                          ? 'Signed in with Facebook ✓'
                          : 'Sign in with Facebook'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="shrink-0 mx-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Client &amp; Delivery Information
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

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
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Email Address (Order Receipt &amp; Kit) *</span>
                        {isEmailValid && (
                          <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Verified Format
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (testEmailFeedback) setTestEmailFeedback(null);
                          }}
                          placeholder="yourname@example.com"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                        />
                      </div>
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
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Instant Order Confirmation Email Delivery Bar */}
                  <div className="hidden p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-emerald-950 flex flex-wrap items-center gap-1.5">
                            <span>Automated Order Confirmation Email</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 font-bold">
                              SMTP Active
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-800 mt-0.5 truncate">
                            {isEmailValid
                              ? `Receipt for ${checkoutItems.length} item(s) (BDT ${orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) will be sent to ${email.trim().toLowerCase()}`
                              : 'Enter your email address above to receive your itemized order confirmation & download links.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleSendTestOrderEmail}
                          disabled={testEmailSending || !isEmailValid}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-extrabold transition-colors cursor-pointer shadow-2xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>{testEmailSending ? 'Sending...' : 'Send Confirmation Mail'}</span>
                        </button>
                      </div>
                    </div>

                    {testEmailFeedback && (
                      <div
                        className={`p-2.5 rounded-xl border text-[11px] font-semibold flex flex-wrap items-center justify-between gap-2 ${
                          testEmailFeedback.type === 'success'
                            ? 'bg-white border-emerald-300 text-emerald-900'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {testEmailFeedback.type === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          )}
                          <span>{testEmailFeedback.text}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowEmailPreview(true);
                              setEmailPreviewTab('rendered');
                            }}
                            className="underline font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                          >
                            View Sent Email
                          </button>
                          {testEmailFeedback.previewUrl && (
                            <a
                              href={testEmailFeedback.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold hover:bg-emerald-200"
                            >
                              <span>SMTP Inbox</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
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
                          placeholder="[Enter Your bKash Transaction ID]"
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
                      <h4 className="font-extrabold text-base text-emerald-900">Total Due: BDT 0.00 (Free Access)</h4>
                      <p className="text-emerald-800 mt-1 leading-relaxed">
                        Payment method is hidden because the total due amount equals <strong>BDT 0.00</strong>. No bKash payment or transaction ID is needed. Enter your email details above and confirm your order below to unlock instant downloads.
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
                        BDT {(item.product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal Amount:</span>
                    <span 
                      className="font-bold text-slate-900 text-[10px]"
                      style={{ fontSize: '10px' }}
                    >
                      BDT {orderSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {orderDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount Savings:</span>
                      <span>-BDT {orderDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1">
                    <span>Confirmation Email:</span>
                    {isEmailValid ? (
                      <span className="font-extrabold text-emerald-700 truncate max-w-[180px]">
                        {email.trim().toLowerCase()}
                      </span>
                    ) : (
                      <span className="font-extrabold text-amber-700">
                        Enter Email in Step 1
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total Due:</span>
                    <span className="text-lg text-emerald-700 font-black">
                      BDT {orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    className="w-full py-4 px-5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Processing Order &amp; Sending Email...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          {isFree 
                            ? 'Confirm Order • Free (BDT 0.00)' 
                            : `Confirm Order • BDT ${orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Order Confirmation Template Inspector & Live Preview */}
              <div className="hidden bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900">
                        Automated Order Confirmation
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Triggers automatically on submission to confirm your {checkoutItems.length} item(s) and{' '}
                        <strong className="text-slate-800">BDT {orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> total cost.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmailPreview((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors shrink-0 cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{showEmailPreview ? 'Hide Template' : 'Preview Template'}</span>
                  </button>
                </div>

                {showEmailPreview && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setEmailPreviewTab('rendered')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                            emailPreviewTab === 'rendered'
                              ? 'bg-white text-slate-900 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Live Email Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmailPreviewTab('template')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                            emailPreviewTab === 'template'
                              ? 'bg-white text-slate-900 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          HTML Source
                        </button>
                      </div>

                      {emailPreviewTab === 'template' && (
                        <button
                          type="button"
                          onClick={handleCopyEmailTemplate}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3 text-emerald-400" />
                          <span>{copiedTemplate ? 'Copied!' : 'Copy HTML'}</span>
                        </button>
                      )}
                    </div>

                    {emailPreviewTab === 'rendered' ? (
                      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 truncate">
                          <strong className="text-slate-900">Subject:</strong> {liveEmailPreview.subject}
                        </div>
                        <div
                          className="max-h-96 overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: liveEmailPreview.html }}
                        />
                      </div>
                    ) : (
                      <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 text-[10px] font-mono overflow-x-auto max-h-72 leading-relaxed">
                        {SHOP_ORDER_HTML_TEMPLATE}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
