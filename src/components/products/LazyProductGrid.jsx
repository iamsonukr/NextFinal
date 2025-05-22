// src/components/products/LazyProductGrid.jsx
'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function LazyProductGrid({ products, loading, hasMore, onLoadMore }) {
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loadTriggerRef, isLoadTriggerVisible] = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    if (products) {
      setDisplayedProducts(products);
    }
  }, [products]);

  useEffect(() => {
    if (isLoadTriggerVisible && hasMore && !loading) {
      onLoadMore();
    }
  }, [isLoadTriggerVisible, hasMore, loading, onLoadMore]);

  if (loading && displayedProducts.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!displayedProducts?.length) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Loading trigger for infinite scroll */}
      {hasMore && (
        <div ref={loadTriggerRef} className="flex justify-center py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">Scroll to load more products</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}