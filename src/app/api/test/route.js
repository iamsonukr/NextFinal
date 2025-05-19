// src/app/api/test/route.js
import connectDB from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      message: 'Database connected successfully!',
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Database connection failed',
      error: error.message,
      status: 'error'
    }, { status: 500 });
  }
}