import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShopProduct } from '../data/shopProducts';

export interface TransactionRecord {
  id: string;
  transactionId: string;
  productTitle: string;
  amount: number;
  status: 'completed' | 'pending';
  paymentMethod: string;
  date: string;
  referenceId?: string;
}

interface PurchaseContextType {
  purchasedProductIds: string[];
  transactions: TransactionRecord[];
  isPurchased: (productId: string) => boolean;
  purchaseProduct: (productId: string, productTitle?: string, amount?: number, paymentMethod?: string, status?: 'completed' | 'pending') => void;
  simulateInstantPurchase: (product: ShopProduct) => void;
  downloadReceipt: (tx: TransactionRecord) => void;
}

const PurchaseContext = createContext<PurchaseContextType | null>(null);

const STORAGE_KEY = 'accounticca_purchased_products';
const TRANSACTIONS_KEY = 'accounticca_payment_history';

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TXN-2026-101',
    transactionId: 'UPAY-TXN-9988776',
    productTitle: 'Income Tax Return & Assessment Workbook (2026-27)',
    amount: 1500,
    status: 'completed',
    paymentMethod: 'UddoktaPay (Sandbox)',
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
      if (saved) return JSON.parse(saved);
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
    paymentMethod: string = 'UddoktaPay', 
    status: 'completed' | 'pending' = 'completed'
  ) => {
    setPurchasedProductIds(prev => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });

    const newTx: TransactionRecord = {
      id: `TXN-${Date.now()}`,
      transactionId: `UPAY-TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
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
    purchaseProduct(product.id, product.title, product.price, 'UddoktaPay', 'completed');
  }, [purchaseProduct]);

  const downloadReceipt = useCallback((tx: TransactionRecord) => {
    const receiptContent = `========================================================
ACCOUNTICCA & E-LAWYERS DIGITAL PAYMENT RECEIPT
========================================================
Transaction Reference: ${tx.id}
Gateway Transaction ID: ${tx.transactionId}
Order Reference No: ${tx.referenceId || 'N/A'}
Date & Time: ${new Date(tx.date).toLocaleString('en-GB')}
Payment Status: ${tx.status.toUpperCase()}
Payment Method: ${tx.paymentMethod}
Total Paid Amount: BDT ${tx.amount.toLocaleString('en-IN')} BDT

--- PURCHASED ITEM ---
• ${tx.productTitle}

--- MERCHANT DETAILS ---
Accounticca Advisory & eLawyers Bangladesh
Dhaka Chamber Building (2nd Floor), Motijheel C/A, Dhaka
Hotline: +88 01335230170 | support@accounticca.com
Tax ID (TIN): 482910283401 | VAT Reg: 003928102-0101
========================================================
This is a computer-generated digital receipt and is valid for NBR tax rebate and statutory audit records.
========================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${tx.transactionId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <PurchaseContext.Provider value={{ purchasedProductIds, transactions, isPurchased, purchaseProduct, simulateInstantPurchase, downloadReceipt }}>
      {children}
    </PurchaseContext.Provider>
  );
};
