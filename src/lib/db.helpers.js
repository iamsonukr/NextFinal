// src/lib/dbHelpers.js
import connectDB from './mongodb';

// Generic error handler for database operations
export const handleDBOperation = async (operation) => {
  try {
    await connectDB();
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw new Error(`Database operation failed: ${error.message}`);
  }
};

// Check if ObjectId is valid
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Generate unique slug
export const generateUniqueSlug = async (Model, baseSlug) => {
  let slug = baseSlug;
  let counter = 1;
  
  while (await Model.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};