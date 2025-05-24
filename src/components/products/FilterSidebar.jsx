// src/components/products/FilterSidebar.jsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function FilterSidebar({ 
  categories, 
  filters, 
  onFilterChange,
  className = '' 
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true
  });

  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || 1000
  ]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category, checked) => {
    onFilterChange({
      category: checked ? category : 'all'
    });
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    onFilterChange({
      minPrice: value[0],
      maxPrice: value[1]
    });
  };

  const handleSortChange = (sortBy, sortOrder) => {
    onFilterChange({ sortBy, sortOrder });
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    onFilterChange({
      category: 'all',
      minPrice: 0,
      maxPrice: null,
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <Collapsible 
          open={openSections.category}
          onOpenChange={() => toggleSection('category')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="font-semibold">Category</h3>
            {openSections.category ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-categories"
                checked={filters.category === 'all' || !filters.category}
                onCheckedChange={(checked) => handleCategoryChange('all', checked)}
              />
              <label htmlFor="all-categories" className="text-sm">
                All Categories
              </label>
            </div>
            {categories?.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.category === category}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                />
                <label htmlFor={category} className="text-sm capitalize">
                  {category}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible 
          open={openSections.price}
          onOpenChange={() => toggleSection('price')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="font-semibold">Price Range</h3>
            {openSections.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Sort Options */}
        <div className="space-y-2">
          <h3 className="font-semibold">Sort By</h3>
          <div className="space-y-2">
            {[
              { label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
              { label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
              { label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
              { label: 'Best Rating', sortBy: 'rating', sortOrder: 'desc' },
              { label: 'Most Popular', sortBy: 'sales', sortOrder: 'desc' }
            ].map((option) => (
              <Button
                key={`${option.sortBy}-${option.sortOrder}`}
                variant={
                  filters.sortBy === option.sortBy && filters.sortOrder === option.sortOrder
                    ? "default"
                    : "ghost"
                }
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSortChange(option.sortBy, option.sortOrder)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}