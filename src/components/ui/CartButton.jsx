// src/components/ui/CartButton.jsx
'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export function CartButton({ product }) {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product);
  };

  const quantity = getItemQuantity(product.id);

  return (
    <Button 
      onClick={handleAddToCart}
      variant={isInCart(product.id) ? "secondary" : "default"}
      size="sm"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {isInCart(product.id) ? `In Cart (${quantity})` : 'Add to Cart'}
    </Button>
  );
}