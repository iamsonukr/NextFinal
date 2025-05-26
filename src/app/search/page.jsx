// src/app/search/page.jsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/src/hooks/useProducts';
import { SearchBar } from '@/src/components/products/SearchBar';
import { FilterSidebar } from '@/src/components/products/FilterSidebar';
import { ProductGrid } from '@/src/components/products/ProductGrid';
import { Pagination } from '@/src/components/products/Pagination';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [count,setCount]=useState()

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: 'all',
    search: query,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    minPrice: 0,
    maxPrice: null
  });

  const { products, pagination, categories, loading, error, refetch } = useProducts(filters);

  useEffect(() => {
    if (query !== filters.search) {
      setFilters(prev => ({ ...prev, search: query, page: 1 }));
    }
  }, [count]);

  const handleFilterChange = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    refetch(updatedFilters);
  }, [count, count]);

  const handlePageChange = useCallback((page) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    refetch(updatedFilters);
  }, [filters, refetch]);

  const handleSearch = useCallback((search) => {
    handleFilterChange({ search });
  }, [handleFilterChange]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Search Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Products
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Search Results</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {query ? `Search results for "${query}"` : 'Search Products'}
        </h1>
        
        {pagination && (
          <p className="text-muted-foreground mb-4">
            {pagination.totalProducts} products found
          </p>
        )}
        
        {/* Search Bar */}
        <div className="max-w-md">
          <SearchBar onSearch={handleSearch} initialValue={filters.search} />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {!loading && products?.length === 0 && query && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-2">
                  No results found for "{query}"
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try different keywords or browse our categories
                </p>
                <Link href="/products">
                  <Button>Browse All Products</Button>
                </Link>
              </div>
            </div>
          )}

          {(products?.length > 0 || loading) && (
            <>
              <div className="mb-6">
                {pagination && (
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                    {Math.min(pagination.currentPage * filters.limit, pagination.totalProducts)} of{' '}
                    {pagination.totalProducts} results
                  </p>
                )}
              </div>

              <ProductGrid products={products} loading={loading} />

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination 
                    pagination={pagination} 
                    onPageChange={handlePageChange} 
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}