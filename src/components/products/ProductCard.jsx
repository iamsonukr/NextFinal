// src/components/products/ProductCard.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/src/contexts/CartContext';
import { useState } from 'react';

export function ProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          {/* Product Image */}
          <Image
            src={product.images?.[0] || '/api/placeholder/300/300'}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'blur-sm' : ''
            }`}
            onLoad={() => setImageLoading(false)}
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleWishlist}
          >
            <Heart 
              className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>

          {/* Stock Status */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Category */}
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>

            {/* Product Name */}
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            variant={isInCart(product._id) ? "secondary" : "default"}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock <= 0 
              ? 'Out of Stock'
              : isInCart(product._id) 
                ? `In Cart (${getItemQuantity(product._id)})`
                : 'Add to Cart'
            }
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}