# Deployment Guide - Vercel

## Quick Deployment Steps

### 1. Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (first time) or **Yes** (if updating)
- Project name? `shopify-app` (or your preferred name)
- Directory? `./` (current directory)
- Override settings? **No**

### 4. Set Environment Variables

After first deployment, you'll get a URL like `https://your-app.vercel.app`.

**Add these environment variables in Vercel Dashboard:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

```
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SCOPES=read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_content,write_content,read_shipping,write_shipping
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/shopify-app
APP_URL=https://your-app.vercel.app
HOST=your-app.vercel.app
NODE_ENV=production
```

**OR use Vercel CLI to add them:**
```bash
vercel env add SHOPIFY_API_KEY production
vercel env add SHOPIFY_API_SECRET production
vercel env add SCOPES production
vercel env add DATABASE_URL production
vercel env add APP_URL production
vercel env add HOST production
vercel env add NODE_ENV production
```

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

### 6. Update Shopify Partner Dashboard

After deployment, you'll get a production URL like `https://your-app.vercel.app`.

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com)
2. Navigate to **Apps** → Your App → **App setup**
3. Update:
   - **App URL**: `https://your-app.vercel.app`
   - **Allowed redirection URL(s)**: Add `https://your-app.vercel.app/auth/callback`

4. Go to **Webhooks** and update webhook URLs:
   - **App uninstalled**: `https://your-app.vercel.app/app/uninstall`
   - **Customers data request**: `https://your-app.vercel.app/webhooks`
   - **Customers redact**: `https://your-app.vercel.app/webhooks`
   - **Shop redact**: `https://your-app.vercel.app/webhooks`

### 7. Test Production Deployment

Visit: `https://your-app.vercel.app/?shop=your-store.myshopify.com`

---

## Option B: Deploy via GitHub

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Shopify app ready for deployment"

# Create a repository on GitHub, then push
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

### 2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Remix (should auto-detect)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `build` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

### 3. Add Environment Variables

Before deploying, add all environment variables in Vercel Dashboard:
- Go to **Settings** → **Environment Variables**
- Add all variables from Step 4 above

### 4. Deploy

Click **Deploy** - Vercel will automatically build and deploy your app.

---

## Troubleshooting

### MongoDB Connection Issues
- Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) in Network Access
- Verify your DATABASE_URL connection string is correct
- Check MongoDB Atlas logs if connection fails

### Environment Variables Not Working
- Make sure variables are set for **Production** environment in Vercel
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

### Build Failures
- Check build logs in Vercel Dashboard
- Verify all dependencies are in `package.json`
- Make sure `remix build` command works locally

---

## Continuous Deployment

Once connected to GitHub, Vercel will automatically deploy on every push to `main` branch.

To deploy manually:
```bash
vercel --prod
```

To preview deployments:
```bash
vercel
```
