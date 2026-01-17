# Shopify Public App Starter Template

A production-ready Shopify public app starter template built with Remix, React, Shopify App Bridge, Polaris UI, and MongoDB. This template includes all required components for Shopify App Store submission.

## Features

- ✅ **OAuth Flow** - Complete Shopify OAuth authentication
- ✅ **Embedded App** - Integrated with Shopify Admin via App Bridge
- ✅ **Polaris UI** - Shopify's design system components
- ✅ **Session Management** - Secure session storage with MongoDB
- ✅ **Required Webhooks** - App uninstall and GDPR compliance webhooks
- ✅ **Database Setup** - MongoDB with Mongoose ODM
- ✅ **Compliance Pages** - Privacy policy and Terms of Service
- ✅ **Vercel Ready** - Pre-configured for easy deployment

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Shopify Partner account ([sign up here](https://partners.shopify.com))
- MongoDB database (local or cloud)
- npm or yarn package manager

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd shopifyAPP

# Install dependencies
npm install
```

### 2. Install Ngrok (Recommended for Local Development)

Ngrok provides a public HTTPS URL for OAuth callbacks:

1. Install ngrok:
   - **macOS**: `brew install ngrok/ngrok/ngrok`
   - **Windows**: Download from [ngrok.com](https://ngrok.com/download)
   - **Linux**: `curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok`

2. Sign up for a free ngrok account at [ngrok.com](https://ngrok.com) and get your auth token

3. Configure ngrok:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

### 3. Shopify Partner Dashboard Setup

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com)
2. Navigate to **Apps** → **Create app**
3. Choose **Public app**
4. Fill in app details:
   - App name
   - App URL: Your ngrok URL (e.g., `https://abc123.ngrok-free.app`) or production URL
   - Allowed redirection URL(s): 
     - Your ngrok callback URL: `https://YOUR-NGROK-URL.ngrok-free.app/auth/callback`
     - Production: `https://your-app.vercel.app/auth/callback`
5. Copy your **API Key** and **API Secret**

### 4. Environment Setup

1. Create `.env` file and fill in your values:
   ```env
   SHOPIFY_API_KEY=your_api_key_here
   SHOPIFY_API_SECRET=your_api_secret_here
   SCOPES=read_products,write_products,read_orders,write_orders
   DATABASE_URL=mongodb://localhost:27017/shopify-app
   # When using ngrok, set this to your ngrok URL (e.g., https://abc123.ngrok-free.app)
   APP_URL=https://YOUR-NGROK-URL.ngrok-free.app
   HOST=localhost
   NODE_ENV=development
   ```

   **Important**: Replace `YOUR-NGROK-URL` with your actual ngrok URL when using ngrok.

### 5. Database Setup

#### Local MongoDB

1. Install MongoDB if not already installed:
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Linux**: `sudo apt-get install mongodb` or `sudo yum install mongodb`
2. Start MongoDB service:
   ```bash
   # macOS/Linux
   brew services start mongodb-community
   # or
   mongod --config /usr/local/etc/mongod.conf
   
   # Windows
   net start MongoDB
   ```
3. MongoDB will run on `mongodb://localhost:27017`
4. Update `DATABASE_URL` in `.env` if needed

#### MongoDB Atlas (Cloud) - Recommended for Production

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Get connection string: **Connect** → **Connect your application**
4. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/shopify-app
   ```

### 6. Start Development Server

#### Option A: Using Ngrok (Recommended - Automated)

Simply run:
```bash
npm run dev:ngrok
```

This script will:
- ✅ Automatically start ngrok tunnel
- ✅ Detect the ngrok public URL dynamically
- ✅ Start the Remix dev server
- ✅ Display the callback URL you need to add to Shopify

**After the script starts, you'll see output like:**
```
======================================================================
✅ Ngrok tunnel is active!
======================================================================
🌐 Public URL: https://abc123.ngrok-free.app
📋 Callback URL: https://abc123.ngrok-free.app/auth/callback
======================================================================

📝 Add this callback URL to your Shopify Partner Dashboard:
   https://abc123.ngrok-free.app/auth/callback

💡 The app will automatically use this ngrok URL for OAuth.
   You don't need to set APP_URL in .env when using this script.
======================================================================
```

**Then:**
1. Copy the callback URL from the output (e.g., `https://abc123.ngrok-free.app/auth/callback`)
2. Go to your Shopify Partner Dashboard → Your App → App setup
3. Add the callback URL to "Allowed redirection URL(s)"
4. Update "App URL" to your ngrok public URL (e.g., `https://abc123.ngrok-free.app`)
5. Save and test your app!

**Note**: The app automatically detects and uses the ngrok URL - no need to set `APP_URL` in `.env` when using this script.

#### Option B: Manual Setup

If you prefer to start ngrok manually:

1. **Terminal 1** - Start ngrok:
   ```bash
   ngrok http 3000
   ```

2. **Terminal 2** - Start the app:
   ```bash
   npm run dev
   ```

3. Update `.env` with your ngrok URL:
   ```env
   APP_URL=https://YOUR-NGROK-URL.ngrok-free.app
   ```

4. Update Shopify Partner Dashboard with the callback URL.

#### Option C: Localhost Only (Limited OAuth Support)

```bash
npm run dev
```

**Note**: Localhost has limited OAuth functionality. Using ngrok (Option A) is highly recommended for proper OAuth testing.

## Development Workflow

### Testing with Development Stores

1. In Partner Dashboard, create a **Development Store** (unlimited, free)
2. Use this store to test your app installation and features
3. Never test critical features on real merchant stores

### Local Development with Shopify CLI (Recommended)

For the best development experience, use Shopify CLI:

```bash
# Install Shopify CLI (if not already installed)
npm install -g @shopify/cli @shopify/app

# Run app with tunneling
shopify app dev
```

This automatically:
- Creates a secure tunnel (Cloudflare)
- Provides temporary install link
- Handles OAuth flow
- Enables hot reload

### Manual Testing Flow

1. Start your local server: `npm run dev`
2. Visit: `http://localhost:3000/auth/login?shop=your-dev-store.myshopify.com`
3. Complete OAuth flow
4. App will be installed and accessible in Shopify Admin

## Project Structure

```
shopifyAPP/
├── app/
│   ├── routes/           # Remix routes
│   │   ├── _index.tsx           # Main app page
│   │   ├── auth.login.tsx       # OAuth initiation
│   │   ├── auth.callback.tsx    # OAuth callback
│   │   ├── app.uninstall.tsx    # Uninstall webhook
│   │   ├── webhooks.tsx         # GDPR webhooks
│   │   ├── privacy.tsx          # Privacy policy
│   │   └── terms.tsx            # Terms of service
│   ├── components/
│   │   └── AppLayout.tsx        # Polaris wrapper
│   ├── config/
│   │   ├── shopify.server.ts    # Shopify configuration
│   │   └── database.server.ts   # MongoDB connection
│   ├── models/
│   │   ├── Session.model.ts     # Session model
│   │   └── AppData.model.ts     # App data model
│   └── utils/
│       └── env.server.ts        # Environment validation
├── public/                      # Static assets
├── .env.example                 # Environment template
├── vercel.json                  # Vercel config
└── README.md                    # This file
```

## Deployment to Vercel

### 1. Prepare for Production

1. Update `.env` with production values:
   ```env
   APP_URL=https://your-app.vercel.app
   HOST=your-app.vercel.app
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/shopify-app
   NODE_ENV=production
   ```

2. Update Shopify Partner Dashboard:
   - App URL: `https://your-app.vercel.app`
   - Allowed redirection URL: `https://your-app.vercel.app/auth/callback`

### 2. Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or via CLI
vercel env add SHOPIFY_API_KEY
vercel env add SHOPIFY_API_SECRET
vercel env add SCOPES
vercel env add DATABASE_URL
vercel env add APP_URL
vercel env add HOST
```

#### Option B: GitHub Integration

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### 3. Configure Webhooks in Partner Dashboard

After deployment, configure webhooks:

1. Go to your app in Partner Dashboard
2. Navigate to **Webhooks**
3. Add these webhooks:
   - **App uninstalled**: `https://your-app.vercel.app/app/uninstall`
   - **Customers data request**: `https://your-app.vercel.app/webhooks`
   - **Customers redact**: `https://your-app.vercel.app/webhooks`
   - **Shop redact**: `https://your-app.vercel.app/webhooks`

## Required Pages

Your app must have publicly accessible URLs for:

- **Privacy Policy**: `https://your-app.vercel.app/privacy`
- **Terms of Service**: `https://your-app.vercel.app/terms`
- **Support**: Configure in Partner Dashboard app settings

Update these pages in `app/routes/privacy.tsx` and `app/routes/terms.tsx` with your actual content.

## Database Management

### MongoDB Compass (Recommended)

Download [MongoDB Compass](https://www.mongodb.com/products/compass) to visually view and edit your database:
1. Connect to your MongoDB instance using the `DATABASE_URL` from `.env`
2. Browse collections and documents
3. Run queries and modify data

### MongoDB Shell

Use MongoDB shell to interact with your database:

```bash
# Connect to local MongoDB
mongosh mongodb://localhost:27017/shopify-app

# Connect to MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/shopify-app"
```

### Model Management

Mongoose models are automatically created when first used. To modify schemas:
1. Update model files in `app/models/`
2. Restart the development server
3. MongoDB will handle schema validation

## Pre-Submission Checklist

Before submitting to Shopify App Store, ensure:

### Required Features
- [x] OAuth flow works correctly
- [x] Embedded UI loads in Shopify Admin
- [x] At least one functional feature
- [x] App uninstall webhook implemented
- [x] GDPR compliance webhooks implemented

### Required Pages
- [x] Privacy policy URL is accessible
- [x] Terms of service URL is accessible
- [x] Support email/page configured

### Configuration
- [x] App URLs match Partner Dashboard configuration
- [x] Redirect URLs are correctly set
- [x] Webhooks are configured
- [x] Access scopes are appropriate and documented

### Testing
- [x] Tested install/uninstall flow
- [x] Tested on development store (not production)
- [x] All features work correctly
- [x] App handles errors gracefully

### Production
- [x] App is deployed with HTTPS
- [x] Database is backed up
- [x] Environment variables are secured
- [x] App is stable and performant

## Customization

### Adding Features

1. Add new routes in `app/routes/`
2. Use Polaris components from `@shopify/polaris`
3. Access Shopify APIs via `createShopifyClient()` helper
4. Store app data in `AppData` model (see `prisma/schema.prisma`)

### Database Models

Add new Mongoose models in `app/models/`:

```typescript
// app/models/YourModel.model.ts
import { Schema, model, models } from "mongoose";

export interface IYourModel {
  id: string;
  shop: string;
  // ... your fields
  createdAt?: Date;
  updatedAt?: Date;
}

const YourModelSchema = new Schema<IYourModel>(
  {
    shop: { type: String, required: true, index: true },
    // ... your fields
  },
  {
    timestamps: true,
    collection: "your_collection",
  }
);

export const YourModel = models.YourModel || model<IYourModel>("YourModel", YourModelSchema);
```

Models are automatically registered when imported. No migrations needed!

## Troubleshooting

### OAuth Issues

- Ensure redirect URLs match exactly in Partner Dashboard
- Check that `APP_URL` in `.env` matches your deployment URL
- Verify API key and secret are correct

### Database Connection Issues

- Verify `DATABASE_URL` format: `mongodb://localhost:27017/shopify-app` or `mongodb+srv://user:pass@cluster.mongodb.net/shopify-app`
- Ensure MongoDB service is running (local) or cluster is accessible (Atlas)
- Check network firewall settings for MongoDB Atlas
- Verify MongoDB credentials are correct

### Webhook Issues

- Verify webhook URLs are publicly accessible (HTTPS)
- Check webhook signature verification
- Ensure webhook handlers return 200 status

## Resources

- [Shopify App Development Docs](https://shopify.dev/apps)
- [Remix Documentation](https://remix.run/docs)
- [Polaris Design System](https://polaris.shopify.com)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Vercel Documentation](https://vercel.com/docs)

## Support

For issues and questions:
- Check Shopify Partner Community
- Review Shopify App Store requirements
- Consult this template's documentation

## License

This template is provided as-is for building Shopify apps. Customize as needed for your specific use case.

---

**Happy Building! 🚀**
#   e a z y d r o p s h i p p i n g - a p p  
 