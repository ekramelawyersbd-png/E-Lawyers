import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShopProduct } from '../data/shopProducts';
import { useCart } from './CartContext';

interface PurchaseContextType {
  purchasedProductIds: string[];
  isPurchased: (productId: string) => boolean;
  purchaseProduct: (productId: string) => void;
  simulateInstantPurchase: (product: ShopProduct) => void;
}

const PurchaseContext = createContext<PurchaseContextType | null>(null);

const STORAGE_KEY = 'accounticca_purchased_products';

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
      // Default: Give sample purchased IDs or empty for strict monetized shop
      return ['income-tax-return-workbook-2026']; // Default sample unlocked
    } catch {
      return ['income-tax-return-workbook-2026'];
    }
  });

  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(purchasedProductIds));
    } catch {
      // ignore
    }
  }, [purchasedProductIds]);

  const isPurchased = useCallback((productId: string) => {
    return purchasedProductIds.includes(productId);
  }, [purchasedProductIds]);

  const purchaseProduct = useCallback((productId: string) => {
    setPurchasedProductIds(prev => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, []);

  const simulateInstantPurchase = useCallback((product: ShopProduct) => {
    purchaseProduct(product.id);
  }, [purchaseProduct]);

  return (
    <PurchaseContext.Provider value={{ purchasedProductIds, isPurchased, purchaseProduct, simulateInstantPurchase }}>
      {children}
    </PurchaseContext.Provider>
  );
};
