# 💎 Lumera - Premium Jewelry E-Commerce Platform

A modern, full-featured e-commerce platform for jewelry and gemstones built with Next.js 15, TypeScript, Supabase, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

---

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**: Browse jewelry by categories (Rings, Necklaces, Earrings, Bracelets)
- **Gemstone Gallery**: Explore precious gemstones (Ruby, Sapphire, Emerald, Diamond, etc.)
- **Product Customization**: 
  - Ring sizing options
  - Loose vs Mounted gemstones
  - Metal type selection (Gold, Platinum, Silver)
  - Jewelry type customization
- **Shopping Cart**: Add, remove, update quantities with real-time price calculations
- **Wishlist**: Save favorite items for later
- **Checkout System**: 
  - Complete shipping information form
  - Bank transfer payment method
  - Payment receipt upload to Supabase Storage
  - Order confirmation and tracking
- **Expert Consultation**: Request to speak with jewelry experts
- **Currency Display**: INR (₹) and USD ($) with automatic conversion
- **Responsive Design**: Beautiful UI on desktop, tablet, and mobile

### 🎛️ Admin Dashboard
- **Product Management**: 
  - Add, edit, delete products
  - Image upload and management
  - Inventory tracking
  - Price management in USD (auto-converts to INR)
- **Category Management**: Create and manage product categories
- **Order Management**:
  - View all orders with status filtering
  - Update order status (Pending, Processing, Shipped, Delivered, Cancelled)
  - View payment receipts
  - Customer information and shipping details
  - Order item details
- **Inquiry Management**: Handle customer inquiries and expert consultation requests
- **Bank Details Management**: Configure bank account info for customer payments
- **Analytics Dashboard**: View sales metrics and order statistics
- **Admin Authentication**: Secure admin-only access

### 🔐 Security & Authentication
- Supabase Authentication for admin access
- Row Level Security (RLS) policies
- Secure API routes with service role authentication
- Protected admin routes

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.3 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: 
  - Tailwind CSS 3.4
  - shadcn/ui components
  - Radix UI primitives
- **State Management**: React Context API (Cart, Wishlist)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Image Carousels**: Embla Carousel

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for product images and payment receipts)
- **API**: Next.js API Routes
- **Authentication**: Supabase Auth

### Additional Tools
- **AI Integration**: Google Genkit (for future AI features)
- **Charts**: Recharts (for admin analytics)
- **Date Handling**: date-fns

---

## 📁 Project Structure

```
Lumera/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   │   ├── bank-details/
│   │   │   ├── categories/
│   │   │   ├── inquiries/
│   │   │   ├── orders/
│   │   │   └── products/
│   │   ├── cart/              # Shopping cart page
│   │   ├── category/          # Category pages
│   │   ├── checkout/          # Checkout flow
│   │   ├── gemstones/         # Gemstone catalog
│   │   ├── jewels/            # Jewelry catalog
│   │   ├── products/          # Product detail pages
│   │   └── wishlist/          # Wishlist page
│   ├── components/            # React components
│   │   ├── admin/            # Admin-specific components
│   │   ├── layout/           # Header, Footer
│   │   └── ui/               # shadcn/ui components
│   ├── context/              # React Context providers
│   │   ├── cart-context.tsx
│   │   └── wishlist-context.tsx
│   ├── lib/                  # Utility functions
│   │   ├── supabaseClient.ts
│   │   ├── storage.ts        # Supabase Storage helpers
│   │   ├── products.ts
│   │   ├── bank.ts
│   │   └── image-utils.ts
│   └── hooks/                # Custom React hooks
├── docs/                     # Documentation
│   └── supabase-schema.sql   # Database schema
├── public/                   # Static assets
├── scripts/                  # Utility scripts
│   └── seed-supabase.ts      # Database seeding
├── .env.local                # Environment variables
└── package.json

```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Lumera
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Custom bucket name (defaults to 'receipts')
NEXT_PUBLIC_SUPABASE_RECEIPTS_BUCKET=receipts
```

**Get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### 4. Database Setup

#### Step 1: Create Supabase Tables
1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `docs/supabase-schema.sql`
3. Run the SQL to create all tables and policies

#### Step 2: Create Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `receipts`
3. Make it **public**
4. Run the storage policies from `SUPABASE_STORAGE_SETUP.md`

#### Step 3: Seed Database (Optional)
```bash
npm run db:seed
```

This will populate your database with sample products and categories.

### 5. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:9002`

---

## 🔑 Admin Access

### Default Admin Login
- **Email**: `admin@lumera.com`
- **Password**: Set during Supabase Auth setup

### Accessing Admin Dashboard
1. Navigate to `/admin`
2. Login with admin credentials
3. Manage products, orders, categories, and inquiries

For detailed admin setup instructions, see `ADMIN_AUTH_README.md`

---

## 📊 Database Schema

### Main Tables
- **categories**: Product categories (Rings, Necklaces, Gemstones, etc.)
- **products**: Product catalog with prices, descriptions, images
- **orders**: Customer orders with items and payment receipts
- **inquiries**: Customer inquiries and consultation requests
- **bank_details**: Bank account information for payments

For complete schema details, see `docs/supabase-schema.sql`

---

## 🎨 Key Features Breakdown

### Shopping Cart
- Persistent cart using localStorage
- Real-time price calculations
- Quantity management
- Customization tracking (size, metal type, etc.)
- INR & USD price display

### Product Customization
```typescript
// Ring sizing
- Sizes: 5-16
- Price increases 2% per size increment

// Gemstone Options
- Loose stone: Base price
- Mounted: +$200-500 (depends on jewelry type)
- Metal types: Yellow Gold, White Gold, Rose Gold, Platinum
```

### Payment Flow
1. Customer adds items to cart
2. Proceeds to checkout
3. Fills shipping information
4. Uploads payment receipt (bank transfer)
5. Receipt stored in Supabase Storage
6. Order created with "pending" status
7. Admin reviews and updates status

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Deploy to Firebase Hosting
```bash
firebase deploy
```

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run db:seed      # Seed database with sample data
npm run genkit:dev   # Start Genkit AI development
```

---

## 🎯 Environment Configuration

### Currency Conversion
Default rate: 1 USD = 85 INR (configurable in `src/lib/products.ts`)

### Product Customization Costs
Defined in `src/lib/products.ts`:
```typescript
customizationCosts = {
  jewelryType: {
    'Ring': 200,
    'Engagement Ring': 500,
    'Pendant': 150,
    // ...
  },
  metalType: {
    'Yellow Gold': 300,
    'White Gold': 350,
    // ...
  }
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 📧 Support

For issues or questions:
- Check existing documentation in `docs/` folder
- Review `ADMIN_README.md` for admin features
- Check `SUPABASE_STORAGE_SETUP.md` for storage setup

---

## 🔄 Recent Updates

- ✅ Supabase Storage integration for payment receipts
- ✅ Improved admin order management with scrollable dialogs
- ✅ Buy Now button auto-adds to cart and redirects to checkout
- ✅ Clickable cart items redirect to product detail pages
- ✅ Enhanced checkout page with improved UI/UX
- ✅ All form fields required with validation
- ✅ Better receipt image display in admin panel

---

**Built with ❤️ for Lumera Jewelry**

change the  background color of "Talk with Our Expert section as its not match with website color scheme which ave appointment " , as website need to look like premium feel as oits the website of premium category gems