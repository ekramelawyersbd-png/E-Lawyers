import React, { useState } from 'react';
import { usePurchases } from '../../contexts/PurchaseContext';
import { SHOP_PRODUCTS, ShopProduct } from '../../data/shopProducts';
import { LockedToolView } from '../tools/LockedToolView';

export interface ToolAccessGuardProps {
  productId?: string;
  toolId?: string;
  product?: ShopProduct;
  toolTitle?: string;
  redirectUnauthorized?: boolean;
  children: React.ReactNode;
}

export const ToolAccessGuard: React.FC<ToolAccessGuardProps> = ({
  productId,
  toolId,
  product: productProp,
  toolTitle,
  children
}) => {
  const { isPurchased } = usePurchases();
  const [justUnlocked, setJustUnlocked] = useState(false);

  // Determine the target product by productId, toolId, or product prop
  const lookupId = productId || toolId;
  const product: ShopProduct | undefined =
    productProp ||
    (lookupId ? SHOP_PRODUCTS.find(p => p.id === lookupId || p.slug === lookupId) : undefined) ||
    SHOP_PRODUCTS[0];

  const targetId = productId || product?.id || '';
  const unlocked = isPurchased(targetId) || justUnlocked;

  if (!unlocked) {
    return (
      <LockedToolView 
        product={product} 
        toolTitle={toolTitle} 
        onUnlockSuccess={() => setJustUnlocked(true)} 
      />
    );
  }

  return <>{children}</>;
};

export default ToolAccessGuard;
