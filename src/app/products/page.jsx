// src/app/products/page.jsx
'use client';

import { useState, useCallback } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { SearchBar } from '@/components/products/SearchBar';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    minPrice: 0,
    maxPrice: null
  });

  const { products, pagination, categories, loading, error, refetch } = useProducts(filters);

  const handleFilterChange = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    refetch(updatedFilters);
  }, [filters, refetch]);

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
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => refetch(filters)}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        
        {/* Search and Mobile Filter Toggle */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} initialValue={filters.search} />
          </div>
          
          {/* Mobile Filter Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6">
            {pagination && (
              <p className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * filters.limit, pagination.totalProducts)} of{' '}
                {pagination.totalProducts} products
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
        </main>
      </div>
    </div>
  );
}