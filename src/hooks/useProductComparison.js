// src/hooks/useProductComparison.js
import { useState, useEffect } from 'react';

export function useProductComparison() {
  const [compareList, setCompareList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('productComparison');
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading comparison list:', error);
      }
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem('productComparison', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    if (compareList.length >= 4) {
      return { success: false, message: 'Maximum 4 products can be compared' };
    }
    
    if (compareList.find(p => p._id === product._id)) {
      return { success: false, message: 'Product already in comparison' };
    }

    setCompareList(prev => [...prev, product]);
    return { success: true, message: 'Added to comparison' };
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(p => p._id !== productId));
  };

  const clearComparison = () => {
    setCompareList([]);
  };

  const isInComparison = (productId) => {
    return compareList.some(p => p._id === productId);
  };

  return {
    compareList,
    isOpen,
    setIsOpen,
    addToCompare,
    removeFromCompare,
    clearComparison,
    isInComparison,
    count: compareList.length
  };
}