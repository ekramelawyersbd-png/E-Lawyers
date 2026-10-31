import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, fallbackAuth } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { SHOP_PRODUCTS, ShopProduct } from '../data/shopProducts';
import { generatePdfReceipt } from '../utils/receiptGenerator';

export type PaymentStatus = 'completed' | 'pending' | 'refunded' | 'failed';
export type AccessStatus = 'active' | 'pending' | 'revoked';
export type ProductAccessState = 'completed' | 'pending' | 'none';

export interface TransactionRecord {
  id: string;
  purchaseId: string;
  userId: string;
  userEmail?: string;
  productId: string;
  productSlug?: string;
  productTitle: string;
  productName: string;
  orderId: string;
  referenceId?: string;
  transactionId: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  paymentStatus: PaymentStatus;
  accessStatus: AccessStatus;
  paymentMethod: string;
  date: string;
  purchaseDate: string;
  accessExpiryDate: string | null;
  refundedAt?: string;
  refundReason?: string;
}

export interface PurchaseOptions {
  productSlug?: string;
  orderId?: string;
  transactionId?: string;
  userIdOverride?: string;
  userEmailOverride?: string;
  userNameOverride?: string;
  accessExpiryDate?: string | null;
}

interface PurchaseContextType {
  activeUserId: string | null;
  activeUserEmail: string | null;
  isUserLoggedIn: boolean;
  purchasedProductIds: string[];
  pendingProductIds: string[];
  transactions: TransactionRecord[];
  isPurchased: (productIdOrSlug: string) => boolean;
  isPendingPurchase: (productIdOrSlug: string) => boolean;
  getProductAccessState: (productIdOrSlug: string) => ProductAccessState;
  getPurchaseRecord: (productIdOrSlug: string) => TransactionRecord | undefined;
  purchaseProduct: (
    productId: string,
    productTitle?: string,
    amount?: number,
    paymentMethod?: string,
    status?: 'completed' | 'pending',
    options?: PurchaseOptions
  ) => TransactionRecord | null;
  simulateInstantPurchase: (product: ShopProduct) => void;
  verifyPendingTransaction: (transactionId: string) => void;
  downloadReceipt: (tx: TransactionRecord) => void;
  processRefund: (transactionId: string, refundReason?: string) => void;
  bindCheckoutIdentity: (email: string, name?: string) => string;
}

const PurchaseContext = createContext<PurchaseContextType | null>(null);

const LEGACY_STORAGE_KEY = 'accounticca_purchased_products';
const LEGACY_TRANSACTIONS_KEY = 'accounticca_payment_history';
const CHECKOUT_IDENTITY_KEY = 'accounticca_checkout_client_identity';

const getUserTransactionsKey = (userId: string) => `accounticca_user_tx_${userId}`;
const getEmailTransactionsKey = (email: string) => `accounticca_email_tx_${email.trim().toLowerCase()}`;

function createDeterministicUserIdFromEmail(email: string): string {
  const clean = email.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  return `USR-${Math.abs(hash).toString(36).toUpperCase()}-${clean.replace(/[^a-z0-9]/g, '').slice(0, 10)}`;
}

function resolveCanonicalProduct(productIdOrSlug: string): { id: string; slug: string; title: string } {
  const clean = (productIdOrSlug || '').trim();
  const found = SHOP_PRODUCTS.find(
    (p) =>
      p.id === clean ||
      p.slug === clean ||
      p.title.toLowerCase() === clean.toLowerCase() ||
      (p.coursePath && p.coursePath === clean)
  );
  if (found) {
    return { id: found.id, slug: found.slug, title: found.title };
  }
  return { id: clean, slug: clean, title: clean || 'Digital Compliance Product' };
}

