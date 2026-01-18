# Troubleshooting Vercel Deployment

## Quick Diagnostic Checklist

### 1. Check Vercel Environment Variables

Go to: https://vercel.com/universallevis-projects/eazydropshipping-app-vcry/settings/environment-variables

**Required variables (all must be set for Production):**

```
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SCOPES=read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_content,write_content,read_shipping,write_shipping
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/shopify-app?retryWrites=true&w=majority
APP_URL=https://eazydropshipping-app-vcry.vercel.app
HOST=eazydropshipping-app-vcry.vercel.app
NODE_ENV=production
```

**Important:**
- Make sure DATABASE_URL includes `/shopify-app` before the `?`
- Make sure APP_URL and HOST match your actual Vercel URL
- All variables must be set for **Production** environment

### 2. Check Vercel Build Logs

1. Go to: https://vercel.com/universallevis-projects/eazydropshipping-app-vcry/deployments
2. Click on the latest deployment
3. Click "Build Logs" tab
4. Look for errors like:
   - "Missing required environment variable"
   - "MongoDB connection error"
   - "Failed to connect to MongoDB"

### 3. Check Vercel Runtime Logs

1. Go to: https://vercel.com/universallevis-projects/eazydropshipping-app-vcry/deployments
2. Click on the latest deployment
3. Click "Runtime Logs" tab
4. Look for:
   - MongoDB connection messages
   - Error messages
   - Startup errors

### 4. Test the App

Visit: https://eazydropshipping-app-vcry.vercel.app/

**Expected behavior:**
- Should show a development message if no `shop` parameter
- Should redirect to OAuth if `shop` parameter is provided

**If you see an error:**
- Check the browser console (F12)
- Check Vercel runtime logs
- Verify all environment variables are set

### 5. Common Issues

#### Issue: "Missing required environment variable"
**Fix:** Add all required environment variables in Vercel Dashboard → Settings → Environment Variables

#### Issue: "MongoDB connection error"
**Fix:** 
- Verify DATABASE_URL is correct
- Check MongoDB Atlas Network Access allows connections from anywhere (0.0.0.0/0)
- Make sure database name is included: `/shopify-app` before the `?`

#### Issue: "OAuth redirect_uri not whitelisted"
**Fix:**
- Update Shopify Partner Dashboard with production URL
- App URL: `https://eazydropshipping-app-vcry.vercel.app`
- Redirect URL: `https://eazydropshipping-app-vcry.vercel.app/auth/callback`

#### Issue: App shows blank page or error
**Fix:**
- Check Vercel runtime logs
- Verify all environment variables are set
- Make sure MongoDB is accessible

### 6. Verify MongoDB Atlas Connection

1. Go to MongoDB Atlas Dashboard
2. Check **Network Access**:
   - Should allow `0.0.0.0/0` (all IPs) for Vercel
3. Check **Database Access**:
   - User should have read/write permissions
4. Test connection string:
   ```bash
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/shopify-app"
   ```

### 7. Redeploy After Fixes

After fixing environment variables:
1. Go to Vercel Dashboard
2. Click "Redeploy" on latest deployment
3. Or push a new commit to trigger auto-deploy
