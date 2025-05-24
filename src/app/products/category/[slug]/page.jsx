// src/app/products/category/[slug]/page.jsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { SearchBar } from '@/components/products/SearchBar';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage({ params }) {
  const { slug } = params;
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: slug,
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

  // Format category name for display
  const categoryName = slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category not found</h2>
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
          <span className="font-medium">{categoryName}</span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{categoryName}</h1>
        
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
          <div className="mb-6">
            {pagination && (
              <p className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * filters.limit, pagination.totalProducts)} of{' '}
                {pagination.totalProducts} products in {categoryName}
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