// src/hooks/useCart.js
import { useCart as useCartContext } from '@/contexts/CartContext';
import { useState } from 'react';

export function useCart() {
  const cart = useCartContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const addToCartWithLoading = async (product, quantity = 1) => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      cart.addToCart(product, quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateQuantityWithLoading = async (id, quantity) => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API call
      cart.updateQuantity(id, quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    ...cart,
    addToCartWithLoading,
    updateQuantityWithLoading,
    isUpdating
  };
}