Project: MERN E-commerce Application
Stack: Next.js 14 (App Router), MongoDB, Razorpay, shadcn/ui, JSX
Current Status: Lecture X - [Topic Name]

Completed:
✅ Lecture 1: Project setup, Next.js, Tailwind, shadcn/ui
✅ Lecture 2: MongoDB Atlas, User/Product/Order/Cart models
✅ Lecture 3: Authentication Setup with NextAuth**
**Lecture 4: Context API & State Management**
**Lecture 5: Basic UI Components & Layout**
**Lecture 6: Product Catalog & Listing**


What's Next: **Lecture 7: Product Details & Dynamic Routing**
- Dynamic product pages ([productId])
- Image optimization with Next.js Image
- Product reviews system
- Related products

**Lecture 8: Shopping Cart Implementation**
- Cart context and operations
- Add/remove/update cart items
- Cart persistence (localStorage + database)
- Cart drawer/modal

Please continue from where we left off.

✔
____________________________________________________________________________________________________________________________________________
____________________________________________________________________________________________________________________________________________
____________________________________________________________________________________________________________________________________________

# MERN E-Commerce Application - Complete Course Curriculum

## Course Overview
Build a full-stack e-commerce application using MongoDB, Express, React (Next.js), and Node.js with modern authentication, state management, and payment processing.

## Lecture Series (20-25 Lectures)

### Phase 1: Foundation & Setup (Lectures 1-5)

**Lecture 1: Project Setup & Next.js Fundamentals**
- Setting up Next.js 14 with App Router
- Understanding SSR vs SSG vs CSR
- Project structure and organization
- Installing dependencies (Tailwind CSS, TypeScript)

**Lecture 2: Database Design & MongoDB Setup**
- MongoDB Atlas setup
- Database schema design for e-commerce
- Mongoose models (User, Product, Order, Cart)
- Database connection and environment variables

**Lecture 3: Authentication Setup with NextAuth**
- NextAuth configuration
- Setting up providers (credentials, Google, GitHub)
- JWT and session management
- Protected routes and middleware

**Lecture 4: Context API & State Management**
- Setting up React Context
- Global state architecture
- Cart management context
- User authentication context

**Lecture 5: Basic UI Components & Layout**
- Responsive design with Tailwind CSS
- Reusable components
- Navigation and footer
- Basic product card design

### Phase 2: Core E-Commerce Features (Lectures 6-12)

**Lecture 6: Product Catalog & Listing**
- Product model and API routes
- Server-side rendering for SEO
- Product grid with filtering
- Search functionality

**Lecture 7: Product Details & Dynamic Routing**
- Dynamic product pages ([productId])
- Image optimization with Next.js Image
- Product reviews system
- Related products

**Lecture 8: Shopping Cart Implementation**
- Cart context and operations
- Add/remove/update cart items
- Cart persistence (localStorage + database)
- Cart drawer/modal

**Lecture 9: User Registration & Login**
- Custom login/register forms
- Form validation and error handling
- Password hashing and security
- Email verification (optional)

**Lecture 10: User Profile & Account Management**
- User dashboard
- Profile editing
- Order history
- Address management

**Lecture 11: Checkout Process**
- Multi-step checkout
- Shipping information
- Order summary
- Form validation

**Lecture 12: Order Management System**
- Order creation and processing
- Order status tracking
- Email notifications
- Order confirmation pages

### Phase 3: Advanced Features (Lectures 13-18)

**Lecture 13: Payment Integration with Stripe**
- Stripe setup and configuration
- Payment processing
- Webhook handling
- Payment confirmation

**Lecture 14: Admin Dashboard - Part 1**
- Admin authentication and roles
- Product management (CRUD)
- Image upload functionality
- Inventory management

**Lecture 15: Admin Dashboard - Part 2**
- Order management
- User management
- Analytics and reporting
- Dashboard charts

**Lecture 16: Advanced Search & Filtering**
- Elasticsearch integration (or MongoDB text search)
- Category filtering
- Price range filtering
- Sorting options

**Lecture 17: SEO Optimization & Performance**
- Meta tags and structured data
- Sitemap generation
- Performance optimization
- Image optimization strategies

**Lecture 18: Error Handling & Validation**
- Global error handling
- API error responses
- Client-side validation
- Loading states and skeletons

### Phase 4: Production & Deployment (Lectures 19-22)

**Lecture 19: Security & Best Practices**
- Environment variables management
- API rate limiting
- CORS configuration
- Security headers

**Lecture 20: Testing Implementation**
- Unit testing with Jest
- Integration testing
- API testing
- E2E testing basics

**Lecture 21: Performance Optimization**
- Code splitting
- Lazy loading
- Caching strategies
- Database optimization

**Lecture 22: Deployment & DevOps**
- Next.js deployment options
- MongoDB Atlas production setup
- Environment configuration
- CI/CD basics

### Phase 5: Additional Features (Lectures 23-25)

**Lecture 23: Real-time Features**
- WebSocket integration
- Real-time notifications
- Live chat support
- Inventory updates

