// ===== LECTURE 7: PRODUCT DETAILS & DYNAMIC ROUTING =====

// 1. DYNAMIC PRODUCT PAGE - app/products/[productId]/page.js
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, Heart, Share2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductReviews from '@/components/ProductReviews';
import RelatedProducts from '@/components/RelatedProducts';
import AddToCartButton from '@/components/AddToCartButton';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';

async function getProduct(productId) {
  try {
    await connectDB();
    const product = await Product.findById(productId)
      .populate('reviews')
      .lean();
    
    if (!product) {
      return null;
    }

    // Convert MongoDB ObjectId to string
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(categoryId, currentProductId) {
  try {
    await connectDB();
    const relatedProducts = await Product.find({
      category: categoryId,
      _id: { $ne: currentProductId },
      stock: { $gt: 0 }
    })
    .limit(4)
    .lean();

    return JSON.parse(JSON.stringify(relatedProducts));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  const { productId } = params;
  
  const product = await getProduct(productId);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, productId);

  // Calculate average rating
  const averageRating = product.reviews?.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <span>Home</span>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images?.[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.originalPrice && (
              <Badge className="absolute top-4 left-4 bg-red-500">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <p className="text-sm text-green-600">
                You save ₹{(product.originalPrice - product.price).toLocaleString()} ({discountPercentage}%)
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Specifications</h3>
              <div className="space-y-1">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Add to Cart Section */}
          <div className="space-y-4">
            <AddToCartButton product={product} />
            
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Free shipping</span>
              <span>On orders over ₹999</span>
            </div>
            <div className="flex justify-between">
              <span>Return policy</span>
              <span>30 days return</span>
            </div>
            <div className="flex justify-between">
              <span>Warranty</span>
              <span>1 year manufacturer warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Reviews ({product.reviews?.length || 0})</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="mt-6">
            <ProductReviews productId={productId} reviews={product.reviews || []} />
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium capitalize">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specifications available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Information</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Free standard shipping on orders over ₹999</li>
                      <li>• Express shipping available for ₹99</li>
                      <li>• Estimated delivery: 3-7 business days</li>
                      <li>• Same-day delivery available in select cities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Return Policy</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 30-day return window</li>
                      <li>• Items must be in original condition</li>
                      <li>• Free returns for defective items</li>
                      <li>• Return shipping fee applies for change of mind</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const product = await getProduct(params.productId);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | Your Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

// ===== 2. ADD TO CART BUTTON COMPONENT - components/AddToCartButton.js =====
'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} ${product.name} added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-8 w-8 rounded-r-none"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center py-1 border-x">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            className="h-8 w-8 rounded-l-none"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isLoading}
        className="w-full"
        size="lg"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {isLoading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}

// ===== 3. PRODUCT REVIEWS COMPONENT - components/ProductReviews.js =====
'use client';

import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';

export default function ProductReviews({ productId, reviews = [] }) {
  const { data: session } = useSession();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const star = 5 - i;
    const count = reviews.filter(review => review.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please login to write a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your review!",
        });
        setIsWritingReview(false);
        setReviewData({ rating: 5, comment: '' });
        // Refresh page to show new review
        window.location.reload();
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center space-x-2 text-sm">
                  <span className="w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Button */}
      {session && !isWritingReview && (
        <Button onClick={() => setIsWritingReview(true)}>
          Write a Review
        </Button>
      )}

      {/* Write Review Form */}
      {isWritingReview && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Write a Review</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating */}
              <div>
                <Label>Rating</Label>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, rating: i + 1 }))}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          i < reviewData.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this product..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsWritingReview(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ===== 4. RELATED PRODUCTS COMPONENT - components/RelatedProducts.js =====
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const discountPercentage = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <Link key={product._id} href={`/products/${product._id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discountPercentage > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        -{discountPercentage}%
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.averageRating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-primary">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ===== 5. REVIEW API ENDPOINT - app/api/reviews/route.js =====
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { productId, rating, comment } = await request.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: session.user.id
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create new review
    const review = new Review({
      product: productId,
      user: session.user.id,
      rating,
      comment
    });

    await review.save();

    // Update product with new review
    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id }
    });

    // Populate user data before returning
    await review.populate('user', 'name');

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ===== 6. REVIEW MODEL - models/Review.js =====
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  helpful: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);

// ===== 7. UPDATE PRODUCT MODEL - models/Product.js (Add reviews field) =====
// Add this to your existing Product model:

/*
reviews: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Review'
}],
averageRating: {
  type: Number,
  default: 0
},
reviewCount: {
  type: Number,
  default: 0
}
*/

// ===== 8. CART CONTEXT - context/CartContext.js =====
'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        isLoading: false
      };
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload.productId)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true
  });

  // Load cart from localStorage or API on mount
  useEffect(() => {
    loadCart();
  }, [session]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('cart', JSON.stringify(state.items));
      
      // Also sync with database if user is logged in
      if (session?.user?.id) {
        syncCartWithDatabase();
      }
    }
  }, [state.items, state.isLoading, session]);

  const loadCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if (session?.user?.id) {
        // Load from database for logged-in users
        const response = await fetch('/api/cart');
        if (response.ok) {
          const cartData = await response.json();
          dispatch({ type: 'SET_CART', payload: cartData.items || [] });
        } else {
          // Fallback to localStorage
          loadCartFromLocalStorage();
        }
      } else {
        // Load from localStorage for guest users
        loadCartFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      loadCartFromLocalStorage();
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      dispatch({ type: 'SET_CART', payload: cartItems });
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      dispatch({ type: 'SET_CART', payload: [] });
    }
  };

  const syncCartWithDatabase = async () => {
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: state.items }),
      });
    } catch (error) {
      console.error('Error syncing cart with database:', error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity,
      stock: product.stock
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });

    // Sync with database if logged in
    if (session?.user?.id) {
      try {
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cartItem),
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    dispatch({ type: 'UPDATE_ITEM', payload: { productId, quantity } });

    if (session?.user?.id) {
      try {
        await fetch('/api/cart/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, quantity }),
        });
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });

    if (session?.user?.id) {
      try {
        await fetch('/api/cart/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        });
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    if (session?.user?.id) {
      try {
        await fetch('/api/cart/clear', {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items: state.items,
    isLoading: state.isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// ===== 9. CART API ENDPOINTS =====

// app/api/cart/route.js - Get and Update Cart
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const cart = await Cart.findOne({ user: session.user.id })
      .populate('items.product', 'name price images stock');

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { items } = await request.json();
    await connectDB();

    await Cart.findOneAndUpdate(
      { user: session.user.id },
      { items, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// app/api/cart/add/route.js - Add Item to Cart
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const cartItem = await request.json();
    await connectDB();

    const cart = await Cart.findOne({ user: session.user.id });

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === cartItem.productId
      );

      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += cartItem.quantity;
      } else {
        cart.items.push({
          product: cartItem.productId,
          quantity: cartItem.quantity,
          price: cartItem.price
        });
      }

      await cart.save();
    } else {
      await Cart.create({
        user: session.user.id,
        items: [{
          product: cartItem.productId,
          quantity: cartItem.quantity,
          price: cartItem.price
        }]
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ===== 10. CART MODEL - models/Cart.js =====
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);

// ===== 11. SETUP - Update app/layout.js to include CartProvider =====
/*
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <CartProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
*/

// ===== 12. NAVIGATION UPDATE - Add cart icon to Navbar =====
/*
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

// In your Navbar component:
const { getCartItemCount } = useCart();
const itemCount = getCartItemCount();

<Link href="/cart" className="relative">
  <ShoppingCart className="w-6 h-6" />
  {itemCount > 0 && (
    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
      {itemCount}
    </Badge>
  )}
</Link>
*/