function normalizeTransactionRecord(raw: any, fallbackUserId: string): TransactionRecord {
  const canonical = resolveCanonicalProduct(raw.productId || raw.productSlug || raw.productTitle || raw.id);
  const status: 'completed' | 'pending' | 'refunded' =
    raw.status === 'refunded' || raw.paymentStatus === 'refunded'
      ? 'refunded'
      : raw.status === 'pending' || raw.paymentStatus === 'pending'
      ? 'pending'
      : 'completed';

  const paymentStatus: PaymentStatus =
    raw.paymentStatus || status;

  const accessStatus: AccessStatus =
    raw.accessStatus ||
    (status === 'completed' ? 'active' : status === 'pending' ? 'pending' : 'revoked');

  const dateIso = raw.purchaseDate || raw.date || new Date().toISOString();
  const orderId = raw.orderId || raw.referenceId || `ACC-${new Date().getFullYear()}-100001`;
  const purchaseId = raw.purchaseId || raw.id || `PUR-${Date.now()}`;

  return {
    id: purchaseId,
    purchaseId,
    userId: raw.userId || fallbackUserId,
    userEmail: raw.userEmail || '',
    productId: raw.productId || canonical.id,
    productSlug: raw.productSlug || canonical.slug,
    productTitle: raw.productTitle || raw.productName || canonical.title,
    productName: raw.productName || raw.productTitle || canonical.title,
    orderId,
    referenceId: orderId,
    transactionId: raw.transactionId || `PAY-TXN-1000001`,
    amount: typeof raw.amount === 'number' ? raw.amount : Number(raw.amount) || 0,
    status,
    paymentStatus,
    accessStatus,
    paymentMethod: raw.paymentMethod || 'SSL Secure Gateway',
    date: dateIso,
    purchaseDate: dateIso,
    accessExpiryDate: raw.accessExpiryDate ?? null,
    refundedAt: raw.refundedAt,
    refundReason: raw.refundReason
  };
}

function deduplicateTransactions(txs: TransactionRecord[]): TransactionRecord[] {
  const byKey = new Map<string, TransactionRecord>();
  for (const tx of txs) {
    // Key by productId + status priority or purchaseId
    const key = tx.purchaseId || tx.id;
    if (!byKey.has(key)) {
      byKey.set(key, tx);
    } else {
      const existing = byKey.get(key)!;
      // Prefer updated status (e.g. refunded or completed over pending)
      if (tx.status !== existing.status) {
        byKey.set(key, tx);
      }
    }
  }
  return Array.from(byKey.values()).sort(
    (a, b) => new Date(b.purchaseDate || b.date).getTime() - new Date(a.purchaseDate || a.date).getTime()
  );
}

