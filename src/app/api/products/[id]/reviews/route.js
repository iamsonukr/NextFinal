// src/app/api/products/[id]/reviews/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';

// Get reviews with pagination
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const rating = searchParams.get('rating');
    
    let query = { productId: params.id };
    
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }
    
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find(query)
      .populate('userId', 'name email image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);
    
    return NextResponse.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Reviews GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// Add new review
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const body = await request.json();
    const { rating, comment, title } = body;
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Valid rating (1-5) is required' },
        { status: 400 }
      );
    }
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId: params.id,
      userId: session.user.id
    });
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }
    
    // Create new review
    const review = new Review({
      productId: params.id,
      userId: session.user.id,
      rating,
      comment,
      title,
      createdAt: new Date()
    });
    
    await review.save();
    
    // Update product rating statistics
    const reviewStats = await Review.aggregate([
      { $match: { productId: params.id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    
    if (reviewStats[0]) {
      await Product.findByIdAndUpdate(params.id, {
        rating: reviewStats[0].averageRating,
        reviewCount: reviewStats[0].totalReviews
      });
    }
    
    // Populate user data for response
    await review.populate('userId', 'name email image');
    
    return NextResponse.json(review);
    
  } catch (error) {
    console.error('Review POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}