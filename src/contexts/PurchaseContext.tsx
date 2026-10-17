import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShopProduct } from '../data/shopProducts';
import { generatePdfReceipt } from '../utils/receiptGenerator';

export interface TransactionRecord {
  id: string;
  transactionId: string;
  productTitle: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
  paymentMethod: string;
  date: string;
  referenceId?: string;
  refundedAt?: string;
  refundReason?: string;
}

interface PurchaseContextType {
  purchasedProductIds: string[];
  transactions: TransactionRecord[];
  isPurchased: (productId: string) => boolean;
  purchaseProduct: (productId: string, productTitle?: string, amount?: number, paymentMethod?: string, status?: 'completed' | 'pending') => void;
  simulateInstantPurchase: (product: ShopProduct) => void;
  downloadReceipt: (tx: TransactionRecord) => void;
  processRefund: (transactionId: string, refundReason?: string) => void;
}

const PurchaseContext = createContext<PurchaseContextType | null>(null);

const STORAGE_KEY = 'accounticca_purchased_products';
const TRANSACTIONS_KEY = 'accounticca_payment_history';

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TXN-2026-101',
    transactionId: 'PAY-TXN-9988776',
    productTitle: 'Income Tax Return & Assessment Workbook (2026-27)',
    amount: 1500,
    status: 'completed',
    paymentMethod: 'SSL Secure Gateway',
    date: '2026-10-15T14:30:00.000Z',
    referenceId: 'ACC-2026-849201'
  },
  {
    id: 'TXN-2026-102',
    transactionId: 'BKASH-TRX-5544332',
    productTitle: 'Corporate Legal & Compliance Agreement Bundle',
    amount: 3500,
    status: 'completed',
    paymentMethod: 'bKash Personal',
    date: '2026-10-10T09:15:00.000Z',
    referenceId: 'ACC-2026-739102'
  },
  {
    id: 'TXN-2026-103',
    transactionId: 'PENDING-TRX-8821',
    productTitle: 'VAT & SD Act Audit Checklist & Reconciliations',
    amount: 2500,
    status: 'pending',
    paymentMethod: 'Bank Transfer (City Bank)',
    date: '2026-10-15T17:55:00.000Z',
    referenceId: 'ACC-2026-991204'
  }
];

export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchases must be used within a PurchaseProvider');
  }
  return context;
};

const deduplicateAndEnsureUniqueIds = (txs: TransactionRecord[]): TransactionRecord[] => {
  const seenIds = new Set<string>();
  return txs.map((tx, index) => {
    let id = tx.id;
    if (!id || seenIds.has(id)) {
      id = `${id || 'TXN'}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
    }
    seenIds.add(id);
    return {
      ...tx,
      id
    };
  });
};

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return ['income-tax-return-workbook-2026', 'corporate-compliance-bundle'];
    } catch {
      return ['income-tax-return-workbook-2026', 'corporate-compliance-bundle'];
    }
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(TRANSACTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return deduplicateAndEnsureUniqueIds(parsed);
        }
      }
      return INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(purchasedProductIds));
    } catch {}
  }, [purchasedProductIds]);

  useEffect(() => {
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  const isPurchased = useCallback((productId: string) => {
    return purchasedProductIds.includes(productId);
  }, [purchasedProductIds]);

  const purchaseProduct = useCallback((
    productId: string, 
    productTitle: string = 'Digital Compliance Product', 
    amount: number = 1500, 
    paymentMethod: string = 'SSL Secure Gateway', 
    status: 'completed' | 'pending' = 'completed'
  ) => {
    setPurchasedProductIds(prev => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });

    const uniqueEntropy = `${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(2, 7)}`;
    const newTx: TransactionRecord = {
      id: `TXN-${Date.now()}-${uniqueEntropy}`,
      transactionId: `PAY-TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      productTitle,
      amount,
      status,
      paymentMethod,
      date: new Date().toISOString(),
      referenceId: `ACC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setTransactions(prev => [newTx, ...prev]);
  }, []);

  const simulateInstantPurchase = useCallback((product: ShopProduct) => {
    purchaseProduct(product.id, product.title, product.price, 'SSL Secure Gateway', 'completed');
  }, [purchaseProduct]);

  const downloadReceipt = useCallback((tx: TransactionRecord) => {
    generatePdfReceipt(tx);
  }, []);

  const processRefund = useCallback((transactionId: string, refundReason: string = 'Admin processed refund') => {
    setTransactions(prev => prev.map(tx => {
      if (tx.transactionId === transactionId || tx.id === transactionId) {
        return {
          ...tx,
          status: 'refunded',
          refundedAt: new Date().toISOString(),
          refundReason
        };
      }
      return tx;
    }));
  }, []);

  return (
    <PurchaseContext.Provider value={{ purchasedProductIds, transactions, isPurchased, purchaseProduct, simulateInstantPurchase, downloadReceipt, processRefund }}>
      {children}
    </PurchaseContext.Provider>
  );
};
