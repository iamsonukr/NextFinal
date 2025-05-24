// src/components/products/ProductInfo.jsx
'use client';

import { useState } from 'react';
import { Star, Heart, Share2, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

export function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useUser();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.name}(s) to cart`);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard');
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isInStock = product.stock > 0;
  const currentCartQuantity = getItemQuantity(product._id);

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <Badge variant="secondary" className="mb-2">
          {product.category}
        </Badge>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.averageRating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.averageRating?.toFixed(1) || '0.0'} ({product.totalReviews || 0} reviews)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="flex items-center gap-2">
              <span className="text-xl text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <Badge className="bg-red-100 text-red-800">
                Save {discountPercentage}%
              </Badge>
            </div>
          )}
        </div>
        
        {discountPercentage > 0 && (
          <p className="text-sm text-green-600 font-medium">
            You save ${(product.originalPrice - product.price).toFixed(2)}
          </p>
        )}
      </div>

      <Separator />

      {/* Stock Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
            {isInStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </span>
        </div>
        
        {isInStock && product.stock <= 10 && (
          <p className="text-sm text-orange-600">
            Only {product.stock} left in stock - order soon!
          </p>
        )}
      </div>

      {/* Quantity and Actions */}
      {isInStock && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              size="lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {currentCartQuantity > 0 
                ? `Update Cart (${currentCartQuantity})`
                : 'Add to Cart'
              }
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleWishlist}
            >
              <Heart 
                className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {/* Product Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="w-5 h-5 text-green-600" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>2-year warranty included</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RotateCcw className="w-5 h-5 text-orange-600" />
          <span>30-day return policy</span>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Product Specifications */}
      {product.specifications && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}