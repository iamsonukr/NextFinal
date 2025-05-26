// src/hooks/useProducts.js
import { useState, useEffect } from 'react';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count,setCount]=useState()

  const fetchProducts = async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        ...filters,
        ...newFilters
      });

      const response = await fetch(`/api/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      
      setProducts(data.products);
      setPagination(data.pagination);
      setCategories(data.categories);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchProducts();
}, [count]); // Include filters

  const refetch = (newFilters) => {
    // fetchProducts(newFilters);
  };

  return {
    products,
    pagination,
    categories,
    loading,
    error,
    refetch
  };
}