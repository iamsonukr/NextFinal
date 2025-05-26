// src/models/Product.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        maxlength: [8, 'Price cannot exceed 8 figures'],
        default: 0.0
    },
    comparePrice: {
        type: Number,
        default: 0.0
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Sports',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Home',
                'Food'
            ],
            message: 'Please select a valid category'
        }
    },
    subcategory: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },
    stock: {
        type: Number,
        required: [true, 'Product stock is required'],
        maxlength: [5, 'Stock cannot exceed 5 figures'],
        default: 0
    },
    images: [{
        public_id: { type: String, required: true },
        url: { type: String, required: true }
    }],
    colors: [{
        name: String,
        code: String
    }],
    sizes: [{
        name: String,
        stock: Number
    }],
    specifications: [{
        key: String,
        value: String
    }],
    tags: [String],
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true
    },
    metaTitle: String,
    metaDescription: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create slug before saving
productSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
    next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) {
        this.ratings = 0;
        this.numOfReviews = 0;
    } else {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.ratings = (totalRating / this.reviews.length).toFixed(1);
        this.numOfReviews = this.reviews.length;
    }
};

export default mongoose.models.Product || mongoose.model('Product', productSchema);
export const review = mongoose.model('Review', reviewSchema);