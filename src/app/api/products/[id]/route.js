// src/app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const product = await Product.findById(params.id).lean();
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get product reviews with user details
    const reviews = await Review.find({ productId: params.id })
      .populate('userId', 'name email image')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Calculate review statistics
    const reviewStats = await Review.aggregate([
      { $match: { productId: params.id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    // Calculate rating distribution
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (reviewStats[0]?.ratingDistribution) {
      reviewStats[0].ratingDistribution.forEach(rating => {
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
      });
    }

    // Get related products (same category, excluding current product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
    .limit(8)
    .lean();

    // Get frequently bought together products
    const frequentlyBoughtTogether = await Product.find({
      _id: { $in: product.frequentlyBoughtWith || [] },
      isActive: true
    }).lean();

    return NextResponse.json({
      product: {
        ...product,
        averageRating: reviewStats[0]?.averageRating || 0,
        totalReviews: reviewStats[0]?.totalReviews || 0,
        ratingDistribution: ratingCounts
      },
      reviews,
      relatedProducts,
      frequentlyBoughtTogether
    });

  } catch (error) {
    console.error('Product Detail API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}