**Lecture 24: Mobile Optimization & PWA**
- Responsive design improvements
- Progressive Web App features
- Mobile-specific optimizations
- Touch gestures

**Lecture 25: Advanced Analytics & Monitoring**
- Google Analytics integration
- Error monitoring
- Performance monitoring
- A/B testing setup

## Project Tracking System

To help you continue from where you left off, each lecture will include:

1. **Lecture Identifier**: Clear numbering and unique titles
2. **Completion Checkpoints**: Specific milestones to verify progress
3. **Code Snapshots**: Key file versions at each stage
4. **Branch Strategy**: Git branches for each lecture
5. **Progress Tracker**: A simple JSON file to track completion

### How to Resume Your Project

When you return to the project, simply mention:
- "Continue from Lecture X" or
- "I completed up to [specific feature]" or
- "Show me the current status of [component/feature]"

And I'll immediately understand where you are in the curriculum and continue from that exact point.

## Technologies Used

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **State Management**: React Context API
- **Payment**: Stripe
- **Deployment**: Vercel/Netlify (Frontend), Railway/Heroku (Backend)
- **Additional**: Express.js, Node.js, JWT, bcrypt

## Expected Learning Outcomes

By the end of this course, you'll understand:
- Next.js advanced features and architecture
- Full-stack application development
- Authentication and authorization
- State management patterns
- E-commerce business logic
- Payment processing
- Performance optimization
- Deployment strategies

Ready to start? Let me know and we'll begin with Lecture 1!

✔
______________________________________________________________________________________________________________________________________________
______________________________________________________________________________________________________________________________________________

Lecture 1
Lecture 1: Project Setup & Next.js Fundamentals
Learning Objectives

Set up Next.js 14 with App Router
Configure Tailwind CSS and shadcn/ui
Understand Next.js folder structure
Create basic layout and components
Environment setup

1. Project Initialization
First, create a new Next.js project:
bashnpx create-next-app@latest ecommerce-app
# Choose the following options:
# ✓ Would you like to use TypeScript? › No
# ✓ Would you like to use ESLint? › Yes  
# ✓ Would you like to use Tailwind CSS? › Yes
# ✓ Would you like to use `src/` directory? › Yes
# ✓ Would you like to use App Router? › Yes
# ✓ Would you like to customize the default import alias? › No

cd ecommerce-app
2. Install Required Dependencies
bash# Core dependencies
npm install @next/font lucide-react class-variance-authority clsx tailwind-merge

# State management and utilities
npm install js-cookie mongodb mongoose bcryptjs jsonwebtoken

# Authentication (will setup in next lectures)
npm install next-auth

# UI Components (shadcn/ui setup)
npx shadcn-ui@latest init
# Choose default options for now

# Install some basic shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
3. Environment Variables Setup
Create .env.local file:
env# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Razorpay (we'll add these in payment lecture)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
4. Project Structure Overview
ecommerce-app/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── products/        # Product pages
│   │   ├── cart/           # Cart page
│   │   ├── checkout/       # Checkout pages
│   │   └── api/            # API routes
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Layout components
│   │   └── common/        # Common components
│   ├── contexts/          # React Context providers
│   ├── lib/               # Utility functions
│   ├── models/            # MongoDB models
│   └── hooks/             # Custom React hooks
├── public/               # Static assets
└── package.json
5. Key Next.js App Router Concepts
App Router vs Pages Router

App Router (new): Uses app/ directory, supports React Server Components
Pages Router (legacy): Uses pages/ directory, traditional client-side routing

Important Files in App Router

layout.js: Shared layout across routes
page.js: Unique page content
loading.js: Loading UI
error.js: Error handling
not-found.js: 404 pages

Server vs Client Components

Server Components: Run on server, default in App Router
Client Components: Run in browser, use 'use client' directive

6. Basic Configuration Files
Let's update some configuration files:
tailwind.config.js
javascript/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
next.config.js
javascript/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
7. Understanding Next.js Benefits
Server-Side Rendering (SSR)

Pages rendered on server for each request
Better SEO and initial load performance
Dynamic data fetching

Static Site Generation (SSG)

Pages pre-rendered at build time
Best performance for static content
Can be combined with ISR (Incremental Static Regeneration)

API Routes

Full-stack in one framework
Serverless functions
Automatic optimization

Image Optimization

Automatic WebP conversion
Lazy loading
Responsive images

Automatic Code Splitting

Only load necessary JavaScript
Route-based splitting
Component-based splitting

8. Checkpoint: Verify Setup

✅ Next.js project created with App Router
✅ Tailwind CSS configured
✅ shadcn/ui initialized
✅ Environment variables file created
✅ Project structure understood

Next Steps
In Lecture 2, we'll:

Set up MongoDB connection
Create database models for our e-commerce app
Design the schema for Users, Products, Orders, and Cart

Commands to Remember
bash# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Add shadcn/ui components
npx shadcn-ui@latest add [component-name]
Key Takeaways

