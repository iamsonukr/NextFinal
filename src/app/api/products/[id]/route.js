// src/app/api/productOnes/[id]/route.js
import { NextResponse } from 'next/server';
import {review} from '@/src/models/product';
import product from '@/src/models/product';
import connectDB from '@/src/lib/mongodb';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const productOne = await product.findById(params.id).lean();
    
    if (!productOne) {
      return NextResponse.json(
        { error: 'productOne not found' },
        { status: 404 }
      );
    }

    // Get productOne reviews with user details
    const reviews = await review.find({ productOneId: params.id })
      .populate('userId', 'name email image')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Calculate review statistics
    const reviewStats = await review.aggregate([
      { $match: { productOneId: params.id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalreviews: { $sum: 1 },
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

    // Get related productOnes (same category, excluding current productOne)
    const relatedproductOnes = await productOne.find({
      category: productOne.category,
      _id: { $ne: productOne._id },
      isActive: true
    })
    .limit(8)
    .lean();

    // Get frequently bought together productOnes
    const frequentlyBoughtTogether = await productOne.find({
      _id: { $in: productOne.frequentlyBoughtWith || [] },
      isActive: true
    }).lean();

    return NextResponse.json({
      productOne: {
        ...productOne,
        averageRating: reviewStats[0]?.averageRating || 0,
        totalreviews: reviewStats[0]?.totalreviews || 0,
        ratingDistribution: ratingCounts
      },
      reviews,
      relatedproductOnes,
      frequentlyBoughtTogether
    });

  } catch (error) {
    console.error('productOne Detail API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch productOne details' },
      { status: 500 }
    );
  }
}