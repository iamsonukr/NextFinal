// src/components/products/ProductQuickActions.jsx
'use client';

import { useState } from 'react';
import { Heart, Scale, Share2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProductQuickView } from './ProductQuickView';
import { useWishlist } from '@/hooks/useWishlist';
import { useProductComparison } from '@/hooks/useProductComparison';
import { toast } from 'sonner';

export function ProductQuickActions({ product, className = '' }) {
  const [showQuickView, setShowQuickView] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInComparison } = useProductComparison();

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = await toggleWishlist(product);
    toast.success(result.message);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = addToCompare(product);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/products/${product._id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Product link copied to clipboard');
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <TooltipProvider>
      <div className={`flex gap-1 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlist}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart 
                className={`w-4 h-4 ${
                  isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''
                }`} 
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCompare}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Scale 
                className={`w-4 h-4 ${
                  isInComparison(product._id) ? 'text-blue-500' : ''
                }`} 
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isInComparison(product._id) ? 'In Comparison' : 'Add to Compare'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickView}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Quick View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Product</TooltipContent>
        </Tooltip>
      </div>

      <ProductQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </TooltipProvider>
  );
}