App Router is the future of Next.js routing
Server Components by default improve performance
shadcn/ui provides beautiful, accessible components
Environment variables keep sensitive data secure
Folder structure is crucial for maintainable code

Ready for Lecture 2? Say "Continue to Lecture 2" when you're ready to set up the database!

✔
__________________________________________________________________________________________________________________________________________
__________________________________________________________________________________________________________________________________________
__________________________________________________________________________________________________________________________________________

Lecture 2

# Lecture 2: Database Design & MongoDB Setup

## Learning Objectives
- Set up MongoDB Atlas cloud database
- Design e-commerce database schema
- Create Mongoose models (User, Product, Order, Cart)
- Configure database connection
- Understand MongoDB relationships and best practices

## 1. MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create new organization and project
4. Build your first cluster (choose M0 Sandbox - FREE)

### Step 2: Configure Database Access
1. **Database Access** → Create database user
2. **Network Access** → Add IP address (0.0.0.0/0 for development)
3. **Connect** → Get connection string

### Step 3: Update Environment Variables
```env
# .env.local
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

## 2. Database Schema Design

### E-commerce Database Structure

```
Users Collection
├── Basic Info (name, email, password)
├── Profile (phone, avatar, addresses)
├── Authentication (roles, verification)
└── Timestamps

Products Collection
├── Basic Info (name, description, price)
├── Inventory (stock, SKU, category)
├── Media (images, videos)
├── SEO (slug, meta)
└── Relationships (reviews, ratings)

Orders Collection
├── Order Info (orderNumber, status, total)
├── Customer (user reference)
├── Items (product references with quantities)
├── Shipping (address, method, tracking)
└── Payment (method, status, razorpayId)

Cart Collection
├── User Reference
├── Items (product, quantity, price)
├── Session (for guest users)
└── Timestamps

Reviews Collection
├── Product Reference
├── User Reference
├── Rating & Comment
└── Timestamps
```

## 3. Database Connection Configuration

### Create Database Connection Utility

```javascript
// src/lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Global is used here to maintain a cached connection across hot reloads in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

## 4. Mongoose Models

### User Model
```javascript
// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid phone number']
  },
  avatar: {
    type: String,
    default: '/default-avatar.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  addresses: [addressSchema],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token method (we'll implement this in auth lecture)
userSchema.methods.getJWTToken = function() {
  // Will implement in lecture 3
};

export default mongoose.models.User || mongoose.model('User', userSchema);
```

### Product Model
```javascript
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
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
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
```

### Order Model
```javascript
// src/models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  color: String,
  size: String
});

const shippingAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentInfo: {
    id: String,
    status: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
  },
  paidAt: Date,
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Processing'
  },
  deliveredAt: Date,
  shippingMethod: {
    type: String,
    enum: ['Standard', 'Express', 'Overnight'],
    default: 'Standard'
  },
  trackingNumber: String,
  notes: String
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
```

### Cart Model
```javascript
// src/models/Cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  color: String,
  size: String
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0.0
  },
  sessionId: String, // For guest users
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // 7 days
  }
}, {
  timestamps: true
});

// Calculate total items and price before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  next();
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
```

## 5. Utility Functions

### Database Helpers
```javascript
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
```

## 6. Testing Database Connection

### Create a test API route
```javascript
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
```

## 7. MongoDB Best Practices for E-commerce

### Indexing Strategy
```javascript
// Add indexes for better performance
productSchema.index({ category: 1, price: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ name: 'text', description: 'text' });

userSchema.index({ email: 1 });
orderSchema.index({ user: 1, orderStatus: 1 });
orderSchema.index({ orderNumber: 1 });
```

### Data Validation
- Use Mongoose validation for data integrity
- Implement custom validators where needed
- Use enums for predefined values
- Set appropriate min/max values

### Performance Considerations
- Use `select()` to limit returned fields
- Implement pagination for large datasets
- Use `populate()` wisely to avoid over-fetching
- Consider using aggregation for complex queries

## 8. Checkpoint: Verify Database Setup

1. ✅ MongoDB Atlas cluster created
2. ✅ Connection string configured
3. ✅ User model with authentication fields
4. ✅ Product model with reviews and variants
5. ✅ Order model with payment integration
6. ✅ Cart model with item management
7. ✅ Database connection utility created
8. ✅ Test API route working

## Next Steps

In **Lecture 3**, we'll:
- Set up NextAuth.js for authentication
- Configure multiple auth providers
- Implement JWT and session management
- Create protected routes and middleware

## Key Takeaways

1. **Schema Design** is crucial for scalable e-commerce
2. **Mongoose** provides powerful ODM features
3. **Indexing** improves query performance
4. **Validation** ensures data integrity
5. **Connection pooling** optimizes database performance

Ready for Lecture 3? Say "Continue to Lecture 3" when you're ready to implement authentication!

Lecture 3
_________________________________________________________________________________________________________________________________________
_________________________________________________________________________________________________________________________________________