export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchases must be used within a PurchaseProvider');
  }
  return context;
};

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authUser } = useAuth();

  // Optional checkout identity if a customer completed checkout with email before full OAuth login
  const [checkoutIdentity, setCheckoutIdentity] = useState<{
    uid: string;
    email: string;
    name?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem(CHECKOUT_IDENTITY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Clear legacy global non-user-scoped keys once so hardcoded defaults never leak across users
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem(LEGACY_TRANSACTIONS_KEY);
    } catch {}
  }, []);

  // When user logs out of Firebase Auth, also clear any temporary checkout identity
  const prevAuthUidRef = React.useRef<string | null>(null);
  useEffect(() => {
    const currentFirebaseUid = user?.uid || authUser?.uid || null;
    if (prevAuthUidRef.current && !currentFirebaseUid) {
      // User explicitly logged out
      setCheckoutIdentity(null);
      try {
        localStorage.removeItem(CHECKOUT_IDENTITY_KEY);
      } catch {}
    }
    prevAuthUidRef.current = currentFirebaseUid;
  }, [user?.uid, authUser?.uid]);

  const activeUserId = useMemo<string | null>(() => {
    if (user?.uid) return user.uid;
    if (authUser?.uid) return authUser.uid;
    if (checkoutIdentity?.uid) return checkoutIdentity.uid;
    return null;
  }, [user?.uid, authUser?.uid, checkoutIdentity?.uid]);

  const activeUserEmail = useMemo<string | null>(() => {
    const raw =
      user?.email ||
      authUser?.email ||
      user?.providerData?.[0]?.email ||
      checkoutIdentity?.email ||
      null;
    return raw ? raw.trim().toLowerCase() : null;
  }, [user, authUser, checkoutIdentity]);

  const isUserLoggedIn = Boolean(activeUserId);

  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  // Load user-specific purchases from localStorage and merge email-matched purchases on login
  useEffect(() => {
    if (!activeUserId) {
      setTransactions([]);
      return;
    }

    let merged: TransactionRecord[] = [];
    try {
      const userSaved = localStorage.getItem(getUserTransactionsKey(activeUserId));
      if (userSaved) {
        const parsed = JSON.parse(userSaved);
        if (Array.isArray(parsed)) {
          merged.push(...parsed.map((item) => normalizeTransactionRecord(item, activeUserId)));
        }
      }

      if (activeUserEmail) {
        const emailSaved = localStorage.getItem(getEmailTransactionsKey(activeUserEmail));
        if (emailSaved) {
          const parsedEmail = JSON.parse(emailSaved);
          if (Array.isArray(parsedEmail)) {
            const normalizedEmailTxs = parsedEmail.map((item) =>
              normalizeTransactionRecord({ ...item, userId: activeUserId, userEmail: activeUserEmail }, activeUserId)
            );
            merged.push(...normalizedEmailTxs);
          }
        }
      }
    } catch {}

    const deduped = deduplicateTransactions(merged);
    setTransactions(deduped);

    try {
      localStorage.setItem(getUserTransactionsKey(activeUserId), JSON.stringify(deduped));
      if (activeUserEmail) {
        localStorage.setItem(getEmailTransactionsKey(activeUserEmail), JSON.stringify(deduped));
      }
    } catch {}
  }, [activeUserId, activeUserEmail]);

  // Real-time Firestore synchronization for the logged-in user's purchases
  useEffect(() => {
    if (!activeUserId) return;
    // Only attach Firestore listener when fallbackAuth is signed in with matching UID to satisfy firestore.rules
    const firestoreUid = fallbackAuth.currentUser?.uid;
    if (!firestoreUid || firestoreUid !== activeUserId) return;

    const q = query(collection(db, 'user_purchases'), where('userId', '==', activeUserId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) return;
        const remoteRecords: TransactionRecord[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          remoteRecords.push(normalizeTransactionRecord({ ...data, id: docSnap.id }, activeUserId));
        });

        setTransactions((prev) => {
          const combined = deduplicateTransactions([...remoteRecords, ...prev]);
          try {
            localStorage.setItem(getUserTransactionsKey(activeUserId), JSON.stringify(combined));
            if (activeUserEmail) {
              localStorage.setItem(getEmailTransactionsKey(activeUserEmail), JSON.stringify(combined));
            }
          } catch {}
          return combined;
        });
      },
      () => {
        // Silent fallback to user-scoped local cache if offline
      }
    );

    return () => unsubscribe();
  }, [activeUserId, activeUserEmail]);

  // Listen to cross-tab storage updates for instant synchronization across browser tabs/pages
  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (!activeUserId) return;
      if (e.key === getUserTransactionsKey(activeUserId) && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setTransactions(deduplicateTransactions(parsed.map((item) => normalizeTransactionRecord(item, activeUserId))));
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, [activeUserId]);

  const persistTransactionsForUser = useCallback(
    (uid: string, email: string | null, updated: TransactionRecord[]) => {
      try {
        localStorage.setItem(getUserTransactionsKey(uid), JSON.stringify(updated));
        if (email) {
          localStorage.setItem(getEmailTransactionsKey(email), JSON.stringify(updated));
        }
      } catch {}
    },
    []
  );

  // Derived list of verified & active product IDs for the currently logged-in user
  const purchasedProductIds = useMemo<string[]>(() => {
    if (!activeUserId) return [];
    const ids = new Set<string>();
    for (const tx of transactions) {
      if (
        tx.userId === activeUserId &&
        tx.paymentStatus === 'completed' &&
        tx.accessStatus === 'active'
      ) {
        if (tx.productId) ids.add(tx.productId);
        if (tx.productSlug) ids.add(tx.productSlug);
        const canonical = resolveCanonicalProduct(tx.productId || tx.productTitle);
        if (canonical.id) ids.add(canonical.id);
        if (canonical.slug) ids.add(canonical.slug);
      }
    }
    return Array.from(ids);
  }, [activeUserId, transactions]);

  // Derived list of pending product IDs for the currently logged-in user
  const pendingProductIds = useMemo<string[]>(() => {
    if (!activeUserId) return [];
    const ids = new Set<string>();
    for (const tx of transactions) {
      if (
        tx.userId === activeUserId &&
        (tx.paymentStatus === 'pending' || tx.accessStatus === 'pending')
      ) {
        if (tx.productId && !purchasedProductIds.includes(tx.productId)) {
          ids.add(tx.productId);
        }
        if (tx.productSlug && !purchasedProductIds.includes(tx.productSlug)) {
          ids.add(tx.productSlug);
        }
        const canonical = resolveCanonicalProduct(tx.productId || tx.productTitle);
        if (canonical.id && !purchasedProductIds.includes(canonical.id)) {
          ids.add(canonical.id);
        }
        if (canonical.slug && !purchasedProductIds.includes(canonical.slug)) {
          ids.add(canonical.slug);
        }
      }
    }
    return Array.from(ids);
  }, [activeUserId, transactions, purchasedProductIds]);

  const isPurchased = useCallback(
    (productIdOrSlug: string): boolean => {
      if (!activeUserId || !productIdOrSlug) return false;
      const clean = productIdOrSlug.trim();
      if (purchasedProductIds.includes(clean)) return true;
      const canonical = resolveCanonicalProduct(clean);
      return purchasedProductIds.includes(canonical.id) || purchasedProductIds.includes(canonical.slug);
    },
    [activeUserId, purchasedProductIds]
  );

  const isPendingPurchase = useCallback(
    (productIdOrSlug: string): boolean => {
      if (!activeUserId || !productIdOrSlug) return false;
      if (isPurchased(productIdOrSlug)) return false;
      const clean = productIdOrSlug.trim();
      if (pendingProductIds.includes(clean)) return true;
      const canonical = resolveCanonicalProduct(clean);
      return pendingProductIds.includes(canonical.id) || pendingProductIds.includes(canonical.slug);
    },
    [activeUserId, pendingProductIds, isPurchased]
  );

  const getProductAccessState = useCallback(
    (productIdOrSlug: string): ProductAccessState => {
      if (!activeUserId || !productIdOrSlug) return 'none';
      if (isPurchased(productIdOrSlug)) return 'completed';
      if (isPendingPurchase(productIdOrSlug)) return 'pending';
      return 'none';
    },
    [activeUserId, isPurchased, isPendingPurchase]
  );

  const getPurchaseRecord = useCallback(
    (productIdOrSlug: string): TransactionRecord | undefined => {
      if (!activeUserId || !productIdOrSlug) return undefined;
      const canonical = resolveCanonicalProduct(productIdOrSlug);
      return transactions.find(
        (tx) =>
          tx.userId === activeUserId &&
          (tx.productId === productIdOrSlug ||
            tx.productSlug === productIdOrSlug ||
            tx.productId === canonical.id ||
            tx.productSlug === canonical.slug ||
            tx.productTitle.toLowerCase() === canonical.title.toLowerCase())
      );
    },
    [activeUserId, transactions]
  );

  const bindCheckoutIdentity = useCallback(
    (email: string, name?: string): string => {
      const cleanEmail = email.trim().toLowerCase();
      if (user?.uid) return user.uid;
      if (authUser?.uid) return authUser.uid;
      const deterministicUid = createDeterministicUserIdFromEmail(cleanEmail);
      const identity = { uid: deterministicUid, email: cleanEmail, name };
      setCheckoutIdentity(identity);
      try {
        localStorage.setItem(CHECKOUT_IDENTITY_KEY, JSON.stringify(identity));
      } catch {}
      return deterministicUid;
    },
    [user?.uid, authUser?.uid]
  );

  const purchaseProduct = useCallback(
    (
      productId: string,
      productTitle: string = 'Digital Compliance Product',
      amount: number = 1500,
      paymentMethod: string = 'SSL Secure Gateway',
      status: 'completed' | 'pending' = 'completed',
      options?: PurchaseOptions
    ): TransactionRecord | null => {
      const canonical = resolveCanonicalProduct(productId || productTitle);
      const resolvedEmail = (
        options?.userEmailOverride ||
        activeUserEmail ||
        ''
      )
        .trim()
        .toLowerCase();

      let targetUserId = options?.userIdOverride || activeUserId;
      if (!targetUserId && resolvedEmail) {
        targetUserId = bindCheckoutIdentity(resolvedEmail, options?.userNameOverride);
      }
      if (!targetUserId) {
        // Fallback session user ID if neither Firebase Auth nor email was provided
        targetUserId = bindCheckoutIdentity('client@accounticca.com', 'Verified Client');
      }

      const nowIso = new Date().toISOString();
      const orderId =
        options?.orderId ||
        `ACC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const txId =
        options?.transactionId ||
        `PAY-TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const purchaseDocId = `PUR-${targetUserId.slice(0, 12)}-${canonical.id}`;

      const paymentStatus: PaymentStatus = status === 'pending' ? 'pending' : 'completed';
      const accessStatus: AccessStatus = status === 'pending' ? 'pending' : 'active';

      const newRecord: TransactionRecord = {
        id: purchaseDocId,
        purchaseId: purchaseDocId,
        userId: targetUserId,
        userEmail: resolvedEmail,
        productId: canonical.id,
        productSlug: options?.productSlug || canonical.slug,
        productTitle: productTitle || canonical.title,
        productName: productTitle || canonical.title,
        orderId,
        referenceId: orderId,
        transactionId: txId,
        amount,
        status,
        paymentStatus,
        accessStatus,
        paymentMethod,
        date: nowIso,
        purchaseDate: nowIso,
        accessExpiryDate: options?.accessExpiryDate ?? null
      };

      setTransactions((prev) => {
        // Prevent duplicate active purchase records for the same user + product
        const existingCompleted = prev.find(
          (item) =>
            item.userId === targetUserId &&
            (item.productId === canonical.id || item.productSlug === canonical.slug) &&
            item.paymentStatus === 'completed' &&
            item.accessStatus === 'active'
        );
        if (existingCompleted && status === 'completed') {
          return prev;
        }

        const filtered = prev.filter(
          (item) =>
            !(
              item.userId === targetUserId &&
              (item.productId === canonical.id || item.productSlug === canonical.slug)
            )
        );
        const updated = deduplicateTransactions([newRecord, ...filtered]);
        persistTransactionsForUser(targetUserId!, resolvedEmail || null, updated);
        return updated;
      });

      // Persist to Firestore if authenticated on the Firestore project
      const firestoreUid = fallbackAuth.currentUser?.uid;
      if (firestoreUid && firestoreUid === targetUserId) {
        const docRef = doc(db, 'user_purchases', `${targetUserId}_${canonical.id}`);
        setDoc(
          docRef,
          {
            ...newRecord,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
          },
          { merge: true }
        ).catch(() => {});
      }

      return newRecord;
    },
    [activeUserId, activeUserEmail, bindCheckoutIdentity, persistTransactionsForUser]
  );

  const simulateInstantPurchase = useCallback(
    (product: ShopProduct) => {
      purchaseProduct(product.id, product.title, product.price, 'SSL Secure Gateway', 'completed', {
        productSlug: product.slug
      });
    },
    [purchaseProduct]
  );

  const verifyPendingTransaction = useCallback(
    (transactionId: string) => {
      if (!activeUserId) return;
      setTransactions((prev) => {
        const updated = prev.map((tx) => {
          if (tx.transactionId === transactionId || tx.id === transactionId || tx.purchaseId === transactionId) {
            const verifiedTx: TransactionRecord = {
              ...tx,
              status: 'completed',
              paymentStatus: 'completed',
              accessStatus: 'active'
            };
            const firestoreUid = fallbackAuth.currentUser?.uid;
            if (firestoreUid && firestoreUid === activeUserId) {
              const docRef = doc(db, 'user_purchases', `${activeUserId}_${tx.productId}`);
              setDoc(docRef, { ...verifiedTx, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
            }
            return verifiedTx;
          }
          return tx;
        });
        persistTransactionsForUser(activeUserId, activeUserEmail, updated);
        return updated;
      });
    },
    [activeUserId, activeUserEmail, persistTransactionsForUser]
  );

  const downloadReceipt = useCallback((tx: TransactionRecord) => {
    generatePdfReceipt(tx);
  }, []);

  const processRefund = useCallback(
    (transactionId: string, refundReason: string = 'Admin processed refund') => {
      setTransactions((prev) => {
        const updated = prev.map((tx) => {
          if (tx.transactionId === transactionId || tx.id === transactionId || tx.purchaseId === transactionId) {
            const refundedTx: TransactionRecord = {
              ...tx,
              status: 'refunded',
              paymentStatus: 'refunded',
              accessStatus: 'revoked',
              refundedAt: new Date().toISOString(),
              refundReason
            };
            const firestoreUid = fallbackAuth.currentUser?.uid;
            if (firestoreUid && firestoreUid === tx.userId) {
              const docRef = doc(db, 'user_purchases', `${tx.userId}_${tx.productId}`);
              setDoc(docRef, { ...refundedTx, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
            }
            return refundedTx;
          }
          return tx;
        });
        if (activeUserId) {
          persistTransactionsForUser(activeUserId, activeUserEmail, updated);
        }
        return updated;
      });
    },
    [activeUserId, activeUserEmail, persistTransactionsForUser]
  );

  return (
    <PurchaseContext.Provider
      value={{
        activeUserId,
        activeUserEmail,
        isUserLoggedIn,
        purchasedProductIds,
        pendingProductIds,
        transactions,
        isPurchased,
        isPendingPurchase,
        getProductAccessState,
        getPurchaseRecord,
        purchaseProduct,
        simulateInstantPurchase,
        verifyPendingTransaction,
        downloadReceipt,
        processRefund,
        bindCheckoutIdentity
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
