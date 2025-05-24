// src/hooks/useWishlist.js
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useUser();

  // Load wishlist from API or localStorage
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlistFromAPI();
    } else {
      loadWishlistFromStorage();
    }
  }, [isAuthenticated]);

  const loadWishlistFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      loadWishlistFromStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadWishlistFromStorage = () => {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
    }
  };

  const saveToStorage = (newWishlist) => {
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const addToWishlist = async (product) => {
    if (isInWishlist(product._id)) {
      return { success: false, message: 'Already in wishlist' };
    }

    const newWishlist = [...wishlist, product];
    setWishlist(newWishlist);
    saveToStorage(newWishlist);

    if (isAuthenticated) {
      try {
        await fetch('/api/user/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id, action: 'add' })
        });
      } catch (error) {
        console.error('Error syncing wishlist:', error);
      }
    }

    return { success: true, message: 'Added to wishlist' };
  };

  const removeFromWishlist = async (productId) => {
    const newWishlist = wishlist.filter(p => p._id !== productId);
    setWishlist(newWishlist);
    saveToStorage(newWishlist);

    if (isAuthenticated) {
      try {
        await fetch('/api/user/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, action: 'remove' })
        });
      } catch (error) {
        console.error('Error syncing wishlist:', error);
      }
    }

    return { success: true, message: 'Removed from wishlist' };
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product._id)) {
      return await removeFromWishlist(product._id);
    } else {
      return await addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(p => p._id === productId);
  };

  const clearWishlist = async () => {
    setWishlist([]);
    saveToStorage([]);

    if (isAuthenticated) {
      try {
        await fetch('/api/user/wishlist', {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    }
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    count: wishlist.length
  };
}