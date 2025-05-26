// src/app/products/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useProduct } from '@/src/hooks/useProduct';
import { ProductImageGallery } from '@/src/components/products/ProductImageGallery';
import { ProductInfo } from '@/src/components/products/ProductInfo';
import { ProductReviews } from '@/src/components/products/ProductReviews';
import { RelatedProducts } from '@/src/components/products/RelatedProducts';
// import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ProductDetailPage({ params }) {
  const { product, relatedProducts, loading, error } = useProduct(params.id);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    notFound();
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/products/category/${product.category.toLowerCase().replace(' ', '-')}`}>
          <Button variant="ghost" size="sm">
            {product.category}
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium truncate">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            discount={discountPercentage}
            isNew={product.isNew}
          />
        </div>

        {/* Product Info */}
        <div>
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {product.description || 'No detailed description available.'}
            </p>
            
            {product.features?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          {product.specifications ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between p-3 border rounded-lg">
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No specifications available.</p>
          )}
        </TabsContent>
        
        <TabsContent value="shipping" className="mt-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Free Shipping</h4>
              <p className="text-muted-foreground">
                Free standard shipping on orders over $50. Orders typically arrive in 3-7 business days.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Returns</h4>
              <p className="text-muted-foreground">
                30-day return policy. Items must be unused and in original packaging.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Warranty</h4>
              <p className="text-muted-foreground">
                2-year manufacturer warranty included with purchase.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reviews Section */}
      <div className="mb-12">
        <ProductReviews
          productId={product._id}
          initialReviews={product.reviews || []}
          averageRating={product.averageRating || 0}
          totalReviews={product.totalReviews || 0}
          ratingDistribution={product.ratingDistribution || {}}
        />
      </div>

      {/* Related Products */}
      {relatedProducts?.length > 0 && (
        <RelatedProducts 
          products={relatedProducts}
          title="You Might Also Like"
        />
      )}
    </div>
  );
}

// Loading skeleton component
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-64 mb-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-16 h-16" />
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}